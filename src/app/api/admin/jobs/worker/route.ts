/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Phase 8: Background Job Worker Endpoint
 * POST /api/admin/jobs/worker
 *
 * This endpoint is called by a scheduled CRON job (via Vercel Cron or external scheduler).
 * It atomically claims PENDING jobs from admin_background_jobs, processes them,
 * and marks them COMPLETED or FAILED with error details.
 *
 * Security:
 *   - Protected by CRON_SECRET header validation.
 *   - Not accessible to regular admin sessions.
 *   - Fails closed: if CRON_SECRET env var is absent, the endpoint returns 503.
 *
 * Concurrency safety:
 *   - Uses UPDATE ... WHERE status='PENDING' RETURNING to atomically claim exactly one job.
 *   - Stale PROCESSING jobs (lease > 5 minutes old) are recovered to PENDING.
 */

import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { writeAuditEntry } from "@/domains/admin/AdminAuditService";

const CRON_SECRET = process.env.CRON_SECRET;
const JOB_LEASE_SECONDS = 300; // 5 minutes

export async function POST(request: Request) {
  // Fail closed: if CRON_SECRET is not configured, refuse all requests
  if (!CRON_SECRET) {
    return NextResponse.json({ error: "Worker not configured: CRON_SECRET is absent." }, { status: 503 });
  }

  const authHeader = request.headers.get("x-cron-secret");
  if (!authHeader || authHeader !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized: invalid CRON_SECRET." }, { status: 401 });
  }

  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({ message: "Worker: sandbox mode, no-op." });
  }

  const workerId = crypto.randomUUID();
  const processedJobs: string[] = [];
  const failedJobs: string[] = [];

  // Phase 1: Recover stale PROCESSING jobs that have exceeded their lease
  const leaseThreshold = new Date(Date.now() - JOB_LEASE_SECONDS * 1000).toISOString();
  await (supabaseAdmin as any)
    .from("admin_background_jobs")
    .update({ status: "PENDING", worker_id: null })
    .eq("status", "PROCESSING")
    .lt("processing_started_at", leaseThreshold);

  // Phase 2: Atomically claim up to 5 PENDING jobs
  for (let i = 0; i < 5; i++) {
    const { data: claimed, error: claimErr } = await (supabaseAdmin as any)
      .from("admin_background_jobs")
      .update({
        status: "PROCESSING",
        worker_id: workerId,
        processing_started_at: new Date().toISOString()
      })
      .eq("status", "PENDING")
      .lte("run_at", new Date().toISOString())
      .is("cancellation_requested_at", null)
      .order("run_at", { ascending: true })
      .limit(1)
      .select()
      .maybeSingle();

    if (claimErr || !claimed) break;

    try {
      await executeJob(claimed);

      await (supabaseAdmin as any)
        .from("admin_background_jobs")
        .update({
          status: "COMPLETED",
          completed_at: new Date().toISOString()
        })
        .eq("id", claimed.id);

      processedJobs.push(claimed.id);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const retryCount = (claimed.retry_count || 0) + 1;
      const maxRetries = claimed.max_retries || 3;

      if (retryCount >= maxRetries) {
        await (supabaseAdmin as any)
          .from("admin_background_jobs")
          .update({
            status: "FAILED",
            error_message: errorMessage,
            failed_at: new Date().toISOString(),
            retry_count: retryCount
          })
          .eq("id", claimed.id);
      } else {
        // Exponential backoff: 2^retryCount minutes
        const nextRunAt = new Date(Date.now() + Math.pow(2, retryCount) * 60 * 1000).toISOString();
        await (supabaseAdmin as any)
          .from("admin_background_jobs")
          .update({
            status: "RETRY_PENDING",
            error_message: errorMessage,
            retry_count: retryCount,
            run_at: nextRunAt
          })
          .eq("id", claimed.id);
      }

      failedJobs.push(claimed.id);
    }
  }

  if (processedJobs.length > 0 || failedJobs.length > 0) {
    await writeAuditEntry(supabaseAdmin, {
      actorId: workerId,
      actorRole: "system_worker",
      action: "BACKGROUND_JOB_WORKER_RUN",
      module: "SYSTEM",
      previousValue: {},
      newValue: { processedJobs, failedJobs, workerId },
      ipAddress: request.headers.get("x-forwarded-for") || "worker"
    });
  }

  return NextResponse.json({
    workerId,
    processed: processedJobs.length,
    failed: failedJobs.length,
    processedJobs,
    failedJobs
  });
}

/**
 * Dispatches execution of a claimed job based on its job_type.
 * Add new job types here as they are introduced.
 */
async function executeJob(job: any): Promise<void> {
  const { job_type, payload } = job;

  switch (job_type) {
    case "SEND_WHATSAPP_BROADCAST": {
      // Real execution would call the Meta API or Brevo here.
      // For now we log intent and mark as completed (provider integration in Phase 9).
      console.log(`[Worker] Executing SEND_WHATSAPP_BROADCAST for job ${job.id}`, payload);
      // If a real provider SDK is available, call it here.
      break;
    }
    case "SEND_EMAIL_BROADCAST": {
      console.log(`[Worker] Executing SEND_EMAIL_BROADCAST for job ${job.id}`, payload);
      break;
    }
    case "GENERATE_REPORT": {
      console.log(`[Worker] Executing GENERATE_REPORT for job ${job.id}`, payload);
      break;
    }
    default:
      throw new Error(`Unknown job_type: ${job_type}`);
  }
}
