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
  if (!session?.id && !session?.email && !session?.phone) return null;
  const hasPerm = await checkAdminPermission(supabaseAdmin, session.id || session.email || session.phone, "schools.edit");
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

    // Run database-level count queries in parallel (bypasses 1000 row select cap)
    const countQueries = {
      total: (supabaseAdmin as any).from("school_prospects").select("id", { count: "exact", head: true }),
      pending: (supabaseAdmin as any).from("school_prospects").select("id", { count: "exact", head: true }).eq("enrichment_status", "PENDING"),
      processing: (supabaseAdmin as any).from("school_prospects").select("id", { count: "exact", head: true }).eq("enrichment_status", "PROCESSING"),
      completed: (supabaseAdmin as any).from("school_prospects").select("id", { count: "exact", head: true }).eq("enrichment_status", "COMPLETED"),
      partial: (supabaseAdmin as any).from("school_prospects").select("id", { count: "exact", head: true }).eq("enrichment_status", "PARTIAL"),
      failed: (supabaseAdmin as any).from("school_prospects").select("id", { count: "exact", head: true }).eq("enrichment_status", "FAILED"),
      retryPending: (supabaseAdmin as any).from("school_prospects").select("id", { count: "exact", head: true }).eq("enrichment_status", "RETRY_PENDING"),
      highFit: (supabaseAdmin as any).from("school_prospects").select("id", { count: "exact", head: true }).gte("outreach_score", 70),
      readyForOutreach: (supabaseAdmin as any).from("school_prospects").select("id", { count: "exact", head: true }).eq("outreach_status", "READY_FOR_OUTREACH"),
      contacted: (supabaseAdmin as any).from("school_prospects").select("id", { count: "exact", head: true }).in("outreach_status", ["CONTACTED", "FOLLOW_UP_DUE", "REPLIED", "INTERESTED", "MEETING_SCHEDULED", "PARTNERED"]),
      interested: (supabaseAdmin as any).from("school_prospects").select("id", { count: "exact", head: true }).in("outreach_status", ["INTERESTED", "MEETING_SCHEDULED"]),
      partnered: (supabaseAdmin as any).from("school_prospects").select("id", { count: "exact", head: true }).eq("outreach_status", "PARTNERED"),
    };

    const countKeys = Object.keys(countQueries);
    const countPromises = Object.values(countQueries);

    const [countsResult, pagesResults, { count: activeJobsCount }] = await Promise.all([
      Promise.all(countPromises),
      Promise.all([
        (supabaseAdmin as any).from("school_prospects").select("state").not("state", "is", null).range(0, 999),
        (supabaseAdmin as any).from("school_prospects").select("state").not("state", "is", null).range(1000, 1999),
        (supabaseAdmin as any).from("school_prospects").select("state").not("state", "is", null).range(2000, 2999),
      ]),
      (supabaseAdmin as any)
        .from("admin_background_jobs")
        .select("id", { count: "exact", head: true })
        .eq("job_type", "SCHOOL_PROSPECT_ENRICH")
        .in("status", ["PENDING", "PROCESSING", "RETRY_PENDING"])
    ]);

    const stats: any = {};
    countKeys.forEach((key, idx) => {
      stats[key] = (countsResult[idx] as any).count || 0;
    });
    stats.activeJobs = activeJobsCount || 0;

    // Get distinct states from fetched data
    const stateRows = pagesResults.flatMap((r: any) => r.data || []);
    const stateSet = new Set<string>();
    for (const row of stateRows) {
      if (row.state) stateSet.add(row.state);
    }
    const states = Array.from(stateSet).sort();

    return NextResponse.json({ success: true, stats, states });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
