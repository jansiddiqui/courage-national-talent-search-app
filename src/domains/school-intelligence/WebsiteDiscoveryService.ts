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

    try {
      if (tavilyKey) {
        // Query Tavily search API
        const response = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: tavilyKey,
            query,
            search_depth: "basic",
            max_results: 5
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.results)) {
            data.results.forEach((res: any) => {
              if (res.url && !candidates.includes(res.url)) {
                candidates.push(res.url);
              }
            });
            signals.push("SEARCH_PROVIDER_TAVILY");
          }
        }
      } else if (googleKey && googleCx) {
        // Query Google Custom Search JSON API
        const url = `https://customsearch.googleapis.com/customsearch/v1?key=${googleKey}&cx=${googleCx}&q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.items)) {
            data.items.forEach((item: any) => {
              if (item.link && !candidates.includes(item.link)) {
                candidates.push(item.link);
              }
            });
            signals.push("SEARCH_PROVIDER_GOOGLE");
          }
        }
      } else {
        // No search provider configured — return honest unavailable result, never fake a URL
        signals.push("NO_SEARCH_PROVIDER_CONFIGURED");
        return {
          selectedUrl: null,
          candidates: [],
          confidenceScore: 0,
          status: "UNVERIFIED" as const,
          signals: ["NO_SEARCH_PROVIDER_CONFIGURED"]
        };
      }

      // Filter and evaluate candidates
      if (candidates.length > 0) {
        // Evaluate the first candidate link
        const bestCandidate = candidates[0];
        const urlObj = new URL(bestCandidate);
        const domain = urlObj.hostname.toLowerCase();

        // 1. Check domain relevance matches school name
        const cleanName = prospect.name.toLowerCase().replace(/[^a-z0-9]/g, "");
        const nameInDomain = domain.includes(cleanName.substring(0, Math.min(10, cleanName.length)));

        if (nameInDomain) {
          confidenceScore += 40;
          signals.push("DOMAIN_MATCHES_NAME");
        }

        // 2. Check if it's a standard educational domain suffix (.edu, .ac.in, .org, .edu.in, .com)
        if (domain.endsWith(".edu.in") || domain.endsWith(".ac.in") || domain.endsWith(".edu")) {
          confidenceScore += 30;
          signals.push("EDUCATIONAL_DOMAIN_SUFFIX");
        } else if (domain.endsWith(".org")) {
          confidenceScore += 20;
          signals.push("ORGANIZATION_DOMAIN_SUFFIX");
        } else if (domain.endsWith(".com") || domain.endsWith(".in")) {
          confidenceScore += 10;
          signals.push("STANDARD_DOMAIN_SUFFIX");
        }

        // 3. Exclude directory portals (e.g. justdial, sulekha, wikimapia, maps.google, facebook, local directories)
        const directoryKeywords = ["justdial", "sulekha", "wikimapia", "facebook", "instagram", "youtube", "linkedin", "maps.google", "indiamart", "schools.org", "shiksha"];
        const isDirectory = directoryKeywords.some(keyword => domain.includes(keyword));

        if (isDirectory) {
          confidenceScore = 10; // low confidence directory link
          signals.push("DIRECTORY_LINK_PENALIZED");
        } else {
          selectedUrl = bestCandidate;
          confidenceScore += 30; // base selected boost
        }

        // Assign status based on final calculated score
        if (confidenceScore >= 80) {
          status = "VERIFIED";
        } else if (confidenceScore >= 50) {
          status = "PROBABLE";
        } else {
          status = "UNVERIFIED";
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
