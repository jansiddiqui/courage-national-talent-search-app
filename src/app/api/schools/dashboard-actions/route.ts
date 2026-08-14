import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SchoolAuthService } from "@/domains/school/SchoolAuthService";
import { SchoolLedgerService } from "@/domains/school/SchoolLedgerService";
import { SchoolDocumentService } from "@/domains/school/SchoolDocumentService";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import bcrypt from "bcryptjs";

const db = supabaseAdmin as any;

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cnts_school_session")?.value;

    const session = await SchoolAuthService.verifySession(token);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({
        success: true,
        announcements: [],
        acknowledgments: [],
        events: [],
        documents: [],
        ledger: [],
        balance: 0,
        snapshots: [],
      });
    }

    // 1. Fetch announcements active during the session
    const { data: announcements } = await db
      .from("school_announcements")
      .select("*")
      .or(`expiry_time.is.null,expiry_time.gt.${new Date().toISOString()}`)
      .order("publish_time", { ascending: false });

    // 2. Fetch acknowledgments for this school
    const { data: acks } = await db
      .from("school_announcement_acknowledgments")
      .select("announcement_id")
      .eq("school_id", session.schoolId);

    // 3. Fetch calendar events (global + school specific)
    const { data: events } = await db
      .from("cnts_calendar_events")
      .select("*")
      .or(`school_id.is.null,school_id.eq.${session.schoolId}`)
      .order("start_date", { ascending: true });

    // 4. Fetch uploaded documents
    const documents = await SchoolDocumentService.getDocuments(session.schoolId);

    // 5. Fetch financials ledger statement and dynamic balance
    const ledger = await SchoolLedgerService.getLedgerHistory(session.schoolId);
    const balance = await SchoolLedgerService.calculateBalance(session.schoolId);

    // 6. Fetch performance snapshots
    const { data: snapshots } = await db
      .from("school_performance_snapshots")
      .select("*, academic_sessions(session_name)")
      .eq("school_id", session.schoolId)
      .order("generated_at", { ascending: false });

    // 7. Fetch active school session configurations
    const { data: config } = await db
      .from("school_session_configs")
      .select("quota, used_quota, sponsorship_mode")
      .eq("school_id", session.schoolId)
      .eq("academic_session_id", session.activeSessionId)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      announcements: announcements || [],
      acknowledgments: acks?.map((a: any) => a.announcement_id) || [],
      events: events || [],
      documents,
      ledger,
      balance,
      snapshots: snapshots || [],
      config,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cnts_school_session")?.value;

    const session = await SchoolAuthService.verifySession(token);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === "change_pin") {
      const { currentPin, newPin } = body;
      if (!currentPin || !newPin) {
        return NextResponse.json({ success: false, message: "Current PIN and New PIN are required" }, { status: 400 });
      }

      if (newPin.trim().length < 4) {
        return NextResponse.json({ success: false, message: "New PIN must be at least 4 digits" }, { status: 400 });
      }

      if (!hasSupabaseAdminConfig) {
        return NextResponse.json({ success: true, message: "Sandbox PIN update success" });
      }

      const { data: school, error: sErr } = await db
        .from("schools")
        .select("id, pin")
        .eq("id", session.schoolId)
        .maybeSingle();

      if (sErr || !school) {
        return NextResponse.json({ success: false, message: "School record not found" }, { status: 404 });
      }

      const storedPin = school.pin || "";
      const isBcryptHash = storedPin.startsWith("$2a$") || storedPin.startsWith("$2b$") || storedPin.startsWith("$2y$");

      let isValid = false;
      if (isBcryptHash) {
        isValid = await bcrypt.compare(currentPin.trim(), storedPin);
      } else {
        isValid = (currentPin.trim() === storedPin);
      }

      if (!isValid) {
        return NextResponse.json({ success: false, message: "Incorrect current PIN" }, { status: 401 });
      }

      const hashedNewPin = await bcrypt.hash(newPin.trim(), 12);
      const { error: uErr } = await db
        .from("schools")
        .update({ pin: hashedNewPin })
        .eq("id", session.schoolId);

      if (uErr) {
        return NextResponse.json({ success: false, message: uErr.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Login PIN updated successfully" });
    }

    if (action === "acknowledge") {
      const { announcementId } = body;
      if (!announcementId) {
        return NextResponse.json({ success: false, message: "Announcement ID required" }, { status: 400 });
      }

      const { error } = await db
        .from("school_announcement_acknowledgments")
        .insert({
          announcement_id: announcementId,
          school_id: session.schoolId,
          coordinator_id: session.coordinatorId,
        })
        .select("id")
        .maybeSingle();

      if (error && error.code !== "23505") { // Ignore unique constraint violation
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    if (action === "upload_doc") {
      const { documentType, storagePath, issueDate, expiryDate } = body;
      if (!documentType || !storagePath) {
        return NextResponse.json({ success: false, message: "Missing document metadata" }, { status: 400 });
      }

      const docId = await SchoolDocumentService.uploadDocument(
        session.schoolId,
        session.coordinatorId,
        documentType,
        storagePath,
        issueDate,
        expiryDate
      );

      return NextResponse.json({ success: true, docId });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
