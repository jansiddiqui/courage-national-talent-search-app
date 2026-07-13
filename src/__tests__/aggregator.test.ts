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
      in: jest.fn().mockImplementation(() => chain),
      maybeSingle: jest.fn().mockImplementation(() => Promise.resolve({ data: data[0] || null, error: null })),
      order: jest.fn().mockImplementation(() => chain),
      limit: jest.fn().mockImplementation(() => chain),
      upsert: jest.fn().mockImplementation(() => Promise.resolve({ error: null })),
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
      const mockResults = [{ score: 85.0 }, { score: 95.0 }];

      (supabaseAdmin.from as jest.Mock).mockImplementation((table: string) => {
        if (table === "analytics_daily_registrations") return makeChain(mockDailyRegs);
        if (table === "analytics_daily_revenue") return makeChain(mockDailyRev);
        if (table === "assessment_results") return makeChain(mockResults);
        if (table === "assessments") return makeChain([{}, {}]);
        if (table === "candidate_sessions") return makeChain([{}, {}, {}]);
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
      expect(json.kpis.activeSessions).toBe(3);
    });
  });
});
