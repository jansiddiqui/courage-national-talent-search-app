/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (hasSupabaseAdminConfig) {
      if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
        return NextResponse.json({ success: false, message: "Authentication session required." }, { status: 401 });
      }

      const payload = await verifySession(sessionCookie.value, JWT_SECRET);
      if (!payload || payload.role !== "admin") {
        return NextResponse.json({ success: false, message: "Forbidden: Admin access required." }, { status: 403 });
      }

      // Fetch audit logs from DB
      const { data: logs, error } = await (supabaseAdmin as any)
        .from("admin_operations_audit_trail")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[Audit API] Fetch error:", error);
        return NextResponse.json({ success: false, message: "Database query error" }, { status: 500 });
      }

      return NextResponse.json({ success: true, logs });
    }

    // Sandbox Mock response
    return NextResponse.json({
      success: true,
      logs: [
        { id: "aud-1", actor_role: "ADMIN", action: "CREATED_ASSESSMENT", module: "EXAMS", previous_value: {}, new_value: { title: "CNTS 2026 Mathematics Mock Paper 1" }, ip_address: "127.0.0.1", browser: "Chrome", created_at: new Date().toISOString() },
        { id: "aud-2", actor_role: "SUPER_ADMIN", action: "UPDATED_USER_ROLE", module: "USERS", previous_value: { role: "VOLUNTEER" }, new_value: { role: "ADMIN" }, ip_address: "127.0.0.1", browser: "Safari", created_at: new Date().toISOString() }
      ]
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (hasSupabaseAdminConfig) {
      if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
        return NextResponse.json({ success: false, message: "Authentication session required." }, { status: 401 });
      }

      const payload = await verifySession(sessionCookie.value, JWT_SECRET);
      if (!payload || payload.role !== "admin") {
        return NextResponse.json({ success: false, message: "Forbidden: Admin access required." }, { status: 403 });
      }

      const body = await request.json();
      const { action, module, prevValue, newValue } = body;

      if (!action || !module) {
        return NextResponse.json({ success: false, message: "Missing required audit parameters" }, { status: 400 });
      }

      const { data: inserted, error: insertErr } = await (supabaseAdmin as any)
        .from("admin_operations_audit_trail")
        .insert({
          actor_id: payload.cntsId || null,
          actor_role: "ADMIN",
          action,
          module,
          previous_value: prevValue || {},
          new_value: newValue || {},
          ip_address: request.headers.get("x-forwarded-for") || "unknown"
        })
        .select()
        .maybeSingle();

      if (insertErr) {
        console.error("[Audit API] Insert error:", insertErr);
        return NextResponse.json({ success: false, message: "Failed to write audit log entry" }, { status: 500 });
      }

      return NextResponse.json({ success: true, log: inserted });
    }

    // Sandbox Mock response
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("[Audit API] POST Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
