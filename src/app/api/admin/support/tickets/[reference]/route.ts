/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { isRateLimited } from "@/lib/rateLimiter";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";
import { writeAuditEntry } from "@/domains/admin/AdminAuditService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function GET(request: Request, props: { params: Promise<{ reference: string }> }) {
  try {
    const { reference } = await props.params;
    if (!reference) {
      return NextResponse.json({ success: false, message: "Missing ticket reference." }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const { limited } = await isRateLimited(ip, "admin-ticket-details", 100, 60);
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
    if (!payload || (!payload.id && !payload.email)) {
      return NextResponse.json({ success: false, message: "Forbidden: Admin session required." }, { status: 403 });
    }

    const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id || payload.email, "support.view");
    if (!hasPerm) {
      return NextResponse.json({ success: false, message: "Forbidden: support.view permission required." }, { status: 403 });
    }

    // Fetch support ticket
    const { data: ticket, error: ticketErr } = await (supabaseAdmin as any)
      .from("support_tickets")
      .select("*, assigned_agent:assigned_to(id, name, email)")
      .eq("ticket_number", reference)
      .single();

    if (ticketErr || !ticket) {
      return NextResponse.json({ success: false, message: "Ticket not found." }, { status: 404 });
    }

    // Fetch related messages
    const { data: messages, error: msgErr } = await (supabaseAdmin as any)
      .from("support_ticket_messages")
      .select("*")
      .eq("ticket_id", ticket.id)
      .order("created_at", { ascending: true });

    if (msgErr) {
      console.error("[Ticket Detail API] Messages query error:", msgErr);
      return NextResponse.json({ success: false, message: "Unable to retrieve ticket timeline." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      ticket,
      messages: messages || []
    }, {
      headers: {
        "Cache-Control": "private, no-store, no-cache, must-revalidate"
      }
    });

  } catch (error) {
    console.error("[Ticket Detail API] System error:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}

export async function PATCH(request: Request, props: { params: Promise<{ reference: string }> }) {
  try {
    const { reference } = await props.params;
    if (!reference) {
      return NextResponse.json({ success: false, message: "Missing ticket reference." }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const { limited } = await isRateLimited(ip, "admin-ticket-update", 100, 60);
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
    if (!payload || (!payload.id && !payload.email)) {
      return NextResponse.json({ success: false, message: "Forbidden: Admin session required." }, { status: 403 });
    }

    const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id || payload.email, "support.edit");
    if (!hasPerm) {
      return NextResponse.json({ success: false, message: "Forbidden: support.edit permission required." }, { status: 403 });
    }

    const body = await request.json();
    const { status, priority, assigned_to } = body;

    const { data: ticket, error: ticketErr } = await (supabaseAdmin as any)
      .from("support_tickets")
      .select("id, status, priority, assigned_to, metadata")
      .eq("ticket_number", reference)
      .single();

    if (ticketErr || !ticket) {
      return NextResponse.json({ success: false, message: "Ticket not found." }, { status: 404 });
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    // Transitions and validation mapping
    if (status) {
      const allowedStatus = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
      const upperStatus = status.toUpperCase();
      if (!allowedStatus.includes(upperStatus)) {
        return NextResponse.json({ success: false, message: "Invalid status value." }, { status: 400 });
      }
      updates.status = upperStatus;

      if (upperStatus === "RESOLVED") {
        updates.resolved_at = new Date().toISOString();
        updates.sla_state = "MET";
      } else if (upperStatus === "CLOSED") {
        updates.sla_state = "CLOSED";
      } else if (ticket.status === "RESOLVED" || ticket.status === "CLOSED") {
        // Reopened ticket
        updates.resolved_at = null;
        updates.sla_state = "ACTIVE";
      }
    }

    if (priority) {
      const allowedPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
      const upperPriority = priority.toUpperCase();
      if (!allowedPriorities.includes(upperPriority)) {
        return NextResponse.json({ success: false, message: "Invalid priority value." }, { status: 400 });
      }
      updates.priority = upperPriority;
    }

    if (assigned_to !== undefined) {
      updates.assigned_to = assigned_to;
    }

    const { error: updateErr } = await (supabaseAdmin as any)
      .from("support_tickets")
      .update(updates)
      .eq("id", ticket.id);

    if (updateErr) {
      console.error("[Ticket Update API] update error:", updateErr);
      return NextResponse.json({ success: false, message: "Failed to update ticket properties." }, { status: 500 });
    }

    // Write audit trail log securely using centralized writeAuditEntry
    await writeAuditEntry(supabaseAdmin, {
      actorId: payload.id,
      actorRole: payload.role || "admin",
      action: "UPDATE_SUPPORT_TICKET",
      module: "SUPPORT",
      previousValue: {
        status: ticket.status,
        priority: ticket.priority,
        assigned_to: ticket.assigned_to
      },
      newValue: updates,
      ipAddress: ip
    });

    return NextResponse.json({ success: true, message: "Ticket updated successfully." });

  } catch (error) {
    console.error("[Ticket Update API] System error:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
