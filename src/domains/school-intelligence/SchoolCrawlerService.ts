import dns from "dns";
import { stripHtml, extractInternalLinks } from "@/utils/htmlParser";

export interface CrawledPage {
  url: string;
  title: string;
  text: string;
}

export class SchoolCrawlerService {
  private static MAX_PAGES = 8;
  private static MAX_SIZE_BYTES = 500 * 1024; // 500 KB
  private static MAX_REDIRECTS = 3;
  private static TIMEOUT_MS = 10000; // 10 seconds

  /**
   * Safe check to prevent SSRF by resolving and testing target IP addresses
   */
  static async isSafeUrl(targetUrl: string): Promise<boolean> {
    try {
      const parsed = new URL(targetUrl);
      if (!parsed.protocol.startsWith("http")) return false;

      const hostname = parsed.hostname;
      
      // If hostname is directly an IP, parse it
      const ipMatch = /^[0-9.]+$/.test(hostname) || hostname.includes(":");
      if (ipMatch) {
        return this.isSafeIp(hostname);
      }

      // Resolve DNS
      return new Promise<boolean>((resolve) => {
        dns.lookup(hostname, (err, address) => {
          if (err || !address) {
            resolve(false);
          } else {
            resolve(this.isSafeIp(address));
          }
        });
      });
    } catch (e) {
      return false;
    }
  }

  private static isSafeIp(ip: string): boolean {
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
    if (ip === "::1" || ip.startsWith("fe80:") || ip.startsWith("fc00:") || ip.startsWith("fd00:")) return false;

    return true;
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

    while (queue.length > 0 && crawled.length < this.MAX_PAGES) {
      const currentUrl = queue.shift()!;
      if (visited.includes(currentUrl)) continue;
      visited.push(currentUrl);

      try {
        console.log(`[Crawler] Fetching: ${currentUrl}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

        const response = await fetch(currentUrl, {
          signal: controller.signal,
          headers: {
            "User-Agent": "CNTS-Intelligence-Bot/1.0 (+https://courage-talent-search.org)"
          }
        });

        clearTimeout(timeoutId);

        if (!response.ok) continue;

        // Content-Type validation
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("text/html")) continue;

        // Check content size from headers first
        const sizeHeader = parseInt(response.headers.get("content-length") || "0", 10);
        if (sizeHeader > this.MAX_SIZE_BYTES) continue;

        // Read response body text, checking size
        const reader = response.body?.getReader();
        if (!reader) continue;

        let chunks = [];
        let totalSize = 0;
        let done = false;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            totalSize += value.length;
            if (totalSize > this.MAX_SIZE_BYTES) {
              console.log(`[Crawler] Size limit exceeded for: ${currentUrl}`);
              break;
            }
            chunks.push(value);
          }
        }

        if (totalSize > this.MAX_SIZE_BYTES) continue;

        // Combine chunks
        const combined = new Uint8Array(totalSize);
        let offset = 0;
        for (const chunk of chunks) {
          combined.set(chunk, offset);
          offset += chunk.length;
        }

        const html = new TextDecoder().decode(combined);
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
            // Prioritize relevant subpages
            const lowercaseLink = link.toLowerCase();
            const keywords = ["about", "contact", "academics", "facilities", "achievements", "olympiad", "stem", "principal", "director"];
            const isRelevant = keywords.some(k => lowercaseLink.includes(k));
            if (isRelevant) {
              // Verify safety before adding to queue
              const safe = await this.isSafeUrl(link);
              if (safe) {
                queue.push(link);
              }
            }
          }
        }
      } catch (err: any) {
        console.error(`[Crawler] Error fetching ${currentUrl}:`, err.message);
      }
    }

    return crawled;
  }
}
