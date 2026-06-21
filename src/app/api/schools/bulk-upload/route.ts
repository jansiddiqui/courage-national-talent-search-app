import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = new TextEncoder().encode(process.env.SUPABASE_SERVICE_ROLE_KEY || "fallback_secret_key");

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cnts_school_session")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let sessionSchoolCode = "";
    let sessionSchoolId = "";
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      sessionSchoolCode = payload.schoolCode as string;
      sessionSchoolId = payload.schoolId as string;
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
    }

    const { schoolCode, students } = await request.json();

    if (schoolCode !== sessionSchoolCode) {
      return NextResponse.json({ success: false, message: "Unauthorized for this school code" }, { status: 403 });
    }

    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json({ success: false, message: "No students provided" }, { status: 400 });
    }

    if (!hasSupabaseAdminConfig) {
      // Mock success for development
      return NextResponse.json({ success: true, processed: students.length });
    }

    // Verify school quota first
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: school, error: schoolErr } = await (supabaseAdmin as any)
      .from("schools")
      .select("name, city, quota, used_quota, sponsorship_mode")
      .eq("school_code", sessionSchoolCode)
      .single();

    if (schoolErr || !school) {
      return NextResponse.json({ success: false, message: "School not found" }, { status: 404 });
    }

    if (school.sponsorship_mode !== "FULL") {
      return NextResponse.json({ success: false, message: "School must have FULL sponsorship for bulk upload" }, { status: 400 });
    }

    const availableQuota = school.quota - school.used_quota;
    if (students.length > availableQuota) {
      return NextResponse.json({ 
        success: false, 
        message: `Insufficient quota. You have ${availableQuota} remaining, but tried to upload ${students.length} students.` 
      }, { status: 400 });
    }

    let processedCount = 0;
    const errors = [];

    // Process sequentially to respect quota
    for (const [index, student] of students.entries()) {
      const name = student["Student Name"] || student["Name"] || student["studentName"];
      const cls = student["Class"] || student["studentClass"] || "Not Specified";
      const mobile = student["Mobile Number"] || student["Mobile"] || "0000000000";
      
      if (!name) {
        errors.push(`Row ${index + 1}: Name missing`);
        continue;
      }

      // Generate random CNTS ID
      const regId = `CNTS-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

      // Use RPC to consume quota
      const { error: rpcError } = await (supabaseAdmin as any).rpc('consume_school_quota_and_register', {
        p_registration_id: regId,
        p_student_name: name,
        p_dob: "2000-01-01", // dummy DOB since excel might not have it
        p_student_class: String(cls),
        p_school_name: school.name,
        p_school_city: school.city,
        p_school_code: sessionSchoolCode,
        p_school_id: sessionSchoolId,
        p_parent_name: "Provided by School",
        p_mobile_number: String(mobile),
        p_whatsapp_number: String(mobile),
        p_parent_email: "school_bulk@example.com",
        p_state: school.city, // assume same state roughly or dummy
        p_district: school.city,
        p_language: "English",
        p_why_participating: "School Bulk Registration",
        p_how_heard: "School",
        p_payment_status: "SPONSORED",
        p_registration_source: "SCHOOL"
      });

      if (rpcError) {
        errors.push(`Row ${index + 1} (${name}): ${rpcError.message}`);
      } else {
        processedCount++;
      }
    }

    if (processedCount === 0 && errors.length > 0) {
      return NextResponse.json({ success: false, message: "Upload failed: " + errors[0] }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      processed: processedCount,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully registered ${processedCount} students.`
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
