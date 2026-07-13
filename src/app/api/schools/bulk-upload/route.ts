import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SchoolAuthService } from "@/domains/school/SchoolAuthService";
import { SchoolImportValidation } from "@/domains/school/SchoolImportValidation";
import { SchoolImportService } from "@/domains/school/SchoolImportService";
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

    const { schoolCode, students } = await request.json();

    if (schoolCode !== session.schoolCode) {
      return NextResponse.json({ success: false, message: "Unauthorized for this school code" }, { status: 403 });
    }

    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json({ success: false, message: "No students provided" }, { status: 400 });
    }

    // 2. Validate sheet structure and limits (max 5000 rows)
    const validation = SchoolImportValidation.validateSheetData(students, 5000);
    if (!validation.isValid) {
      return NextResponse.json({ success: false, message: "Validation errors:\n" + validation.errors.slice(0, 5).join("\n") }, { status: 400 });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, processed: validation.validatedRows.length });
    }

    // 3. Check school session configurations
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

    if (config.sponsorship_mode !== "FULL") {
      return NextResponse.json({ success: false, message: "School must have FULL sponsorship for bulk upload" }, { status: 400 });
    }

    // Fetch dynamic outstanding quota limit
    const { data: ledgerSum } = await db
      .from("school_quota_ledger")
      .select("amount")
      .eq("school_session_config_id", config.id);

    const currentBalance = (ledgerSum || []).reduce((acc: number, t: any) => acc + Number(t.amount), 0);
    
    if (validation.validatedRows.length > currentBalance) {
      return NextResponse.json({
        success: false,
        message: `Insufficient quota. You have ${currentBalance} remaining, but tried to upload ${validation.validatedRows.length} students.`,
      }, { status: 400 });
    }

    // 4. Verify candidate duplicate entries in current session roster
    const duplicates = await SchoolImportValidation.checkDatabaseDuplicates(session.schoolId, validation.validatedRows);
    if (duplicates.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Duplicate registrations detected:\n" + duplicates.slice(0, 3).join("\n"),
      }, { status: 400 });
    }

    // 5. Queue import job asynchronously
    const batchId = await SchoolImportService.queueImportJob(
      session.schoolId,
      session.coordinatorId,
      "bulk_import.xlsx",
      `uploads/school_imports/${session.schoolId}/${Date.now()}.xlsx`,
      validation.validatedRows
    );

    // 6. Non-blocking call to trigger worker execution
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    fetch(`${appUrl}/api/internal/process-school-jobs`, {
      method: "POST",
    }).catch(err => console.error("[Bulk Upload] Failed to trigger background worker:", err));

    return NextResponse.json({
      success: true,
      batchId,
      message: `Roster upload queued successfully. Registered job ID: ${batchId}. Candidates will appear shortly.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
