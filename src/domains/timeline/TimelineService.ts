/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

export interface CntsEdition {
  id: string;
  edition_year: number;
  name: string;
  slug: string;
  theme?: string;
  status: "DRAFT" | "REVIEW" | "PUBLISHED" | "LOCKED" | "COMPLETED" | "ARCHIVED";
  is_current: boolean;
  registration_status: "UPCOMING" | "OPEN" | "CLOSING_SOON" | "CLOSED";
  exam_status: "SCHEDULED" | "LOGIN_OPEN" | "IN_PROGRESS" | "COMPLETED";
  results_status: "SCHEDULED" | "READY" | "RELEASED" | "LOCKED";
  certificates_status: "SCHEDULED" | "READY" | "AVAILABLE" | "LOCKED";
  awards_status: "SCHEDULED" | "READY" | "RELEASED" | "COMPLETED";
  admit_card_status: "SCHEDULED" | "READY" | "AVAILABLE" | "LOCKED";
  created_at: string;
  updated_at: string;
}

export interface CntsTimelineEvent {
  id: string;
  edition_id: string;
  event_key: string;
  title: string;
  short_title?: string;
  description?: string;
  start_at: string;
  end_at?: string | null;
  timezone: string;
  event_type: "PUBLIC" | "ADMIN_ONLY" | "MILESTONE" | "EXAM_WINDOW" | "GATING";
  audience: "STUDENT" | "PARENT" | "SCHOOL" | "PARTNER" | "ADMIN" | "ALL";
  status: "UPCOMING" | "ACTIVE" | "COMPLETED" | "OVERDUE" | "DISABLED" | "READY" | "RELEASED";
  is_public: boolean;
  is_active: boolean;
  display_order: number;
  icon?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface DynamicTimelineConfig {
  editionYear: number;
  editionName: string;
  editionSlug: string;
  editionStatus: string;
  isCurrent: boolean;
  
  // Date ISO Strings (IST +05:30)
  AWARENESS_START: string;
  AWARENESS_END: string;
  REGISTRATION_OPEN: string;
  REGISTRATION_CLOSE: string;
  FINAL_RECONCILIATION: string;
  ADMIT_CARD_RELEASE: string;
  EXAM_LOGIN_OPEN: string;
  EXAM_DATE: string;
  EXAM_START: string;
  SUB_JUNIOR_EXAM_END: string;
  JUNIOR_EXAM_END: string;
  EXAM_GLOBAL_CUTOFF: string;
  RESULT_COMPILATION_START: string;
  RESULT_COMPILATION_END: string;
  RESULTS_DATE: string;
  TALENT_PROFILE_DATE: string;
  CERTIFICATE_DATE: string;
  AWARDS_DATE: string;

  // Formatted Labels (IST)
  LABELS: {
    REGISTRATION_OPEN: string;
    REGISTRATION_CLOSE: string;
    ADMIT_CARD_RELEASE: string;
    EXAM_DATE: string;
    EXAM_WINDOW: string;
    RESULTS_DATE: string;
    TALENT_PROFILE_DATE: string;
    CERTIFICATE_DATE: string;
    AWARDS_DATE: string;
  };

  // Operational Gating Statuses
  REGISTRATION_STATUS: string;
  EXAM_STATUS: string;
  RESULTS_STATUS: string;
  CERTIFICATES_STATUS: string;
  ADMIT_CARD_STATUS: string;
}

// Emergency Static Fallback (Used strictly if Database is unreachable)
const EMERGENCY_FALLBACK_EDITION: CntsEdition = {
  id: "emergency-fallback-2026",
  edition_year: 2026,
  name: "Courage National Talent Search 2026",
  slug: "cnts-2026",
  theme: "Founding National Edition",
  status: "PUBLISHED",
  is_current: true,
  registration_status: "OPEN",
  exam_status: "SCHEDULED",
  results_status: "SCHEDULED",
  certificates_status: "SCHEDULED",
  awards_status: "SCHEDULED",
  admit_card_status: "SCHEDULED",
  created_at: "2026-07-15T00:00:00Z",
  updated_at: "2026-08-19T00:00:00Z"
};

const EMERGENCY_FALLBACK_EVENTS: CntsTimelineEvent[] = [
  {
    id: "fb_1",
    edition_id: "emergency-fallback-2026",
    event_key: "REGISTRATION_OPEN",
    title: "Candidate Registrations Open",
    short_title: "Registrations Open",
    description: "Online enrollment opens for Classes 5 to 8 across India.",
    start_at: "2026-07-15T10:00:00+05:30",
    timezone: "Asia/Kolkata",
    event_type: "PUBLIC",
    audience: "ALL",
    status: "COMPLETED",
    is_public: true,
    is_active: true,
    display_order: 1,
    icon: "UserPlus"
  },
  {
    id: "fb_2",
    edition_id: "emergency-fallback-2026",
    event_key: "REGISTRATION_CLOSE",
    title: "Candidate Registration Deadline",
    short_title: "Registration Closes",
    description: "Final deadline for online candidate registration and school roster submissions.",
    start_at: "2026-09-25T23:59:59+05:30",
    timezone: "Asia/Kolkata",
    event_type: "PUBLIC",
    audience: "ALL",
    status: "ACTIVE",
    is_public: true,
    is_active: true,
    display_order: 2,
    icon: "CalendarX"
  },
  {
    id: "fb_3",
    edition_id: "emergency-fallback-2026",
    event_key: "FINAL_REGISTRATION_RECONCILIATION",
    title: "Registration & Fee Reconciliation",
    short_title: "Final Reconciliation",
    description: "Administrative audit of candidate payments and school quotas.",
    start_at: "2026-09-26T00:00:00+05:30",
    end_at: "2026-09-26T09:59:59+05:30",
    timezone: "Asia/Kolkata",
    event_type: "ADMIN_ONLY",
    audience: "ADMIN",
    status: "UPCOMING",
    is_public: false,
    is_active: true,
    display_order: 3,
    icon: "CheckSquare"
  },
  {
    id: "fb_4",
    edition_id: "emergency-fallback-2026",
    event_key: "ADMIT_CARD_RELEASE",
    title: "Admit Card & Hall Ticket Release",
    short_title: "Admit Cards Available",
    description: "Digital admit cards and testing slot passes become available for download.",
    start_at: "2026-09-26T10:00:00+05:30",
    timezone: "Asia/Kolkata",
    event_type: "PUBLIC",
    audience: "ALL",
    status: "UPCOMING",
    is_public: true,
    is_active: true,
    display_order: 4,
    icon: "FileText"
  },
  {
    id: "fb_5",
    edition_id: "emergency-fallback-2026",
    event_key: "EXAM_LOGIN_OPEN",
    title: "Candidate Exam Login & System Check",
    short_title: "Candidate Login Opens",
    description: "Assessment room opens for device checks, webcam verification, and audio tests.",
    start_at: "2026-09-27T09:30:00+05:30",
    end_at: "2026-09-27T10:00:00+05:30",
    timezone: "Asia/Kolkata",
    event_type: "PUBLIC",
    audience: "ALL",
    status: "UPCOMING",
    is_public: true,
    is_active: true,
    display_order: 5,
    icon: "LogIn"
  },
  {
    id: "fb_6",
    edition_id: "emergency-fallback-2026",
    event_key: "EXAM_START",
    title: "CNTS National Online Assessment",
    short_title: "National Exam Starts",
    description: "Official cognitive talent search examination commences nationwide.",
    start_at: "2026-09-27T10:00:00+05:30",
    end_at: "2026-09-27T12:00:00+05:30",
    timezone: "Asia/Kolkata",
    event_type: "PUBLIC",
    audience: "ALL",
    status: "UPCOMING",
    is_public: true,
    is_active: true,
    display_order: 6,
    icon: "Award"
  },
  {
    id: "fb_7",
    edition_id: "emergency-fallback-2026",
    event_key: "SUB_JUNIOR_EXAM_END",
    title: "Sub-Junior Exam Concludes (Class 5–6)",
    short_title: "Class 5–6 Exam Ends",
    start_at: "2026-09-27T11:15:00+05:30",
    timezone: "Asia/Kolkata",
    event_type: "MILESTONE",
    audience: "ALL",
    status: "UPCOMING",
    is_public: true,
    is_active: true,
    display_order: 7,
    icon: "Clock"
  },
  {
    id: "fb_8",
    edition_id: "emergency-fallback-2026",
    event_key: "JUNIOR_EXAM_END",
    title: "Junior Exam Concludes (Class 7–8)",
    short_title: "Class 7–8 Exam Ends",
    start_at: "2026-09-27T11:30:00+05:30",
    timezone: "Asia/Kolkata",
    event_type: "MILESTONE",
    audience: "ALL",
    status: "UPCOMING",
    is_public: true,
    is_active: true,
    display_order: 8,
    icon: "Clock"
  },
  {
    id: "fb_9",
    edition_id: "emergency-fallback-2026",
    event_key: "RESULT_COMPILATION",
    title: "Result Compilation & Percentile Verification",
    short_title: "Result Compilation",
    start_at: "2026-09-28T00:00:00+05:30",
    end_at: "2026-10-09T23:59:59+05:30",
    timezone: "Asia/Kolkata",
    event_type: "ADMIN_ONLY",
    audience: "ADMIN",
    status: "UPCOMING",
    is_public: false,
    is_active: true,
    display_order: 9,
    icon: "Activity"
  },
  {
    id: "fb_10",
    edition_id: "emergency-fallback-2026",
    event_key: "RESULT_RELEASE",
    title: "National Results & Ranks Publication",
    short_title: "Results Released",
    start_at: "2026-10-10T00:00:00+05:30",
    timezone: "Asia/Kolkata",
    event_type: "PUBLIC",
    audience: "ALL",
    status: "UPCOMING",
    is_public: true,
    is_active: true,
    display_order: 10,
    icon: "Trophy"
  },
  {
    id: "fb_11",
    edition_id: "emergency-fallback-2026",
    event_key: "TALENT_PROFILE_RELEASE",
    title: "Comprehensive Talent DNA Diagnostic Profiles",
    short_title: "Talent DNA Profiles",
    start_at: "2026-10-16T00:00:00+05:30",
    timezone: "Asia/Kolkata",
    event_type: "PUBLIC",
    audience: "ALL",
    status: "UPCOMING",
    is_public: true,
    is_active: true,
    display_order: 11,
    icon: "Sparkles"
  },
  {
    id: "fb_12",
    edition_id: "emergency-fallback-2026",
    event_key: "CERTIFICATE_RELEASE",
    title: "Digital Merit & Participation Certificates",
    short_title: "Certificates Released",
    start_at: "2026-10-18T00:00:00+05:30",
    timezone: "Asia/Kolkata",
    event_type: "PUBLIC",
    audience: "ALL",
    status: "UPCOMING",
    is_public: true,
    is_active: true,
    display_order: 12,
    icon: "FileCheck"
  },
  {
    id: "fb_13",
    edition_id: "emergency-fallback-2026",
    event_key: "AWARDS_DATE",
    title: "National Awards & Merit Cash Prizes",
    short_title: "Awards Announcement",
    start_at: "2026-10-20T00:00:00+05:30",
    timezone: "Asia/Kolkata",
    event_type: "PUBLIC",
    audience: "ALL",
    status: "UPCOMING",
    is_public: true,
    is_active: true,
    display_order: 13,
    icon: "Award"
  }
];

export class TimelineService {
  private static cache: {
    edition: CntsEdition | null;
    events: CntsTimelineEvent[];
    timestamp: number;
  } = {
    edition: null,
    events: [],
    timestamp: 0
  };

  private static CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

  /**
   * Clears the in-memory cache when an administrator updates the timeline
   */
  public static invalidateCache(): void {
    this.cache = { edition: null, events: [], timestamp: 0 };
  }

  /**
   * Retrieves the current active CNTS edition from database
   */
  public static async getActiveEdition(): Promise<CntsEdition> {
    const now = Date.now();
    if (this.cache.edition && (now - this.cache.timestamp) < this.CACHE_TTL_MS) {
      return this.cache.edition;
    }

    if (!hasSupabaseAdminConfig) {
      return EMERGENCY_FALLBACK_EDITION;
    }

    try {
      const { data, error } = await (supabaseAdmin as any)
        .from("cnts_editions")
        .select("*")
        .eq("is_current", true)
        .eq("status", "PUBLISHED")
        .maybeSingle();

      if (error || !data) {
        // Fallback to highest year published edition
        const { data: fallbackData } = await (supabaseAdmin as any)
          .from("cnts_editions")
          .select("*")
          .order("edition_year", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (fallbackData) {
          this.cache.edition = fallbackData;
          this.cache.timestamp = now;
          return fallbackData;
        }

        return EMERGENCY_FALLBACK_EDITION;
      }

      this.cache.edition = data;
      this.cache.timestamp = now;
      return data;
    } catch (err) {
      console.error("[TimelineService] Failed to query active edition from DB:", err);
      return EMERGENCY_FALLBACK_EDITION;
    }
  }

  /**
   * Retrieves all timeline events for an edition from database
   */
  public static async getTimelineEvents(editionYear?: number): Promise<CntsTimelineEvent[]> {
    const activeEdition = await this.getActiveEdition();
    const targetYear = editionYear || activeEdition.edition_year;

    if (!hasSupabaseAdminConfig) {
      return EMERGENCY_FALLBACK_EVENTS;
    }

    try {
      const { data: edition } = await (supabaseAdmin as any)
        .from("cnts_editions")
        .select("id")
        .eq("edition_year", targetYear)
        .maybeSingle();

      const editionId = edition?.id || activeEdition.id;

      const { data: events, error } = await (supabaseAdmin as any)
        .from("cnts_timeline_events")
        .select("*")
        .eq("edition_id", editionId)
        .order("display_order", { ascending: true });

      if (error || !events || events.length === 0) {
        return EMERGENCY_FALLBACK_EVENTS;
      }

      return events;
    } catch (err) {
      console.error("[TimelineService] Failed to query timeline events from DB:", err);
      return EMERGENCY_FALLBACK_EVENTS;
    }
  }

  /**
   * Formats a UTC or ISO date string into an IST formatted string
   */
  public static formatISTDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
    const date = new Date(dateStr);
    const defaultOptions: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata"
    };
    return date.toLocaleDateString("en-IN", options || defaultOptions);
  }

  /**
   * Generates the dynamic single-source-of-truth timeline configuration
   */
  public static async getTimelineConfig(): Promise<DynamicTimelineConfig> {
    const edition = await this.getActiveEdition();
    const events = await this.getTimelineEvents(edition.edition_year);

    const eventMap = new Map<string, CntsTimelineEvent>();
    events.forEach(e => eventMap.set(e.event_key, e));

    const regOpen = eventMap.get("REGISTRATION_OPEN")?.start_at || "2026-07-15T10:00:00+05:30";
    const regClose = eventMap.get("REGISTRATION_CLOSE")?.start_at || "2026-09-25T23:59:59+05:30";
    const recon = eventMap.get("FINAL_REGISTRATION_RECONCILIATION")?.start_at || "2026-09-26T00:00:00+05:30";
    const admitCard = eventMap.get("ADMIT_CARD_RELEASE")?.start_at || "2026-09-26T10:00:00+05:30";
    const loginOpen = eventMap.get("EXAM_LOGIN_OPEN")?.start_at || "2026-09-27T09:30:00+05:30";
    const examStart = eventMap.get("EXAM_START")?.start_at || "2026-09-27T10:00:00+05:30";
    const subJrEnd = eventMap.get("SUB_JUNIOR_EXAM_END")?.start_at || "2026-09-27T11:15:00+05:30";
    const jrEnd = eventMap.get("JUNIOR_EXAM_END")?.start_at || "2026-09-27T11:30:00+05:30";
    const globalCutoff = eventMap.get("EXAM_START")?.end_at || "2026-09-27T12:00:00+05:30";
    const compStart = eventMap.get("RESULT_COMPILATION")?.start_at || "2026-09-28T00:00:00+05:30";
    const compEnd = eventMap.get("RESULT_COMPILATION")?.end_at || "2026-10-09T23:59:59+05:30";
    const resultsDate = eventMap.get("RESULT_RELEASE")?.start_at || "2026-10-10T00:00:00+05:30";
    const talentProfile = eventMap.get("TALENT_PROFILE_RELEASE")?.start_at || "2026-10-16T00:00:00+05:30";
    const certDate = eventMap.get("CERTIFICATE_RELEASE")?.start_at || "2026-10-18T00:00:00+05:30";
    const awardsDate = eventMap.get("AWARDS_DATE")?.start_at || "2026-10-20T00:00:00+05:30";

    const examDateObj = new Date(examStart);
    const dayName = examDateObj.toLocaleDateString("en-IN", { weekday: "long", timeZone: "Asia/Kolkata" });
    const formattedExamDay = `${this.formatISTDate(examStart)} (${dayName})`;

    return {
      editionYear: edition.edition_year,
      editionName: edition.name,
      editionSlug: edition.slug,
      editionStatus: edition.status,
      isCurrent: edition.is_current,
      AWARENESS_START: "2026-07-05T00:00:00+05:30",
      AWARENESS_END: "2026-07-14T23:59:59+05:30",
      REGISTRATION_OPEN: regOpen,
      REGISTRATION_CLOSE: regClose,
      FINAL_RECONCILIATION: recon,
      ADMIT_CARD_RELEASE: admitCard,
      EXAM_LOGIN_OPEN: loginOpen,
      EXAM_DATE: examStart,
      EXAM_START: examStart,
      SUB_JUNIOR_EXAM_END: subJrEnd,
      JUNIOR_EXAM_END: jrEnd,
      EXAM_GLOBAL_CUTOFF: globalCutoff,
      RESULT_COMPILATION_START: compStart,
      RESULT_COMPILATION_END: compEnd,
      RESULTS_DATE: resultsDate,
      TALENT_PROFILE_DATE: talentProfile,
      CERTIFICATE_DATE: certDate,
      AWARDS_DATE: awardsDate,
      LABELS: {
        REGISTRATION_OPEN: this.formatISTDate(regOpen),
        REGISTRATION_CLOSE: this.formatISTDate(regClose),
        ADMIT_CARD_RELEASE: this.formatISTDate(admitCard),
        EXAM_DATE: formattedExamDay,
        EXAM_WINDOW: "10:00 AM - 12:00 PM IST",
        RESULTS_DATE: this.formatISTDate(resultsDate),
        TALENT_PROFILE_DATE: this.formatISTDate(talentProfile),
        CERTIFICATE_DATE: this.formatISTDate(certDate),
        AWARDS_DATE: this.formatISTDate(awardsDate)
      },
      REGISTRATION_STATUS: edition.registration_status,
      EXAM_STATUS: edition.exam_status,
      RESULTS_STATUS: edition.results_status,
      CERTIFICATES_STATUS: edition.certificates_status,
      ADMIT_CARD_STATUS: edition.admit_card_status
    };
  }

  /**
   * Hard Server-Side Gate: Evaluates whether registration is open
   */
  public static async isRegistrationOpen(nowDate?: Date): Promise<{ isOpen: boolean; reason?: string; closeDate: Date }> {
    const config = await this.getTimelineConfig();
    const now = nowDate || new Date();
    const openTime = new Date(config.REGISTRATION_OPEN).getTime();
    const closeTime = new Date(config.REGISTRATION_CLOSE).getTime();
    const currentTime = now.getTime();

    if (config.REGISTRATION_STATUS === "CLOSED") {
      return { isOpen: false, reason: `Registrations for CNTS ${config.editionYear} are officially closed by administration.`, closeDate: new Date(closeTime) };
    }

    if (currentTime < openTime) {
      return { isOpen: false, reason: `Registrations for CNTS ${config.editionYear} open on ${config.LABELS.REGISTRATION_OPEN} at 10:00 AM IST.`, closeDate: new Date(closeTime) };
    }

    if (currentTime > closeTime) {
      return { isOpen: false, reason: `Registrations for CNTS ${config.editionYear} officially closed on ${config.LABELS.REGISTRATION_CLOSE} at 11:59 PM IST.`, closeDate: new Date(closeTime) };
    }

    return { isOpen: true, closeDate: new Date(closeTime) };
  }

  /**
   * Hard Server-Side Gate: Evaluates whether admit cards are available for download
   */
  public static async isAdmitCardAvailable(nowDate?: Date): Promise<boolean> {
    const config = await this.getTimelineConfig();
    if (config.ADMIT_CARD_STATUS === "AVAILABLE") return true;
    if (config.ADMIT_CARD_STATUS === "LOCKED") return false;

    const now = (nowDate || new Date()).getTime();
    const releaseTime = new Date(config.ADMIT_CARD_RELEASE).getTime();
    return now >= releaseTime;
  }

  /**
   * Hard Server-Side Gate: Evaluates whether results are officially released
   * Separates scheduled date from actual release status
   */
  public static async isResultReleased(nowDate?: Date): Promise<boolean> {
    const config = await this.getTimelineConfig();
    // Explicit release status takes absolute precedence
    if (config.RESULTS_STATUS === "RELEASED") return true;
    if (config.RESULTS_STATUS === "LOCKED" || config.RESULTS_STATUS === "SCHEDULED" || config.RESULTS_STATUS === "READY") {
      return false;
    }

    const now = (nowDate || new Date()).getTime();
    const releaseTime = new Date(config.RESULTS_DATE).getTime();
    return now >= releaseTime;
  }

  /**
   * Hard Exam-Window Calculation:
   * Caps individual session expiration at the global exam cutoff time
   * so late starters cannot extend past the official window end
   */
  public static async calculateSessionExpiry(
    category: "SUB_JUNIOR" | "JUNIOR",
    startedAtDate?: Date
  ): Promise<{ startedAt: string; expiresAt: string; durationMinutes: number; isHardCapped: boolean }> {
    const config = await this.getTimelineConfig();
    const startedAt = startedAtDate || new Date();
    const startTimeMs = startedAt.getTime();

    const standardDurationMinutes = category === "SUB_JUNIOR" ? 75 : 90;
    const standardExpiryMs = startTimeMs + (standardDurationMinutes * 60 * 1000);

    // Global cutoff is 12:00 PM IST on exam day
    const globalCutoffMs = new Date(config.EXAM_GLOBAL_CUTOFF).getTime();

    // Cap expiry at the global window cutoff
    let finalExpiryMs = standardExpiryMs;
    let isHardCapped = false;

    if (standardExpiryMs > globalCutoffMs) {
      finalExpiryMs = Math.max(startTimeMs, globalCutoffMs);
      isHardCapped = true;
    }

    const effectiveDurationMinutes = Math.max(1, Math.round((finalExpiryMs - startTimeMs) / (60 * 1000)));

    return {
      startedAt: startedAt.toISOString(),
      expiresAt: new Date(finalExpiryMs).toISOString(),
      durationMinutes: effectiveDurationMinutes,
      isHardCapped
    };
  }

  /**
   * Timeline Dependency Validator:
   * Ensures chronological sanity and surfaces warnings before publishing timeline changes
   */
  public static validateTimelineDependencies(events: Partial<CntsTimelineEvent>[]): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const map = new Map<string, Date>();
    events.forEach(e => {
      if (e.event_key && e.start_at) {
        map.set(e.event_key, new Date(e.start_at));
      }
    });

    const regOpen = map.get("REGISTRATION_OPEN");
    const regClose = map.get("REGISTRATION_CLOSE");
    const admitCard = map.get("ADMIT_CARD_RELEASE");
    const examStart = map.get("EXAM_START");
    const resultRel = map.get("RESULT_RELEASE");
    const certRel = map.get("CERTIFICATE_RELEASE");
    const awards = map.get("AWARDS_DATE");

    if (regOpen && regClose && regClose <= regOpen) {
      errors.push("Registration Close date must be after Registration Open date.");
    }

    if (regClose && examStart && examStart < regClose) {
      errors.push("National Exam date cannot be before the Registration Close deadline.");
    }

    if (admitCard && examStart && admitCard > examStart) {
      errors.push("Admit Cards must be released before or on the National Exam date.");
    }

    if (examStart && resultRel && resultRel <= examStart) {
      errors.push("Results Release date must be after the National Exam date.");
    }

    if (resultRel && certRel && certRel < resultRel) {
      warnings.push("Certificate Release is scheduled before Results Release. Verify if certificates should precede results.");
    }

    if (resultRel && awards && awards < resultRel) {
      warnings.push("Awards Announcement is scheduled before Results Release.");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}
