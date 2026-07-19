import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function authenticate(permissionKey: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");
  if (!sessionCookie?.value || !JWT_SECRET) return null;
  const session = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!session?.id && !session?.email && !session?.phone) return null;
  const hasPerm = await checkAdminPermission(supabaseAdmin, session.id || session.email || session.phone, permissionKey);
  if (!hasPerm) return null;
  return session;
}

/**
 * GET /api/admin/prospects/discover/[runId]
 * Poll progress of a discovery run.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: false, message: "Database not configured." }, { status: 503 });
    }

    const session = await authenticate("schools.view");
    if (!session) {
      return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
    }

    const { runId } = await params;

    const { data: run, error } = await (supabaseAdmin as any)
      .from("school_discovery_runs")
      .select("*")
      .eq("id", runId)
      .single();

    if (error || !run) {
      return NextResponse.json({ success: false, message: "Discovery run not found." }, { status: 404 });
    }

    // Fetch up to 5 recently discovered schools for this run for live logging
    const { data: recentSchools } = await (supabaseAdmin as any)
      .from("school_prospects")
      .select("id, name, city, state, created_at")
      .eq("source_identifier", runId)
      .order("created_at", { ascending: false })
      .limit(5);

    return NextResponse.json({ success: true, run, recentSchools: recentSchools || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/prospects/discover/[runId]
 * Cancel a running discovery run.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: false, message: "Database not configured." }, { status: 503 });
    }

    const session = await authenticate("schools.edit");
    if (!session) {
      return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
    }

    const { runId } = await params;

    await (supabaseAdmin as any)
      .from("school_discovery_runs")
      .update({ status: "CANCELLED", updated_at: new Date().toISOString() })
      .eq("id", runId)
      .in("status", ["PENDING", "RUNNING"]);

    // Also cancel any queued jobs for this run
    await (supabaseAdmin as any)
      .from("admin_background_jobs")
      .update({ status: "CANCELLED" })
      .eq("job_type", "SCHOOL_DISCOVERY_RUN")
      .contains("payload", { runId });

    return NextResponse.json({ success: true, message: "Discovery run cancelled." });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
