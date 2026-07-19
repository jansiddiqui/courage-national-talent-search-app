/**
 * SchoolDiscoveryService — CNTS School Intelligence Engine
 *
 * Implements nationwide school discovery through geographic decomposition
 * and search-API-based candidate harvesting.
 */

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { DiscoveryScope, DiscoveryProgress, CanonicalCandidate } from "./types";
import { SearchApiCollector } from "./SearchApiCollector";

// ─── Geographic Data ────────────────────────────────────────────────────────

/** All 28 states and 8 union territories of India with highly expanded cities and districts */
export const INDIA_GEOGRAPHY: Record<string, string[]> = {
  "Andhra Pradesh": [
    "Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore", 
    "Kurnool", "Kakinada", "Rajamahendravaram", "Kadapa", "Anantapur", 
    "Eluru", "Vizianagaram", "Ongole", "Nandyal", "Machilipatnam", 
    "Adoni", "Tenali", "Proddatur", "Chittoor"
  ],
  "Arunachal Pradesh": ["Itanagar", "Tawang", "Naharlagun", "Pasighat"],
  "Assam": [
    "Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Nagaon", 
    "Tinsukia", "Tezpur", "Bongaigaon", "Karimganj", "Sivasagar"
  ],
  "Bihar": [
    "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Bihar Sharif", 
    "Arrah", "Begusarai", "Katihar", "Munger", "Purnia", 
    "Darbhanga", "Samastipur", "Chapra", "Saharsa", "Hajipur", 
    "Sasaram", "Motihari", "Siwan"
  ],
  "Chhattisgarh": [
    "Raipur", "Bhilai", "Bilaspur", "Durg", "Korba", 
    "Rajnandgaon", "Jagdalpur", "Ambikapur", "Dhamtari"
  ],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  "Gujarat": [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", 
    "Bhavnagar", "Jamnagar", "Junagadh", "Gandhidham", "Nadiad", 
    "Anand", "Morbi", "Mehsana", "Surendranagar", "Valsad", 
    "Bharuch", "Navsari", "Vapi", "Godhra", "Patan"
  ],
  "Haryana": [
    "Gurugram", "Faridabad", "Ambala", "Hisar", "Rohtak", 
    "Karnal", "Panipat", "Yamunanagar", "Sonipat", "Panchkula", 
    "Kurukshetra", "Kaithal", "Sirsa", "Jind", "Bahadurgarh", 
    "Jhajjar", "Rewari"
  ],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamsala", "Solan", "Mandi", "Hamirpur"],
  "Jharkhand": [
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Deoghar", 
    "Phusro", "Hazaribagh", "Giridih", "Medininagar"
  ],
  "Karnataka": [
    "Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belagavi", 
    "Davanagere", "Bellary", "Shimoga", "Tumkur", "Bijapur", 
    "Raichur", "Bidar", "Hospet", "Hassan", "Gadag", 
    "Udupi", "Kolar", "Mandya", "Chikmagalur", "Chitradurga", 
    "Bagalkot"
  ],
  "Kerala": [
    "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", 
    "Alappuzha", "Palakkad", "Kannur", "Kottayam", "Kasargod", 
    "Malappuram", "Pathanamthitta"
  ],
  "Madhya Pradesh": [
    "Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", 
    "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", 
    "Murwara", "Singrauli", "Burhanpur", "Khandwa", "Bhind", 
    "Chhindwara", "Shivpuri", "Vidisha", "Chhatarpur", "Damoh", 
    "Mandsaur", "Khargone"
  ],
  "Maharashtra": [
    "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane", 
    "Navi Mumbai", "Solapur", "Kolhapur", "Amravati", "Akola", 
    "Jalgaon", "Latur", "Dhule", "Ahmednagar", "Chandrapur", 
    "Parbhani", "Ichalkaranji", "Jalna", "Bhusawal", "Panvel", 
    "Satara", "Beed", "Yavatmal", "Gondia"
  ],
  "Manipur": ["Imphal", "Churachandpur", "Thoubal"],
  "Meghalaya": ["Shillong", "Tura", "Jowai"],
  "Mizoram": ["Aizawl", "Lunglei"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung"],
  "Odisha": [
    "Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", 
    "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda"
  ],
  "Punjab": [
    "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Chandigarh", 
    "Bathinda", "Mohali", "Pathankot", "Hoshiarpur", "Moga", 
    "Abohar", "Khanna", "Phagwara", "Muktsar", "Barnala"
  ],
  "Rajasthan": [
    "Jaipur", "Jodhpur", "Kota", "Udaipur", "Bikaner", 
    "Ajmer", "Bhilwara", "Alwar", "Bharatpur", "Sikar", 
    "Sri Ganganagar", "Pali", "Chittorgarh", "Tonk", "Kishangarh", 
    "Beawar", "Hanumangarh", "Dholpur", "Sawai Madhopur", "Churu"
  ],
  "Sikkim": ["Gangtok", "Namchi"],
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", 
    "Tirunelveli", "Thoothukudi", "Nagercoil", "Thanjavur", "Dindigul", 
    "Vellore", "Karur", "Ooty", "Erode", "Tiruppur", 
    "Kanchipuram", "Kumbakonam", "Karaikudi", "Neyveli", "Cuddalore"
  ],
  "Telangana": [
    "Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", 
    "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad"
  ],
  "Tripura": ["Agartala", "Dharmanagar", "Udaipur"],
  "Uttar Pradesh": [
    "Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", 
    "Allahabad", "Noida", "Ghaziabad", "Aligarh", "Bareilly", 
    "Moradabad", "Gorakhpur", "Saharanpur", "Jhansi", "Muzaffarnagar", 
    "Mathura", "Firozabad", "Loni", "Ayodhya", "Mirzapur", 
    "Bulandshahr", "Hapur", "Sambhal", "Amroha", "Hardoi", 
    "Fatehpur", "Raebareli", "Orai", "Bahraich", "Jaunpur", 
    "Unnao", "Sitapur", "Lakhimpur", "Budaun", "Pilibhit", 
    "Farrukhabad"
  ],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh"],
  "West Bengal": [
    "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", 
    "Bardhaman", "Malda", "Baharampur", "Kharagpur", "Haldia", 
    "Jalpaiguri", "Balurghat", "Purulia", "Bankura", "Darjeeling"
  ],
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Silvassa", "Diu"],
  "Delhi": [
    "New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", 
    "Central Delhi", "Dwarka", "Rohini", "Vasant Kunj", "Saket"
  ],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua", "Sopore"],
  "Ladakh": ["Leh", "Kargil"],
  "Lakshadweep": ["Kavaratti"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
};

/** Query templates for school discovery — targeted at CNTS-relevant schools */
export const QUERY_TEMPLATES = [
  "private schools in {geo}",
  "CBSE schools in {geo}",
  "ICSE schools in {geo}",
  "English medium schools in {geo}",
  "schools classes 5 to 8 in {geo}",
  "best schools in {geo}",
  "top schools in {geo}",
];

export class SchoolDiscoveryService {

  /**
   * Start a new discovery run and persist it to the database.
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
        status: "PENDING",
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
   * Execute a bounded batch of discovery queries (called from cron worker).
   */
  static async executeDiscoveryRun(
    runId: string,
    job: any
  ): Promise<{ completed: boolean; progress: DiscoveryProgress; updatedJobPayload: any }> {
    // 1. Fetch run record
    const { data: run } = await (supabaseAdmin as any)
      .from("school_discovery_runs")
      .select("*")
      .eq("id", runId)
      .single();

    if (!run) {
      throw new Error(`Run not found: ${runId}`);
    }

    // Initialize progress stats
    const progress: DiscoveryProgress = {
      geographiesPlanned: run.geographies_planned || 0,
      geographiesCompleted: run.geographies_completed || 0,
      queriesPlanned: run.queries_planned || 0,
      queriesCompleted: run.queries_completed || 0,
      queriesFailed: run.queries_failed || 0,
      rawCandidatesFound: run.raw_candidates_found || 0,
      uniqueCandidatesFound: run.unique_candidates_found || 0,
      duplicatesRemoved: run.duplicates_removed || 0,
      candidatesPersisted: run.candidates_persisted || 0,
    };

    if (run.status === "CANCELLED" || run.status === "COMPLETED") {
      return { completed: true, progress, updatedJobPayload: job.payload };
    }

    // Load or initialize checkpoint
    const checkpoint = job.payload?.checkpoint || {
      currentGeographyIndex: 0,
      currentTemplateIndex: 0,
      currentPageNumber: 1,
    };

    const scope: DiscoveryScope = {
      type: run.scope_type,
      selectedStates: run.selected_states,
      selectedDistricts: run.selected_districts,
      targetCount: run.target_count,
    };

    const geographies = this.buildGeographyList(scope);
    const collector = new SearchApiCollector();

    let queryCount = 0;
    const maxQueriesPerBatch = 5;
    let completed = false;

    // Load existing names to avoid memory double insertion checks
    const existingNames = await this.fetchExistingNormalizedNames();

    // Mark run as RUNNING in DB
    await (supabaseAdmin as any)
      .from("school_discovery_runs")
      .update({ status: "RUNNING", updated_at: new Date().toISOString() })
      .eq("id", runId);

    while (queryCount < maxQueriesPerBatch) {
      // Check if target count reached
      if (progress.candidatesPersisted >= scope.targetCount) {
        completed = true;
        break;
      }

      // Check if geographies exhausted
      if (checkpoint.currentGeographyIndex >= geographies.length) {
        completed = true;
        break;
      }

      // Verify cancellation from DB
      const { data: latestRun } = await (supabaseAdmin as any)
        .from("school_discovery_runs")
        .select("status")
        .eq("id", runId)
        .maybeSingle();

      if (latestRun?.status === "CANCELLED") {
        return { completed: true, progress, updatedJobPayload: job.payload };
      }

      const geo = geographies[checkpoint.currentGeographyIndex];
      const template = QUERY_TEMPLATES[checkpoint.currentTemplateIndex];
      const query = template.replace("{geo}", `${geo.city}, ${geo.state}`);

      const unitId = `${runId}_${checkpoint.currentGeographyIndex}_${checkpoint.currentTemplateIndex}_${checkpoint.currentPageNumber}`;

      // Check idempotency table first
      const { data: completedUnit } = await (supabaseAdmin as any)
        .from("school_discovery_run_units")
        .select("id, results_count, candidates_saved_count")
        .eq("id", unitId)
        .maybeSingle();

      if (completedUnit) {
        // Skip API call but rebuild progress stats from DB metrics
        progress.rawCandidatesFound += completedUnit.results_count;
        progress.uniqueCandidatesFound += completedUnit.candidates_saved_count;
        progress.candidatesPersisted += completedUnit.candidates_saved_count;
        progress.duplicatesRemoved += Math.max(0, completedUnit.results_count - completedUnit.candidates_saved_count);
        progress.queriesCompleted++;
        
        // Advance state pointers without executing search
        this.advanceCheckpoint(checkpoint, geographies.length);
        queryCount++;
        continue;
      }

      // Update real-time terminal progress
      await (supabaseAdmin as any)
        .from("school_discovery_runs")
        .update({
          error_summary: `Querying: "${query}" (Page ${checkpoint.currentPageNumber})`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", runId);

      try {
        const results = await collector.collect(query, checkpoint.currentPageNumber);
        progress.rawCandidatesFound += results.length;

        let savedCount = 0;
        let dupCount = 0;

        for (const candidate of results) {
          const key = `${candidate.normalized_name}|${geo.city.toLowerCase()}`;
          if (existingNames.has(key)) {
            progress.duplicatesRemoved++;
            dupCount++;
            continue;
          }

          // Layered Identity Resolution
          const resolution = await this.resolveIdentity(candidate);
          if (resolution.status === "CONFIRMED_DUPLICATE") {
            progress.duplicatesRemoved++;
            dupCount++;
            existingNames.add(key);
            continue;
          }

          // Persist prospect
          const persisted = await this.persistCandidate(candidate, geo.state, runId, resolution);
          if (persisted) {
            progress.uniqueCandidatesFound++;
            progress.candidatesPersisted++;
            savedCount++;
            existingNames.add(key);
          } else {
            progress.duplicatesRemoved++;
            dupCount++;
          }
        }

        // Transactional batch commit helper (save work unit record)
        await (supabaseAdmin as any)
          .from("school_discovery_run_units")
          .insert({
            id: unitId,
            run_id: runId,
            geography: `${geo.city}, ${geo.state}`,
            query_template: template,
            page_number: checkpoint.currentPageNumber,
            results_count: results.length,
            candidates_saved_count: savedCount,
          });

        progress.queriesCompleted++;

        // Stop pagination if empty or target reached
        const stopPage =
          results.length === 0 ||
          progress.candidatesPersisted >= scope.targetCount ||
          checkpoint.currentPageNumber >= 3 || // limit to 3 pages
          (results.length > 0 && dupCount / results.length > 0.8); // duplicate saturation > 80%

        if (stopPage) {
          // Reset page to 1, advance template/geography
          checkpoint.currentPageNumber = 1;
          checkpoint.currentTemplateIndex++;
          if (checkpoint.currentTemplateIndex >= QUERY_TEMPLATES.length) {
            checkpoint.currentTemplateIndex = 0;
            checkpoint.currentGeographyIndex++;
            progress.geographiesCompleted++;
          }
        } else {
          // Increment page number
          checkpoint.currentPageNumber++;
        }

      } catch (err: any) {
        console.error(`[Discovery] Query failed: "${query}"`, err.message);
        progress.queriesFailed++;
        // Advance template on error
        checkpoint.currentPageNumber = 1;
        checkpoint.currentTemplateIndex++;
        if (checkpoint.currentTemplateIndex >= QUERY_TEMPLATES.length) {
          checkpoint.currentTemplateIndex = 0;
          checkpoint.currentGeographyIndex++;
          progress.geographiesCompleted++;
        }
      }

      queryCount++;
      await this.sleep(300);
    }

    // Check completion
    if (checkpoint.currentGeographyIndex >= geographies.length || progress.candidatesPersisted >= scope.targetCount) {
      completed = true;
    }

    // Persist final progress to DB for this batch
    const finalStatus = completed
      ? progress.queriesFailed > progress.queriesCompleted ? "PARTIAL" : "COMPLETED"
      : "RUNNING";

    await (supabaseAdmin as any)
      .from("school_discovery_runs")
      .update({
        status: finalStatus,
        error_summary: completed ? null : run.error_summary,
        ...this.progressToDbFields(progress),
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", runId);

    const updatedJobPayload = {
      ...job.payload,
      checkpoint,
    };

    return { completed, progress, updatedJobPayload };
  }

  // ─── Layered Identity Resolution ───────────────────────────────────────────

  static async resolveIdentity(
    candidate: CanonicalCandidate
  ): Promise<{ status: "DISTINCT" | "POSSIBLE_DUPLICATE" | "CONFIRMED_DUPLICATE"; duplicateOfId: string | null }> {
    // 1. Affiliation Number match
    if (candidate.affiliation_number) {
      const { data } = await (supabaseAdmin as any)
        .from("school_prospects")
        .select("id")
        .eq("affiliation_number", candidate.affiliation_number)
        .maybeSingle();
      if (data) {
        return { status: "CONFIRMED_DUPLICATE", duplicateOfId: data.id };
      }
    }

    // 2. Canonical Website Domain match + Geography check
    if (candidate.website) {
      try {
        const urlObj = new URL(candidate.website);
        const domain = urlObj.hostname.toLowerCase().replace("www.", "");
        if (domain && domain.length > 3 && !domain.includes("facebook") && !domain.includes("blogspot")) {
          const { data } = await (supabaseAdmin as any)
            .from("school_prospects")
            .select("id, state")
            .ilike("website", `%${domain}%`);
          if (data && data.length > 0) {
            const sameState = data.find((d: any) => d.state?.toLowerCase() === candidate.state?.toLowerCase());
            if (sameState) {
              return { status: "CONFIRMED_DUPLICATE", duplicateOfId: sameState.id };
            }
          }
        }
      } catch (_) {}
    }

    // 3. Exact Normalized Name + City
    const { data: nameMatches } = await (supabaseAdmin as any)
      .from("school_prospects")
      .select("id, city, state")
      .eq("normalized_name", candidate.normalized_name);

    if (nameMatches && nameMatches.length > 0) {
      const sameCity = nameMatches.find((n: any) => n.city?.toLowerCase() === candidate.city?.toLowerCase());
      if (sameCity) {
        return { status: "CONFIRMED_DUPLICATE", duplicateOfId: sameCity.id };
      }
      const sameState = nameMatches.find((n: any) => n.state?.toLowerCase() === candidate.state?.toLowerCase());
      if (sameState) {
        return { status: "POSSIBLE_DUPLICATE", duplicateOfId: sameState.id };
      }
    }

    // 4. Abbreviation Acronym Match (e.g. DPS Kanpur vs Delhi Public School Kanpur) in same city
    const { data: citySchools } = await (supabaseAdmin as any)
      .from("school_prospects")
      .select("id, name")
      .eq("city", candidate.city);

    if (citySchools) {
      for (const school of citySchools) {
        if (school.name && this.isAcronymMatch(candidate.school_name, school.name)) {
          return { status: "CONFIRMED_DUPLICATE", duplicateOfId: school.id };
        }
      }
    }

    return { status: "DISTINCT", duplicateOfId: null };
  }

  private static isAcronymMatch(nameA: string, nameB: string): boolean {
    const cleanA = nameA.toUpperCase().replace(/[^A-Z0-9\s]/g, "").trim();
    const cleanB = nameB.toUpperCase().replace(/[^A-Z0-9\s]/g, "").trim();
    const wordsA = cleanA.split(/\s+/);
    const wordsB = cleanB.split(/\s+/);

    if (wordsA.length === 1 && wordsB.length > 1) {
      const acronym = wordsB.map(w => w[0]).join("");
      return wordsA[0] === acronym;
    }
    if (wordsB.length === 1 && wordsA.length > 1) {
      const acronym = wordsA.map(w => w[0]).join("");
      return wordsB[0] === acronym;
    }

    // Match acronym prefix: e.g. "DPS Kanpur" (A) vs "Delhi Public School Kanpur" (B)
    if (wordsA.length > 0 && wordsB.length > 1) {
      const firstWord = wordsA[0];
      if (firstWord.length > 1 && firstWord.length < wordsB.length) {
        const potentialAcronym = wordsB.slice(0, firstWord.length).map(w => w[0]).join("");
        if (firstWord === potentialAcronym) return true;
      }
    }
    if (wordsB.length > 0 && wordsA.length > 1) {
      const firstWord = wordsB[0];
      if (firstWord.length > 1 && firstWord.length < wordsA.length) {
        const potentialAcronym = wordsA.slice(0, firstWord.length).map(w => w[0]).join("");
        if (firstWord === potentialAcronym) return true;
      }
    }

    return false;
  }

  // ─── Persistence ─────────────────────────────────────────────────────────────

  private static async persistCandidate(
    candidate: CanonicalCandidate,
    state: string,
    runId: string,
    resolution: { status: string; duplicateOfId: string | null }
  ): Promise<boolean> {
    try {
      const { error: insertErr } = await (supabaseAdmin as any)
        .from("school_prospects")
        .insert({
          name: candidate.school_name,
          normalized_name: candidate.normalized_name,
          city: candidate.city,
          district: candidate.district || "UNKNOWN",
          state: candidate.state || state,
          board: candidate.board || null,
          website: candidate.website || null,
          discovery_source: candidate.source,
          source_identifier: runId,
          enrichment_status: "PENDING",
          outreach_status: "NEW",
          identity_status: resolution.status,
          duplicate_of: resolution.duplicateOfId,
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

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private static advanceCheckpoint(checkpoint: any, totalGeographies: number) {
    checkpoint.currentPageNumber = 1;
    checkpoint.currentTemplateIndex++;
    if (checkpoint.currentTemplateIndex >= QUERY_TEMPLATES.length) {
      checkpoint.currentTemplateIndex = 0;
      checkpoint.currentGeographyIndex++;
    }
  }

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
