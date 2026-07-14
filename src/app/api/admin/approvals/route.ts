import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";
import { approveRequest, rejectRequest } from "@/domains/admin/ApprovalRequestService";
import { writeAuditEntry } from "@/domains/admin/AdminAuditService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function GET() {
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({
      approvals: [
        { id: "mock-1", action_type: "EXAM_PUBLISH", status: "PENDING", created_at: new Date().toISOString() }
      ]
    });
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");
  if (!sessionCookie?.value || !JWT_SECRET) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!payload || (!payload.id && !payload.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id || payload.email, "assessment.approve");
  if (!hasPerm) return NextResponse.json({ error: "Forbidden: assessment.approve permission required." }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from("approval_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ approvals: data || [] });
}

export async function POST(request: Request) {
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({ success: true, message: "Sandbox success" });
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");
  if (!sessionCookie?.value || !JWT_SECRET) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!payload || (!payload.id && !payload.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id || payload.email, "assessment.approve");
  if (!hasPerm) return NextResponse.json({ error: "Forbidden: assessment.approve permission required." }, { status: 403 });

  const body = await request.json();
  const { action, approvalId, rejectionReason } = body;
  const reviewerId = payload.id as string;
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  try {
    if (action === "approve") {
      await approveRequest(supabaseAdmin, approvalId, reviewerId);
      await writeAuditEntry(supabaseAdmin, {
        actorId: reviewerId, actorRole: payload.role || "admin", action: "APPROVAL_APPROVED",
        module: "APPROVALS", previousValue: { status: "PENDING" }, newValue: { status: "APPROVED", approvalId },
        ipAddress: ip
      });
      return NextResponse.json({ success: true });
    }

    if (action === "reject") {
      await rejectRequest(supabaseAdmin, approvalId, reviewerId, rejectionReason || "No reason provided");
      await writeAuditEntry(supabaseAdmin, {
        actorId: reviewerId, actorRole: payload.role || "admin", action: "APPROVAL_REJECTED",
        module: "APPROVALS", previousValue: { status: "PENDING" }, newValue: { status: "REJECTED", approvalId },
        ipAddress: ip
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
