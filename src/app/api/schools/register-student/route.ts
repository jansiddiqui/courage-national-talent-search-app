import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NotificationService } from "@/services/NotificationService";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

const JWT_SECRET = new TextEncoder().encode(
  process.env.SUPABASE_SERVICE_ROLE_KEY || "fallback_secret_key"
);

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cnts_school_session")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let sessionSchoolCode = "";
    let sessionSchoolId = "";
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      sessionSchoolCode = payload.schoolCode as string;
      sessionSchoolId = payload.schoolId as string;
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid session" },
        { status: 401 }
      );
    }

    const {
      name,
      studentClass,
      dob,
      mobileNumber,
      parentEmail,
      parentName,
      gender,
      language,
      photoBase64,
    } = await request.json();

    if (!name || !studentClass || !dob || !mobileNumber) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, Class, Date of Birth, and Parent Mobile Number are required.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Date of Birth format. Expected YYYY-MM-DD.",
        },
        { status: 400 }
      );
    }

    if (!hasSupabaseAdminConfig) {
      // Mock success for development
      const mockRegId = `CNTS26${Math.floor(100000 + Math.random() * 900000)}`;
      return NextResponse.json({
        success: true,
        registrationId: mockRegId,
        message: "Student registered successfully (Demo Mode).",
      });
    }

    // Fetch school details (name, city, state)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: school, error: schoolErr } = await (supabaseAdmin as any)
      .from("schools")
      .select("name, city, state, quota, used_quota")
      .eq("school_code", sessionSchoolCode)
      .single();

    if (schoolErr || !school) {
      return NextResponse.json(
        { success: false, message: "School not found" },
        { status: 404 }
      );
    }

    if (school.used_quota >= school.quota) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Quota exceeded. Please contact administrator to increase quota.",
        },
        { status: 400 }
      );
    }

    // Generate standard CNTS26 registration ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const regId = `CNTS26${randomSuffix}`;

    // Build why_participating from gender info
    const genderNote = gender ? ` | Gender: ${gender}` : "";
    const langValue = language || "English";
    const whyParticipating = `School Registration${genderNote}`;

    // Resolve state/district — use school.state if available, otherwise school.city
    const stateValue = school.state || school.city || "";
    const districtValue = school.city || "";

    // Use RPC to consume quota and create registration
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: rpcError } = await (supabaseAdmin as any).rpc(
      "consume_school_quota_and_register",
      {
        p_registration_id: regId,
        p_student_name: name,
        p_dob: dob,
        p_student_class: String(studentClass),
        p_school_name: school.name,
        p_school_city: school.city,
        p_school_code: sessionSchoolCode,
        p_school_id: sessionSchoolId,
        p_parent_name: parentName?.trim() || "Provided by School",
        p_mobile_number: String(mobileNumber),
        p_whatsapp_number: String(mobileNumber),
        p_parent_email: parentEmail?.trim() || "school_registration@cnts.in",
        p_state: stateValue,
        p_district: districtValue,
        p_language: langValue,
        p_why_participating: whyParticipating,
        p_how_heard: "School",
        p_payment_status: "SPONSORED",
        p_registration_source: "SCHOOL",
      }
    );

    if (rpcError) {
      return NextResponse.json(
        { success: false, message: rpcError.message },
        { status: 400 }
      );
    }

    // Upload photo if provided
    if (photoBase64) {
      try {
        const base64String = photoBase64.replace(
          /^data:image\/\w+;base64,/,
          ""
        );
        const buffer = Buffer.from(base64String, "base64");
        const filePath = `${regId}/photo.jpg`;

        const { error: uploadError } = await (supabaseAdmin as any).storage
          .from("candidate_photos")
          .upload(filePath, buffer, {
            contentType: "image/jpeg",
            upsert: true,
          });

        if (!uploadError) {
          // Update the registration with the photo URL
          await (supabaseAdmin as any)
            .from("registrations")
            .update({ photo_url: `candidate_photos/${filePath}` })
            .eq("registration_id", regId);
        } else {
          console.error(
            "[School Register] Photo upload failed:",
            uploadError.message
          );
          // Non-fatal — registration still succeeds, photo just won't be stored
        }
      } catch (photoErr) {
        console.error("[School Register] Photo processing error:", photoErr);
        // Non-fatal
      }
    }

    // Send WhatsApp + Email confirmation to parent (non-blocking)
    NotificationService.sendRegistrationSuccess(
      String(mobileNumber),
      parentEmail?.trim() || null,
      name,
      String(studentClass),
      regId
    ).catch((err) =>
      console.error("[School Register] Notification failed (non-fatal):", err)
    );

    return NextResponse.json({
      success: true,
      registrationId: regId,
      message: "Student registered successfully.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
