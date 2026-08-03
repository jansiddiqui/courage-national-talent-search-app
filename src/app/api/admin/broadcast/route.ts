/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { createBroadcastCampaign } from "@/domains/admin/AdminNotificationService";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";
import { writeAuditEntry } from "@/domains/admin/AdminAuditService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
      return NextResponse.json({ success: false, message: "Authentication session required." }, { status: 401 });
    }

    const payload = await verifySession(sessionCookie.value, JWT_SECRET);
    if (!payload || (!payload.id && !payload.email && !payload.phone)) {
      return NextResponse.json({ success: false, message: "Forbidden: Admin session required." }, { status: 403 });
    }

    const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id || payload.email || payload.phone, "notification.broadcast");
    if (!hasPerm) {
      return NextResponse.json({ success: false, message: "Forbidden: notification.broadcast permission required." }, { status: 403 });
    }

    const body = await request.json();
    const { 
      audience, 
      templateName, 
      channel, 
      recipientPhone, 
      principalName, 
      meetingTime, 
      schoolName, 
      meetingMode, 
      meetingLink 
    } = body;

    if (!audience || !templateName || !channel) {
      return NextResponse.json({ success: false, message: "Missing audience, templateName, or channel parameters" }, { status: 400 });
    }

    // 1-ON-1 INSTANT WHATSAPP MEETING CONFIRMATION DISPATCH
    if (audience === "INDIVIDUAL_PRINCIPAL" || templateName === "MEETING_CONFIRMATION" || templateName === "school_meeting_confirmation") {
      const { whatsappService } = await import("@/services/whatsappService");
      const targetPhone = recipientPhone || "8707884735";
      
      const sent = await whatsappService.sendSchoolMeetingConfirmation(
        targetPhone,
        principalName || "Dr. R. K. Sharma",
        meetingTime || "Today at 7:00 PM",
        schoolName || "Delhi Public School, Lucknow",
        meetingMode || "Google Meet",
        meetingLink || "https://meet.google.com/qzz-gykt-msm"
      );

      await writeAuditEntry(supabaseAdmin, {
        actorId: payload.id,
        actorRole: payload.role || "admin",
        action: "DISPATCHED_INSTANT_WHATSAPP",
        module: "COMMUNICATIONS",
        previousValue: {},
        newValue: { targetPhone, templateName: "school_meeting_confirmation", sent },
        ipAddress: request.headers.get("x-forwarded-for") || "unknown"
      });

      return NextResponse.json({ 
        success: sent, 
        status: sent ? "SENT" : "FAILED", 
        recipientPhone: targetPhone,
        message: sent ? `Meta WhatsApp Template dispatched to ${targetPhone}` : "Meta API dispatch failed. Check WHATSAPP_ACCESS_TOKEN in .env.local"
      });
    }

    if (hasSupabaseAdminConfig) {
      const { queued, jobId } = await createBroadcastCampaign(supabaseAdmin, {
        audience,
        templateName,
        channel,
        actorId: payload.id
      });

      // Write action to audit trail using writeAuditEntry
      await writeAuditEntry(supabaseAdmin, {
        actorId: payload.id,
        actorRole: payload.role || "admin",
        action: "QUEUED_BROADCAST",
        module: "COMMUNICATIONS",
        previousValue: {},
        newValue: { audience, templateName, channel, queued, jobId },
        ipAddress: request.headers.get("x-forwarded-for") || "unknown"
      });

      return NextResponse.json({ success: true, queued, jobId });
    }

    // Sandbox Mock response
    return NextResponse.json({ success: true, sentCount: 15 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
