import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

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

    const { name, studentClass, dob, mobileNumber, parentEmail, gender } = await request.json();

    if (!name || !studentClass || !dob || !mobileNumber) {
      return NextResponse.json({ success: false, message: "Name, Class, Date of Birth, and Parent Mobile Number are required." }, { status: 400 });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      return NextResponse.json({ success: false, message: "Invalid Date of Birth format. Expected YYYY-MM-DD." }, { status: 400 });
    }

    if (!hasSupabaseAdminConfig) {
      // Mock success for development
      const mockRegId = `CNTS26${Math.floor(100000 + Math.random() * 900000)}`;
      return NextResponse.json({ 
        success: true, 
        registrationId: mockRegId, 
        message: "Student registered successfully (Demo Mode)." 
      });
    }

    // Verify school quota first
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: school, error: schoolErr } = await (supabaseAdmin as any)
      .from("schools")
      .select("name, city, quota, used_quota")
      .eq("school_code", sessionSchoolCode)
      .single();

    if (schoolErr || !school) {
      return NextResponse.json({ success: false, message: "School not found" }, { status: 404 });
    }

    if (school.used_quota >= school.quota) {
      return NextResponse.json({ success: false, message: "Quota exceeded. Please contact administrator to increase quota." }, { status: 400 });
    }

    // Generate random CNTS ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const regId = `CNTS26${randomSuffix}`;

    const whyParticipating = gender ? `School Registration | Gender: ${gender}` : "School Registration";

    // Use RPC to consume quota
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: rpcError } = await (supabaseAdmin as any).rpc('consume_school_quota_and_register', {
      p_registration_id: regId,
      p_student_name: name,
      p_dob: dob,
      p_student_class: String(studentClass),
      p_school_name: school.name,
      p_school_city: school.city,
      p_school_code: sessionSchoolCode,
      p_school_id: sessionSchoolId,
      p_parent_name: "Provided by School",
      p_mobile_number: String(mobileNumber),
      p_whatsapp_number: String(mobileNumber),
      p_parent_email: parentEmail || "school_bulk@example.com",
      p_state: school.city,
      p_district: school.city,
      p_language: "English",
      p_why_participating: whyParticipating,
      p_how_heard: "School",
      p_payment_status: "SPONSORED",
      p_registration_source: "SCHOOL"
    });

    if (rpcError) {
      return NextResponse.json({ success: false, message: rpcError.message }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      registrationId: regId,
      message: "Student registered successfully."
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
