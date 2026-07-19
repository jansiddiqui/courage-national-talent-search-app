import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ success: false, message: "School code is required" }, { status: 400 });
    }

    code = code.trim().toUpperCase();

    if (!hasSupabaseAdminConfig) {
      // Sandbox mock
      if (code === "DEMO-123") {
        return NextResponse.json({ 
          success: true, 
          school: {
            id: "demo-id",
            name: "Demo International School",
            city: "New Delhi",
            sponsorship_mode: "FULL",
            available_quota: 50
          } 
        });
      }
      return NextResponse.json({ success: false, message: "Invalid or inactive school code" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: school, error } = await (supabaseAdmin as any)
      .from("schools")
      .select("id, name, city, sponsorship_mode, quota, used_quota, status, notes, student_discount_percent, school_rebate_percent")
      .eq("school_code", code)
      .eq("status", "ACTIVE")
      .single();

    if (error || !school) {
      return NextResponse.json({ success: false, message: "Invalid or inactive school code" }, { status: 404 });
    }

    const available_quota = school.quota - school.used_quota;

    if (available_quota <= 0) {
      return NextResponse.json({ success: false, message: "This school's free registration quota has been exhausted" }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      school: {
        id: school.id,
        name: school.name,
        city: school.city,
        sponsorship_mode: school.sponsorship_mode,
        notes: school.notes,
        student_discount_percent: school.student_discount_percent,
        school_rebate_percent: school.school_rebate_percent,
        available_quota: available_quota
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
