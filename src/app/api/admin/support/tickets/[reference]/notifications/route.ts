/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { isRateLimited } from "@/lib/rateLimiter";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;
  const [local, domain] = email.split("@");
  if (local.length <= 2) return `**@${domain}`;
  return `${local.slice(0, 2)}***@${domain}`;
}

function maskPhone(phone: string): string {
  if (!phone) return "";
  const clean = phone.replace(/\D/g, "");
  if (clean.length <= 4) return "****";
  return "*".repeat(clean.length - 4) + clean.slice(-4);
}

export async function GET(request: Request, props: { params: Promise<{ reference: string }> }) {
  try {
    const { reference } = await props.params;
    if (!reference) {
      return NextResponse.json({ success: false, message: "Missing ticket reference." }, { status: 400 });
    }

    if (!JWT_SECRET) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY environment variable is required.");
    }

    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const { limited } = await isRateLimited(ip, "admin-ticket-notifications", 100, 60);
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

    // Resolve ticket to get requester contact info
    const { data: ticket, error: ticketErr } = await (supabaseAdmin as any)
      .from("support_tickets")
      .select("metadata")
      .eq("ticket_number", reference)
      .single();

    if (ticketErr || !ticket) {
      return NextResponse.json({ success: false, message: "Ticket not found." }, { status: 404 });
    }

    const metadata = ticket.metadata || {};
    const email = metadata.email;
    const phone = metadata.phone;

    if (!email && !phone) {
      return NextResponse.json({ success: true, notifications: [] });
    }

    let query = (supabaseAdmin as any)
      .from("notification_jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (email && phone) {
      query = query.or(`recipient.eq.${email},recipient.eq.${phone}`);
    } else if (email) {
      query = query.eq("recipient", email);
    } else {
      query = query.eq("recipient", phone);
    }

    const { data: jobs, error: jobsErr } = await query.limit(50);

    if (jobsErr) {
      console.error("[Ticket Notifications API] Fetch error:", jobsErr.message);
      return NextResponse.json({ success: false, message: "Error querying notifications." }, { status: 500 });
    }

    // Mask sensitive recipient info for visibility safety
    const maskedJobs = (jobs || []).map((job: any) => ({
      id: job.id,
      channel: job.channel,
      template_name: job.template_name,
      status: job.status,
      attempts: job.attempts,
      error_message: job.error_message,
      created_at: job.created_at,
      updated_at: job.updated_at,
      recipient: job.channel === "EMAIL" ? maskEmail(job.recipient) : maskPhone(job.recipient)
    }));

    return NextResponse.json({
      success: true,
      notifications: maskedJobs
    }, {
      headers: {
        "Cache-Control": "private, no-store, no-cache, must-revalidate"
      }
    });

  } catch (error) {
    console.error("[Ticket Notifications API] Server error:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
