/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AdminNotificationService
 * Phase 9: Truthful notification provider/job states.
 *
 * Instead of immediately marking notifications as "SENT" (a lie),
 * we now enqueue them as PENDING background jobs and record them
 * in whatsapp_logs with status = "QUEUED".
 *
 * The actual delivery is handled by the worker at /api/admin/jobs/worker,
 * which will update the log status to SENT/FAILED based on the real
 * provider (Meta API / Brevo) response.
 */

export interface BroadcastCampaignParams {
  audience: string;
  templateName: string;
  channel: string;
  actorId: string;
}

export interface BroadcastResult {
  queued: number;
  jobId?: string;
}

export async function createBroadcastCampaign(
  supabaseAdmin: any,
  params: BroadcastCampaignParams
): Promise<BroadcastResult> {
  let query = supabaseAdmin.from("registrations").select("*");

  if (params.audience.startsWith("CLASS_")) {
    const cls = params.audience.replace("CLASS_", "");
    query = query.eq("student_class", cls);
  } else if (params.audience === "PAID") {
    query = query.eq("registration_status", "REGISTERED");
  }

  const { data: candidates, error } = await query;
  if (error) throw new Error(`Database query error: ${error.message}`);
  if (!candidates || candidates.length === 0) return { queued: 0 };

  // Phase 9: write QUEUED log entries (not SENT — we haven't sent anything yet)
  const logsToInsert = candidates.map((cand: any) => {
    const phone = cand.whatsapp_number || cand.parent_phone || "919999999999";
    const masked = phone.slice(0, 3) + "******" + phone.slice(-2);
    return {
      phone_number_masked: masked,
      message_type: `${params.templateName}_BROADCAST_${params.channel}`,
      status: "QUEUED",          // truthful: not yet delivered
      meta_message_id: null,     // will be filled by worker after delivery
    };
  });

  const { error: insertErr } = await supabaseAdmin
    .from("whatsapp_logs")
    .insert(logsToInsert);

  if (insertErr) throw new Error(`Failed to write notification logs: ${insertErr.message}`);

  // Enqueue a background job for the actual send operation
  const { data: job, error: jobErr } = await supabaseAdmin
    .from("admin_background_jobs")
    .insert({
      job_type: params.channel === "EMAIL" ? "SEND_EMAIL_BROADCAST" : "SEND_WHATSAPP_BROADCAST",
      status: "PENDING",
      payload: {
        audience: params.audience,
        templateName: params.templateName,
        channel: params.channel,
        recipientCount: candidates.length,
        actorId: params.actorId,
      },
      next_retry_at: new Date().toISOString(),
      max_attempts: 3,
      attempts: 0,
    })
    .select("id")
    .single();

  if (jobErr) {
    console.error("[AdminNotificationService] Failed to enqueue broadcast job:", jobErr.message);
    // Return partial success — logs are queued even if job enqueue fails
    return { queued: candidates.length };
  }

  return { queued: candidates.length, jobId: job?.id };
}
