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
      console.error("[Enrich Pending API] Fetch prospects error:", fetchErr);
      return NextResponse.json({ success: false, message: `Failed to fetch pending prospects: ${fetchErr.message || JSON.stringify(fetchErr)}` }, { status: 500 });
    }

    const prospects = pendingProspects || [];
    const skippedCount = { duplicate: 0 };
    const jobsToInsert: any[] = [];

    if (prospects.length > 0) {
      const prospectIds = prospects.map((p: any) => p.id);
      const idempotencyKeys = prospectIds.map((id: string) => `prospect_enrich_${id}`);

      // Single query to find existing active background jobs
      const { data: existingJobs, error: jobsErr } = await (supabaseAdmin as any)
        .from("admin_background_jobs")
        .select("idempotency_key")
        .in("idempotency_key", idempotencyKeys)
        .in("status", ["PENDING", "PROCESSING", "RETRY_PENDING"]);

      if (jobsErr) {
        console.error("[Enrich Pending API] Fetch existing jobs error:", jobsErr);
        return NextResponse.json({ success: false, message: `Failed to verify existing jobs: ${jobsErr.message || JSON.stringify(jobsErr)}` }, { status: 500 });
      }

      const existingKeys = new Set((existingJobs || []).map((j: any) => j.idempotency_key));

      for (const p of prospects) {
        const key = `prospect_enrich_${p.id}`;
        if (existingKeys.has(key)) {
          skippedCount.duplicate++;
        } else {
          jobsToInsert.push({
            job_type: "SCHOOL_PROSPECT_ENRICH",
            status: "PENDING",
            payload: { prospectId: p.id },
            idempotency_key: key,
            next_retry_at: new Date().toISOString(),
          });
        }
      }

      if (jobsToInsert.length > 0) {
        const { error: insertErr } = await (supabaseAdmin as any)
          .from("admin_background_jobs")
          .upsert(jobsToInsert, { onConflict: "idempotency_key" });

        if (insertErr) {
          console.error("[Enrich Pending API] Batch insert error:", JSON.stringify(insertErr, null, 2));
          return NextResponse.json({ success: false, message: `Failed to queue enrichment jobs: ${insertErr.message || JSON.stringify(insertErr)}` }, { status: 500 });
        }
      }
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    await writeAuditEntry(supabaseAdmin, {
      actorId: session.id,
      actorRole: "ADMIN",
      action: "QUEUED_BULK_PROSPECT_ENRICHMENT",
      module: "SCHOOLS",
      previousValue: {},
      newValue: { totalPending: prospects.length, queued: jobsToInsert.length, skipped: skippedCount.duplicate },
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      totalPendingFound: prospects.length,
      queuedJobsCount: jobsToInsert.length,
      skippedCount,
      message: `Queued ${jobsToInsert.length} enrichment jobs. Worker will process them in batches.`,
    });
  } catch (err: any) {
    console.error("[Enrich Pending API] Unexpected error:", err);
    return NextResponse.json({ success: false, message: `Unexpected error: ${err.message || err}` }, { status: 500 });
  }
}
