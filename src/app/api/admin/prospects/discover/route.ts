import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";
import { writeAuditEntry } from "@/domains/admin/AdminAuditService";
import { SchoolDiscoveryService, DiscoveryScope, INDIA_GEOGRAPHY } from "@/domains/school-intelligence/SchoolDiscoveryService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function authenticate(permissionKey: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");
  if (!sessionCookie?.value || !JWT_SECRET) return null;
  const session = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!session?.id && !session?.email) return null;
  const hasPerm = await checkAdminPermission(supabaseAdmin, session.id || session.email, permissionKey);
  if (!hasPerm) return null;
  return session;
}

/**
 * POST /api/admin/prospects/discover
 * Starts a new school discovery run.
 * Body: { scope_type, selected_states?, selected_districts?, target_count }
 */
export async function POST(request: Request) {
  try {
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: false, message: "Database not configured." }, { status: 503 });
    }

    const session = await authenticate("schools.edit");
    if (!session) {
      return NextResponse.json({ success: false, message: "Forbidden: schools.edit required." }, { status: 403 });
    }

    const body = await request.json();
    const { scope_type, selected_states, selected_districts, target_count } = body;

    if (!scope_type || !["ALL_INDIA", "SELECTED_STATES", "SELECTED_DISTRICTS"].includes(scope_type)) {
      return NextResponse.json({ success: false, message: "Invalid scope_type." }, { status: 400 });
    }

    if (scope_type === "SELECTED_STATES" && (!Array.isArray(selected_states) || selected_states.length === 0)) {
      return NextResponse.json({ success: false, message: "selected_states required for SELECTED_STATES scope." }, { status: 400 });
    }

    const scope: DiscoveryScope = {
      type: scope_type,
      selectedStates: selected_states || [],
      selectedDistricts: selected_districts || [],
      targetCount: Math.min(Math.max(parseInt(target_count) || 500, 10), 2000),
    };

    // Check provider availability before starting
    const tavilyKey = process.env.TAVILY_API_KEY;
    const googleKey = process.env.GOOGLE_SEARCH_API_KEY;
    const googleCx = process.env.GOOGLE_SEARCH_CX;
    if (!tavilyKey && !(googleKey && googleCx)) {
      return NextResponse.json({
        success: false,
        message: "No search provider configured. Set TAVILY_API_KEY or GOOGLE_SEARCH_API_KEY + GOOGLE_SEARCH_CX."
      }, { status: 503 });
    }

    // Calculate plan size for transparency
    const geographies = SchoolDiscoveryService.buildGeographyList(scope);

    // Create the run record
    const runId = await SchoolDiscoveryService.startDiscoveryRun(scope);
    if (!runId) {
      return NextResponse.json({ success: false, message: "Failed to create discovery run." }, { status: 500 });
    }

    // Queue the discovery run as a background job
    const idempotencyKey = `school_discovery_run_${runId}`;
    await (supabaseAdmin as any)
      .from("admin_background_jobs")
      .insert({
        job_type: "SCHOOL_DISCOVERY_RUN",
        status: "PENDING",
        payload: { runId, scope },
        idempotency_key: idempotencyKey,
        run_at: new Date().toISOString(),
      });

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    await writeAuditEntry(supabaseAdmin, {
      actorId: session.id,
      actorRole: "ADMIN",
      action: "STARTED_SCHOOL_DISCOVERY_RUN",
      module: "SCHOOLS",
      previousValue: {},
      newValue: { runId, scope_type, target_count: scope.targetCount, geographies_planned: geographies.length },
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      runId,
      geographiesPlanned: geographies.length,
      queriesPlanned: geographies.length * 7, // 7 query templates
      targetCount: scope.targetCount,
      message: "Discovery run queued. Poll /api/admin/prospects/discover/{runId} for progress.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

/**
 * GET /api/admin/prospects/discover
 * Returns list of recent discovery runs + available states for scope selection.
 */
export async function GET(request: Request) {
  try {
    const providerStatus = {
      tavily: !!process.env.TAVILY_API_KEY,
      google: !!(process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_CX),
      openrouter: !!process.env.OPENROUTER_API_KEY,
      cronSecret: !!process.env.CRON_SECRET,
    };

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, runs: [], availableStates: Object.keys(INDIA_GEOGRAPHY), providerStatus });
    }

    const session = await authenticate("schools.view");
    if (!session) {
      return NextResponse.json({ success: false, message: "Forbidden: schools.view required." }, { status: 403 });
    }

    const { data: runs } = await (supabaseAdmin as any)
      .from("school_discovery_runs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      success: true,
      runs: runs || [],
      availableStates: Object.keys(INDIA_GEOGRAPHY),
      providerStatus,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
