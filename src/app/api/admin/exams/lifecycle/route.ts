/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";
import { writeAuditEntry } from "@/domains/admin/AdminAuditService";
import {
  transitionExamStatus,
  getAllowedTransitions,
  getTransitionPermission,
  ExamStatus
} from "@/domains/admin/ExamLifecycleService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * GET /api/admin/exams/lifecycle?assessmentId=...
 * Returns current status and allowed transitions for an assessment.
 */
export async function GET(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");
  if (!sessionCookie?.value || !JWT_SECRET) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!payload || (!payload.id && !payload.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id || payload.email, "assessment.update");
  if (!hasPerm) return NextResponse.json({ error: "Forbidden: assessment.update permission required." }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const assessmentId = searchParams.get("assessmentId");
  if (!assessmentId) return NextResponse.json({ error: "assessmentId is required." }, { status: 400 });

  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({
      status: "DRAFT",
      allowedTransitions: getAllowedTransitions("DRAFT"),
      is_published: false
    });
  }

  const { data: assessment, error } = await (supabaseAdmin as any)
    .from("assessments")
    .select("id, status, is_published, title")
    .eq("id", assessmentId)
    .maybeSingle();

  if (error || !assessment) {
    return NextResponse.json({ error: "Assessment not found." }, { status: 404 });
  }

  return NextResponse.json({
    id: assessment.id,
    title: assessment.title,
    status: assessment.status,
    is_published: assessment.is_published,
    allowedTransitions: getAllowedTransitions(assessment.status as ExamStatus)
  });
}

/**
 * POST /api/admin/exams/lifecycle
 * Body: { assessmentId, fromStatus, toStatus }
 * Atomically transitions the exam status. Enforces per-transition permission.
 */
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");
  if (!sessionCookie?.value || !JWT_SECRET) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!payload || (!payload.id && !payload.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { assessmentId, fromStatus, toStatus } = body;

  if (!assessmentId || !fromStatus || !toStatus) {
    return NextResponse.json({ error: "assessmentId, fromStatus, and toStatus are required." }, { status: 400 });
  }

  // Resolve the required permission for this exact transition
  let requiredPermission: string;
  try {
    requiredPermission = getTransitionPermission(fromStatus as ExamStatus, toStatus as ExamStatus);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }

  const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id || payload.email, requiredPermission);
  if (!hasPerm) {
    return NextResponse.json({ error: `Forbidden: ${requiredPermission} permission required.` }, { status: 403 });
  }

  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({ success: true, message: "Sandbox: lifecycle transition accepted." });
  }

  // Fetch the assessment's current status to verify `fromStatus` matches
  const { data: current, error: fetchErr } = await (supabaseAdmin as any)
    .from("assessments")
    .select("id, status, is_published")
    .eq("id", assessmentId)
    .maybeSingle();

  if (fetchErr || !current) {
    return NextResponse.json({ error: "Assessment not found." }, { status: 404 });
  }

  if (current.status !== fromStatus) {
    return NextResponse.json({
      error: `State mismatch: assessment is currently ${current.status}, not ${fromStatus}. Refresh and retry.`
    }, { status: 409 });
  }

  const result = await transitionExamStatus(supabaseAdmin, assessmentId, fromStatus, toStatus);

  if (!result.success) {
    const isConflict = result.error?.startsWith("CONFLICT");
    return NextResponse.json({ error: result.error }, { status: isConflict ? 409 : 400 });
  }

  await writeAuditEntry(supabaseAdmin, {
    actorId: payload.id,
    actorRole: payload.role || "admin",
    action: "EXAM_LIFECYCLE_TRANSITION",
    module: "EXAMS",
    previousValue: { assessmentId, status: fromStatus },
    newValue: { assessmentId, status: toStatus, is_published: result.assessment?.is_published },
    ipAddress: request.headers.get("x-forwarded-for") || "unknown"
  });

  return NextResponse.json({ success: true, assessment: result.assessment });
}
