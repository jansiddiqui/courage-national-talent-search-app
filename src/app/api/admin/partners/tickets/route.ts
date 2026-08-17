/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { isRateLimited } from "@/lib/rateLimiter";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";
import { NotificationService } from "@/services/NotificationService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function sanitizeInput(text: string): string {
  if (!text) return "";
  return text.replace(/<[^>]*>/g, "").trim();
}

/**
 * GET /api/admin/partners/tickets
 * Retrieves all partner support tickets for the Admin Partner Management Desk
 */
export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const { limited } = await isRateLimited(ip, "admin-partner-tickets-list", 100, 60);
    if (limited) {
      return NextResponse.json({ success: false, message: "Too many requests." }, { status: 429 });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, tickets: [], stats: { total: 0, open: 0, resolved: 0 } });
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
      return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    }

    const payload = await verifySession(sessionCookie.value, JWT_SECRET);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN" && payload.role !== "admin")) {
      return NextResponse.json({ success: false, message: "Forbidden: Admin session required." }, { status: 403 });
    }

    const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id || payload.email || payload.phone || "admin", "partners.view");
    if (!hasPerm) {
      return NextResponse.json({ success: false, message: "Forbidden: partners.view permission required." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const search = searchParams.get("search");

    // Query support_tickets specifically for partners
    let query = (supabaseAdmin as any)
      .from("support_tickets")
      .select("*, assigned_agent:assigned_to(id, name, email)")
      .or("requester_role.eq.PARTNER,category.eq.PARTNER,metadata->>referral_code.neq.null");

    if (statusFilter && statusFilter !== "ALL") {
      query = query.eq("status", statusFilter.toUpperCase());
    }

    if (search) {
      query = query.or(`ticket_number.ilike.%${search}%,subject.ilike.%${search}%,description.ilike.%${search}%,metadata->>referral_code.ilike.%${search}%,metadata->>partner_name.ilike.%${search}%`);
    }

    query = query.order("created_at", { ascending: false }).limit(100);

    const { data: tickets, error } = await query;

    if (error) {
      console.error("[Admin Partner Tickets API error]:", error);
      return NextResponse.json({ success: false, message: "Database query failed." }, { status: 500 });
    }

    // Fetch messages timeline for each ticket
    const formattedTickets = await Promise.all(
      (tickets || []).map(async (t: any) => {
        const { data: messages } = await (supabaseAdmin as any)
          .from("support_ticket_messages")
          .select("id, sender_role, message, created_at, is_internal")
          .eq("ticket_id", t.id)
          .order("created_at", { ascending: true });

        return {
          id: t.id,
          ticketNumber: t.ticket_number,
          subject: t.subject,
          description: t.description,
          status: t.status,
          priority: t.priority,
          category: t.category,
          slaState: t.sla_state,
          createdAt: t.created_at,
          updatedAt: t.updated_at,
          firstResponseDueAt: t.first_response_due_at,
          resolutionDueAt: t.resolution_due_at,
          partnerName: t.metadata?.partner_name || "Courage Partner",
          referralCode: t.metadata?.referral_code || "PARTNER",
          topic: t.metadata?.topic || "General Partner Support",
          email: t.metadata?.email || "",
          phone: t.metadata?.phone || "",
          messages: messages || []
        };
      })
    );

    const total = formattedTickets.length;
    const open = formattedTickets.filter((t: any) => t.status === "OPEN" || t.status === "IN_PROGRESS").length;
    const resolved = formattedTickets.filter((t: any) => t.status === "RESOLVED" || t.status === "CLOSED").length;

    return NextResponse.json({
      success: true,
      tickets: formattedTickets,
      stats: { total, open, resolved }
    }, {
      headers: {
        "Cache-Control": "private, no-store, no-cache, must-revalidate"
      }
    });

  } catch (error: any) {
    console.error("[GET /api/admin/partners/tickets error]:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}

/**
 * POST /api/admin/partners/tickets
 * Admin sends a reply to a partner ticket and optionally updates status
 */
export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const { limited } = await isRateLimited(ip, "admin-partner-ticket-reply", 60, 60);
    if (limited) {
      return NextResponse.json({ success: false, message: "Too many requests." }, { status: 429 });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, message: "Sandbox reply logged." });
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
      return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    }

    const payload = await verifySession(sessionCookie.value, JWT_SECRET);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN" && payload.role !== "admin")) {
      return NextResponse.json({ success: false, message: "Forbidden: Admin session required." }, { status: 403 });
    }

    const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id || payload.email || payload.phone || "admin", "partners.edit");
    if (!hasPerm) {
      return NextResponse.json({ success: false, message: "Forbidden: partners.edit permission required." }, { status: 403 });
    }

    const body = await request.json();
    const { ticketId, ticketNumber, message, newStatus, referralCode, partnerName } = body;

    if (!ticketId && !ticketNumber) {
      return NextResponse.json({ success: false, message: "Missing ticket identifier." }, { status: 400 });
    }

    // 1. Fetch ticket to verify existence
    let ticketQuery = (supabaseAdmin as any).from("support_tickets").select("*");
    if (ticketId) {
      ticketQuery = ticketQuery.eq("id", ticketId);
    } else {
      ticketQuery = ticketQuery.eq("ticket_number", ticketNumber);
    }

    const { data: ticket, error: fetchErr } = await ticketQuery.single();
    if (fetchErr || !ticket) {
      return NextResponse.json({ success: false, message: "Support ticket not found." }, { status: 404 });
    }

    const now = new Date().toISOString();
    const cleanMessage = sanitizeInput(message || "");
    const updatedStatus = newStatus || (ticket.status === "OPEN" ? "IN_PROGRESS" : ticket.status);

    // 2. Insert Admin Message if reply message provided
    if (cleanMessage) {
      const { error: msgErr } = await (supabaseAdmin as any)
        .from("support_ticket_messages")
        .insert({
          ticket_id: ticket.id,
          sender_id: payload.id || payload.email || "ADMIN",
          sender_role: "ADMIN",
          message: cleanMessage,
          is_internal: false
        });

      if (msgErr) {
        console.error("[Admin Partner Ticket Reply Error]:", msgErr);
      }
    }

    // 3. Update Ticket Status
    const updatePayload: any = {
      status: updatedStatus,
      updated_at: now
    };

    if (updatedStatus === "RESOLVED" || updatedStatus === "CLOSED") {
      updatePayload.resolved_at = now;
      updatePayload.sla_state = "RESOLVED";
    }

    await (supabaseAdmin as any)
      .from("support_tickets")
      .update(updatePayload)
      .eq("id", ticket.id);

    // 4. Send Instant Inbox Notification to Partner (Non-blocking)
    const targetRefCode = referralCode || ticket.metadata?.referral_code || "PARTNER";
    const partnerFullName = partnerName || ticket.metadata?.partner_name || "Partner";

    try {
      await (supabaseAdmin as any)
        .from("partner_notifications")
        .insert({
          partner_id: ticket.requester_id || targetRefCode,
          referral_code: targetRefCode,
          sender: "Courage Partner Helpdesk",
          title: `Update on Support Ticket #${ticket.ticket_number}`,
          preview: cleanMessage ? `Helpdesk response: ${cleanMessage.slice(0, 80)}...` : `Ticket status updated to ${updatedStatus}`,
          full_body: `Dear ${partnerFullName},\n\nOur Partner Support team has updated your ticket (${ticket.ticket_number}).\n\nSubject: ${ticket.subject}\nStatus: ${updatedStatus}\n${cleanMessage ? `\nHelpdesk Reply:\n"${cleanMessage}"\n` : ''}\nIf you have further questions, you can continue the thread in your Support Center tab.\n\nWarm regards,\nCourage Partner Operations`,
          category: "System",
          is_read: false
        });
    } catch (notifErr) {
      console.error("[Partner Ticket Admin Notification Error]:", notifErr);
    }

    // 5. Send Email Notification to Partner
    if (cleanMessage) {
      try {
        let partnerEmail = ticket.metadata?.email;
        let partnerPhone = ticket.metadata?.phone;

        // If email is missing or a placeholder domain, fetch from partner_applications
        if (!partnerEmail || partnerEmail.includes("couragetalent.org")) {
          const { data: partnerApp } = await (supabaseAdmin as any)
            .from("partner_applications")
            .select("email, phone")
            .or(`id.eq.${ticket.requester_id},referral_code.eq.${targetRefCode}`)
            .maybeSingle();

          if (partnerApp) {
            partnerEmail = partnerApp.email || partnerEmail;
            partnerPhone = partnerApp.phone || partnerPhone;
          }
        }

        if (partnerEmail) {
          await NotificationService.sendAgentReplied(
            partnerPhone || null,
            partnerEmail,
            ticket.ticket_number,
            ticket.subject,
            cleanMessage
          );
        }
      } catch (emailErr) {
        console.error("[Partner Ticket Admin Email Dispatch Error]:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Ticket updated and reply dispatched to partner successfully.",
      status: updatedStatus
    });

  } catch (error: any) {
    console.error("[POST /api/admin/partners/tickets error]:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}
