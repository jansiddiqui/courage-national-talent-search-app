/**
 * SchoolDiscoveryService — CNTS School Intelligence Engine
 *
 * Implements nationwide school discovery through geographic decomposition
 * and search-API-based candidate harvesting.
 *
 * Architecture:
 *   Geographic scope (All India / states / districts)
 *       ↓
 *   Query plan (bounded templates × geographies)
 *       ↓
 *   Search API calls (Tavily primary, Google fallback)
 *       ↓
 *   Parse candidate school names from results
 *       ↓
 *   Normalize + deduplicate
 *       ↓
 *   Persist new candidates to school_prospects
 *       ↓
 *   Update discovery run progress
 */

import { supabaseAdmin } from "@/lib/supabaseAdmin";

// ─── Geographic Data ────────────────────────────────────────────────────────

/** Major states/UTs of India with representative high-density districts */
export const INDIA_GEOGRAPHY: Record<string, string[]> = {
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Central Delhi"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Allahabad", "Noida", "Ghaziabad"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belagavi"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Udaipur", "Bikaner"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Haryana": ["Gurugram", "Faridabad", "Ambala", "Hisar", "Rohtak"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Chandigarh"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela"],
  "Assam": ["Guwahati", "Dibrugarh", "Silchar"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamsala"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama"],
  "Chandigarh": ["Chandigarh"],
  "Puducherry": ["Puducherry"],
};

/** Query templates for school discovery — targeted at CNTS-relevant schools */
const QUERY_TEMPLATES = [
  "private schools in {geo}",
  "CBSE schools in {geo}",
  "ICSE schools in {geo}",
  "English medium schools in {geo}",
  "schools classes 5 to 8 in {geo}",
  "best schools in {geo}",
  "top schools in {geo}",
];

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DiscoveryScope {
  type: "ALL_INDIA" | "SELECTED_STATES" | "SELECTED_DISTRICTS";
  selectedStates?: string[];
  selectedDistricts?: string[];
  targetCount: number;
}

export interface DiscoveryProgress {
  geographiesPlanned: number;
  geographiesCompleted: number;
  queriesPlanned: number;
  queriesCompleted: number;
  queriesFailed: number;
  rawCandidatesFound: number;
  uniqueCandidatesFound: number;
  duplicatesRemoved: number;
  candidatesPersisted: number;
}

export interface ParsedCandidate {
  name: string;
  city: string;
  state: string;
  sourceUrl: string;
  sourceTitle: string;
  rawSnippet: string;
}

// ─── Keyword filters ─────────────────────────────────────────────────────────

const SCHOOL_KEYWORDS = ["school", "vidyalaya", "vidyapeeth", "convent", "academy", "college", "public", "international", "global", "cambridge", "central"];
const REJECT_KEYWORDS = ["justdial", "sulekha", "wikipedia", "maps.google", "indiamart", "shiksha", "practo", "quora", "youtube", "facebook", "instagram", "linkedin", "twitter"];

// ─── Main Discovery Service ───────────────────────────────────────────────────

export class SchoolDiscoveryService {

  /**
   * Start a new discovery run and persist it to the database.
   * Returns the run ID for progress polling.
   */
  static async startDiscoveryRun(scope: DiscoveryScope): Promise<string | null> {
    const geographies = this.buildGeographyList(scope);
    const queriesPlanned = geographies.length * QUERY_TEMPLATES.length;

    const { data: run, error } = await (supabaseAdmin as any)
      .from("school_discovery_runs")
      .insert({
        scope_type: scope.type,
        selected_states: scope.selectedStates || [],
        selected_districts: scope.selectedDistricts || [],
        target_count: scope.targetCount,
        status: "RUNNING",
        geographies_planned: geographies.length,
        queries_planned: queriesPlanned,
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !run) {
      console.error("[Discovery] Failed to create discovery run:", error);
      return null;
    }

    return run.id;
  }

  /**
   * Execute a discovery run (called from background job or API route).
   * Runs queries in sequence to respect rate limits.
   */
  static async executeDiscoveryRun(runId: string): Promise<DiscoveryProgress> {
    const progress: DiscoveryProgress = {
      geographiesPlanned: 0,
      geographiesCompleted: 0,
      queriesPlanned: 0,
      queriesCompleted: 0,
      queriesFailed: 0,
      rawCandidatesFound: 0,
      uniqueCandidatesFound: 0,
      duplicatesRemoved: 0,
      candidatesPersisted: 0,
    };

    // Fetch run record
    const { data: run } = await (supabaseAdmin as any)
      .from("school_discovery_runs")
      .select("*")
      .eq("id", runId)
      .single();

    if (!run) {
      console.error("[Discovery] Run not found:", runId);
      return progress;
    }

    const scope: DiscoveryScope = {
      type: run.scope_type,
      selectedStates: run.selected_states,
      selectedDistricts: run.selected_districts,
      targetCount: run.target_count,
    };

    const geographies = this.buildGeographyList(scope);
    progress.geographiesPlanned = geographies.length;
    progress.queriesPlanned = geographies.length * QUERY_TEMPLATES.length;

    // Get existing normalized names to avoid duplicates
    const existingNames = await this.fetchExistingNormalizedNames();

    for (const geo of geographies) {
      // Stop early if target reached
      if (progress.candidatesPersisted >= scope.targetCount) break;

      for (const template of QUERY_TEMPLATES) {
        if (progress.candidatesPersisted >= scope.targetCount) break;

        const query = template.replace("{geo}", `${geo.city}, ${geo.state}`);

        try {
          const results = await this.searchForSchools(query);
          progress.rawCandidatesFound += results.length;

          for (const candidate of results) {
            const normalized = this.normalizeName(candidate.name);

            // Deduplicate against existing + within this run
            if (existingNames.has(`${normalized}|${geo.city.toLowerCase()}`)) {
              progress.duplicatesRemoved++;
              continue;
            }

            // Persist candidate
            const persisted = await this.persistCandidate(candidate, geo.state, runId);
            if (persisted) {
              progress.uniqueCandidatesFound++;
              progress.candidatesPersisted++;
              existingNames.add(`${normalized}|${geo.city.toLowerCase()}`);
            } else {
              progress.duplicatesRemoved++;
            }
          }

          progress.queriesCompleted++;
        } catch (err: any) {
          console.error(`[Discovery] Query failed: "${query}"`, err.message);
          progress.queriesFailed++;
        }

        // Small delay between queries to respect rate limits
        await this.sleep(300);
      }

      progress.geographiesCompleted++;

      // Persist progress to DB every geography
      await this.updateRunProgress(runId, progress);
    }

    // Mark run complete
    const finalStatus = progress.queriesFailed > progress.queriesCompleted
      ? "PARTIAL"
      : "COMPLETED";

    await (supabaseAdmin as any)
      .from("school_discovery_runs")
      .update({
        status: finalStatus,
        ...this.progressToDbFields(progress),
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", runId);

    return progress;
  }

  // ─── Search Provider ────────────────────────────────────────────────────────

  private static async searchForSchools(query: string): Promise<ParsedCandidate[]> {
    const tavilyKey = process.env.TAVILY_API_KEY;
    const googleKey = process.env.GOOGLE_SEARCH_API_KEY;
    const googleCx = process.env.GOOGLE_SEARCH_CX;

    let rawResults: Array<{ title: string; url: string; snippet?: string; content?: string }> = [];

    if (tavilyKey) {
      rawResults = await this.searchTavily(tavilyKey, query);
    } else if (googleKey && googleCx) {
      rawResults = await this.searchGoogle(googleKey, googleCx, query);
    } else {
      throw new Error("No search provider configured (TAVILY_API_KEY or GOOGLE_SEARCH_API_KEY + GOOGLE_SEARCH_CX)");
    }

    return this.parseSchoolCandidates(rawResults, query);
  }

  private static async searchTavily(
    apiKey: string,
    query: string
  ): Promise<Array<{ title: string; url: string; snippet?: string; content?: string }>> {
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

  private static async searchGoogle(
    apiKey: string,
    cx: string,
    query: string
  ): Promise<Array<{ title: string; url: string; snippet?: string }>> {
    const url = `https://customsearch.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=10`;
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

  // ─── Candidate Parsing ──────────────────────────────────────────────────────

  /**
   * Parse raw search results into candidate school objects.
   * Rejects directory sites and non-school results.
   */
  private static parseSchoolCandidates(
    results: Array<{ title: string; url: string; snippet?: string; content?: string }>,
    originalQuery: string
  ): ParsedCandidate[] {
    const candidates: ParsedCandidate[] = [];

    // Extract city/state from query (last part after "in ")
    const geoMatch = originalQuery.match(/in\s+([^,]+),\s+(.+)$/i);
    const city = geoMatch ? geoMatch[1].trim() : "";
    const state = geoMatch ? geoMatch[2].trim() : "";

    for (const result of results) {
      // Reject directory/listing sites
      const urlLower = result.url.toLowerCase();
      if (REJECT_KEYWORDS.some((kw) => urlLower.includes(kw))) continue;

      // Title must contain a school-related keyword
      const titleLower = result.title.toLowerCase();
      if (!SCHOOL_KEYWORDS.some((kw) => titleLower.includes(kw))) continue;

      // Extract a clean school name from the title
      const name = this.extractSchoolName(result.title);
      if (!name || name.length < 5) continue;

      candidates.push({
        name,
        city,
        state,
        sourceUrl: result.url,
        sourceTitle: result.title,
        rawSnippet: result.snippet || result.content || "",
      });
    }

    return candidates;
  }

  /**
   * Extract the most likely school name from a search result title.
   * Strips suffixes like "| Admission", "- Official Site", etc.
   */
  private static extractSchoolName(title: string): string {
    // Remove common suffixes
    let name = title
      .replace(/\s*[\|\-–]\s*.*/g, "") // strip after | or -
      .replace(/official\s+site/gi, "")
      .replace(/official\s+website/gi, "")
      .replace(/admission\s+\d{4}/gi, "")
      .replace(/fees\s+structure/gi, "")
      .replace(/\s*\|\s*.*/, "")
      .trim();

    // Must contain at least one school keyword to be a valid school name
    const nameLower = name.toLowerCase();
    if (!SCHOOL_KEYWORDS.some((kw) => nameLower.includes(kw))) {
      return "";
    }

    return name.substring(0, 150); // cap length
  }

  // ─── Persistence ─────────────────────────────────────────────────────────────

  private static async persistCandidate(
    candidate: ParsedCandidate,
    state: string,
    runId: string
  ): Promise<boolean> {
    const normalizedName = this.normalizeName(candidate.name);

    try {
      // Check for existing record with same normalized name + city
      const { data: existing } = await (supabaseAdmin as any)
        .from("school_prospects")
        .select("id, normalized_name")
        .eq("normalized_name", normalizedName)
        .ilike("city", candidate.city)
        .maybeSingle();

      if (existing) {
        return false; // duplicate
      }

      const { error: insertErr } = await (supabaseAdmin as any)
        .from("school_prospects")
        .insert({
          name: candidate.name,
          normalized_name: normalizedName,
          city: candidate.city,
          district: null, // district unknown from search results
          state: candidate.state || state,
          board: null, // board unknown — do NOT default to CBSE
          school_type: null,
          website: null,
          discovery_source: "SEARCH_API",
          source_identifier: runId,
          enrichment_status: "PENDING",
          outreach_status: "NEW",
          identity_status: "DISTINCT",
          outreach_score: 0,
          confidence_score: 0,
          scoring_breakdown: {},
          outreach_templates: {},
        });

      return !insertErr;
    } catch (err: any) {
      console.error("[Discovery] Failed to persist candidate:", err.message);
      return false;
    }
  }

  // ─── Geography Planning ────────────────────────────────────────────────────

  static buildGeographyList(scope: DiscoveryScope): Array<{ city: string; state: string }> {
    const geos: Array<{ city: string; state: string }> = [];

    if (scope.type === "ALL_INDIA") {
      for (const [state, cities] of Object.entries(INDIA_GEOGRAPHY)) {
        for (const city of cities) {
          geos.push({ city, state });
        }
      }
    } else if (scope.type === "SELECTED_STATES" && scope.selectedStates) {
      for (const state of scope.selectedStates) {
        const cities = INDIA_GEOGRAPHY[state] || [];
        for (const city of cities) {
          geos.push({ city, state });
        }
      }
    } else if (scope.type === "SELECTED_DISTRICTS" && scope.selectedDistricts) {
      // For selected districts, pair each with its state
      for (const [state, cities] of Object.entries(INDIA_GEOGRAPHY)) {
        for (const city of cities) {
          if (scope.selectedDistricts.includes(city)) {
            geos.push({ city, state });
          }
        }
      }
    }

    return geos;
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  static normalizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\s/g, "");
  }

  private static async fetchExistingNormalizedNames(): Promise<Set<string>> {
    const names = new Set<string>();
    try {
      const { data } = await (supabaseAdmin as any)
        .from("school_prospects")
        .select("normalized_name, city");

      if (data) {
        for (const row of data) {
          if (row.normalized_name && row.city) {
            names.add(`${row.normalized_name}|${row.city.toLowerCase()}`);
          }
        }
      }
    } catch (err) {
      console.error("[Discovery] Failed to load existing names:", err);
    }
    return names;
  }

  private static async updateRunProgress(runId: string, progress: DiscoveryProgress): Promise<void> {
    await (supabaseAdmin as any)
      .from("school_discovery_runs")
      .update({
        ...this.progressToDbFields(progress),
        updated_at: new Date().toISOString(),
      })
      .eq("id", runId);
  }

  private static progressToDbFields(p: DiscoveryProgress) {
    return {
      geographies_planned: p.geographiesPlanned,
      geographies_completed: p.geographiesCompleted,
      queries_planned: p.queriesPlanned,
      queries_completed: p.queriesCompleted,
      queries_failed: p.queriesFailed,
      raw_candidates_found: p.rawCandidatesFound,
      unique_candidates_found: p.uniqueCandidatesFound,
      duplicates_removed: p.duplicatesRemoved,
      candidates_persisted: p.candidatesPersisted,
    };
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise((res) => setTimeout(res, ms));
  }
}
