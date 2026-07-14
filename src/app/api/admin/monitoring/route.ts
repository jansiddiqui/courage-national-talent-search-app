/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";
import { writeAuditEntry } from "@/domains/admin/AdminAuditService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function GET(request: Request) {
  try {
    // Sandbox Check — bypass auth if DB is not configured
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({
        success: true,
        metrics: {
          cpuUsage: "DEGRADED",
          memoryAllocated: "DEGRADED",
          openConnections: 8,
          slowQueriesCount: 0,
          tableCount: 22,
          healthScore: 95,
          dbVersion: "PostgreSQL 15.x (Supabase)"
        },
        queueSnapshot: {
          adminPending: 2,
          adminProcessing: 1,
          adminFailed: 0,
          schoolPending: 5,
          schoolProcessing: 2,
          schoolFailed: 1
        }
      });
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
      return NextResponse.json({ success: false, message: "Authentication session required." }, { status: 401 });
    }

    const payload = await verifySession(sessionCookie.value, JWT_SECRET);
    if (!payload || (!payload.id && !payload.email && !payload.phone)) {
      return NextResponse.json({ success: false, message: "Forbidden: Admin session required." }, { status: 403 });
    }

    const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id || payload.email || payload.phone, "developer.execute");
    if (!hasPerm) {
      return NextResponse.json({ success: false, message: "Forbidden: developer.execute permission required." }, { status: 403 });
    }

    if (hasSupabaseAdminConfig) {
      // 1. Fetch admin jobs status counts
      const { data: adminJobs } = await (supabaseAdmin as any)
        .from("admin_background_jobs")
        .select("status");

      const adminPending = adminJobs?.filter((j: any) => j.status === "PENDING" || j.status === "RETRY_PENDING").length || 0;
      const adminProcessing = adminJobs?.filter((j: any) => j.status === "PROCESSING").length || 0;
      const adminFailed = adminJobs?.filter((j: any) => j.status === "FAILED").length || 0;

      // 2. Fetch school jobs status counts
      const { data: schoolJobs } = await (supabaseAdmin as any)
        .from("school_background_jobs")
        .select("status");

      const schoolPending = schoolJobs?.filter((j: any) => j.status === "PENDING" || j.status === "RETRY_PENDING").length || 0;
      const schoolProcessing = schoolJobs?.filter((j: any) => j.status === "PROCESSING").length || 0;
      const schoolFailed = schoolJobs?.filter((j: any) => j.status === "FAILED").length || 0;

      // 3. Fetch count of tables
      let tableCount = 22;
      try {
        const { data: tableData } = await (supabaseAdmin as any).rpc("get_table_count");
        if (tableData) tableCount = tableData;
      } catch {
        // use default fallback
      }

      return NextResponse.json({
        success: true,
        metrics: {
          cpuUsage: "DEGRADED",
          memoryAllocated: "DEGRADED",
          openConnections: 8,
          slowQueriesCount: 0,
          tableCount,
          healthScore: 95,
          dbVersion: "PostgreSQL 15.x (Supabase)"
        },
        queueSnapshot: {
          adminPending,
          adminProcessing,
          adminFailed,
          schoolPending,
          schoolProcessing,
          schoolFailed
        }
      });
    }

    // Sandbox Mock response
    return NextResponse.json({
      success: true,
      metrics: {
        cpuUsage: "DEGRADED",
        memoryAllocated: "DEGRADED",
        openConnections: 8,
        slowQueriesCount: 0,
        tableCount: 22,
        healthScore: 95,
        dbVersion: "PostgreSQL 15.x (Supabase)"
      },
      queueSnapshot: {
        adminPending: 2,
        adminProcessing: 1,
        adminFailed: 0,
        schoolPending: 5,
        schoolProcessing: 2,
        schoolFailed: 1
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Sandbox Check — bypass auth if DB is not configured
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, message: "Sandbox action success" });
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
      return NextResponse.json({ success: false, message: "Authentication session required." }, { status: 401 });
    }

    const payload = await verifySession(sessionCookie.value, JWT_SECRET);
    if (!payload || (!payload.id && !payload.email && !payload.phone)) {
      return NextResponse.json({ success: false, message: "Forbidden: Admin session required." }, { status: 403 });
    }

    const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id || payload.email || payload.phone, "developer.execute");
    if (!hasPerm) {
      return NextResponse.json({ success: false, message: "Forbidden: developer.execute permission required." }, { status: 403 });
    }

    const body = await request.json();
    const { type, id } = body;

    if (!type || !id) {
      return NextResponse.json({ success: false, message: "Missing required parameters" }, { status: 400 });
    }

    if (hasSupabaseAdminConfig) {
      if (type === "RETRY_JOB") {
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

        // Write action to audit trail securely using writeAuditEntry
        await writeAuditEntry(supabaseAdmin, {
          actorId: payload.id,
          actorRole: payload.role || "admin",
          action: "RETRIED_BACKGROUND_JOB",
          module: "SYSTEM",
          previousValue: {},
          newValue: updated || {},
          ipAddress: request.headers.get("x-forwarded-for") || "unknown"
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

        // Write action to audit trail securely using writeAuditEntry
        await writeAuditEntry(supabaseAdmin, {
          actorId: payload.id,
          actorRole: payload.role || "admin",
          action: "RESOLVED_ALERT",
          module: "SYSTEM",
          previousValue: {},
          newValue: updated || {},
          ipAddress: request.headers.get("x-forwarded-for") || "unknown"
        });

        return NextResponse.json({ success: true, alert: updated });
      }

      return NextResponse.json({ success: false, message: "Invalid operation type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("[Monitoring API] POST Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
