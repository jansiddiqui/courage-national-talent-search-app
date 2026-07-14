import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const VALID_REPORT_TYPES = [
  "REGISTRATIONS_EXPORT",
  "RESULTS_EXPORT",
  "SCHOOL_LEDGER_EXPORT",
  "AUDIT_EXPORT",
  "SUPPORT_EXPORT",
  "FULL_EXPORT"
];

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");

  if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!payload || (!payload.id && !payload.email)) {
    return NextResponse.json({ error: "Forbidden: Admin session required." }, { status: 403 });
  }

  const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id || payload.email, "reports.export");
  if (!hasPerm) {
    return NextResponse.json({ error: "Forbidden: reports.export permission required." }, { status: 403 });
  }

  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({ jobId: "mock-export-job", status: "PENDING" });
  }

  const body = await request.json();
  const { reportType, filters } = body;

  if (!VALID_REPORT_TYPES.includes(reportType)) {
    return NextResponse.json({ error: `Invalid report type. Valid: ${VALID_REPORT_TYPES.join(", ")}` }, { status: 400 });
  }

  const idempotencyKey = uuidv4();

  const { data, error } = await (supabaseAdmin as any)
    .from("admin_background_jobs")
    .insert({
      job_type: reportType,
      status: "PENDING",
      payload: { filters: filters || {}, requested_by: payload.id },
      idempotency_key: idempotencyKey,
      attempts: 0,
      max_attempts: 3
    })
    .select("id, status")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ jobId: data.id, status: data.status, idempotencyKey });
}
