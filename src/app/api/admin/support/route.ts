import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

export async function GET() {
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({ success: false, messages: [] });
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
    return NextResponse.json({ success: false, error: "Missing admin config" }, { status: 500 });
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
