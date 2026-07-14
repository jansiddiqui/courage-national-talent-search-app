process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.INTERNAL_API_SECRET = "test-api-secret";

// Mock checkAdminPermission before importing route handlers to override auth check
jest.mock("@/domains/admin/AdminAuthService", () => ({
  checkAdminPermission: jest.fn().mockResolvedValue(true)
}));

import { POST as runAggregate } from "../app/api/internal/analytics/aggregate/route";
import { GET as getAnalytics } from "../app/api/admin/analytics/route";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";

jest.mock("next/headers", () => ({
  cookies: jest.fn()
}));

jest.mock("@/lib/supabaseAdmin", () => ({
  supabaseAdmin: {
    from: jest.fn()
  },
  hasSupabaseAdminConfig: true
}));

jest.mock("@/lib/sessionHelper", () => ({
  verifySession: jest.fn(),
  generateFingerprint: jest.fn()
}));

describe("Analytics Platform Aggregator & Calculations (Phase 2)", () => {
  let mockCookieGet: jest.Mock;

  // Thenable mock chain helper to support both direct awaits and long method chains
  const makeChain = (data: any[]) => {
    const chain: any = {
      then: (resolve: any) => resolve({ data, count: data.length, error: null }),
      select: jest.fn().mockImplementation(() => chain),
      eq: jest.fn().mockImplementation(() => chain),
      neq: jest.fn().mockImplementation(() => chain),
      lt: jest.fn().mockImplementation(() => chain),
      lte: jest.fn().mockImplementation(() => chain),
      gte: jest.fn().mockImplementation(() => chain),
      in: jest.fn().mockImplementation(() => chain),
      maybeSingle: jest.fn().mockImplementation(() => Promise.resolve({ data: data[0] || null, error: null })),
      single: jest.fn().mockImplementation(() => Promise.resolve({ data: data[0] || null, error: null })),
      order: jest.fn().mockImplementation(() => chain),
      limit: jest.fn().mockImplementation(() => chain),
      range: jest.fn().mockImplementation(() => Promise.resolve({ data, error: null })),
      upsert: jest.fn().mockImplementation(() => Promise.resolve({ error: null })),
      update: jest.fn().mockImplementation(() => chain),
      delete: jest.fn().mockImplementation(() => chain),
      insert: jest.fn().mockImplementation(() => Promise.resolve({ error: null }))
    };
    return chain;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCookieGet = jest.fn();
    (cookies as jest.Mock).mockResolvedValue({
      get: mockCookieGet
    });
  });

  describe("Psychometric Calculations (Difficulty & Discrimination)", () => {
    it("should calculate correct difficulty index when valid attempts >= 20", async () => {
      const mockQuestions = [{ id: "q-1", assessment_id: "asm-1", content: { domain: "Numerical reasoning", topic: "Series" } }];
      const mockKeys = [{ question_id: "q-1", correct_options: ["A"] }];
      
      const mockAttempts: any[] = [];
      for (let i = 0; i < 20; i++) {
        mockAttempts.push({
          question_id: "q-1",
          session_id: `sess-${i}`,
          selected_answers: i < 15 ? ["A"] : ["B"],
          time_taken_seconds: 30
        });
      }
      
      const mockSessions: any[] = [];
      for (let i = 0; i < 20; i++) {
        mockSessions.push({
          id: `sess-${i}`,
          status: "SUBMITTED",
          started_at: "2026-07-14T00:00:00Z",
          tab_switch_count: 0,
          assessment_id: "asm-1"
        });
      }

      const mockResults: any[] = [];
      for (let i = 0; i < 20; i++) {
        mockResults.push({ session_id: `sess-${i}`, score: i < 15 ? 10 : 2, candidate_id: `cand-${i}` });
      }

      const mockRegs = [{ cnts_id: "cand-1", registration_id: "reg-1", payment_status: "SUCCESS", created_at: "2026-07-14T00:00:00Z" }];

      const tableChains: Record<string, any> = {};
      const getChain = (table: string, data: any[]) => {
        if (!tableChains[table]) {
          tableChains[table] = makeChain(data);
        }
        return tableChains[table];
      };

      (supabaseAdmin.from as jest.Mock).mockImplementation((table: string) => {
        if (table === "questions") return getChain(table, mockQuestions);
        if (table === "question_keys") return getChain(table, mockKeys);
        if (table === "question_attempts") return getChain(table, mockAttempts);
        if (table === "candidate_sessions") return getChain(table, mockSessions);
        if (table === "assessment_results") return getChain(table, mockResults);
        if (table === "registrations") return getChain(table, mockRegs);
        return getChain(table, []);
      });

      const request = new Request("http://localhost/api/internal/analytics/aggregate", {
        method: "POST",
        headers: { "x-api-key": "test-api-secret" }
      });

      const response = await runAggregate(request);
      expect(response.status).toBe(200);

      const upsertSpy = tableChains["analytics_question_statistics"].upsert;
      expect(upsertSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          question_id: "q-1",
          difficulty_index: 0.75,
          sample_size: 20
        }),
        expect.any(Object)
      );
    });

    it("should set difficulty to null and status to INSUFFICIENT_SAMPLE if valid attempts < 20", async () => {
      const mockQuestions = [{ id: "q-1", assessment_id: "asm-1" }];
      const mockKeys = [{ question_id: "q-1", correct_options: ["A"] }];
      const mockAttempts = [
        { question_id: "q-1", session_id: "sess-1", selected_answers: ["A"], time_taken_seconds: 10 },
        { question_id: "q-1", session_id: "sess-2", selected_answers: ["B"], time_taken_seconds: 10 }
      ];
      const mockSessions = [
        { id: "sess-1", status: "SUBMITTED", started_at: "2026-07-14T00:00:00Z", tab_switch_count: 0, assessment_id: "asm-1" },
        { id: "sess-2", status: "SUBMITTED", started_at: "2026-07-14T00:00:00Z", tab_switch_count: 0, assessment_id: "asm-1" }
      ];

      const tableChains: Record<string, any> = {};
      const getChain = (table: string, data: any[]) => {
        if (!tableChains[table]) {
          tableChains[table] = makeChain(data);
        }
        return tableChains[table];
      };

      (supabaseAdmin.from as jest.Mock).mockImplementation((table: string) => {
        if (table === "questions") return getChain(table, mockQuestions);
        if (table === "question_keys") return getChain(table, mockKeys);
        if (table === "question_attempts") return getChain(table, mockAttempts);
        if (table === "candidate_sessions") return getChain(table, mockSessions);
        return getChain(table, []);
      });

      const request = new Request("http://localhost/api/internal/analytics/aggregate", {
        method: "POST",
        headers: { "x-api-key": "test-api-secret" }
      });

      await runAggregate(request);

      const upsertSpy = tableChains["analytics_question_statistics"].upsert;
      expect(upsertSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          question_id: "q-1",
          difficulty_index: null,
          status: "INSUFFICIENT_SAMPLE"
        }),
        expect.any(Object)
      );
    });
  });

  describe("Analytics Dashboard API Endpoint (Dynamic KPIs)", () => {
    it("should query database and return real dynamic KPI metrics", async () => {
      const mockDailyRegs = [{ date: "2026-07-14", total_started: 10, total_completed: 8, conversion_rate: 80.0, total_active_parents: 5 }];
      const mockDailyRev = [{ date: "2026-07-14", gross_amount: 1600.0, refund_amount: 200.0, net_amount: 1400.0 }];
      const mockResults = [{ score: 85.0, candidate_id: "CNTS01" }, { score: 95.0, candidate_id: "CNTS02" }];
      const mockRegs = [{ cnts_id: "CNTS01", payment_status: "SUCCESS", created_at: "2026-07-14T00:00:00Z" }, { cnts_id: "CNTS02", payment_status: "SUCCESS", created_at: "2026-07-14T00:00:00Z" }];

      (supabaseAdmin.from as jest.Mock).mockImplementation((table: string) => {
        if (table === "analytics_daily_registrations") return makeChain(mockDailyRegs);
        if (table === "analytics_daily_revenue") return makeChain(mockDailyRev);
        if (table === "assessment_results") return makeChain(mockResults);
        if (table === "assessments") return makeChain([{}, {}]);
        if (table === "candidate_sessions") return makeChain([{}, {}, {}]);
        if (table === "registrations") return makeChain(mockRegs);
        return makeChain([]);
      });

      mockCookieGet.mockReturnValue({ value: "valid-session-token" });
      (verifySession as jest.Mock).mockResolvedValue({ id: "admin-user", role: "ADMIN" });

      const request = new Request("http://localhost/api/admin/analytics", { method: "GET" });
      const response = await getAnalytics(request);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.kpis.totalRevenue).toBe(1600.0);
      expect(json.kpis.netRevenue).toBe(1400.0);
      expect(json.kpis.averageScore).toBe(90.0);
      expect(json.kpis.activeParents).toBe(5);
      expect(json.kpis.activeExams).toBe(2);
    });

    it("should return 400 for invalid schoolId UUID format", async () => {
      mockCookieGet.mockReturnValue({ value: "valid-session-token" });
      (verifySession as jest.Mock).mockResolvedValue({ id: "admin-user", role: "ADMIN" });

      const request = new Request("http://localhost/api/admin/analytics?schoolId=invalid-uuid", { method: "GET" });
      const response = await getAnalytics(request);
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("Invalid schoolId");
    });

    it("should return 400 for invalid medium parameter", async () => {
      mockCookieGet.mockReturnValue({ value: "valid-session-token" });
      (verifySession as jest.Mock).mockResolvedValue({ id: "admin-user", role: "ADMIN" });

      const request = new Request("http://localhost/api/admin/analytics?medium=french", { method: "GET" });
      const response = await getAnalytics(request);
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("Invalid medium");
    });

    it("should return 400 for chronologically backward date range", async () => {
      mockCookieGet.mockReturnValue({ value: "valid-session-token" });
      (verifySession as jest.Mock).mockResolvedValue({ id: "admin-user", role: "ADMIN" });

      const request = new Request("http://localhost/api/admin/analytics?from=2026-07-20&to=2026-07-10", { method: "GET" });
      const response = await getAnalytics(request);
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("from date cannot be after to date");
    });

    it("should return 400 for date range exceeding 366 days", async () => {
      mockCookieGet.mockReturnValue({ value: "valid-session-token" });
      (verifySession as jest.Mock).mockResolvedValue({ id: "admin-user", role: "ADMIN" });

      const request = new Request("http://localhost/api/admin/analytics?from=2025-01-01&to=2026-07-10", { method: "GET" });
      const response = await getAnalytics(request);
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("Date range cannot exceed 366 days");
    });

    it("should return 400 for invalid class integer format", async () => {
      mockCookieGet.mockReturnValue({ value: "valid-session-token" });
      (verifySession as jest.Mock).mockResolvedValue({ id: "admin-user", role: "ADMIN" });

      const request = new Request("http://localhost/api/admin/analytics?class=15", { method: "GET" });
      const response = await getAnalytics(request);
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("Invalid class");
    });

    it("should calculate forecasting and cohort metrics correctly", async () => {
      const mockDailyRegs = [
        { date: "2026-07-14", total_started: 10, total_completed: 8, conversion_rate: 80.0, total_active_parents: 5 },
        { date: "2026-07-13", total_started: 10, total_completed: 6, conversion_rate: 60.0, total_active_parents: 4 }
      ];
      const mockDailyRev = [{ date: "2026-07-14", gross_amount: 1400.0, refund_amount: 0.0, net_amount: 1400.0 }];
      const mockResults = [
        { score: 80.0, candidate_id: "CNTS-CLASS-5-EN" },
        { score: 90.0, candidate_id: "CNTS-CLASS-5-EN" }
      ];
      const mockRegs = [
        { cnts_id: "CNTS-CLASS-5-EN", payment_status: "SUCCESS", created_at: "2026-07-14T00:00:00Z", student_class: "5", language: "en" }
      ];
      const mockSchools = [
        { created_at: "2026-07-14T00:00:00Z" }
      ];

      (supabaseAdmin.from as jest.Mock).mockImplementation((table: string) => {
        if (table === "analytics_daily_registrations") return makeChain(mockDailyRegs);
        if (table === "analytics_daily_revenue") return makeChain(mockDailyRev);
        if (table === "assessment_results") return makeChain(mockResults);
        if (table === "assessments") return makeChain([{}]);
        if (table === "candidate_sessions") return makeChain([{}, {}]);
        if (table === "registrations") return makeChain(mockRegs);
        if (table === "schools") return makeChain(mockSchools);
        return makeChain([]);
      });

      mockCookieGet.mockReturnValue({ value: "valid-session-token" });
      (verifySession as jest.Mock).mockResolvedValue({ id: "admin-user", role: "ADMIN" });

      const request = new Request("http://localhost/api/admin/analytics", { method: "GET" });
      const response = await getAnalytics(request);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.forecastMetrics.expectedDailyRegs).toBe(2.00); // (8 + 6) / 7 = 2
      expect(json.forecastMetrics.expectedWeeklyRegs).toBe(14.00);
      expect(json.forecastMetrics.expectedSchoolsOnboarding).toBe(0.14); // 1 / 7 = 0.14

      // Cohorts verification
      const c5 = json.cohorts.classCohorts.find((c: any) => c.class === "5");
      expect(c5.totalCandidates).toBe(1);
      expect(c5.averageScore).toBe(85.0);

      const en = json.cohorts.mediumCohorts.find((m: any) => m.medium === "en");
      expect(en.totalCandidates).toBe(1);
      expect(en.averageScore).toBe(85.0);
    });

    it("should trigger system alerts on telemetry conditions in aggregator POST pipeline", async () => {
      // Mock telemetries for payment spike and autosave failures
      const nowStr = new Date().toISOString();
      const mockTelemetry = [
        { event_type: "PAYMENT_FAILED", created_at: nowStr },
        { event_type: "PAYMENT_FAILED", created_at: nowStr },
        { event_type: "PAYMENT_FAILED", created_at: nowStr },
        { event_type: "PAYMENT_SUCCESS", created_at: nowStr },
        { event_type: "EXAM_AUTOSAVE_FAILED", created_at: nowStr },
        { event_type: "EXAM_AUTOSAVE_FAILED", created_at: nowStr },
        { event_type: "EXAM_AUTOSAVE_FAILED", created_at: nowStr },
        { event_type: "EXAM_AUTOSAVE_FAILED", created_at: nowStr },
        { event_type: "EXAM_AUTOSAVE_FAILED", created_at: nowStr },
        { event_type: "EXAM_AUTOSAVE_FAILED", created_at: nowStr },
        { event_type: "EXAM_AUTOSAVE_FAILED", created_at: nowStr },
        { event_type: "EXAM_AUTOSAVE_FAILED", created_at: nowStr },
        { event_type: "EXAM_AUTOSAVE_FAILED", created_at: nowStr },
        { event_type: "EXAM_AUTOSAVE_FAILED", created_at: nowStr },
        { event_type: "EXAM_AUTOSAVE_FAILED", created_at: nowStr } // 11 autosave failures (>10)
      ];

      const mockSchools = [
        { id: "sch-1", name: "Spike School", quota: 10, used_quota: 9 } // approaching limit (90%)
      ];

      const tableChains: Record<string, any> = {};
      const getChain = (table: string, data: any[]) => {
        if (!tableChains[table]) {
          tableChains[table] = makeChain(data);
        }
        return tableChains[table];
      };

      (supabaseAdmin.from as jest.Mock).mockImplementation((table: string) => {
        if (table === "analytics_telemetry_events") return getChain(table, mockTelemetry);
        if (table === "schools") return getChain(table, mockSchools);
        return getChain(table, []);
      });

      const request = new Request("http://localhost/api/internal/analytics/aggregate", {
        method: "POST",
        headers: { "x-api-key": "test-api-secret" }
      });

      const response = await runAggregate(request);
      expect(response.status).toBe(200);

      // Verify alerts upserted
      const upsertSpy = tableChains["analytics_alerts"].insert;
      expect(upsertSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          alert_rule: "AUTOSAVE_FAILURE",
          severity: "WARNING"
        })
      );
      expect(upsertSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          alert_rule: "SCHOOL_QUOTA_EXHAUSTED",
          severity: "WARNING"
        })
      );
    });
  });
});
