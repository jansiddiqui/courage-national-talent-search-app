import { AIExtractedIntelligence } from "./types";

export interface ScoreDetails {
  totalScore: number;
  confidenceScore: number;
  breakdown: {
    classesOffered: number;
    olympiads: number;
    stem: number;
    contacts: number;
    decisionMaker: number;
    digitalFootprint: number;
    board: number;
  };
}

export class SchoolScoringService {
  private static getStatusModifier(status: string): number {
    switch (status) {
      case "VERIFIED":
        return 1.0;
      case "INFERRED":
        return 0.5;
      case "UNKNOWN":
      case "CONFLICTING":
      default:
        return 0.0;
    }
  }

  /**
   * Calculate deterministic outreach score and aggregate confidence rating
   */
  static calculateScore(intelligence: AIExtractedIntelligence, websiteFound: boolean): ScoreDetails {
    const breakdown = {
      classesOffered: 0,
      olympiads: 0,
      stem: 0,
      contacts: 0,
      decisionMaker: 0,
      digitalFootprint: 0,
      board: 0
    };

    let totalConfidence = 0;
    let confidenceCount = 0;

    const trackConfidence = (claim: any) => {
      if (claim) {
        if (claim.status === "UNKNOWN") {
          totalConfidence += 0;
        } else if (typeof claim.confidence === "number") {
          totalConfidence += claim.confidence;
        }
      }
      confidenceCount++;
    };

    // 1. Target Classes Offered (Weight: 20)
    const classes = intelligence.classes_offered;
    trackConfidence(classes);
    if (classes && classes.value) {
      const text = classes.value.toLowerCase();
      const hasTargetClass = text.includes("5") || text.includes("6") || text.includes("7") || text.includes("8") || 
                             text.includes("five") || text.includes("six") || text.includes("seven") || text.includes("eight") ||
                             text.includes("middle") || text.includes("primary") || text.includes("secondary") || text.includes("12");
      if (hasTargetClass) {
        breakdown.classesOffered = Math.round(20 * this.getStatusModifier(classes.status));
      }
    }

    // 2. Olympiads & Competitions Focus (Weight: 20)
    const olymp = intelligence.partnership_signals_olympiad_participation;
    const comp = intelligence.partnership_signals_competitions_participation;
    trackConfidence(olymp);
    trackConfidence(comp);

    const hasOlymp = (olymp && olymp.value === true) || (comp && comp.value === true);
    if (hasOlymp) {
      let maxStatus = "UNKNOWN";
      if (olymp?.status === "VERIFIED" || comp?.status === "VERIFIED") {
        maxStatus = "VERIFIED";
      } else if (olymp?.status === "INFERRED" || comp?.status === "INFERRED") {
        maxStatus = "INFERRED";
      }
      breakdown.olympiads = Math.round(20 * this.getStatusModifier(maxStatus));
    }

    // 3. STEM / Atal Tinkering Lab (Weight: 15)
    const stemLab = intelligence.facilities_stem_facilities;
    const atalLab = intelligence.facilities_atal_tinkering_lab;
    const stemFocus = intelligence.partnership_signals_stem_focus;
    trackConfidence(stemLab);
    trackConfidence(atalLab);
    trackConfidence(stemFocus);

    const hasStem = (stemLab && stemLab.value === true) || (atalLab && atalLab.value === true) || (stemFocus && stemFocus.value === true);
    if (hasStem) {
      let maxStatus = "UNKNOWN";
      if (stemLab?.status === "VERIFIED" || atalLab?.status === "VERIFIED" || stemFocus?.status === "VERIFIED") {
        maxStatus = "VERIFIED";
      } else if (stemLab?.status === "INFERRED" || atalLab?.status === "INFERRED" || stemFocus?.status === "INFERRED") {
        maxStatus = "INFERRED";
      }
      breakdown.stem = Math.round(15 * this.getStatusModifier(maxStatus));
    }

    // 4. Contact Credentials (Weight: 15)
    const email = intelligence.email;
    const phone = intelligence.phone;
    trackConfidence(email);
    trackConfidence(phone);

    const hasContact = (email && email.value) || (phone && phone.value);
    if (hasContact) {
      let maxStatus = "UNKNOWN";
      if (email?.status === "VERIFIED" || phone?.status === "VERIFIED") {
        maxStatus = "VERIFIED";
      } else if (email?.status === "INFERRED" || phone?.status === "INFERRED") {
        maxStatus = "INFERRED";
      }
      breakdown.contacts = Math.round(15 * this.getStatusModifier(maxStatus));
    }

    // 5. Decision Maker Identified (Weight: 15)
    const princ = intelligence.principal_name;
    const dir = intelligence.director_name;
    const coord = intelligence.academic_coordinator_name;
    trackConfidence(princ);
    trackConfidence(dir);
    trackConfidence(coord);

    const hasLeader = (princ && princ.value) || (dir && dir.value) || (coord && coord.value);
    if (hasLeader) {
      let maxStatus = "UNKNOWN";
      if (princ?.status === "VERIFIED" || dir?.status === "VERIFIED" || coord?.status === "VERIFIED") {
        maxStatus = "VERIFIED";
      } else if (princ?.status === "INFERRED" || dir?.status === "INFERRED" || coord?.status === "INFERRED") {
        maxStatus = "INFERRED";
      }
      breakdown.decisionMaker = Math.round(15 * this.getStatusModifier(maxStatus));
    }

    // 6. Digital Footprint (Weight: 10)
    if (websiteFound) {
      breakdown.digitalFootprint = 10;
    }

    // 7. Board Affiliation (Weight: 5)
    const board = intelligence.board;
    trackConfidence(board);
    if (board && board.value === "CBSE") {
      breakdown.board = Math.round(5 * this.getStatusModifier(board.status));
    }

    const totalScore = breakdown.classesOffered + breakdown.olympiads + breakdown.stem + breakdown.contacts + breakdown.decisionMaker + breakdown.digitalFootprint + breakdown.board;
    const confidenceScore = confidenceCount > 0 ? Math.round(totalConfidence / confidenceCount) : 0;

    return {
      totalScore,
      confidenceScore,
      breakdown
    };
  }
}
