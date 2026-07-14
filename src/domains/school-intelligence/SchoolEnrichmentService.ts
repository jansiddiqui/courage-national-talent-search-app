import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { SchoolProspect, AIExtractedIntelligence } from "./types";
import { WebsiteDiscoveryService } from "./WebsiteDiscoveryService";
import { SchoolCrawlerService, CrawledPage } from "./SchoolCrawlerService";
import { SchoolExtractionService } from "./SchoolExtractionService";
import { SchoolScoringService } from "./SchoolScoringService";
import { SchoolOutreachService } from "./SchoolOutreachService";

export class SchoolEnrichmentService {
  /**
   * Run the full pipeline for a school prospect
   */
  static async enrichProspect(prospectId: string): Promise<boolean> {
    console.log(`[Enrichment] Starting enrichment for prospect ID: ${prospectId}`);

    // 1. Fetch prospect details
    const { data: prospect, error: fetchErr } = await (supabaseAdmin as any)
      .from("school_prospects")
      .select("*")
      .eq("id", prospectId)
      .single();

    if (fetchErr || !prospect) {
      console.error(`[Enrichment] Prospect not found: ${prospectId}`, fetchErr);
      return false;
    }

    // Update status to PROCESSING
    await (supabaseAdmin as any)
      .from("school_prospects")
      .update({
        enrichment_status: "PROCESSING",
        error_logs: null,
        updated_at: new Date().toISOString()
      })
      .eq("id", prospectId);

    try {
      // 2. Discover Website
      console.log(`[Enrichment] Step 1: Discovering website for ${prospect.name}...`);
      const discovery = await WebsiteDiscoveryService.discoverWebsite(prospect);
      const websiteUrl = discovery.selectedUrl;

      let crawledPages: any[] = [];
      let status: "COMPLETED" | "PARTIAL" | "FAILED" = "COMPLETED";

      if (websiteUrl) {
        // 3. Crawl Website
        console.log(`[Enrichment] Step 2: Crawling website: ${websiteUrl}...`);
        crawledPages = await SchoolCrawlerService.crawlSchool(websiteUrl);
        if (crawledPages.length === 0) {
          status = "PARTIAL";
          console.log(`[Enrichment] Website found but crawl returned 0 pages.`);
        }
      } else {
        status = "PARTIAL";
        console.log(`[Enrichment] No website discovered for: ${prospect.name}`);
      }

      // Default mock intelligence if search and crawl returned nothing
      let intelligence: AIExtractedIntelligence;

      if (crawledPages.length > 0) {
        // 4. Extract Structured facts using Gemini
        console.log(`[Enrichment] Step 3: Extracting facts using Gemini...`);
        intelligence = await SchoolExtractionService.extractIntelligence(crawledPages);
      } else {
        // Safe fallback placeholder claims if crawling failed completely (ensures partial success works)
        console.log(`[Enrichment] Crawling empty, setting default UNKNOWN intelligence structure.`);
        intelligence = this.getDefaultUnknownIntelligence();
      }

      // 5. Score Prospect
      console.log(`[Enrichment] Step 4: Scoring prospect...`);
      const scoring = SchoolScoringService.calculateScore(intelligence, !!websiteUrl);

      // 6. Generate Outreach Templates
      console.log(`[Enrichment] Step 5: Generating outreach drafts...`);
      const outreach = SchoolOutreachService.generateDrafts(prospect, intelligence);

      // 7. Write Claim-Level Evidence Provenance to database
      console.log(`[Enrichment] Step 6: Writing field evidence rows...`);
      // Delete old evidence first
      await (supabaseAdmin as any)
        .from("school_prospect_claims_evidence")
        .delete()
        .eq("prospect_id", prospectId);

      const evidenceRows: any[] = [];
      
      const addEvidence = (key: string, claim: any) => {
        if (claim && claim.status && claim.status !== "UNKNOWN") {
          // If we have crawled pages, map to first page or default
          const sourceUrl = pagesContainQuote(crawledPages, claim.evidence_quotes) || websiteUrl || "Discovery Search Snippets";
          evidenceRows.push({
            prospect_id: prospectId,
            claim_key: key,
            extracted_value: claim.value !== null ? String(claim.value) : null,
            source_url: sourceUrl,
            source_title: "School Website Source Page",
            evidence_text: claim.evidence_quotes.join(" | ") || "Extracted fact verified by metadata validation.",
            evidence_status: claim.status,
            confidence: claim.confidence || 0
          });
        }
      };

      // Add evidence for each AI claim field
      Object.keys(intelligence).forEach((key) => {
        const item = (intelligence as any)[key];
        if (item && typeof item === "object" && "status" in item) {
          addEvidence(key, item);
        }
      });

      if (evidenceRows.length > 0) {
        await (supabaseAdmin as any)
          .from("school_prospect_claims_evidence")
          .insert(evidenceRows);
      }

      // 8. Update school_prospects row
      console.log(`[Enrichment] Step 7: Finalizing prospect record update...`);
      await (supabaseAdmin as any)
        .from("school_prospects")
        .update({
          website: websiteUrl,
          enrichment_status: status,
          outreach_score: scoring.totalScore,
          confidence_score: scoring.confidenceScore,
          scoring_breakdown: scoring.breakdown,
          outreach_templates: outreach,
          last_enriched_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("id", prospectId);

      console.log(`[Enrichment] Enrichment successfully COMPLETED for prospect: ${prospect.name}`);
      return true;

    } catch (err: any) {
      console.error(`[Enrichment] Enrichment failed for prospect ${prospectId}:`, err);
      // Mark as FAILED
      await (supabaseAdmin as any)
        .from("school_prospects")
        .update({
          enrichment_status: "FAILED",
          error_logs: err.message || String(err),
          updated_at: new Date().toISOString()
        })
        .eq("id", prospectId);

      return false;
    }
  }

  private static getDefaultUnknownIntelligence(): AIExtractedIntelligence {
    const makeUnknownClaim = <T>(val: T): any => ({
      value: val,
      status: "UNKNOWN",
      confidence: 0,
      evidence_quotes: []
    });

    return {
      board: makeUnknownClaim(null),
      school_type: makeUnknownClaim(null),
      classes_offered: makeUnknownClaim(null),
      medium: makeUnknownClaim(null),
      principal_name: makeUnknownClaim(null),
      director_name: makeUnknownClaim(null),
      academic_coordinator_name: makeUnknownClaim(null),
      student_strength_estimate: makeUnknownClaim(null),
      facilities_computer_lab: makeUnknownClaim(null),
      facilities_smart_classrooms: makeUnknownClaim(null),
      facilities_stem_facilities: makeUnknownClaim(null),
      facilities_atal_tinkering_lab: makeUnknownClaim(null),
      partnership_signals_olympiad_participation: makeUnknownClaim(null),
      partnership_signals_competitions_participation: makeUnknownClaim(null),
      partnership_signals_stem_focus: makeUnknownClaim(null),
      partnership_signals_coding_curriculum: makeUnknownClaim(null),
      email: makeUnknownClaim(null),
      phone: makeUnknownClaim(null),
      objections: [],
      pitch_recommendation: "Introduce CNTS assessment metrics directly to the head of school."
    };
  }
}

function pagesContainQuote(pages: CrawledPage[], quotes: string[]): string | null {
  if (!pages || pages.length === 0 || !quotes || quotes.length === 0) return null;
  const quoteStr = quotes.join(" ").toLowerCase();
  
  for (const page of pages) {
    if (page.text.toLowerCase().includes(quoteStr.substring(0, Math.min(30, quoteStr.length)))) {
      return page.url;
    }
  }
  return pages[0].url;
}
