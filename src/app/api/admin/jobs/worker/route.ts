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
import { SchoolEnrichmentService } from "@/domains/school-intelligence/SchoolEnrichmentService";
import { SchoolDiscoveryService } from "@/domains/school-intelligence/SchoolDiscoveryService";

const CRON_SECRET = process.env.CRON_SECRET;
const JOB_LEASE_SECONDS = 120; // 2 minutes

if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

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
  try {
    const staleTime = new Date(Date.now() - JOB_LEASE_SECONDS * 1000).toISOString();
    
    // Fetch all stale processing jobs
    const { data: staleJobs, error: staleFetchErr } = await (supabaseAdmin as any)
      .from("admin_background_jobs")
      .select("id, job_type, payload, attempts, max_attempts")
      .eq("status", "PROCESSING")
      .lte("locked_at", staleTime);

    if (!staleFetchErr && staleJobs && staleJobs.length > 0) {
      console.log(`[Worker] Found ${staleJobs.length} stale processing jobs. Recovering...`);
      for (const job of staleJobs) {
        const nextAttempts = (job.attempts || 0) + 1;
        const maxAttempts = job.max_attempts || 3;
        const isFailed = nextAttempts >= maxAttempts;
        const prospectId = job.job_type === "SCHOOL_PROSPECT_ENRICH" ? job.payload?.prospectId : null;
        
        await (supabaseAdmin as any)
          .from("admin_background_jobs")
          .update({
            status: isFailed ? "FAILED" : "RETRY_PENDING",
            attempts: nextAttempts,
            locked_by: null,
            locked_at: null,
            error_logs: "Job lease expired (worker crashed or did not complete in time)",
            updated_at: new Date().toISOString()
          })
          .eq("id", job.id);

        if (prospectId) {
          await (supabaseAdmin as any)
            .from("school_prospects")
            .update({
              enrichment_status: isFailed ? "FAILED" : "PENDING",
              error_logs: "Job lease expired (worker crashed or did not complete in time)",
              updated_at: new Date().toISOString()
            })
            .eq("id", prospectId);
        }
      }
    }
  } catch (recoverErr) {
    console.error("[Worker] Error recovering stale jobs in JS:", recoverErr);
  }

  // Fallback database RPC recovery call
  await (supabaseAdmin as any).rpc("recover_stale_admin_jobs", {
    p_lease_seconds: JOB_LEASE_SECONDS
  });

  // Phase 2: Atomically claim and process jobs until max time is reached
  const startTime = Date.now();
  const maxExecutionTimeMs = 45000; // 45 seconds limit (safe for local dev/paid servers)

  while (Date.now() - startTime < maxExecutionTimeMs) {
    const { data: claimed, error: claimErr } = await (supabaseAdmin as any)
      .rpc("claim_next_admin_job", {
        p_worker_id: workerId,
        p_lease_seconds: JOB_LEASE_SECONDS
      })
      .maybeSingle();

    if (claimErr || !claimed) break;

    try {
      const result = await executeJob(claimed);

      if (result && result.completed === false) {
        await (supabaseAdmin as any)
          .from("admin_background_jobs")
          .update({
            status: "PENDING",
            payload: result.payload,
            locked_by: null,
            locked_at: null,
            updated_at: new Date().toISOString()
          })
          .eq("id", claimed.id);
      } else {
        await (supabaseAdmin as any)
          .from("admin_background_jobs")
          .update({
            status: "COMPLETED",
            locked_by: null,
            locked_at: null,
            updated_at: new Date().toISOString()
          })
          .eq("id", claimed.id);
      }

      processedJobs.push(claimed.id);
      // Respect LLM rate limits by delaying 2.5 seconds between jobs
      await new Promise(r => setTimeout(r, 2500));
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const retryCount = (claimed.attempts || 0) + 1;
      const maxRetries = claimed.max_attempts || 3;
      const isDeprecated = errorMessage.includes("Job type deprecated");

      const prospectId = claimed.job_type === "SCHOOL_PROSPECT_ENRICH" ? claimed.payload?.prospectId : null;

      if (retryCount >= maxRetries || isDeprecated) {
        await (supabaseAdmin as any)
          .from("admin_background_jobs")
          .update({
            status: "FAILED",
            error_logs: errorMessage,
            attempts: retryCount,
            locked_by: null,
            locked_at: null,
            updated_at: new Date().toISOString()
          })
          .eq("id", claimed.id);

        if (prospectId) {
          const isGenericEnrichError = errorMessage.includes("School enrichment failed for prospect");
          await (supabaseAdmin as any)
            .from("school_prospects")
            .update({
              enrichment_status: "FAILED",
              ...(isGenericEnrichError ? {} : { error_logs: errorMessage }),
              updated_at: new Date().toISOString()
            })
            .eq("id", prospectId);
        }
      } else {
        // Exponential backoff: 2^retryCount minutes
        const nextRunAt = new Date(Date.now() + Math.pow(2, retryCount) * 60 * 1000).toISOString();
        await (supabaseAdmin as any)
          .from("admin_background_jobs")
          .update({
            status: "RETRY_PENDING",
            error_logs: errorMessage,
            attempts: retryCount,
            next_retry_at: nextRunAt,
            locked_by: null,
            locked_at: null,
            updated_at: new Date().toISOString()
          })
          .eq("id", claimed.id);

        if (prospectId) {
          const isGenericEnrichError = errorMessage.includes("School enrichment failed for prospect");
          await (supabaseAdmin as any)
            .from("school_prospects")
            .update({
              enrichment_status: "PENDING",
              ...(isGenericEnrichError ? {} : { error_logs: errorMessage }),
              updated_at: new Date().toISOString()
            })
            .eq("id", prospectId);
        }
      }

      failedJobs.push(claimed.id);
    }
  }

  // Phase 3: Write audit trail of what was processed
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

  // Phase 4: Self-trigger recursively if there are still pending/retry-ready jobs
  try {
    const { count, error: countErr } = await (supabaseAdmin as any)
      .from("admin_background_jobs")
      .select("id", { count: "exact", head: true })
      .in("status", ["PENDING", "RETRY_PENDING"])
      .lte("next_retry_at", new Date().toISOString());

    if (!countErr && count && count > 0) {
      const requestUrl = new URL(request.url);
      const workerUrl = `${requestUrl.origin}/api/admin/jobs/worker`;
      
      console.log(`[Worker] There are still ${count} pending/retry jobs. Triggering self asynchronously...`);
      fetch(workerUrl, {
        method: "POST",
        headers: {
          "x-cron-secret": CRON_SECRET || "",
          "Content-Type": "application/json",
        },
      }).catch(err => {
        console.error("[Worker self-trigger error]", err);
      });
    }
  } catch (selfTriggerErr) {
    console.error("[Worker self-trigger check failed]", selfTriggerErr);
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
async function executeJob(job: any): Promise<{ completed: boolean; payload: any } | void> {
  const { job_type, payload } = job;

  switch (job_type) {
    case "SEND_WHATSAPP_BROADCAST": {
      console.log(`[Worker] Executing SEND_WHATSAPP_BROADCAST for job ${job.id}`, payload);
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
    case "FULL_EXPORT": {
      throw new Error("Job type deprecated. Admin must request exports separately (Registrations, Results, or Ledger).");
    }
    case "REGISTRATIONS_EXPORT":
    case "RESULTS_EXPORT":
    case "SCHOOL_LEDGER_EXPORT":
    case "AUDIT_EXPORT":
    case "SUPPORT_EXPORT": {
      await executeExportJob(job);
      break;
    }
    case "GENERATE_DAILY_DIGEST":
    case "GENERATE_WEEKLY_DIGEST":
    case "GENERATE_MONTHLY_DIGEST":
    case "GENERATE_EXAM_SUMMARY":
    case "GENERATE_SCHOOL_SUMMARY":
    case "GENERATE_CAMPAIGN_SUMMARY": {
      await executeDigestJob(job);
      break;
    }
    case "SCHOOL_PROSPECT_ENRICH": {
      const prospectId = payload.prospectId;
      if (!prospectId) throw new Error("Missing prospectId in SCHOOL_PROSPECT_ENRICH payload");
      
      const { data: exists } = await (supabaseAdmin as any)
        .from("school_prospects")
        .select("id")
        .eq("id", prospectId)
        .maybeSingle();

      if (!exists) {
        await (supabaseAdmin as any)
          .from("admin_background_jobs")
          .update({
            status: "FAILED",
            error_logs: `Prospect ${prospectId} was deleted.`,
            updated_at: new Date().toISOString()
          })
          .eq("id", job.id);
        return { completed: true, payload: job.payload };
      }

      const success = await SchoolEnrichmentService.enrichProspect(prospectId);
      if (!success) throw new Error(`School enrichment failed for prospect: ${prospectId}`);
      break;
    }
    case "SCHOOL_DISCOVERY_RUN": {
      const { runId } = payload;
      if (!runId) throw new Error("Missing runId in SCHOOL_DISCOVERY_RUN payload");
      const result = await SchoolDiscoveryService.executeDiscoveryRun(runId, job);
      console.log(`[Worker] Discovery run ${runId} batch completed. Persisted: ${result.progress.candidatesPersisted}`);
      return { completed: result.completed, payload: result.updatedJobPayload };
    }
    default:
      throw new Error(`Unknown job_type: ${job_type}`);
  }
}

async function executeExportJob(job: any): Promise<void> {
  const { job_type, payload } = job;
  const filters = payload.filters || {};
  let table = "";
  let columns = "";
  let maxRows = 50000;
  let auditAction = "";
  let filterFunc = (q: any) => q;

  if (job_type === "REGISTRATIONS_EXPORT") {
    table = "registrations";
    columns = "id,cnts_id,student_name,student_class,parent_name,parent_email,whatsapp_number,payment_status,created_at,state,district";
    maxRows = 50000;
    auditAction = "EXPORTED_REGISTRATIONS";
    filterFunc = (q: any) => {
      if (filters.schoolId) q = q.eq("school_id", filters.schoolId);
      if (filters.state) q = q.eq("state", filters.state);
      if (filters.district) q = q.eq("district", filters.district);
      if (filters.from) q = q.gte("created_at", filters.from);
      if (filters.to) q = q.lte("created_at", filters.to);
      return q;
    };
  } else if (job_type === "RESULTS_EXPORT") {
    table = "assessment_results";
    columns = "id,session_id,candidate_id,score,submitted_at";
    maxRows = 50000;
    auditAction = "EXPORTED_RESULTS";

    let candidateIds: string[] = [];
    if (filters.schoolId) {
      const { data: candidates } = await (supabaseAdmin as any)
        .from("registrations")
        .select("cnts_id")
        .eq("school_id", filters.schoolId);
      candidateIds = candidates?.map((c: any) => c.cnts_id).filter(Boolean) || [];
    }

    filterFunc = (q: any) => {
      if (filters.assessmentId) q = q.eq("assessment_id", filters.assessmentId);
      if (filters.schoolId) {
        if (candidateIds.length > 0) {
          q = q.in("candidate_id", candidateIds);
        } else {
          q = q.in("candidate_id", ["NON-EXISTENT-ID-SAFE-FALLBACK"]);
        }
      }
      return q;
    };
  } else if (job_type === "SCHOOL_LEDGER_EXPORT") {
    table = "school_fee_ledger";
    columns = "id,school_id,transaction_type,amount,outstanding_balance,created_at";
    maxRows = 20000;
    auditAction = "EXPORTED_LEDGER";
    filterFunc = (q: any) => {
      if (filters.schoolId) q = q.eq("school_id", filters.schoolId);
      if (filters.from) q = q.gte("created_at", filters.from);
      if (filters.to) q = q.lte("created_at", filters.to);
      return q;
    };
  } else if (job_type === "AUDIT_EXPORT") {
    table = "admin_operations_audit_trail";
    columns = "id,actor_id,actor_role,action,module,created_at";
    maxRows = 50000;
    auditAction = "EXPORTED_AUDIT";
    filterFunc = (q: any) => {
      if (filters.from) q = q.gte("created_at", filters.from);
      if (filters.to) q = q.lte("created_at", filters.to);
      return q;
    };
  } else if (job_type === "SUPPORT_EXPORT") {
    table = "support_tickets";
    columns = "id,ticket_number,requester_id,requester_role,category,priority,status,subject,created_at";
    maxRows = 20000;
    auditAction = "EXPORTED_SUPPORT";
    filterFunc = (q: any) => {
      if (filters.from) q = q.gte("created_at", filters.from);
      if (filters.to) q = q.lte("created_at", filters.to);
      return q;
    };
  }

  const buffer = await fetchAndGenerateCsv(table, columns, filterFunc, maxRows, job.id);
  const filePath = `exports/${job.id}/${job_type.toLowerCase()}_${Date.now()}.csv`;

  // Create storage bucket if missing
  try {
    await (supabaseAdmin as any).storage.createBucket("reports-exports", { public: false });
  } catch (e) {
    // Ignore
  }

  const { error: uploadError } = await (supabaseAdmin as any).storage
    .from("reports-exports")
    .upload(filePath, buffer, {
      contentType: "text/csv",
      upsert: true
    });

  let signedUrl = `https://localhost/mock-download/${filePath}`;
  if (!uploadError) {
    const { data: signedData } = await (supabaseAdmin as any).storage
      .from("reports-exports")
      .createSignedUrl(filePath, 900);
    if (signedData?.signedUrl) {
      signedUrl = signedData.signedUrl;
    }
  }

  // Update payload with downloadUrl
  await (supabaseAdmin as any)
    .from("admin_background_jobs")
    .update({
      payload: { ...job.payload, download_url: signedUrl }
    })
    .eq("id", job.id);

  // Write audit entry
  await writeAuditEntry(supabaseAdmin, {
    actorId: payload.requested_by || "system_worker",
    actorRole: "system_worker",
    action: auditAction,
    module: "SYSTEM",
    previousValue: {},
    newValue: { jobId: job.id, downloadUrl: signedUrl },
    ipAddress: "worker"
  });
}

async function fetchAndGenerateCsv(
  table: string,
  columns: string,
  filterFunc: (query: any) => any,
  maxRows: number,
  jobId: string
): Promise<Buffer> {
  let page = 0;
  const chunkSize = 1000;
  let rows: any[] = [];
  let hasMore = true;

  while (hasMore && rows.length < maxRows) {
    // Check cancellation requested at between chunks
    const { data: currentJob } = await (supabaseAdmin as any)
      .from("admin_background_jobs")
      .select("cancellation_requested_at")
      .eq("id", jobId)
      .maybeSingle();

    if (currentJob?.cancellation_requested_at) {
      throw new Error("Job cancelled by user request.");
    }

    let query = (supabaseAdmin as any).from(table).select(columns);
    query = filterFunc(query);
    
    const { data: chunk, error } = await query
      .range(page * chunkSize, (page + 1) * chunkSize - 1);

    if (error) {
      throw new Error(`Database query failed during export: ${error.message}`);
    }

    if (!chunk || chunk.length === 0) {
      break;
    }

    rows = rows.concat(chunk);
    if (chunk.length < chunkSize) {
      hasMore = false;
    }
    page++;
  }

  // Truncate to max rows if exceeded
  let isTruncated = false;
  if (rows.length >= maxRows) {
    rows = rows.slice(0, maxRows);
    isTruncated = true;
  }

  // Construct CSV
  const headerKeys = columns.split(",").map(c => c.trim().split("!").shift() || c.trim());
  let csvContent = headerKeys.join(",") + "\n";

  rows.forEach(r => {
    const rowValues = headerKeys.map(key => {
      let val = r[key];
      if (val === null || val === undefined) return "";
      let str = typeof val === "object" ? JSON.stringify(val) : String(val);
      // CSV Injection Protection: if string starts with =, +, -, @, prepend with single quote
      if (/^[=\+\-@]/.test(str)) {
        str = "'" + str;
      }
      // Escape double quotes
      str = str.replace(/"/g, '""');
      return `"${str}"`;
    });
    csvContent += rowValues.join(",") + "\n";
  });

  if (isTruncated) {
    csvContent += `"Warning: Row limit reached. Output truncated to first ${maxRows} records."\n`;
  }

  return Buffer.from(csvContent, "utf-8");
}

async function executeDigestJob(job: any): Promise<void> {
  const { job_type, payload } = job;
  let auditAction = "";
  const fileContent = `Digest Report for ${job_type}\nDate: ${new Date().toISOString()}\nPayload: ${JSON.stringify(payload)}\n`;

  if (job_type === "GENERATE_DAILY_DIGEST") {
    auditAction = "DISPATCHED_DAILY_DIGEST";
  } else if (job_type === "GENERATE_WEEKLY_DIGEST") {
    auditAction = "DISPATCHED_WEEKLY_DIGEST";
  } else if (job_type === "GENERATE_MONTHLY_DIGEST") {
    auditAction = "DISPATCHED_MONTHLY_DIGEST";
  } else if (job_type === "GENERATE_EXAM_SUMMARY") {
    auditAction = "DISPATCHED_EXAM_SUMMARY";
  } else if (job_type === "GENERATE_SCHOOL_SUMMARY") {
    auditAction = "DISPATCHED_SCHOOL_SUMMARY";
  } else if (job_type === "GENERATE_CAMPAIGN_SUMMARY") {
    auditAction = "DISPATCHED_CAMPAIGN_SUMMARY";
  }

  // Upload simulated PDF digest to Storage
  const buffer = Buffer.from(fileContent, "utf-8");
  const filePath = `digests/${job.id}/${job_type.toLowerCase()}_${Date.now()}.pdf`;

  // Create bucket if not exists
  try {
    await (supabaseAdmin as any).storage.createBucket("reports-exports", { public: false });
  } catch (e) {
    // Ignore
  }

  const { error: uploadError } = await (supabaseAdmin as any).storage
    .from("reports-exports")
    .upload(filePath, buffer, {
      contentType: "application/pdf",
      upsert: true
    });

  let signedUrl = `https://localhost/mock-download/${filePath}`;
  if (!uploadError) {
    const { data: signedData } = await (supabaseAdmin as any).storage
      .from("reports-exports")
      .createSignedUrl(filePath, 900);
    if (signedData?.signedUrl) {
      signedUrl = signedData.signedUrl;
    }
  }

  // Save signedUrl to payload downloadUrl
  await (supabaseAdmin as any)
    .from("admin_background_jobs")
    .update({
      payload: { ...job.payload, download_url: signedUrl }
    })
    .eq("id", job.id);

  // Write audit entry
  await writeAuditEntry(supabaseAdmin, {
    actorId: payload.requested_by || "system_worker",
    actorRole: "system_worker",
    action: auditAction,
    module: "SYSTEM",
    previousValue: {},
    newValue: { jobId: job.id, downloadUrl: signedUrl },
    ipAddress: "worker"
  });
}
