/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { isRateLimited } from "@/lib/rateLimiter";
import { NotificationService } from "@/services/NotificationService";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function POST(request: Request, props: { params: Promise<{ notificationId: string }> }) {
  try {
    const { notificationId } = await props.params;
    if (!notificationId) {
      return NextResponse.json({ success: false, message: "Missing notification ID." }, { status: 400 });
    }

    if (!JWT_SECRET) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY environment variable is required.");
    }

    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const { limited } = await isRateLimited(ip, "admin-notification-retry", 50, 60);
    if (limited) {
      return NextResponse.json({ success: false, message: "Too many requests." }, { status: 429 });
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifySession(sessionCookie.value, JWT_SECRET);
    if (!payload) {
      return NextResponse.json({ success: false, message: "Session expired or invalid" }, { status: 401 });
    }

    const role = payload.role;
    if (role !== "ADMIN" && role !== "SUPER_ADMIN" && role !== "VOLUNTEER") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin access required." }, { status: 403 });
    }

    // Fetch the target notification job
    const { data: job, error: jobErr } = await (supabaseAdmin as any)
      .from("notification_jobs")
      .select("*")
      .eq("id", notificationId)
      .single();

    if (jobErr || !job) {
      return NextResponse.json({ success: false, message: "Notification job not found." }, { status: 404 });
    }

    // Set status to PENDING and attempts to 0 to prepare for retry execution
    await (supabaseAdmin as any)
      .from("notification_jobs")
      .update({
        status: "PENDING",
        attempts: 0,
        error_message: null,
        updated_at: new Date().toISOString()
      })
      .eq("id", notificationId);

    // Execute the job immediately
    const success = await NotificationService.executeJob(notificationId);

    // Audit the manual retry action
    const actorId = payload.userId || payload.email || "ADMIN";
    await (supabaseAdmin as any)
      .from("admin_operations_audit_trail")
      .insert({
        actor_id: actorId,
        action: "RETRY_NOTIFICATION_JOB",
        target_id: notificationId,
        details: {
          channel: job.channel,
          template_name: job.template_name,
          success
        }
      });

    return NextResponse.json({
      success,
      message: success ? "Notification retried successfully." : "Retry failed. Checked logs."
    }, {
      headers: {
        "Cache-Control": "private, no-store, no-cache, must-revalidate"
      }
    });

  } catch (error) {
    console.error("[Notification Retry API] Server error:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
