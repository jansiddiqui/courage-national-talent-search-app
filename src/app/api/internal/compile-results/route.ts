import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { ResultCompilationService } from "@/domains/assessment/ResultCompilationService";
import crypto from "crypto";

const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: Request) {
  try {
    // 1. Authenticate using CRON_SECRET
    if (!CRON_SECRET) {
      return NextResponse.json({ success: false, message: "Server misconfiguration: CRON_SECRET not defined" }, { status: 500 });
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized: Missing authentication header" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    if (token !== CRON_SECRET) {
      return NextResponse.json({ success: false, message: "Unauthorized: Invalid authentication secret" }, { status: 401 });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, message: "Sandbox fallback active, no db configured" });
    }

    // 2. Call PL/pgSQL atomic claim function
    const workerId = crypto.randomUUID();
    const { data: jobs, error: claimErr } = await (supabaseAdmin as any)
      .rpc("claim_next_processing_job", {
        p_worker_id: workerId,
        p_lease_seconds: 600 // 10 minutes lease
      });

    if (claimErr) {
      console.error("[Internal Compile] RPC claiming error:", claimErr);
      return NextResponse.json({ success: false, message: "Failed to claim next job from database" }, { status: 500 });
    }

    const job = Array.isArray(jobs) ? jobs[0] : jobs;

    if (!job) {
      return NextResponse.json({ success: true, message: "No pending or retryable jobs in queue" });
    }

    // 3. Process the claimed job
    const success = await ResultCompilationService.compileResult(job.session_id);

    return NextResponse.json({
      success,
      jobId: job.id,
      sessionId: job.session_id,
      status: success ? "COMPLETED" : "FAILED"
    });

  } catch (error: any) {
    console.error("[Internal Compile] endpoint exception:", error);
    return NextResponse.json({ success: false, message: "Internal server compilation error" }, { status: 500 });
  }
}
