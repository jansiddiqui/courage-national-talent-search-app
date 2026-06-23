import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NotificationService } from "@/services/NotificationService";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

function cleanExcelDob(dobVal: unknown): string | null {
  if (dobVal === undefined || dobVal === null) return null;

  if (typeof dobVal === "number") {
    // Excel serial date: offset from 1899-12-31
    const days = dobVal > 59 ? dobVal - 1 : dobVal;
    const date = new Date(Math.round((days - 25569) * 86400 * 1000));
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }
  }

  const dobStr = String(dobVal).trim();
  if (!dobStr) return null;

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dobStr)) return dobStr;

  // DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = dobStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  const parsed = new Date(dobStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  return null;
}

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

    const { schoolCode, students } = await request.json();

    if (schoolCode !== sessionSchoolCode) {
      return NextResponse.json(
        { success: false, message: "Unauthorized for this school code" },
        { status: 403 }
      );
    }

    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json(
        { success: false, message: "No students provided" },
        { status: 400 }
      );
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, processed: students.length });
    }

    // Fetch school details including state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: school, error: schoolErr } = await (supabaseAdmin as any)
      .from("schools")
      .select("name, city, state, quota, used_quota, sponsorship_mode")
      .eq("school_code", sessionSchoolCode)
      .single();

    if (schoolErr || !school) {
      return NextResponse.json(
        { success: false, message: "School not found" },
        { status: 404 }
      );
    }

    if (school.sponsorship_mode !== "FULL") {
      return NextResponse.json(
        {
          success: false,
          message: "School must have FULL sponsorship for bulk upload",
        },
        { status: 400 }
      );
    }

    const availableQuota = school.quota - school.used_quota;
    if (students.length > availableQuota) {
      return NextResponse.json(
        {
          success: false,
          message: `Insufficient quota. You have ${availableQuota} remaining, but tried to upload ${students.length} students.`,
        },
        { status: 400 }
      );
    }

    // Resolve state/district properly
    const stateValue = school.state || school.city || "";
    const districtValue = school.city || "";

    let processedCount = 0;
    const errors: string[] = [];

    for (const [index, student] of (students as Record<string, unknown>[]).entries()) {
      // --- Required field extraction ---
      const name =
        (student["Student Name"] as string) ||
        (student["Name"] as string) ||
        (student["studentName"] as string);

      const cls =
        student["Class"] || student["studentClass"];

      const dobVal =
        student["Date of Birth (DD/MM/YYYY)"] ||
        student["Date of Birth"] ||
        student["DOB"] ||
        student["dob"];

      const mobile =
        student["Mobile Number"] || student["Mobile"];

      // --- Optional fields ---
      const emailVal =
        (student["Parent Email"] as string) ||
        (student["Email"] as string) ||
        "";

      const genderVal =
        (student["Gender (Male/Female/Other)"] as string) ||
        (student["Gender"] as string) ||
        "";

      const langVal =
        (student["Language (English/Hindi)"] as string) ||
        (student["Language"] as string) ||
        "English";

      // --- Validation ---
      if (!name) {
        errors.push(`Row ${index + 1}: Student Name is missing.`);
        continue;
      }

      if (!cls) {
        errors.push(`Row ${index + 1} (${name}): Class is missing.`);
        continue;
      }

      const classNum = Number(cls);
      if (isNaN(classNum) || classNum < 5 || classNum > 8) {
        errors.push(
          `Row ${index + 1} (${name}): Class must be between 5 and 8. Got: ${cls}`
        );
        continue;
      }

      const dob = cleanExcelDob(dobVal);
      if (!dob) {
        errors.push(
          `Row ${index + 1} (${name}): Date of Birth is missing or invalid. Use DD/MM/YYYY format.`
        );
        continue;
      }

      const cleanMobile = String(mobile ?? "")
        .replace(/\D/g, "")
        .slice(-10);
      if (!mobile || cleanMobile.length < 10) {
        errors.push(
          `Row ${index + 1} (${name}): Valid 10-digit Parent Mobile Number is required.`
        );
        continue;
      }

      // --- Generate standard CNTS26 registration ID ---
      const regId = `CNTS26${Math.floor(100000 + Math.random() * 900000)}`;

      // Build metadata string
      const genderNote = genderVal ? ` | Gender: ${genderVal}` : "";
      const whyParticipating = `School Bulk Registration${genderNote}`;

      const validLanguages = ["English", "Hindi"];
      const resolvedLanguage = validLanguages.includes(langVal)
        ? langVal
        : "English";

      // --- RPC call ---
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: rpcError } = await (supabaseAdmin as any).rpc(
        "consume_school_quota_and_register",
        {
          p_registration_id: regId,
          p_student_name: name,
          p_dob: dob,
          p_student_class: String(cls),
          p_school_name: school.name,
          p_school_city: school.city,
          p_school_code: sessionSchoolCode,
          p_school_id: sessionSchoolId,
          p_parent_name: "Provided by School",
          p_mobile_number: cleanMobile,
          p_whatsapp_number: cleanMobile,
          p_parent_email: emailVal.trim() || "school_bulk@cnts.in",
          p_state: stateValue,
          p_district: districtValue,
          p_language: resolvedLanguage,
          p_why_participating: whyParticipating,
          p_how_heard: "School",
          p_payment_status: "SPONSORED",
          p_registration_source: "SCHOOL",
        }
      );

      if (rpcError) {
        errors.push(`Row ${index + 1} (${name}): ${rpcError.message}`);
      } else {
        processedCount++;
        // Fire WhatsApp + Email confirmation to parent (non-blocking)
        NotificationService.sendRegistrationSuccess(
          cleanMobile,
          emailVal.trim() || null,
          name,
          String(cls),
          regId
        ).catch((err) =>
          console.error(`[Bulk Upload] Notification failed for row ${index + 1} (${name}):`, err)
        );
      }
    }

    if (processedCount === 0 && errors.length > 0) {
      return NextResponse.json(
        { success: false, message: "Upload failed: " + errors[0] },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      processed: processedCount,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully registered ${processedCount} student(s).${
        errors.length > 0
          ? ` ${errors.length} row(s) had errors and were skipped.`
          : ""
      }`,
    });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
