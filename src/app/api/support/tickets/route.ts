/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { isRateLimited } from "@/lib/rateLimiter";
import { NotificationService } from "@/services/NotificationService";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Simple HTML/script tag sanitizer helper
function sanitizeInput(text: string): string {
  if (!text) return "";
  return text.replace(/<[^>]*>/g, "").trim();
}

export async function POST(request: Request) {
  try {
    // 1. Content-Type Check
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ success: false, message: "Unsupported Media Type: Must be JSON." }, { status: 415 });
    }

    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

    // 2. Throttling Rate Limiter Check
    const { limited } = await isRateLimited(ip, "ticket-creation", 10, 60);
    if (limited) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { 
          status: 429,
          headers: {
            "Cache-Control": "private, no-store, no-cache, must-revalidate"
          }
        }
      );
    }

    // 3. Payload size check
    const rawBody = await request.text();
    if (rawBody.length > 20000) {
      return NextResponse.json({ success: false, message: "Payload too large: Limit is 20KB." }, { status: 413 });
    }

    const body = JSON.parse(rawBody);
    const { name, email, phone, subject, message, category } = body;

    // 4. Server-Side Fields Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, message: "Missing required fields: name, email, subject, message." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: "Invalid email address format." }, { status: 400 });
    }

    const cleanName = sanitizeInput(name);
    const cleanEmail = sanitizeInput(email);
    const cleanSubject = sanitizeInput(subject);
    const cleanMessage = sanitizeInput(message);
    const cleanPhone = phone ? sanitizeInput(phone) : null;
    const rawCategory = category ? sanitizeInput(category) : "GENERAL";

    // Allowed categories check
    const allowedCategories = ["REGISTRATION", "PAYMENT", "EXAM", "RESULT", "CERTIFICATE", "SCHOOL", "ACCOUNT", "TECHNICAL", "GENERAL"];
    const resolvedCategory = allowedCategories.includes(rawCategory.toUpperCase()) ? rawCategory.toUpperCase() : "GENERAL";

    // Priority configuration
    let priority = "MEDIUM";
    if (resolvedCategory === "PAYMENT") {
      priority = "HIGH";
    } else if (resolvedCategory === "GENERAL") {
      priority = "LOW";
    }

    if (hasSupabaseAdminConfig) {
      // 5. Auth identity resolution
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get("cnts_session");

      let requesterId = "ANON";
      let requesterRole = "PUBLIC";

      if (sessionCookie && sessionCookie.value && JWT_SECRET) {
        try {
          const payload = await verifySession(sessionCookie.value, JWT_SECRET);
          if (payload) {
            requesterId = payload.userId || payload.email || "PARENT-USER";
            requesterRole = payload.role === "admin" ? "ADMIN" : "PARENT";
          }
        } catch (err) {
          console.error("[Ticket API] Session verification error:", err);
        }
      }

      // Generate unique ticket identifier reference: CNTS-SUP-YYMMDD-XXXX
      const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
      const randStr = Math.random().toString(36).substring(2, 6).toUpperCase();
      const ticketNumber = `CNTS-SUP-${dateStr}-${randStr}`;

      // Resolve SLA policy hours
      let responseHours = 12;
      let resolutionHours = 48;

      if (priority === "CRITICAL" || priority === "HIGH") {
        responseHours = 2;
        resolutionHours = 24;
      } else if (priority === "LOW") {
        responseHours = 24;
        resolutionHours = 72;
      }

      try {
        const { data: policy } = await (supabaseAdmin as any)
          .from("support_sla_policies")
          .select("response_time_hours, resolution_time_hours")
          .eq("category", resolvedCategory)
          .eq("priority", priority)
          .eq("is_active", true)
          .single();

        if (policy) {
          responseHours = policy.response_time_hours;
          resolutionHours = policy.resolution_time_hours;
        }
      } catch (err) {
        // Fallback to defaults
      }

      const now = new Date();
      const firstResponseDue = new Date(now.getTime() + responseHours * 60 * 60 * 1000).toISOString();
      const resolutionDue = new Date(now.getTime() + resolutionHours * 60 * 60 * 1000).toISOString();

      // 6. DB transaction writes equivalents
      // Write Support Ticket
      const { data: ticket, error: ticketErr } = await (supabaseAdmin as any)
        .from("support_tickets")
        .insert({
          ticket_number: ticketNumber,
          requester_id: requesterId,
          requester_role: requesterRole,
          category: resolvedCategory,
          priority: priority,
          status: "OPEN",
          subject: cleanSubject,
          description: cleanMessage,
          first_response_due_at: firstResponseDue,
          resolution_due_at: resolutionDue,
          sla_state: "ON_TRACK",
          metadata: {
            ip_address: ip,
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone
          }
        })
        .select("id")
        .single();

      if (ticketErr) {
        console.error("[Ticket API] Ticket insert error:", ticketErr);
        return NextResponse.json({ success: false, message: "Unable to create support ticket." }, { status: 500 });
      }

      // Write Initial Message Conversation
      const { error: msgErr } = await (supabaseAdmin as any)
        .from("support_ticket_messages")
        .insert({
          ticket_id: ticket.id,
          sender_id: requesterId,
          sender_role: requesterRole,
          message: cleanMessage
        });

      if (msgErr) {
        console.error("[Ticket API] Message insert error:", msgErr);
        // Rollback ticket insert
        await (supabaseAdmin as any).from("support_tickets").delete().eq("id", ticket.id);
        return NextResponse.json({ success: false, message: "Unable to create support ticket message." }, { status: 500 });
      }

      // Dual-write legacy contact_messages entry for backward compatibility admin panel lists
      const { error: legacyErr } = await (supabaseAdmin as any)
        .from("contact_messages")
        .insert({
          id: ticket.id, // Keep IDs identical to aid trace metrics
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          subject: cleanSubject,
          message: cleanMessage
        });

      if (legacyErr) {
        console.error("[Ticket API] Legacy dual-write error:", legacyErr);
      }

      // Enqueue Support Ticket Created Acknowledgement
      try {
        await NotificationService.sendTicketCreated(
          cleanPhone || null,
          cleanEmail,
          cleanName,
          ticketNumber,
          cleanSubject,
          cleanMessage
        );
      } catch (err) {
        console.error("[Ticket API] Failed to enqueue ticket creation notification:", err);
      }

      return NextResponse.json({
        success: true,
        ticket: {
          reference: ticketNumber,
          status: "OPEN",
          createdAt: new Date().toISOString()
        }
      }, {
        status: 201,
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      });
    }

    // Sandbox Mock response
    return NextResponse.json({
      success: true,
      ticket: {
        reference: "CNTS-SUP-DEMO-001",
        status: "OPEN",
        createdAt: new Date().toISOString()
      }
    }, {
      status: 201,
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });

  } catch (error: any) {
    console.error("[Ticket API] System error handler:", error);
    return NextResponse.json({ success: false, message: "Unable to complete support ticket creation." }, { status: 500 });
  }
}
