process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
process.env.JWT_SECRET = "test-jwt-secret";

import { POST } from "../app/api/telemetry/route";
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

describe("Telemetry Ingestion API Endpoint", () => {
  let mockCookieGet: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCookieGet = jest.fn();
    (cookies as jest.Mock).mockResolvedValue({
      get: mockCookieGet
    });
  });

  it("should enforce rate limits on ANONYMOUS_PUBLIC trust class", async () => {
    const request = new Request("http://localhost/api/telemetry", {
      method: "POST",
      body: JSON.stringify({
        eventType: "REGISTRATION_STARTED",
        eventId: "test-uuid-1",
        sessionIdentity: "anon-sess"
      }),
      headers: {
        "User-Agent": "Mozilla",
        "X-Real-IP": "9.9.9.9" // Distinct IP to avoid rate limit pollution
      }
    });

    const mockInsert = jest.fn().mockResolvedValue({ error: null });
    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      insert: mockInsert
    });

    mockCookieGet.mockReturnValue(undefined);

    let lastResponse;
    // Limit is 60. Request 65 times.
    for (let i = 0; i < 65; i++) {
      lastResponse = await POST(request.clone());
    }

    expect(lastResponse?.status).toBe(429);
  });

  it("should derive actor identity for AUTHENTICATED_USER and ignore client-supplied actorId", async () => {
    const request = new Request("http://localhost/api/telemetry", {
      method: "POST",
      body: JSON.stringify({
        eventType: "LESSON_OPENED",
        actorId: "spoofed-id-ignored",
        metadata: { lesson: "intro" }
      }),
      headers: {
        "X-Real-IP": "1.2.3.4"
      }
    });

    const mockInsert = jest.fn().mockResolvedValue({ error: null });
    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      insert: mockInsert
    });

    mockCookieGet.mockReturnValue({ value: "valid-session-token" });
    (verifySession as jest.Mock).mockResolvedValue({
      cntsId: "CNTS-USER-123",
      role: "STUDENT"
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        actor_id: "CNTS-USER-123",
        event_type: "LESSON_OPENED"
      })
    );
  });

  it("should fail validation for unauthorized public events", async () => {
    const request = new Request("http://localhost/api/telemetry", {
      method: "POST",
      body: JSON.stringify({
        eventType: "EXAM_SUBMITTED",
        eventId: "test-uuid"
      })
    });

    mockCookieGet.mockReturnValue(undefined);

    const response = await POST(request);
    expect(response.status).toBe(401);
  });
});
