import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SchoolAuthService } from "@/domains/school/SchoolAuthService";
import { SchoolImportValidation } from "@/domains/school/SchoolImportValidation";
import { NotificationService } from "@/services/NotificationService";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

const db = supabaseAdmin as any;

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cnts_school_session")?.value;

    // 1. Verify coordinator session context
    const session = await SchoolAuthService.verifySession(token);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
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
      return NextResponse.json({
        success: false,
        message: "Name, Class, Date of Birth, and Parent Mobile Number are required.",
      }, { status: 400 });
    }

    // Basic date parsing validation
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      return NextResponse.json({
        success: false,
        message: "Invalid Date of Birth format. Expected YYYY-MM-DD.",
      }, { status: 400 });
    }

    const cleanMobile = String(mobileNumber).replace(/\D/g, "").slice(-10);
    if (cleanMobile.length < 10) {
      return NextResponse.json({
        success: false,
        message: "Valid 10-digit Parent Mobile Number is required.",
      }, { status: 400 });
    }

    // Sanitize parameters
    const cleanName = SchoolImportValidation.sanitizeFormula(name);
    const cleanParentName = SchoolImportValidation.sanitizeFormula(parentName);
    const cleanParentEmail = SchoolImportValidation.sanitizeFormula(parentEmail);
    const cleanGender = SchoolImportValidation.sanitizeFormula(gender);
    const cleanLanguage = SchoolImportValidation.sanitizeFormula(language) || "English";

    if (!hasSupabaseAdminConfig) {
      const mockRegId = `CNTS26${Math.floor(100000 + Math.random() * 900000)}`;
      return NextResponse.json({
        success: true,
        registrationId: mockRegId,
        message: "Student registered successfully (Demo Mode).",
      });
    }

    // 2. Fetch school session configuration
    const { data: config, error: configErr } = await db
      .from("school_session_configs")
      .select("id, quota, sponsorship_mode")
      .eq("school_id", session.schoolId)
      .eq("academic_session_id", session.activeSessionId)
      .eq("status", "ACTIVE")
      .maybeSingle();

    if (configErr || !config) {
      return NextResponse.json({ success: false, message: "Active school session configuration not found" }, { status: 404 });
    }

    // 3. Verify candidate duplicate entries in current session roster
    const duplicates = await SchoolImportValidation.checkDatabaseDuplicates(session.schoolId, [{
      studentName: cleanName,
      studentClass: String(studentClass),
      dob,
      parentMobile: cleanMobile,
    }]);

    if (duplicates.length > 0) {
      return NextResponse.json({ success: false, message: "Duplicate registration detected" }, { status: 400 });
    }

    // Fetch school name and city
    const { data: school } = await db
      .from("schools")
      .select("name, city, state")
      .eq("id", session.schoolId)
      .single();

    if (!school) {
      return NextResponse.json({ success: false, message: "School details missing" }, { status: 404 });
    }

    // Generate standard CNTS26 registration ID
    const regId = `CNTS26${Math.floor(100000 + Math.random() * 900000)}`;
    const idempotencyKey = `ALLOC-SINGLE-${regId}`;

    const stateValue = school.state || school.city || "";
    const districtValue = school.city || "";

    // 4. Create candidate registration record linked to academic session
    const { error: regErr } = await db
      .from("registrations")
      .insert({
        registration_id: regId,
        student_name: cleanName,
        dob,
        student_class: String(studentClass),
        school_name: school.name,
        school_city: school.city,
        school_code: session.schoolCode,
        school_id: session.schoolId,
        parent_name: cleanParentName || "Provided by School",
        mobile_number: cleanMobile,
        whatsapp_number: cleanMobile,
        parent_email: cleanParentEmail || "school_registration@cnts.in",
        state: stateValue,
        district: districtValue,
        language: cleanLanguage,
        why_participating: `School Registration | Gender: ${cleanGender}`,
        how_heard: "School",
        payment_status: "SPONSORED",
        registration_source: "SCHOOL",
        registration_status: "REGISTERED",
        academic_session_id: session.activeSessionId,
      });

    if (regErr) {
      return NextResponse.json({ success: false, message: regErr.message }, { status: 400 });
    }

    // 5. Call quota allocation transaction RPC
    const { data: allocated, error: allocErr } = await db.rpc("allocate_school_quota", {
      p_config_id: config.id,
      p_registration_id: regId,
      p_idempotency_key: idempotencyKey,
    });

    if (allocErr || !allocated) {
      // Rollback candidate registration draft if quota allocation fails
      await db
        .from("registrations")
        .delete()
        .eq("registration_id", regId);

      return NextResponse.json({
        success: false,
        message: `Quota allocation failed: ${allocErr?.message || 'Quota limit exceeded'}`,
      }, { status: 400 });
    }

    // 6. Upload photo if provided
    if (photoBase64) {
      try {
        const base64String = photoBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64String, "base64");
        const filePath = `${regId}/photo.jpg`;

        const { error: uploadError } = await db.storage
          .from("candidate_photos")
          .upload(filePath, buffer, {
            contentType: "image/jpeg",
            upsert: true,
          });

        if (!uploadError) {
          await db
            .from("registrations")
            .update({ photo_url: `candidate_photos/${filePath}` })
            .eq("registration_id", regId);
        }
      } catch (photoErr) {
        console.error("[School Register] Photo upload error (non-fatal):", photoErr);
      }
    }

    // 7. Send WhatsApp + Email confirmation (non-blocking)
    NotificationService.sendRegistrationSuccess(
      cleanMobile,
      cleanParentEmail || null,
      cleanName,
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
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
