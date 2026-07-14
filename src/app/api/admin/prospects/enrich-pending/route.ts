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
  if (!sessionCookie?.value || !JWT_SECRET) return null;
  const session = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!session?.id && !session?.email && !session?.phone) return null;
  const hasPerm = await checkAdminPermission(supabaseAdmin, session.id || session.email || session.phone, permissionKey);
  if (!hasPerm) return null;
  return session;
}

/**
 * POST /api/admin/prospects/enrich-pending
 * Server-side: queue enrichment for all pending prospects (up to a safe limit).
 * Does NOT require sending IDs from browser.
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

    const body = await request.json().catch(() => ({}));
    const limit = Math.min(parseInt(body.limit) || 100, 500); // max 500 per call

    // Fetch pending prospects server-side
    const { data: pendingProspects, error: fetchErr } = await (supabaseAdmin as any)
      .from("school_prospects")
      .select("id")
      .eq("enrichment_status", "PENDING")
      .order("outreach_score", { ascending: false }) // prioritize any pre-scored
      .limit(limit);

    if (fetchErr) {
      return NextResponse.json({ success: false, message: "Failed to fetch pending prospects." }, { status: 500 });
    }

    const prospects = pendingProspects || [];
    const queuedJobs: string[] = [];
    const skippedCount = { duplicate: 0 };

    for (const { id: prospectId } of prospects) {
      const idempotencyKey = `prospect_enrich_${prospectId}`;

      // Check for existing active job
      const { data: existingJob } = await (supabaseAdmin as any)
        .from("admin_background_jobs")
        .select("id")
        .eq("idempotency_key", idempotencyKey)
        .in("status", ["PENDING", "PROCESSING", "RETRY_PENDING"])
        .maybeSingle();

      if (existingJob) {
        skippedCount.duplicate++;
        continue;
      }

      const { data: job, error: queueErr } = await (supabaseAdmin as any)
        .from("admin_background_jobs")
        .insert({
          job_type: "SCHOOL_PROSPECT_ENRICH",
          status: "PENDING",
          payload: { prospectId },
          idempotency_key: idempotencyKey,
          run_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (!queueErr && job) {
        queuedJobs.push(job.id);
      }
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    await writeAuditEntry(supabaseAdmin, {
      actorId: session.id,
      actorRole: "ADMIN",
      action: "QUEUED_BULK_PROSPECT_ENRICHMENT",
      module: "SCHOOLS",
      previousValue: {},
      newValue: { totalPending: prospects.length, queued: queuedJobs.length, skipped: skippedCount.duplicate },
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      totalPendingFound: prospects.length,
      queuedJobsCount: queuedJobs.length,
      skippedCount,
      message: `Queued ${queuedJobs.length} enrichment jobs. Worker will process them in batches.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
