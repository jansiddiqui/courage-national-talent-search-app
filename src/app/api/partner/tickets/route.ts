/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { isRateLimited } from "@/lib/rateLimiter";

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const JWT_SECRET = SERVICE_KEY || "partner-session-secret-key";

function sanitizeInput(text: string): string {
  if (!text) return "";
  return text.replace(/<[^>]*>/g, "").trim();
}

/**
 * POST /api/partner/tickets
 * Raises a real support ticket from the Partner Dashboard
 */
export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const { limited } = await isRateLimited(ip, "partner-ticket-create", 10, 60);
    if (limited) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please wait a minute." },
        { status: 429 }
      );
    }

    const rawBody = await request.text();
    if (rawBody.length > 20000) {
      return NextResponse.json({ success: false, message: "Payload too large." }, { status: 413 });
    }

    const body = JSON.parse(rawBody);
    const { topic, subject, message, partnerName, referralCode, email, phone } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, message: "Subject and message are required." },
        { status: 400 }
      );
    }

    // 1. Resolve Partner Identity from session if present
    const cookieStore = await cookies();
    const partnerCookie = cookieStore.get("cnts_partner_session");
    let partnerSession: any = null;

    if (partnerCookie?.value) {
      partnerSession = await verifySession(partnerCookie.value, JWT_SECRET);
    }

    const activePartnerName = sanitizeInput(partnerSession?.fullName || partnerName || "Courage Partner");
    const activeRefCode = sanitizeInput(partnerSession?.referralCode || referralCode || "PARTNER").toUpperCase();
    const activeEmail = sanitizeInput(partnerSession?.email || email || `${activeRefCode.toLowerCase()}@partner.couragetalent.org`);
    const activePhone = sanitizeInput(partnerSession?.phone || phone || "");
    const cleanSubject = sanitizeInput(subject);
    const cleanMessage = sanitizeInput(message);
    const cleanTopic = sanitizeInput(topic || "General Partner Support");

    // Priority based on topic
    let priority = "MEDIUM";
    if (cleanTopic.toLowerCase().includes("payout") || cleanTopic.toLowerCase().includes("settlement")) {
      priority = "HIGH";
    } else if (cleanTopic.toLowerCase().includes("school") || cleanTopic.toLowerCase().includes("verification")) {
      priority = "HIGH";
    }

    // Generate unique partner ticket number: CNTS-PRT-YYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const randStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const ticketNumber = `CNTS-PRT-${dateStr}-${randStr}`;

    const now = new Date();
    const responseDueHours = priority === "HIGH" ? 4 : 12;
    const resolutionDueHours = priority === "HIGH" ? 24 : 48;
    const firstResponseDue = new Date(now.getTime() + responseDueHours * 60 * 60 * 1000).toISOString();
    const resolutionDue = new Date(now.getTime() + resolutionDueHours * 60 * 60 * 1000).toISOString();

    if (hasSupabaseAdminConfig) {
      // 2. Insert into support_tickets
      const { data: ticket, error: ticketErr } = await (supabaseAdmin as any)
        .from("support_tickets")
        .insert({
          ticket_number: ticketNumber,
          requester_id: partnerSession?.partnerDbId || activeRefCode,
          requester_role: "PARTNER",
          category: "PARTNER",
          priority: priority,
          status: "OPEN",
          subject: `[Partner ${activeRefCode}] ${cleanSubject}`,
          description: cleanMessage,
          first_response_due_at: firstResponseDue,
          resolution_due_at: resolutionDue,
          sla_state: "ON_TRACK",
          metadata: {
            partner_name: activePartnerName,
            referral_code: activeRefCode,
            topic: cleanTopic,
            email: activeEmail,
            phone: activePhone,
            ip_address: ip,
            source: "partner_dashboard"
          }
        })
        .select("id, ticket_number, created_at, status")
        .single();

      if (ticketErr) {
        console.error("[Partner Ticket Create Error]:", ticketErr);
        return NextResponse.json({ success: false, message: "Database insert failed." }, { status: 500 });
      }

      // 3. Insert initial message
      await (supabaseAdmin as any)
        .from("support_ticket_messages")
        .insert({
          ticket_id: ticket.id,
          sender_id: partnerSession?.partnerDbId || activeRefCode,
          sender_role: "PARTNER",
          message: cleanMessage
        });

      // 4. Dual write to contact_messages for legacy visibility
      try {
        await (supabaseAdmin as any)
          .from("contact_messages")
          .insert({
            id: ticket.id,
            name: `${activePartnerName} (Partner: ${activeRefCode})`,
            email: activeEmail,
            phone: activePhone,
            subject: `[Partner Support - ${cleanTopic}] ${cleanSubject}`,
            message: cleanMessage,
            status: "PENDING"
          });
      } catch (legacyErr) {
        console.error("[Partner Ticket Legacy Dual-Write]:", legacyErr);
      }

      return NextResponse.json({
        success: true,
        ticket: {
          id: ticket.id,
          ticketNumber: ticket.ticket_number,
          subject: cleanSubject,
          topic: cleanTopic,
          status: ticket.status,
          createdAt: ticket.created_at,
          estimatedResponseHours: responseDueHours
        },
        message: "Support ticket created successfully."
      });
    }

    // Sandbox / Mock fallback
    return NextResponse.json({
      success: true,
      ticket: {
        id: `mock-${ticketNumber}`,
        ticketNumber: ticketNumber,
        subject: cleanSubject,
        topic: cleanTopic,
        status: "OPEN",
        createdAt: now.toISOString(),
        estimatedResponseHours: responseDueHours
      },
      message: "Support ticket created successfully."
    });

  } catch (error: any) {
    console.error("[POST /api/partner/tickets error]:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}

/**
 * GET /api/partner/tickets
 * Fetches tickets submitted by the partner
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryRefCode = searchParams.get("referralCode");

    const cookieStore = await cookies();
    const partnerCookie = cookieStore.get("cnts_partner_session");
    let partnerSession: any = null;

    if (partnerCookie?.value) {
      partnerSession = await verifySession(partnerCookie.value, JWT_SECRET);
    }

    const refCode = (partnerSession?.referralCode || queryRefCode || "").trim().toUpperCase();

    if (!refCode) {
      return NextResponse.json({ success: true, tickets: [] });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, tickets: [] });
    }

    // Fetch tickets matching referral code in metadata or requester_id
    const { data: tickets, error } = await (supabaseAdmin as any)
      .from("support_tickets")
      .select(`
        id,
        ticket_number,
        subject,
        description,
        status,
        priority,
        category,
        created_at,
        metadata
      `)
      .or(`requester_id.eq.${refCode},metadata->>referral_code.eq.${refCode}`)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("[Partner Tickets GET error]:", error);
      return NextResponse.json({ success: false, tickets: [] });
    }

    // For each ticket, fetch latest message or admin replies
    const formattedTickets = await Promise.all(
      (tickets || []).map(async (t: any) => {
        const { data: messages } = await (supabaseAdmin as any)
          .from("support_ticket_messages")
          .select("id, sender_role, message, created_at")
          .eq("ticket_id", t.id)
          .order("created_at", { ascending: true });

        return {
          id: t.id,
          ticketNumber: t.ticket_number,
          subject: t.subject.replace(/^\[Partner\s+[^\]]+\]\s*/i, ""),
          topic: t.metadata?.topic || "General Partner Support",
          description: t.description,
          status: t.status,
          priority: t.priority,
          createdAt: t.created_at,
          messages: messages || []
        };
      })
    );

    return NextResponse.json({
      success: true,
      tickets: formattedTickets
    }, {
      headers: {
        "Cache-Control": "private, no-store, no-cache, must-revalidate"
      }
    });

  } catch (error: any) {
    console.error("[GET /api/partner/tickets error]:", error);
    return NextResponse.json({ success: false, tickets: [] });
  }
}
