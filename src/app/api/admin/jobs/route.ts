import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";
import { writeAuditEntry } from "@/domains/admin/AdminAuditService";
import { getQueueSummary, getRecentJobs } from "@/domains/admin/QueueAdapterService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function GET(request: Request) {
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({
      adminSummary: { pending: 2, processing: 1, failed: 0, completed: 45 },
      schoolSummary: { pending: 0, processing: 0, failed: 1, completed: 120 },
      jobs: []
    });
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");

  if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!payload || (!payload.id && !payload.email && !payload.phone)) {
    return NextResponse.json({ error: "Forbidden: Admin session required." }, { status: 403 });
  }

  const url = new URL(request.url);
  const queue = (url.searchParams.get("queue") || "admin") as "admin" | "school";

  const [summary, jobs] = await Promise.all([
    getQueueSummary(supabaseAdmin),
    getRecentJobs(supabaseAdmin, queue, 30)
  ]);

  const adminSummary = summary.find(s => s.queue === "admin") || { pending: 0, processing: 0, failed: 0, completed: 0 };
  const schoolSummary = summary.find(s => s.queue === "school") || { pending: 0, processing: 0, failed: 0, completed: 0 };

  return NextResponse.json({ adminSummary, schoolSummary, jobs });
}

export async function POST(request: Request) {
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({ success: true, message: "Sandbox success" });
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");

  if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!payload || (!payload.id && !payload.email && !payload.phone)) {
    return NextResponse.json({ error: "Forbidden: Admin session required." }, { status: 403 });
  }

  const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id || payload.email || payload.phone, "jobs.cancel");
  if (!hasPerm) {
    return NextResponse.json({ error: "Forbidden: jobs.cancel permission required." }, { status: 403 });
  }

  const body = await request.json();
  const { jobId, action, queue } = body;

  if (action === "cancel") {
    const table = queue === "school" ? "school_background_jobs" : "admin_background_jobs";
    const { data: jobBefore } = await (supabaseAdmin as any)
      .from(table)
      .select("*")
      .eq("id", jobId)
      .maybeSingle();

    const { error } = await (supabaseAdmin as any)
      .from(table)
      .update({ cancellation_requested_at: new Date().toISOString() })
      .eq("id", jobId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Write audit trail log securely using writeAuditEntry
    await writeAuditEntry(supabaseAdmin, {
      actorId: payload.id,
      actorRole: payload.role || "admin",
      action: "CANCEL_BACKGROUND_JOB",
      module: "SYSTEM",
      previousValue: jobBefore || {},
      newValue: { id: jobId, cancellation_requested_at: new Date().toISOString() },
      ipAddress: request.headers.get("x-forwarded-for") || "unknown"
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
