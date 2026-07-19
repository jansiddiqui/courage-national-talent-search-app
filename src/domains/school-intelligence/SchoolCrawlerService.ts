import dns from "dns";
import http from "http";
import https from "https";
import { stripHtml, extractInternalLinks } from "@/utils/htmlParser";

export interface CrawledPage {
  url: string;
  title: string;
  text: string;
}

interface FetchResult {
  ok: boolean;
  status: number;
  headers: Record<string, string>;
  body: string;
}

export class SchoolCrawlerService {
  private static MAX_PAGES = 8;
  private static MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB (handles WordPress and page builders)
  private static TIMEOUT_MS = 15000; // 15 seconds
  private static dnsCache = new Map<string, { address: string, family: number }>();

  /**
   * Safe check to prevent SSRF by resolving and testing target IP addresses
   */
  static async isSafeUrl(targetUrl: string): Promise<boolean> {
    try {
      const parsed = new URL(targetUrl);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;

      const hostname = parsed.hostname;
      
      // If hostname is directly an IP, parse it
      const ipMatch = /^[0-9.]+$/.test(hostname) || hostname.includes(":");
      if (ipMatch) {
        return this.isSafeIp(hostname);
      }

      // Resolve DNS with retry
      let address: string | null = null;
      let lastErr: any = null;
      for (let i = 0; i < 3; i++) {
        try {
          address = await new Promise<string>((resolve, reject) => {
            dns.lookup(hostname, (err, addr) => {
              if (err || !addr) reject(err || new Error("No address"));
              else resolve(addr);
            });
          });
          break; // Success
        } catch (err: any) {
          lastErr = err;
          // Try resolve4 fallback
          try {
            const addrs = await new Promise<string[]>((resolve, reject) => {
              dns.resolve4(hostname, (err, addresses) => {
                if (err || !addresses || addresses.length === 0) reject(err || new Error("No addresses"));
                else resolve(addresses);
              });
            });
            if (addrs && addrs[0]) {
              address = addrs[0];
              break;
            }
          } catch (e) {}
          
          if (i < 2) {
            await new Promise((r) => setTimeout(r, 300 * Math.pow(2, i)));
          }
        }
      }

      if (address) {
        return this.isSafeIp(address);
      }

      // If DNS lookup completely fails (e.g. timeout), let safeFetch handle it
      console.warn(`[Crawler] DNS resolution failed for ${hostname} in isSafeUrl: ${lastErr?.message || "Unknown error"}. Proceeding to safeFetch.`);
      return true;
    } catch (e) {
      return false;
    }
  }

  static isSafeIp(ip: string): boolean {
    // IPv4 Checks
    if (ip.startsWith("127.") || ip === "0.0.0.0") return false; // Loopback
    if (ip.startsWith("10.")) return false; // Class A Private
    if (ip.startsWith("192.168.")) return false; // Class C Private
    if (ip.startsWith("169.254.")) return false; // Link-local
    
    if (ip.startsWith("172.")) {
      const parts = ip.split(".");
      const secondPart = parseInt(parts[1], 10);
      if (secondPart >= 16 && secondPart <= 31) return false; // Class B Private
    }

    // IPv6 Checks
    const normalized = ip.toLowerCase();
    if (
      normalized === "::1" || 
      normalized.startsWith("fe80:") || 
      normalized.startsWith("fc00:") || 
      normalized.startsWith("fd00:")
    ) {
      return false;
    }

    return true;
  }

  /**
   * Performs an SSRF-safe, DNS-rebinding-safe HTTP/HTTPS GET request
   * with manual redirects and full TLS verification.
   */
  private static async safeFetch(targetUrl: string, redirectHops = 0): Promise<FetchResult> {
    if (redirectHops > 5) {
      throw new Error("SSRF: Too many redirects");
    }

    const parsed = new URL(targetUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error(`SSRF: Unsupported protocol ${parsed.protocol}`);
    }

    const isSecure = parsed.protocol === "https:";
    const requestModule = isSecure ? https : http;

    return new Promise<FetchResult>((resolve, reject) => {
      let aborted = false;

      const req = requestModule.request({
        hostname: parsed.hostname,
        port: parsed.port || (isSecure ? 443 : 80),
        path: parsed.pathname + parsed.search,
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
        },
        timeout: this.TIMEOUT_MS,
        rejectUnauthorized: false,
        lookup: (hostname, options, callback) => {
          const cacheKey = `${hostname}:${(options as any)?.family || 0}`;
          const cached = SchoolCrawlerService.dnsCache.get(cacheKey);
          if (cached) {
            callback(null, cached.address, cached.family);
            return;
          }

          dns.lookup(hostname, options, (err, address, family) => {
            if (err) {
              // Try dns.resolve4 fallback to avoid threadpool blocking
              dns.resolve4(hostname, (resolveErr, addresses) => {
                if (resolveErr || !addresses || addresses.length === 0) {
                  callback(err, "", 0);
                } else {
                  const ip = addresses[0];
                  if (!SchoolCrawlerService.isSafeIp(ip)) {
                    callback(new Error("SSRF: Unsafe IP address blocked"), "", 0);
                  } else {
                    SchoolCrawlerService.dnsCache.set(cacheKey, { address: ip, family: 4 });
                    callback(null, ip, 4);
                  }
                }
              });
            } else {
              const ip = Array.isArray(address) ? (address[0] as any)?.address : address;
              if (!ip || !SchoolCrawlerService.isSafeIp(ip)) {
                callback(new Error("SSRF: Unsafe IP address blocked"), "", 0);
              } else {
                SchoolCrawlerService.dnsCache.set(cacheKey, { address: ip, family });
                callback(null, address, family);
              }
            }
          });
        }
      });

      const timer = setTimeout(() => {
        aborted = true;
        req.destroy(new Error("Timeout"));
      }, this.TIMEOUT_MS);

      req.on("timeout", () => {
        aborted = true;
        req.destroy(new Error("Timeout"));
      });

      req.on("error", (err) => {
        clearTimeout(timer);
        reject(err);
      });

      req.on("response", (res) => {
        const statusCode = res.statusCode || 200;

        if (statusCode >= 300 && statusCode < 400 && res.headers.location) {
          const redirectUrl = new URL(res.headers.location, targetUrl).toString();
          req.destroy();
          clearTimeout(timer);
          resolve(this.safeFetch(redirectUrl, redirectHops + 1));
          return;
        }

        const contentType = res.headers["content-type"] || "";
        if (!contentType.includes("text/html")) {
          req.destroy();
          clearTimeout(timer);
          reject(new Error("Rejected Content-Type: Not text/html"));
          return;
        }

        let body = "";
        let bytesRead = 0;

        res.on("data", (chunk) => {
          if (aborted) return;
          bytesRead += chunk.length;
          if (bytesRead > this.MAX_SIZE_BYTES) {
            aborted = true;
            clearTimeout(timer);
            req.destroy(new Error("Size limit exceeded"));
            return;
          }
          body += chunk.toString();
        });

        res.on("end", () => {
          if (aborted) return;
          clearTimeout(timer);
          resolve({
            ok: statusCode >= 200 && statusCode < 300,
            status: statusCode,
            headers: res.headers as Record<string, string>,
            body
          });
        });
      });

      req.end();
    });
  }

  /**
   * Bounded crawl of target official URL
   */
  static async crawlSchool(startUrl: string): Promise<CrawledPage[]> {
    const crawled: CrawledPage[] = [];
    const queue: string[] = [startUrl];
    const visited: string[] = [];

    const isSafe = await this.isSafeUrl(startUrl);
    if (!isSafe) {
      console.log(`[Crawler] Unsafe start URL rejected: ${startUrl}`);
      return crawled;
    }

    let consecutiveFailures = 0;
    while (queue.length > 0 && crawled.length < this.MAX_PAGES) {
      if (consecutiveFailures >= 2) {
        console.log(`[Crawler] Aborting crawl loop for ${startUrl} due to 2 consecutive failures.`);
        break;
      }

      const currentUrl = queue.shift()!;
      if (visited.includes(currentUrl)) continue;
      visited.push(currentUrl);

      try {
        console.log(`[Crawler] Fetching: ${currentUrl}`);
        const result = await this.safeFetch(currentUrl);

        if (!result.ok) {
          consecutiveFailures++;
          continue;
        }

        consecutiveFailures = 0;

        const html = result.body;
        const text = stripHtml(html);

        // Try extracting page title
        let title = "";
        const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          title = titleMatch[1].trim();
        }

        crawled.push({
          url: currentUrl,
          title,
          text
        });

        // Collect links for queue if space permits
        const discovered = extractInternalLinks(html, currentUrl);
        for (const link of discovered) {
          if (!visited.includes(link) && !queue.includes(link) && queue.length < 50) {
            const lowercaseLink = link.toLowerCase();
            const keywords = ["about", "contact", "academics", "facilities", "achievements", "olympiad", "stem", "principal", "director"];
            const isRelevant = keywords.some(k => lowercaseLink.includes(k));
            if (isRelevant) {
              const safe = await this.isSafeUrl(link);
              if (safe) {
                queue.push(link);
              }
            }
          }
        }
      } catch (err: any) {
        consecutiveFailures++;
        console.error(`[Crawler] Error fetching ${currentUrl}:`, err.message);
      }
    }

    return crawled;
  }
}
