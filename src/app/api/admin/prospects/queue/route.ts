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
    const { action, prospectIds } = body;

    const ip = request.headers.get("x-forwarded-for") || "unknown";

    if (action === "STOP") {
      // 1. Fetch prospectIds of pending/retry enrichment jobs
      const { data: pendingJobs } = await (supabaseAdmin as any)
        .from("admin_background_jobs")
        .select("payload")
        .eq("job_type", "SCHOOL_PROSPECT_ENRICH")
        .in("status", ["PENDING", "RETRY_PENDING"]);

      const pendingProspectIds = (pendingJobs || [])
        .map((j: any) => j.payload?.prospectId)
        .filter(Boolean);

      // 2. Delete pending, processing and retry background jobs
      const { error: deleteErr } = await (supabaseAdmin as any)
        .from("admin_background_jobs")
        .delete()
        .eq("job_type", "SCHOOL_PROSPECT_ENRICH")
        .in("status", ["PENDING", "PROCESSING", "RETRY_PENDING"]);

      if (deleteErr) {
        return NextResponse.json({ success: false, message: `Stop failed: ${deleteErr.message}` }, { status: 500 });
      }

      // 3. Reset prospects to NEW if they were pending/processing/retry_pending
      const targetProspectIds = [...pendingProspectIds];
      
      // Also reset any currently processing/pending/retry_pending prospects
      await (supabaseAdmin as any)
        .from("school_prospects")
        .update({
          enrichment_status: "NEW",
          updated_at: new Date().toISOString()
        })
        .in("enrichment_status", ["PENDING", "PROCESSING", "RETRY_PENDING"]);

      if (targetProspectIds.length > 0) {
        await (supabaseAdmin as any)
          .from("school_prospects")
          .update({
            enrichment_status: "NEW",
            updated_at: new Date().toISOString()
          })
          .in("id", targetProspectIds);
      }

      await writeAuditEntry(supabaseAdmin, {
        actorId: session.id,
        actorRole: "ADMIN",
        action: "STOPPED_PROSPECT_ENRICHMENT_QUEUE",
        module: "SCHOOLS",
        previousValue: {},
        newValue: { stoppedJobsCount: pendingJobs?.length || 0 },
        ipAddress: ip,
      });

      return NextResponse.json({ success: true, message: `Enrichment queue stopped. Cancelled ${pendingJobs?.length || 0} jobs.` });
    }

    if (action === "REPROCESS_FAILED") {
      // 1. Fetch prospects in FAILED or PARTIAL status
      const { data: failedProspects } = await (supabaseAdmin as any)
        .from("school_prospects")
        .select("id")
        .in("enrichment_status", ["FAILED", "PARTIAL"]);

      const prospects = failedProspects || [];
      if (prospects.length === 0) {
        return NextResponse.json({ success: true, message: "No failed or partial prospects to reprocess." });
      }

      const jobsToInsert = prospects.map((p: any) => ({
        job_type: "SCHOOL_PROSPECT_ENRICH",
        status: "PENDING",
        payload: { prospectId: p.id },
        idempotency_key: `prospect_enrich_${p.id}`,
        next_retry_at: new Date().toISOString(),
      }));

      // 2. Set prospects status to PENDING
      const prospectIds = prospects.map((p: any) => p.id);
      await (supabaseAdmin as any)
        .from("school_prospects")
        .update({
          enrichment_status: "PENDING",
          error_logs: null,
          updated_at: new Date().toISOString()
        })
        .in("id", prospectIds);

      // 3. Insert jobs
      await (supabaseAdmin as any)
        .from("admin_background_jobs")
        .upsert(jobsToInsert, { onConflict: "idempotency_key" });

      await writeAuditEntry(supabaseAdmin, {
        actorId: session.id,
        actorRole: "ADMIN",
        action: "REPROCESSED_FAILED_PROSPECT_ENRICHMENT",
        module: "SCHOOLS",
        previousValue: {},
        newValue: { reprocessedCount: prospects.length },
        ipAddress: ip,
      });

      return NextResponse.json({ success: true, message: `Reprocessing started for ${prospects.length} failed/partial prospects.` });
    }

    if (action === "RESET_STUCK") {
      // 1. Reset all jobs with status PROCESSING
      const { data: stuckJobs } = await (supabaseAdmin as any)
        .from("admin_background_jobs")
        .select("id, payload")
        .eq("job_type", "SCHOOL_PROSPECT_ENRICH")
        .eq("status", "PROCESSING");

      const jobs = stuckJobs || [];
      if (jobs.length > 0) {
        const jobIds = jobs.map((j: any) => j.id);
        await (supabaseAdmin as any)
          .from("admin_background_jobs")
          .update({
            status: "PENDING",
            attempts: 0,
            locked_at: null,
            locked_by: null,
            error_logs: null,
            updated_at: new Date().toISOString()
          })
          .in("id", jobIds);
      }

      // 2. Reset all prospects with status PROCESSING
      const { data: stuckProspects } = await (supabaseAdmin as any)
        .from("school_prospects")
        .select("id")
        .eq("enrichment_status", "PROCESSING");

      const prospects = stuckProspects || [];
      if (prospects.length > 0) {
        const prospectIds = prospects.map((p: any) => p.id);
        await (supabaseAdmin as any)
          .from("school_prospects")
          .update({
            enrichment_status: "PENDING",
            updated_at: new Date().toISOString()
          })
          .in("id", prospectIds);
      }

      await writeAuditEntry(supabaseAdmin, {
        actorId: session.id,
        actorRole: "ADMIN",
        action: "RESET_STUCK_PROSPECT_ENRICHMENT_QUEUE",
        module: "SCHOOLS",
        previousValue: {},
        newValue: { resetJobs: jobs.length, resetProspects: prospects.length },
        ipAddress: ip,
      });

      return NextResponse.json({ success: true, message: `Reset completed. Unlocked ${jobs.length} background jobs and ${prospects.length} prospects.` });
    }

    if (action === "REPROCESS_SELECTED") {
      if (!prospectIds || !Array.isArray(prospectIds) || prospectIds.length === 0) {
        return NextResponse.json({ success: false, message: "No prospect IDs provided." }, { status: 400 });
      }

      const jobsToInsert = prospectIds.map((pId: string) => ({
        job_type: "SCHOOL_PROSPECT_ENRICH",
        status: "PENDING",
        payload: { prospectId: pId },
        idempotency_key: `prospect_enrich_${pId}`,
        next_retry_at: new Date().toISOString(),
      }));

      // Set prospects to PENDING
      await (supabaseAdmin as any)
        .from("school_prospects")
        .update({
          enrichment_status: "PENDING",
          error_logs: null,
          updated_at: new Date().toISOString()
        })
        .in("id", prospectIds);

      // Upsert background jobs (clearing failed state)
      await (supabaseAdmin as any)
        .from("admin_background_jobs")
        .upsert(jobsToInsert, { onConflict: "idempotency_key" });

      await writeAuditEntry(supabaseAdmin, {
        actorId: session.id,
        actorRole: "ADMIN",
        action: "REPROCESSED_SELECTED_PROSPECTS",
        module: "SCHOOLS",
        previousValue: {},
        newValue: { reprocessedCount: prospectIds.length },
        ipAddress: ip,
      });

      return NextResponse.json({ success: true, message: `Reprocessing queued for ${prospectIds.length} selected prospects.` });
    }

    return NextResponse.json({ success: false, message: "Invalid action." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
