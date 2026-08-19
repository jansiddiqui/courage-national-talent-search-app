jest.mock("@/lib/supabaseAdmin", () => ({
  supabaseAdmin: {},
  hasSupabaseAdminConfig: false
}));

import { TimelineService } from "@/domains/timeline/TimelineService";

describe("TimelineService & Dynamic Annual Event Architecture", () => {
  beforeEach(() => {
    TimelineService.invalidateCache();
  });

  describe("Active Edition & Timeline Config", () => {
    it("should return the default active CNTS 2026 edition and formatted timeline", async () => {
      const edition = await TimelineService.getActiveEdition();
      expect(edition).toBeDefined();
      expect(edition.edition_year).toBe(2026);
      expect(edition.status).toBe("PUBLISHED");
      expect(edition.is_current).toBe(true);

      const config = await TimelineService.getTimelineConfig();
      expect(config.editionYear).toBe(2026);
      expect(config.LABELS.REGISTRATION_CLOSE).toBe("25 September 2026");
      expect(config.LABELS.ADMIT_CARD_RELEASE).toBe("26 September 2026");
      expect(config.LABELS.EXAM_DATE).toContain("27 September 2026");
      expect(config.LABELS.RESULTS_DATE).toBe("10 October 2026");
      expect(config.LABELS.TALENT_PROFILE_DATE).toBe("16 October 2026");
      expect(config.LABELS.CERTIFICATE_DATE).toBe("18 October 2026");
      expect(config.LABELS.AWARDS_DATE).toBe("20 October 2026");
    });

    it("should retrieve all 13 official milestones for CNTS 2026", async () => {
      const events = await TimelineService.getTimelineEvents(2026);
      expect(events.length).toBeGreaterThanOrEqual(13);
      
      const keys = events.map(e => e.event_key);
      expect(keys).toContain("REGISTRATION_OPEN");
      expect(keys).toContain("REGISTRATION_CLOSE");
      expect(keys).toContain("ADMIT_CARD_RELEASE");
      expect(keys).toContain("EXAM_LOGIN_OPEN");
      expect(keys).toContain("EXAM_START");
      expect(keys).toContain("SUB_JUNIOR_EXAM_END");
      expect(keys).toContain("JUNIOR_EXAM_END");
      expect(keys).toContain("RESULT_RELEASE");
      expect(keys).toContain("TALENT_PROFILE_RELEASE");
      expect(keys).toContain("CERTIFICATE_RELEASE");
      expect(keys).toContain("AWARDS_DATE");
    });
  });

  describe("Hard Registration Window Gating", () => {
    it("should reject registrations before opening (e.g. 10 July 2026)", async () => {
      const beforeOpen = new Date("2026-07-10T10:00:00+05:30");
      const check = await TimelineService.isRegistrationOpen(beforeOpen);
      expect(check.isOpen).toBe(false);
      expect(check.reason).toContain("open on");
    });

    it("should allow registrations during the active window (e.g. 19 August 2026)", async () => {
      const duringWindow = new Date("2026-08-19T11:00:00+05:30");
      const check = await TimelineService.isRegistrationOpen(duringWindow);
      expect(check.isOpen).toBe(true);
    });

    it("should reject registrations strictly after 25 September 2026 23:59:59 IST", async () => {
      const afterDeadline = new Date("2026-09-26T00:00:05+05:30");
      const check = await TimelineService.isRegistrationOpen(afterDeadline);
      expect(check.isOpen).toBe(false);
      expect(check.reason).toContain("officially closed");
    });
  });

  describe("Admit Card Gating", () => {
    it("should return unavailable before 26 September 2026 10:00 AM IST", async () => {
      const beforeRelease = new Date("2026-09-25T18:00:00+05:30");
      const isAvailable = await TimelineService.isAdmitCardAvailable(beforeRelease);
      expect(isAvailable).toBe(false);
    });

    it("should return available on 26 September 2026 10:01 AM IST", async () => {
      const onRelease = new Date("2026-09-26T10:01:00+05:30");
      const isAvailable = await TimelineService.isAdmitCardAvailable(onRelease);
      expect(isAvailable).toBe(true);
    });
  });

  describe("Results Release Status Separation", () => {
    it("should not release results when results_status is SCHEDULED even before release date", async () => {
      const beforeDate = new Date("2026-10-05T00:00:00+05:30");
      const isReleased = await TimelineService.isResultReleased(beforeDate);
      expect(isReleased).toBe(false);
    });
  });

  describe("Hard Exam-Window Session Calculation", () => {
    it("should grant standard 75 minutes for Sub-Junior starting at 10:00 AM IST", async () => {
      const startTime = new Date("2026-09-27T10:00:00+05:30");
      const session = await TimelineService.calculateSessionExpiry("SUB_JUNIOR", startTime);
      
      expect(session.durationMinutes).toBe(75);
      expect(session.isHardCapped).toBe(false);
      const expectedEnd = new Date("2026-09-27T11:15:00+05:30").toISOString();
      expect(session.expiresAt).toBe(expectedEnd);
    });

    it("should grant standard 90 minutes for Junior starting at 10:00 AM IST", async () => {
      const startTime = new Date("2026-09-27T10:00:00+05:30");
      const session = await TimelineService.calculateSessionExpiry("JUNIOR", startTime);
      
      expect(session.durationMinutes).toBe(90);
      expect(session.isHardCapped).toBe(false);
      const expectedEnd = new Date("2026-09-27T11:30:00+05:30").toISOString();
      expect(session.expiresAt).toBe(expectedEnd);
    });

    it("should hard-cap duration if candidate starts very late near global cutoff (e.g. 11:15 AM)", async () => {
      const lateStart = new Date("2026-09-27T11:15:00+05:30");
      const session = await TimelineService.calculateSessionExpiry("JUNIOR", lateStart);
      
      // Global cutoff is 12:00 PM IST (45 minutes remaining)
      expect(session.isHardCapped).toBe(true);
      expect(session.durationMinutes).toBe(45);
      const expectedCutoff = new Date("2026-09-27T12:00:00+05:30").toISOString();
      expect(session.expiresAt).toBe(expectedCutoff);
    });
  });

  describe("Timeline Dependency Validation", () => {
    it("should validate a correct chronological timeline without errors", () => {
      const events = [
        { event_key: "REGISTRATION_OPEN", start_at: "2026-07-15T10:00:00+05:30" },
        { event_key: "REGISTRATION_CLOSE", start_at: "2026-09-25T23:59:59+05:30" },
        { event_key: "ADMIT_CARD_RELEASE", start_at: "2026-09-26T10:00:00+05:30" },
        { event_key: "EXAM_START", start_at: "2026-09-27T10:00:00+05:30" },
        { event_key: "RESULT_RELEASE", start_at: "2026-10-10T00:00:00+05:30" },
        { event_key: "CERTIFICATE_RELEASE", start_at: "2026-10-18T00:00:00+05:30" },
        { event_key: "AWARDS_DATE", start_at: "2026-10-20T00:00:00+05:30" },
      ];

      const res = TimelineService.validateTimelineDependencies(events as any);
      expect(res.valid).toBe(true);
      expect(res.errors.length).toBe(0);
    });

    it("should flag an error if exam date is moved before registration deadline", () => {
      const invalidEvents = [
        { event_key: "REGISTRATION_OPEN", start_at: "2026-07-15T10:00:00+05:30" },
        { event_key: "REGISTRATION_CLOSE", start_at: "2026-09-25T23:59:59+05:30" },
        { event_key: "EXAM_START", start_at: "2026-09-20T10:00:00+05:30" }, // Error: before reg close
      ];

      const res = TimelineService.validateTimelineDependencies(invalidEvents as any);
      expect(res.valid).toBe(false);
      expect(res.errors[0]).toContain("cannot be before the Registration Close deadline");
    });
  });
});
