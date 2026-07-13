/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { isRateLimited } from "@/lib/rateLimiter";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";
import { writeAuditEntry } from "@/domains/admin/AdminAuditService";
import { NotificationService } from "@/services/NotificationService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function sanitizeInput(text: string): string {
  if (!text) return "";
  return text.replace(/<[^>]*>/g, "").trim();
}

export async function POST(request: Request, props: { params: Promise<{ reference: string }> }) {
  try {
    const { reference } = await props.params;
    if (!reference) {
      return NextResponse.json({ success: false, message: "Missing ticket reference." }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const { limited } = await isRateLimited(ip, "admin-ticket-replies", 100, 60);
    if (limited) {
      return NextResponse.json({ success: false, message: "Too many requests." }, { status: 429 });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: false, message: "Sandbox active." }, { status: 404 });
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
      return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    }

    const payload = await verifySession(sessionCookie.value, JWT_SECRET);
    if (!payload || !payload.id) {
      return NextResponse.json({ success: false, message: "Forbidden: Admin session required." }, { status: 403 });
    }

    const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id, "support.reply");
    if (!hasPerm) {
      return NextResponse.json({ success: false, message: "Forbidden: support.reply permission required." }, { status: 403 });
    }

    const body = await request.json();
    const { message, is_internal } = body;

    if (!message) {
      return NextResponse.json({ success: false, message: "Reply message cannot be empty." }, { status: 400 });
    }

    const cleanMessage = sanitizeInput(message);
    const isInternalNote = is_internal === true;

    // Resolve ticket ID
    const { data: ticket, error: ticketErr } = await (supabaseAdmin as any)
      .from("support_tickets")
      .select("id, status, first_responded_at, subject, metadata")
      .eq("ticket_number", reference)
      .single();

    if (ticketErr || !ticket) {
      return NextResponse.json({ success: false, message: "Ticket not found." }, { status: 404 });
    }

    const senderId = payload.id;

    // Insert Message
    const { data: createdMsg, error: msgErr } = await (supabaseAdmin as any)
      .from("support_ticket_messages")
      .insert({
        ticket_id: ticket.id,
        sender_id: senderId,
        sender_role: "ADMIN",
        message: cleanMessage,
        is_internal: isInternalNote
      })
      .select("*")
      .single();

    if (msgErr) {
      console.error("[Ticket Reply API] Insert message failed:", msgErr);
      return NextResponse.json({ success: false, message: "Failed to persist response message." }, { status: 500 });
    }

    // Automatically transition ticket to IN_PROGRESS on agent response if it was OPEN
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (!isInternalNote) {
      if (ticket.status === "OPEN") {
        updates.status = "IN_PROGRESS";
      }
      if (!ticket.first_responded_at) {
        updates.first_responded_at = new Date().toISOString();
      }

      // Dispatch Reply Notification
      try {
        const metadata = ticket.metadata || {};
        await NotificationService.sendAgentReplied(
          metadata.phone || null,
          metadata.email || null,
          reference,
          ticket.subject,
          cleanMessage
        );
      } catch (err) {
        console.error("[Ticket Reply API] Notification dispatch error:", err);
      }
    }

    if (Object.keys(updates).length > 1) {
      await (supabaseAdmin as any)
        .from("support_tickets")
        .update(updates)
        .eq("id", ticket.id);
    }

    // Append to audit trail securely using writeAuditEntry
    await writeAuditEntry(supabaseAdmin, {
      actorId: payload.id,
      actorRole: payload.role || "admin",
      action: isInternalNote ? "CREATE_INTERNAL_NOTE" : "CREATE_TICKET_REPLY",
      module: "SUPPORT",
      previousValue: {},
      newValue: {
        message_id: createdMsg.id,
        is_internal: isInternalNote
      },
      ipAddress: ip
    });

    return NextResponse.json({
      success: true,
      message: createdMsg
    }, {
      status: 201,
      headers: {
        "Cache-Control": "private, no-store, no-cache, must-revalidate"
      }
    });

  } catch (error) {
    console.error("[Ticket Reply API] System error:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
