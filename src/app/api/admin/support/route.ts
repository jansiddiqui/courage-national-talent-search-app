import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function GET() {
  if (!hasSupabaseAdminConfig) {
    const mockMessages = [
      { id: "msg-1", name: "Ramesh Sharma", email: "ramesh@example.com", message: "When will the Class 7 admit cards be released?", status: "PENDING", created_at: new Date().toISOString() },
      { id: "msg-2", name: "Anjali Singh", email: "anjali@example.com", message: "Payment was deducted but status says unpaid.", status: "RESOLVED", created_at: new Date(Date.now() - 3600000).toISOString() }
    ];
    return NextResponse.json({ success: true, messages: mockMessages });
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");

  if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
    return NextResponse.json({ success: false, error: "Authentication session required." }, { status: 401 });
  }

  const payload = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!payload || (!payload.id && !payload.email && !payload.phone)) {
    return NextResponse.json({ success: false, error: "Forbidden: Admin session required." }, { status: 403 });
  }

  const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id || payload.email || payload.phone, "support.view");
  if (!hasPerm) {
    return NextResponse.json({ success: false, error: "Forbidden: support.view permission required." }, { status: 403 });
  }

  try {
    // 1. Query support_tickets for full ticket lifecycle
    const { data: ticketsData, error: ticketsErr } = await (supabaseAdmin as any)
      .from("support_tickets")
      .select("*, assigned_agent:assigned_to(id, name, email)")
      .order("created_at", { ascending: false });

    if (!ticketsErr && ticketsData && ticketsData.length > 0) {
      const formattedTickets = ticketsData.map((t: any) => ({
        id: t.id,
        reference: t.ticket_number || t.id,
        student_name: t.metadata?.partner_name ? `${t.metadata.partner_name} (Partner)` : (t.metadata?.name || t.requester_id || "User"),
        category: t.category || "GENERAL",
        status: t.status || "OPEN",
        priority: t.priority || "MEDIUM",
        subject: t.subject || "No Subject",
        description: t.description || "",
        requester_role: t.requester_role || "PUBLIC",
        metadata: t.metadata || {},
        created_at: t.created_at
      }));

      return NextResponse.json({
        success: true,
        tickets: formattedTickets,
        messages: formattedTickets
      });
    }

    // 2. Fallback to contact_messages if support_tickets is empty
    const { data, error } = await (supabaseAdmin as any)
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET /api/admin/support error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const mapped = (data || []).map((m: any) => ({
      id: m.id,
      reference: m.id,
      student_name: m.name || "Inquirer",
      category: "GENERAL",
      status: m.status || "OPEN",
      priority: "MEDIUM",
      subject: m.subject || "General Inquiry",
      description: m.message || "",
      created_at: m.created_at
    }));

    return NextResponse.json({ success: true, tickets: mapped, messages: mapped });
  } catch (error) {
    console.error("GET /api/admin/support error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({ success: true, message: "Sandbox message updated successfully" });
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");

  if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
    return NextResponse.json({ success: false, error: "Authentication session required." }, { status: 401 });
  }

  const payload = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!payload || (!payload.id && !payload.email && !payload.phone)) {
    return NextResponse.json({ success: false, error: "Forbidden: Admin session required." }, { status: 403 });
  }

  const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id || payload.email || payload.phone, "support.edit");
  if (!hasPerm) {
    return NextResponse.json({ success: false, error: "Forbidden: support.edit permission required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json({ success: false, error: "Missing id or updates" }, { status: 400 });
    }

    const { error } = await (supabaseAdmin as any)
      .from("contact_messages")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("PATCH /api/admin/support error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/admin/support error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
