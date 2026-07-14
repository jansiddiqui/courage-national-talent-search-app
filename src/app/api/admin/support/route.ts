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
    const { data, error } = await (supabaseAdmin as any)
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET /api/admin/support error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, messages: data });
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
