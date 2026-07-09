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

      // Fetch background jobs
      const { data: jobs, error: jobsErr } = await (supabaseAdmin as any)
        .from("admin_background_jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (jobsErr) {
        console.error("[Monitoring API] Jobs fetch error:", jobsErr);
        return NextResponse.json({ success: false, message: "Failed to query background jobs" }, { status: 500 });
      }

      // Fetch active alerts
      const { data: alerts, error: alertsErr } = await (supabaseAdmin as any)
        .from("analytics_alerts")
        .select("*")
        .order("created_at", { ascending: false });

      if (alertsErr) {
        console.error("[Monitoring API] Alerts fetch error:", alertsErr);
        return NextResponse.json({ success: false, message: "Failed to query system alerts" }, { status: 500 });
      }

      // Fetch activity feed (audit trail)
      const { data: activity, error: activityErr } = await (supabaseAdmin as any)
        .from("admin_operations_audit_trail")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (activityErr) {
        console.error("[Monitoring API] Audit fetch error:", activityErr);
        return NextResponse.json({ success: false, message: "Failed to query activity logs" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        jobs,
        alerts,
        activity
      });
    }

    // Sandbox Mock response
    return NextResponse.json({
      success: true,
      jobs: [
        { id: "job-1", job_type: "BULK_IMPORT", status: "COMPLETED", payload: { file: "students.xlsx" }, attempts: 1, max_attempts: 3, execution_time_ms: 1250, created_at: new Date().toISOString() },
        { id: "job-2", job_type: "BROADCAST_NOTIF", status: "FAILED", payload: { alert: "Mock alert" }, attempts: 3, max_attempts: 3, execution_time_ms: null, created_at: new Date().toISOString(), error_logs: "Failed connection to WhatsApp gateway timeout" }
      ],
      alerts: [
        { id: "alt-1", alert_rule: "PAYMENT_FAILURES_SPIKE", severity: "CRITICAL", description: "Spike of payment failures detected on gateway razorpay", resolved: false, created_at: new Date().toISOString() },
        { id: "alt-2", alert_rule: "AUTOSAVE_FAILURE", severity: "WARNING", description: "Session save latency higher than 3000ms threshold", resolved: true, created_at: new Date().toISOString() }
      ],
      activity: [
        { id: "act-1", actor_role: "ADMIN", action: "CREATED_ASSESSMENT", module: "EXAMS", new_value: { name: "Mock Test 1" }, created_at: new Date().toISOString() },
        { id: "act-2", actor_role: "ADMIN", action: "REFUND_APPROVED", module: "FINANCE", new_value: { amount: 200 }, created_at: new Date().toISOString() }
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
      const { type, id } = body;

      if (!type || !id) {
        return NextResponse.json({ success: false, message: "Missing required parameters" }, { status: 400 });
      }

      if (type === "RETRY_JOB") {
        // Reset status to PENDING and zero out attempts
        const { data: updated, error: jobErr } = await (supabaseAdmin as any)
          .from("admin_background_jobs")
          .update({
            status: "PENDING",
            attempts: 0
          })
          .eq("id", id)
          .select()
          .maybeSingle();

        if (jobErr) {
          console.error("[Monitoring API] Reset job error:", jobErr);
          return NextResponse.json({ success: false, message: "Failed to reset background job status" }, { status: 500 });
        }

        // Write action to audit trail
        await (supabaseAdmin as any).from("admin_operations_audit_trail").insert({
          actor_id: payload.cntsId || null,
          actor_role: "ADMIN",
          action: "RETRIED_BACKGROUND_JOB",
          module: "SYSTEM",
          previous_value: {},
          new_value: updated || {},
          ip_address: request.headers.get("x-forwarded-for") || "unknown"
        });

        return NextResponse.json({ success: true, job: updated });
      } else if (type === "RESOLVE_ALERT") {
        const { data: updated, error: alertErr } = await (supabaseAdmin as any)
          .from("analytics_alerts")
          .update({
            resolved: true
          })
          .eq("id", id)
          .select()
          .maybeSingle();

        if (alertErr) {
          console.error("[Monitoring API] Resolve alert error:", alertErr);
          return NextResponse.json({ success: false, message: "Failed to resolve alert status" }, { status: 500 });
        }

        // Write action to audit trail
        await (supabaseAdmin as any).from("admin_operations_audit_trail").insert({
          actor_id: payload.cntsId || null,
          actor_role: "ADMIN",
          action: "RESOLVED_ALERT",
          module: "SYSTEM",
          previous_value: {},
          new_value: updated || {},
          ip_address: request.headers.get("x-forwarded-for") || "unknown"
        });

        return NextResponse.json({ success: true, alert: updated });
      }

      return NextResponse.json({ success: false, message: "Invalid operation type" }, { status: 400 });
    }

    // Sandbox Mock response
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("[Monitoring API] POST Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
