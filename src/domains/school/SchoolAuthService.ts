/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtVerify } from "jose";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

const JWT_SECRET = new TextEncoder().encode(
  process.env.SUPABASE_SERVICE_ROLE_KEY || "fallback_secret_key"
);

const db = supabaseAdmin as any;

export interface SchoolSessionContext {
  schoolId: string;
  schoolCode: string;
  coordinatorId: string;
  coordinatorEmail: string;
  role: string;
  permissions: string[];
  activeSessionId: string;
  activeSessionName: string;
}

export class SchoolAuthService {
  /**
   * Decodes the request session cookie and validates the coordinator's status against the database.
   */
  static async verifySession(token: string | undefined): Promise<SchoolSessionContext | null> {
    if (!token) return null;

    try {
      // 1. Verify token signature and age
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const schoolCode = payload.schoolCode as string;
      const schoolId = payload.schoolId as string;
      const coordinatorEmail = payload.email as string;

      if (!schoolCode || !schoolId || !coordinatorEmail) {
        return null;
      }

      if (!hasSupabaseAdminConfig) {
        // Fallback demo session context for development when Supabase config is missing
        return {
          schoolId: "demo-school-id",
          schoolCode: "DEMO-123",
          coordinatorId: "demo-coordinator-id",
          coordinatorEmail: "coordinator@demo.com",
          role: "COORDINATOR",
          permissions: [],
          activeSessionId: "demo-session-id",
          activeSessionName: "2026-27",
        };
      }

      // 2. Query coordinator details to check active status and load permissions
      const { data: coordinator, error: coordErr } = await db
        .from("school_coordinators")
        .select("id, role, permissions, user_id")
        .eq("email", coordinatorEmail)
        .eq("school_id", schoolId)
        .maybeSingle();

      if (coordErr || !coordinator) {
        return null;
      }

      // 3. Query school status to verify it is active
      const { data: school, error: schoolErr } = await db
        .from("schools")
        .select("status")
        .eq("id", schoolId)
        .maybeSingle();

      if (schoolErr || !school || school.status !== "ACTIVE") {
        return null;
      }

      // 4. Resolve the currently ACTIVE academic session globally
      const { data: session, error: sessionErr } = await db
        .from("academic_sessions")
        .select("id, session_name")
        .eq("status", "ACTIVE")
        .maybeSingle();

      if (sessionErr || !session) {
        return null;
      }

      // Parse JSONB permissions column safely
      let permissionsList: string[] = [];
      if (Array.isArray(coordinator.permissions)) {
        permissionsList = coordinator.permissions as string[];
      } else if (typeof coordinator.permissions === "string") {
        try {
          permissionsList = JSON.parse(coordinator.permissions);
        } catch {
          permissionsList = [];
        }
      }

      return {
        schoolId,
        schoolCode,
        coordinatorId: coordinator.id,
        coordinatorEmail,
        role: coordinator.role,
        permissions: permissionsList,
        activeSessionId: session.id,
        activeSessionName: session.session_name,
      };
    } catch (err) {
      console.error("[SchoolAuthService] Session verification failed:", err);
      return null;
    }
  }
}
