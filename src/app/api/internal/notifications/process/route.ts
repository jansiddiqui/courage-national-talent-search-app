/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { NotificationService } from "@/services/NotificationService";

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get("x-api-key");
    const secret = process.env.INTERNAL_API_SECRET || "courage-internal-secret-token";

    if (!apiKey || apiKey !== secret) {
      return NextResponse.json({ success: false, message: "Unauthorized access." }, { status: 401 });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, message: "Sandbox mode: skipped processor." });
    }

    // Query pending/failed jobs with remaining attempts
    const { data: jobs, error: fetchErr } = await (supabaseAdmin as any)
      .from("notification_jobs")
      .select("id, attempts, status")
      .eq("status", "PENDING")
      .lt("attempts", 3)
      .order("created_at", { ascending: true })
      .limit(20);

    if (fetchErr) {
      console.error("[Notification Queue Processor] Error querying queue:", fetchErr.message);
      return NextResponse.json({ success: false, message: "Error querying queue." }, { status: 500 });
    }

    let processed = 0;
    let sent = 0;
    let failed = 0;
    let retryScheduled = 0;

    for (const job of (jobs || [])) {
      processed++;
      try {
        const success = await NotificationService.executeJob(job.id);
        if (success) {
          sent++;
        } else {
          const nextAttempt = job.attempts + 1;
          if (nextAttempt >= 3) {
            failed++;
          } else {
            retryScheduled++;
          }
        }
      } catch (err) {
        console.error(`[Notification Queue Processor] Failed executing job ${job.id}:`, err);
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      claimed: processed,
      sent,
      failed,
      retryScheduled,
      skipped: 0
    }, {
      headers: {
        "Cache-Control": "private, no-store, no-cache, must-revalidate"
      }
    });

  } catch (error: any) {
    console.error("[Notification Queue Processor] Fatal:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
