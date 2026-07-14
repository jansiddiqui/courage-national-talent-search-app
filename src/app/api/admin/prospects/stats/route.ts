import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function authenticate() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");
  if (!sessionCookie?.value || !JWT_SECRET) return null;
  const session = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!session?.id && !session?.email) return null;
  const hasPerm = await checkAdminPermission(supabaseAdmin, session.id || session.email, "schools.edit");
  if (!hasPerm) return null;
  return session;
}

/**
 * GET /api/admin/prospects/stats
 * Returns real full-dataset counts for dashboard KPIs.
 */
export async function GET() {
  try {
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({
        success: true,
        stats: {
          total: 0, pending: 0, processing: 0, completed: 0,
          partial: 0, failed: 0, retryPending: 0,
          highFit: 0, readyForOutreach: 0,
          contacted: 0, interested: 0, partnered: 0,
        },
        states: [],
      });
    }

    const session = await authenticate();
    if (!session) {
      return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
    }

    // Single query for all enrichment status counts
    const { data: enrichCounts } = await (supabaseAdmin as any)
      .from("school_prospects")
      .select("enrichment_status, outreach_status, outreach_score, state");

    const rows: any[] = enrichCounts || [];

    const stats = {
      total: rows.length,
      pending: rows.filter(r => r.enrichment_status === "PENDING").length,
      processing: rows.filter(r => r.enrichment_status === "PROCESSING").length,
      completed: rows.filter(r => r.enrichment_status === "COMPLETED").length,
      partial: rows.filter(r => r.enrichment_status === "PARTIAL").length,
      failed: rows.filter(r => r.enrichment_status === "FAILED").length,
      retryPending: rows.filter(r => r.enrichment_status === "RETRY_PENDING").length,
      highFit: rows.filter(r => r.outreach_score >= 70).length,
      readyForOutreach: rows.filter(r => r.outreach_status === "READY_FOR_OUTREACH").length,
      contacted: rows.filter(r => ["CONTACTED", "FOLLOW_UP_DUE", "REPLIED", "INTERESTED", "MEETING_SCHEDULED", "PARTNERED"].includes(r.outreach_status)).length,
      interested: rows.filter(r => ["INTERESTED", "MEETING_SCHEDULED"].includes(r.outreach_status)).length,
      partnered: rows.filter(r => r.outreach_status === "PARTNERED").length,
    };

    // Get distinct states from actual data
    const stateSet = new Set<string>();
    for (const row of rows) {
      if (row.state) stateSet.add(row.state);
    }
    const states = Array.from(stateSet).sort();

    return NextResponse.json({ success: true, stats, states });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
