export interface AIClaim<T> {
  value: T;
  status: "VERIFIED" | "INFERRED" | "UNKNOWN" | "CONFLICTING";
  confidence: number;
  evidence_quotes: string[];
}

export interface AIExtractedIntelligence {
  board: AIClaim<"CBSE" | "ICSE" | "STATE_BOARD" | "IB" | "OTHER" | null>;
  school_type: AIClaim<"PRIVATE" | "GOVERNMENT" | "CO-ED" | "BOYS_ONLY" | "GIRLS_ONLY" | null>;
  classes_offered: AIClaim<string | null>;
  medium: AIClaim<string | null>;
  principal_name: AIClaim<string | null>;
  director_name: AIClaim<string | null>;
  academic_coordinator_name: AIClaim<string | null>;
  student_strength_estimate: AIClaim<number | null>;
  facilities_computer_lab: AIClaim<boolean | null>;
  facilities_smart_classrooms: AIClaim<boolean | null>;
  facilities_stem_facilities: AIClaim<boolean | null>;
  facilities_atal_tinkering_lab: AIClaim<boolean | null>;
  partnership_signals_olympiad_participation: AIClaim<boolean | null>;
  partnership_signals_competitions_participation: AIClaim<boolean | null>;
  partnership_signals_stem_focus: AIClaim<boolean | null>;
  partnership_signals_coding_curriculum: AIClaim<boolean | null>;
  email: AIClaim<string | null>;
  phone: AIClaim<string | null>;
  objections: string[];
  pitch_recommendation: string;
}

export interface SchoolProspect {
  id?: string;
  name: string;
  alternative_name?: string | null;
  city: string;
  district: string;
  state: string;
  board?: string | null;
  affiliation_number?: string | null;
  school_type?: string | null;
  website?: string | null;
  enrichment_status: "PENDING" | "PROCESSING" | "COMPLETED" | "PARTIAL" | "FAILED" | "RETRY_PENDING";
  identity_status: "DISTINCT" | "POSSIBLE_DUPLICATE" | "CONFIRMED_DUPLICATE" | "CONFLICTING_IDENTITY";
  duplicate_of?: string | null;
  outreach_score: number;
  confidence_score: number;
  scoring_breakdown: any;
  outreach_templates: any;
  error_logs?: string | null;
  last_enriched_at?: string | null;
  created_at?: string;
  updated_at?: string;
}
