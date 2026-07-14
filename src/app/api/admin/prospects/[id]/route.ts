import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";
import { writeAuditEntry } from "@/domains/admin/AdminAuditService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function authenticate(permissionKey: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");

  if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) return null;

  const session = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!session || !session.id) return null;

  const hasPerm = await checkAdminPermission(supabaseAdmin, session.id, permissionKey);
  if (!hasPerm) return null;

  return session;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: false, message: "Sandbox sandbox mode." }, { status: 503 });
    }

    const session = await authenticate("schools.view");
    if (!session) {
      return NextResponse.json({ success: false, message: "Forbidden: schools.view permission required." }, { status: 403 });
    }

    const { id } = await params;

    // Fetch prospect
    const { data: prospect, error: fetchErr } = await (supabaseAdmin as any)
      .from("school_prospects")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !prospect) {
      return NextResponse.json({ success: false, message: "School prospect not found" }, { status: 404 });
    }

    // Fetch claims evidence
    const { data: evidence, error: evErr } = await (supabaseAdmin as any)
      .from("school_prospect_claims_evidence")
      .select("*")
      .eq("prospect_id", id);

    return NextResponse.json({
      success: true,
      prospect,
      evidence: evidence || []
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: false, message: "Sandbox sandbox mode." }, { status: 503 });
    }

    const session = await authenticate("schools.edit");
    if (!session) {
      return NextResponse.json({ success: false, message: "Forbidden: schools.edit permission required." }, { status: 403 });
    }

    const { id } = await params;

    const { data: prospect } = await (supabaseAdmin as any)
      .from("school_prospects")
      .select("name")
      .eq("id", id)
      .single();

    const { error: delErr } = await (supabaseAdmin as any)
      .from("school_prospects")
      .delete()
      .eq("id", id);

    if (delErr) {
      console.error("[Prospects API] Delete error:", delErr);
      return NextResponse.json({ success: false, message: "Failed to delete prospect" }, { status: 500 });
    }

    // Write audit trail
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    await writeAuditEntry(supabaseAdmin, {
      actorId: session.id,
      actorRole: "ADMIN",
      action: "DELETED_SCHOOL_PROSPECT",
      module: "SCHOOLS",
      previousValue: { id, name: prospect?.name },
      newValue: {},
      ipAddress: ip
    });

    return NextResponse.json({
      success: true,
      message: "Prospect successfully deleted"
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: false, message: "Sandbox sandbox mode." }, { status: 503 });
    }

    const session = await authenticate("schools.edit");
    if (!session) {
      return NextResponse.json({ success: false, message: "Forbidden: schools.edit permission required." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const { data: updated, error } = await (supabaseAdmin as any)
      .from("school_prospects")
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: "Failed to update prospect" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      prospect: updated
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
