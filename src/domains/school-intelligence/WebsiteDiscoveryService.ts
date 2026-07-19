import { SchoolProspect } from "./types";

export interface DiscoveryResult {
  selectedUrl: string | null;
  candidates: string[];
  confidenceScore: number;
  status: "VERIFIED" | "PROBABLE" | "UNVERIFIED" | "CONFLICTING";
  signals: string[];
}

export class WebsiteDiscoveryService {
  /**
   * Search for and validate the official website of a prospect school
   */
  static async discoverWebsite(prospect: SchoolProspect): Promise<DiscoveryResult> {
    const candidates: string[] = [];
    const signals: string[] = [];
    let selectedUrl: string | null = null;
    let confidenceScore = 0;
    let status: "VERIFIED" | "PROBABLE" | "UNVERIFIED" | "CONFLICTING" = "UNVERIFIED";

    const query = `${prospect.name} ${prospect.city} ${prospect.state} official website`;
    
    // API keys check
    const tavilyKey = process.env.TAVILY_API_KEY;
    const googleKey = process.env.GOOGLE_SEARCH_API_KEY;
    const googleCx = process.env.GOOGLE_SEARCH_CX; // Fixed: was GOOGLE_CX
    const serperKey = process.env.SERPER_API_KEY;

    try {
      let searchSuccess = false;

    // 1. Try Serper if configured
    if (serperKey && !searchSuccess) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        const response = await fetch("https://google.serper.dev/search", {
          method: "POST",
          headers: {
            "X-API-KEY": serperKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ q: query, num: 5 }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.organic)) {
            data.organic.forEach((item: any) => {
              if (item.link && !candidates.includes(item.link)) {
                candidates.push(item.link);
              }
            });
            signals.push("SEARCH_PROVIDER_SERPER");
            searchSuccess = true;
          }
        } else {
          const errText = await response.text();
          console.warn(`[Discovery] Serper Search failed (HTTP ${response.status}): ${errText}`);
          signals.push(`SERPER_FAILED: ${errText}`);
        }
      } catch (err: any) {
        console.warn(`[Discovery] Serper Search error:`, err.message || String(err));
        signals.push(`SERPER_ERROR: ${err.message}`);
      }
    }

    // 2. Try Tavily fallback if not successful yet
    if (tavilyKey && !searchSuccess) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        const response = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: tavilyKey,
            query,
            search_depth: "basic",
            max_results: 5
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.results)) {
            data.results.forEach((res: any) => {
              if (res.url && !candidates.includes(res.url)) {
                candidates.push(res.url);
              }
            });
            signals.push("SEARCH_PROVIDER_TAVILY");
            searchSuccess = true;
          }
        } else {
          const errText = await response.text();
          console.warn(`[Discovery] Tavily Search failed (HTTP ${response.status}): ${errText}`);
          signals.push(`TAVILY_FAILED: ${errText}`);
        }
      } catch (err: any) {
        console.warn(`[Discovery] Tavily Search error:`, err.message || String(err));
        signals.push(`TAVILY_ERROR: ${err.message}`);
      }
    }

    // 3. Try Google Custom Search fallback if not successful yet
    if (googleKey && googleCx && !searchSuccess) {
      try {
        const url = `https://customsearch.googleapis.com/customsearch/v1?key=${googleKey}&cx=${googleCx}&q=${encodeURIComponent(query)}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.items)) {
            data.items.forEach((item: any) => {
              if (item.link && !candidates.includes(item.link)) {
                candidates.push(item.link);
              }
            });
            signals.push("SEARCH_PROVIDER_GOOGLE");
            searchSuccess = true;
          }
        } else {
          const errText = await response.text();
          console.warn(`[Discovery] Google Custom Search failed (HTTP ${response.status}): ${errText}`);
          signals.push(`GOOGLE_FAILED: ${errText}`);
        }
      } catch (err: any) {
        console.warn(`[Discovery] Google Custom Search error:`, err.message || String(err));
        signals.push(`GOOGLE_ERROR: ${err.message}`);
      }
    }

    // 4. Return unavailable if all failed
    if (!searchSuccess) {
      signals.push("NO_SEARCH_PROVIDER_SUCCESSFUL");
      return {
        selectedUrl: null,
        candidates: [],
        confidenceScore: 0,
        status: "UNVERIFIED" as const,
        signals: [...signals]
      };
    }

      // Filter and evaluate candidates
      if (candidates.length > 0) {
        let bestCandidateUrl: string | null = null;
        let bestCandidateScore = -1;
        let bestCandidateStatus: "VERIFIED" | "PROBABLE" | "UNVERIFIED" | "CONFLICTING" = "UNVERIFIED";
        let bestCandidateSignals: string[] = [];

        for (const candidate of candidates) {
          try {
            let score = 0;
            const candidateSignals: string[] = [];
            const urlObj = new URL(candidate);
            const domain = urlObj.hostname.toLowerCase();

            // 0. Check if URL is a PDF or upload file
            const isPdf = candidate.toLowerCase().endsWith(".pdf") || 
                          candidate.toLowerCase().includes("/pdf/") || 
                          candidate.toLowerCase().includes("/uploads/") ||
                          candidate.toLowerCase().includes("private-elementary-schools") ||
                          candidate.toLowerCase().includes("private-high-schools");

            if (isPdf) {
              score = 0;
              candidateSignals.push("PDF_OR_UPLOAD_REJECTED");
            }

            // 1. Check domain relevance matches school name
            const nameWords = prospect.name.toLowerCase()
              .replace(/[^a-z0-9\s]/g, "")
              .split(/\s+/)
              .filter(w => w && !["school", "college", "academy", "institutions", "educational", "public", "private", "of", "and", "the", "for", "is", "in", "at", "prepared", "by", "cell", "statistical", "directorate", "education", "mizoram", "admission", "fee", "affiliation", "pdf"].includes(w));
            
            const matchedWords = nameWords.filter(word => domain.includes(word));
            const cleanName = prospect.name.toLowerCase().replace(/[^a-z0-9]/g, "");
            const nameInDomain = matchedWords.length > 0 || domain.includes(cleanName.substring(0, Math.min(10, cleanName.length)));

            if (nameInDomain && !isPdf) {
              const matchRatio = nameWords.length > 0 ? matchedWords.length / nameWords.length : 1;
              score += Math.round(40 * matchRatio) + 10;
              candidateSignals.push(`DOMAIN_MATCHES_NAME(${matchedWords.join(",")})`);
            }

            // 2. Check if it's a standard educational domain suffix (.edu, .ac.in, .org, .edu.in, .com)
            if (!isPdf) {
              if (domain.endsWith(".edu.in") || domain.endsWith(".ac.in") || domain.endsWith(".edu")) {
                score += 30;
                candidateSignals.push("EDUCATIONAL_DOMAIN_SUFFIX");
              } else if (domain.endsWith(".org")) {
                score += 20;
                candidateSignals.push("ORGANIZATION_DOMAIN_SUFFIX");
              } else if (domain.endsWith(".com") || domain.endsWith(".in")) {
                score += 10;
                candidateSignals.push("STANDARD_DOMAIN_SUFFIX");
              }
            }

            // 3. Exclude directory portals and generic/non-school websites
            const directoryKeywords = [
              "justdial", "sulekha", "wikimapia", "facebook", "instagram", "youtube", "linkedin", 
              "maps.google", "indiamart", "schools.org", "shiksha", "ezyschooling", "schoolmykids", 
              "edustoke", "icbse", "targetstudy", "ehimachal.org", "youthpower", "scribd.com", 
              "indiankanoon", "northeastlivetv", "wikipedia", "twitter", "pinterest", "mizoram.gov.in",
              "assam.gov.in", "schooleducation", "directorate", "gov.in", "nic.in", "admission", "fee", "result"
            ];
            const isDirectory = directoryKeywords.some(keyword => domain.includes(keyword) || candidate.toLowerCase().includes(keyword));

            if (isDirectory) {
              score = Math.min(score, 10); // cap total score at 10 for directory/penalized links
              candidateSignals.push("DIRECTORY_LINK_PENALIZED");
            } else if (!isPdf) {
              score += 30; // base selected boost
            }

            let candidateStatus: "VERIFIED" | "PROBABLE" | "UNVERIFIED" | "CONFLICTING" = "UNVERIFIED";
            if (score >= 80) {
              candidateStatus = "VERIFIED";
            } else if (score >= 50) {
              candidateStatus = "PROBABLE";
            }

            // Select the candidate with the highest score
            if (score > bestCandidateScore) {
              bestCandidateScore = score;
              bestCandidateUrl = candidate;
              bestCandidateStatus = candidateStatus;
              bestCandidateSignals = candidateSignals;
            }
          } catch (_) {
            // Ignore malformed URL candidates
          }
        }

        if (bestCandidateUrl) {
          selectedUrl = bestCandidateUrl;
          confidenceScore = bestCandidateScore;
          status = bestCandidateStatus;
          signals.push(...bestCandidateSignals);
        }
      }
    } catch (err: any) {
      signals.push(`DISCOVERY_ERROR: ${err.message}`);
    }

    return {
      selectedUrl,
      candidates,
      confidenceScore: Math.min(100, confidenceScore),
      status,
      signals
    };
  }
}
