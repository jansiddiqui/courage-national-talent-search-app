/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { whatsappService } from "@/services/whatsappService";
import crypto from "crypto";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "cnts_whatsapp_verify_token_2026";
const APP_SECRET = process.env.WHATSAPP_APP_SECRET || "";

/**
 * GET Handler - Meta Webhook Verification (Handshake)
 * Meta calls this endpoint with hub.mode, hub.verify_token, and hub.challenge
 * to verify ownership when registering the webhook URL in Meta App Dashboard.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("[WhatsApp Webhook GET] Handshake verification successful!");
      return new NextResponse(challenge, {
        status: 200,
        headers: { "Content-Type": "text/plain" }
      });
    }

    console.warn(`[WhatsApp Webhook GET] Handshake failed. Expected token mismatch.`);
    return NextResponse.json(
      { success: false, message: "Forbidden: Verification token mismatch" },
      { status: 403 }
    );
  } catch (err: any) {
    console.error("[WhatsApp Webhook GET] Exception during verification:", err);
    return NextResponse.json(
      { success: false, message: "Verification error" },
      { status: 500 }
    );
  }
}

/**
 * POST Handler - Meta Status & Message Callback Receiver
 * Meta posts real-time events for message statuses (sent, delivered, read, failed).
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    // 1. Optional HMAC Signature Verification
    if (APP_SECRET) {
      const signature = request.headers.get("x-hub-signature-256");
      if (!signature) {
        console.warn("[WhatsApp Webhook POST] Missing X-Hub-Signature-256 header");
        return NextResponse.json({ success: false, message: "Missing signature" }, { status: 401 });
      }

      const expectedSignature = "sha256=" + crypto.createHmac("sha256", APP_SECRET).update(rawBody).digest("hex");
      if (signature !== expectedSignature) {
        console.warn("[WhatsApp Webhook POST] Invalid X-Hub-Signature-256 signature");
        return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 401 });
      }
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      console.error("[WhatsApp Webhook POST] Malformed JSON payload received");
      return NextResponse.json({ success: true, message: "Ignored malformed payload" });
    }

    // 2. Filter for WhatsApp Business Account notifications
    if (payload.object !== "whatsapp_business_account") {
      return NextResponse.json({ success: true, message: "Ignored non-whatsapp object" });
    }

    const entries = payload.entry || [];
    let processedCount = 0;
    let updatedCount = 0;

    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        if (change.field !== "messages") continue;

        const value = change.value || {};
        const statuses = value.statuses || [];

        for (const statusObj of statuses) {
          processedCount++;
          const wamid = statusObj.id;
          const rawStatus = statusObj.status;
          const timestamp = statusObj.timestamp 
            ? new Date(parseInt(statusObj.timestamp) * 1000).toISOString() 
            : new Date().toISOString();
          const errors = statusObj.errors;

          if (!wamid) {
            console.warn("[WhatsApp Webhook POST] Missing WAMID in status object");
            continue;
          }

          console.log(`[WhatsApp Webhook POST] Received status callback: WAMID=${wamid}, Status=${rawStatus}`);

          const updated = await whatsappService.updateStatusByWamid(
            wamid,
            rawStatus,
            timestamp,
            errors
          );

          if (updated) {
            updatedCount++;
          }
        }
      }
    }

    // Always respond with 200 OK to acknowledge receipt to Meta
    return NextResponse.json({
      success: true,
      processedCount,
      updatedCount
    }, { status: 200 });

  } catch (err: any) {
    console.error("[WhatsApp Webhook POST] Unexpected error processing callback:", err.message || err);
    return NextResponse.json({ success: true, message: "Acknowledged with error logging" }, { status: 200 });
  }
}
