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
  if (!session || (!session.id && !session.email && !session.phone)) return null;

  const hasPerm = await checkAdminPermission(supabaseAdmin, session.id || session.email || session.phone, permissionKey);
  if (!hasPerm) return null;

  return session;
}

export async function POST(request: Request) {
  try {
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: false, message: "Database not configured." }, { status: 503 });
    }

    const session = await authenticate("schools.edit");
    if (!session) {
      return NextResponse.json({ success: false, message: "Forbidden: schools.edit permission required." }, { status: 403 });
    }

    const body = await request.json();
    const { prospectIds, outreach_status, outreach_channel, outreach_notes, next_followup_at } = body;

    if (!Array.isArray(prospectIds) || prospectIds.length === 0) {
      return NextResponse.json({ success: false, message: "prospectIds array is required." }, { status: 400 });
    }

    if (!outreach_status) {
      return NextResponse.json({ success: false, message: "outreach_status is required." }, { status: 400 });
    }

    const updatePayload: any = {
      outreach_status,
      updated_at: new Date().toISOString(),
    };

    if (["CONTACTED", "FOLLOW_UP_DUE", "REPLIED", "INTERESTED", "MEETING_SCHEDULED", "PARTNERED"].includes(outreach_status)) {
      updatePayload.last_contacted_at = new Date().toISOString();
    }

    if (outreach_channel) updatePayload.outreach_channel = outreach_channel;
    if (outreach_notes !== undefined) updatePayload.outreach_notes = outreach_notes;
    if (next_followup_at) updatePayload.next_followup_at = next_followup_at;

    const { data: updatedData, error: updateErr } = await (supabaseAdmin as any)
      .from("school_prospects")
      .update(updatePayload)
      .in("id", prospectIds)
      .select("id, name, outreach_status");

    if (updateErr) {
      console.error("[Bulk Outreach Update Error]", updateErr);
      return NextResponse.json({ success: false, message: updateErr.message || "Failed to update prospects" }, { status: 500 });
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    await writeAuditEntry(supabaseAdmin, {
      actorId: session.id,
      actorRole: "ADMIN",
      action: "BULK_UPDATED_SCHOOL_OUTREACH_STATUS",
      module: "SCHOOLS",
      previousValue: { count: prospectIds.length },
      newValue: { count: prospectIds.length, outreach_status, prospectIds },
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      updatedCount: updatedData?.length || prospectIds.length,
      message: `Successfully updated outreach status to "${outreach_status}" for ${updatedData?.length || prospectIds.length} school(s).`
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
