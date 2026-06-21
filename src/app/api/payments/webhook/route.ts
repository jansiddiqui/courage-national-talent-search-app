/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { NotificationService } from "@/services/NotificationService";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || "";

async function generateSequentialCNTSId(): Promise<string> {
  if (!hasSupabaseAdminConfig) {
    const count = Math.floor(Math.random() * 50) + 10;
    return `CNTS26${String(count).padStart(4, '0')}`;
  }

  try {
    const { count, error } = await (supabaseAdmin as any)
      .from("registrations")
      .select("id", { count: "exact", head: true })
      .not("cnts_id", "is", null);

    if (error) {
      console.error("Error fetching registrations count in webhook:", error);
    }

    let nextIndex = (count || 0) + 1;
    
    while (true) {
      const candidateId = `CNTS26${String(nextIndex).padStart(4, '0')}`;
      const { data } = await (supabaseAdmin as any)
        .from("registrations")
        .select("cnts_id")
        .eq("cnts_id", candidateId)
        .maybeSingle();

      if (!data) {
        return candidateId;
      }
      nextIndex++;
    }
  } catch (e) {
    console.error("Failed to generate sequential CNTS ID in webhook, fallback to random:", e);
    return `CNTS26${String(Math.floor(1000 + Math.random() * 9000))}`;
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (process.env.NODE_ENV === "production" || WEBHOOK_SECRET) {
      if (!signature) {
        return new NextResponse("Missing signature header", { status: 400 });
      }

      const expectedSignature = crypto
        .createHmac("sha256", WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        console.error("[Razorpay Webhook] Signature verification failed");
        return new NextResponse("Invalid signature", { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);
    console.log(`[Razorpay Webhook] Event received: ${event.event}`);

    if (event.event !== "payment.captured") {
      return NextResponse.json({ success: true, message: `Ignored event: ${event.event}` });
    }

    const payment = event.payload.payment?.entity;
    const paymentId = payment?.id;
    const draftRegId = payment?.notes?.draftRegId;

    if (!draftRegId) {
      console.log(`[Razorpay Webhook] No draftRegId associated with payment ${paymentId}. Skipping reconciliation.`);
      return NextResponse.json({ success: true, message: "No draftRegId found in notes" });
    }

    if (!hasSupabaseAdminConfig) {
      console.log(`[Razorpay Webhook Sandbox] Mock capture for registration ${draftRegId}`);
      return NextResponse.json({ success: true, message: "Sandbox processed successfully" });
    }

    // Query current status of registration
    const { data: reg, error: fetchError } = await (supabaseAdmin as any)
      .from("registrations")
      .select("*")
      .eq("registration_id", draftRegId)
      .maybeSingle();

    if (fetchError) {
      console.error("[Razorpay Webhook] Error fetching registration:", fetchError);
      return NextResponse.json({ success: false, error: "Database query failed" }, { status: 500 });
    }

    if (!reg) {
      console.error(`[Razorpay Webhook] Registration ${draftRegId} not found in database.`);
      return NextResponse.json({ success: false, error: "Registration not found" }, { status: 404 });
    }

    // Check if already processed
    if (reg.payment_status === "PAID" || reg.registration_status === "REGISTERED") {
      console.log(`[Razorpay Webhook] Registration ${draftRegId} is already completed/paid. Ending gracefully.`);
      return NextResponse.json({ success: true, message: "Already processed" });
    }

    // Reconcile and finalize candidate registration
    const cntsId = await generateSequentialCNTSId();
    console.log(`[Razorpay Webhook] Finalizing registration ${draftRegId} with CNTS ID: ${cntsId}`);

    const { error: updateError } = await (supabaseAdmin as any)
      .from("registrations")
      .update({
        payment_id: paymentId,
        payment_status: "PAID",
        registration_status: "REGISTERED",
        cnts_id: cntsId,
        mobile_verified: true
      })
      .eq("registration_id", draftRegId);

    if (updateError) {
      console.error("[Razorpay Webhook] Database update failed:", updateError);
      return NextResponse.json({ success: false, error: "Database update failed" }, { status: 500 });
    }

    // Log the event
    await (supabaseAdmin as any).from("registration_events").insert({
      registration_id: draftRegId,
      event_type: "REGISTERED",
      metadata: {
        timestamp: new Date().toISOString(),
        payment_id: paymentId,
        payment_status: "PAID",
        cnts_id: cntsId,
        source: "WEBHOOK"
      }
    });

    // Send notifications
    try {
      const whatsappNumber = reg.whatsapp_number || reg.mobile_number;
      await NotificationService.sendRegistrationSuccess(
        whatsappNumber,
        reg.parent_email || null,
        reg.student_name,
        reg.student_class,
        cntsId
      );

      await NotificationService.sendPaymentSuccess(
        whatsappNumber,
        reg.parent_email || null,
        reg.student_name,
        cntsId,
        paymentId
      );
      console.log(`[Razorpay Webhook] Notifications dispatched successfully for ${cntsId}`);
    } catch (notifyError) {
      console.error("[Razorpay Webhook] Error sending webhook notifications:", notifyError);
    }

    return NextResponse.json({
      success: true,
      message: "Registration finalized and reconciled via webhook successfully",
      cntsId
    });
  } catch (err: any) {
    console.error("[Razorpay Webhook] Endpoint crash:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
