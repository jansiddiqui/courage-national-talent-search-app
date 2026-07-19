import { SchoolCandidateCollector, CanonicalCandidate } from "./types";

const SCHOOL_KEYWORDS = ["school", "vidyalaya", "vidyapeeth", "convent", "academy", "college", "public", "international", "global", "cambridge", "central"];
const REJECT_KEYWORDS = [
  "justdial", "sulekha", "wikipedia", "maps.google", "indiamart", "shiksha", "practo", "quora", 
  "youtube", "facebook", "instagram", "linkedin", "twitter", "collegedunia", "edustoke", 
  "schoolmykids", "getmyuni", "career360", "indiatoday", "hindustantimes", "ndtv", "timesofindia",
  "blog", "article", "list-of", "directory", "ranking", "news", "admission", "fees", "top-10", "top-20"
];

export class SearchApiCollector implements SchoolCandidateCollector {
  sourceId = "SEARCH_API";

  async collect(query: string, page: number): Promise<CanonicalCandidate[]> {
    const tavilyKey = process.env.TAVILY_API_KEY;
    const googleKey = process.env.GOOGLE_SEARCH_API_KEY;
    const googleCx = process.env.GOOGLE_SEARCH_CX;
    const serperKey = process.env.SERPER_API_KEY;

    let rawResults: Array<{ title: string; url: string; snippet?: string }> = [];

    if (serperKey) {
      rawResults = await this.searchSerper(serperKey, query, page);
    } else if (tavilyKey) {
      // Tavily does not support standard page offsets, so only query page 1
      if (page === 1) {
        rawResults = await this.searchTavily(tavilyKey, query);
      }
    } else if (googleKey && googleCx) {
      rawResults = await this.searchGoogle(googleKey, googleCx, query, page);
    } else {
      throw new Error("No search provider configured (SERPER_API_KEY, TAVILY_API_KEY, or GOOGLE_SEARCH_API_KEY + GOOGLE_SEARCH_CX)");
    }

    return this.parseCandidates(rawResults, query);
  }

  private async searchTavily(
    apiKey: string,
    query: string
  ): Promise<Array<{ title: string; url: string; snippet?: string }>> {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "basic",
        max_results: 8,
        include_answer: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily returned ${response.status}`);
    }

    const data = await response.json();
    return (data.results || []).map((r: any) => ({
      title: r.title || "",
      url: r.url || "",
      snippet: r.content || r.snippet || "",
    }));
  }

  private async searchSerper(
    apiKey: string,
    query: string,
    page: number
  ): Promise<Array<{ title: string; url: string; snippet?: string }>> {
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: query,
        num: 10,
        page: page
      })
    });

    if (!response.ok) {
      throw new Error(`Serper returned ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return (data.organic || []).map((item: any) => ({
      title: item.title || "",
      url: item.link || "",
      snippet: item.snippet || ""
    }));
  }

  private async searchGoogle(
    apiKey: string,
    cx: string,
    query: string,
    page: number
  ): Promise<Array<{ title: string; url: string; snippet?: string }>> {
    const start = (page - 1) * 10 + 1;
    const url = `https://customsearch.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=10&start=${start}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google CSE returned ${response.status}`);
    }

    const data = await response.json();
    return (data.items || []).map((item: any) => ({
      title: item.title || "",
      url: item.link || "",
      snippet: item.snippet || "",
    }));
  }

  private parseCandidates(
    results: Array<{ title: string; url: string; snippet?: string }>,
    originalQuery: string
  ): CanonicalCandidate[] {
    const candidates: CanonicalCandidate[] = [];

    const geoMatch = originalQuery.match(/in\s+([^,]+),\s+(.+)$/i);
    const city = geoMatch ? geoMatch[1].trim() : "";
    const state = geoMatch ? geoMatch[2].trim() : "";

    for (const result of results) {
      const urlLower = result.url.toLowerCase();
      if (REJECT_KEYWORDS.some((kw) => urlLower.includes(kw))) continue;

      const titleLower = result.title.toLowerCase();
      if (!SCHOOL_KEYWORDS.some((kw) => titleLower.includes(kw))) continue;

      const schoolName = this.extractSchoolName(result.title);
      if (!schoolName || schoolName.length < 5) continue;

      candidates.push({
        source: this.sourceId,
        school_name: schoolName,
        normalized_name: this.normalizeName(schoolName),
        city,
        state,
        source_url: result.url,
        source_confidence: 50,
        raw_source_payload: result
      });
    }

    return candidates;
  }

  private extractSchoolName(title: string): string {
    let name = title.split(/\s+[|–\-:]\s+/)[0].trim();

    name = name
      .replace(/\s+is\s+the\s+.*/gi, "")
      .replace(/\s*,\s*best\s+.*/gi, "")
      .replace(/official\s+site/gi, "")
      .replace(/official\s+website/gi, "")
      .replace(/admission\s+\d{4}/gi, "")
      .replace(/fees\s+structure/gi, "")
      .trim();

    const nameLower = name.toLowerCase();
    if (!SCHOOL_KEYWORDS.some((kw) => nameLower.includes(kw))) {
      return "";
    }

    const isGenericList = 
      /\b(best|top|good|great|famous|elite|popular|list|directory|ranking|choice|option|near|fees|admission|disaffiliated|comparison|versus|vs)\b.*\bschool/i.test(nameLower) ||
      /\bschools?\s+in\b/i.test(nameLower) ||
      /\bschools?\s+near\b/i.test(nameLower) ||
      /\bschools?\s+(from|of|for|with|and|by)\b/i.test(nameLower) ||
      /\bschool\s+(code|codes|course|courses|list|listing|directory|name)\b/i.test(nameLower) ||
      /\b(sl\.?\s*no|serial\s+no|s\.?\s*no)\b/i.test(nameLower) ||
      /\bcode\s+name\s+of\s+school/i.test(nameLower) ||
      /\b(district|block|taluk|tehsil)\s+school\b/i.test(nameLower) ||
      /\b(what|how|which|why|where)\b/i.test(nameLower) ||
      nameLower.includes("?") ||
      nameLower.includes("parentune") ||
      nameLower.includes("collegedunia") ||
      nameLower.includes("edustoke") ||
      /frmschool/i.test(nameLower) ||
      /member\s+school/i.test(nameLower) ||
      /^school\b/i.test(name.trim()) ||
      name.trim().split(/\s+/).length > 10;

    if (isGenericList) {
      return "";
    }

    if (name.length < 3 || name.length > 100) {
      return "";
    }

    return name.substring(0, 100);
  }

  private normalizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\s/g, "");
  }
}
