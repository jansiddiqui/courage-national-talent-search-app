/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function GET() {
  try {
    if (!JWT_SECRET) {
      throw new Error("CRITICAL CONFIGURATION ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is required.");
    }
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(sessionCookie.value, JWT_SECRET);
    if (!session) {
      return NextResponse.json({ success: false, message: "Session expired or invalid" }, { status: 401 });
    }

    const role = session.role;
    if (role !== "ADMIN" && role !== "SUPER_ADMIN" && role !== "VOLUNTEER") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    // 2. Fetch logs from whatsapp_logs table
    if (hasSupabaseAdminConfig) {
      const { data, error } = await (supabaseAdmin as any)
        .from("whatsapp_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("[Logs API] Database error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch logs" }, { status: 500 });
      }

      return NextResponse.json({ success: true, logs: data || [] });
    } else {
      // Sandbox fallback: return simulated logs
      const mockLogs = [
        {
          id: "mock-log-1",
          phone_number_masked: "******4735",
          message_type: "REGISTRATION_CONFIRMATION",
          status: "SENT_SANDBOX",
          meta_message_id: "mock_meta_abc123",
          created_at: new Date(Date.now() - 5000).toISOString()
        },
        {
          id: "mock-log-2",
          phone_number_masked: "******4735",
          message_type: "PAYMENT_CONFIRMATION",
          status: "SENT_SANDBOX",
          meta_message_id: "mock_meta_xyz789",
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      return NextResponse.json({ success: true, logs: mockLogs });
    }
  } catch (error) {
    console.error("Logs endpoint error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
