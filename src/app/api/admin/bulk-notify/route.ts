/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { NotificationService } from "@/services/NotificationService";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function POST(request: Request) {
  try {
    if (!JWT_SECRET) {
      throw new Error("CRITICAL CONFIGURATION ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is required.");
    }
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(sessionCookie.value, JWT_SECRET);
    if (!session) {
      return NextResponse.json({ success: false, message: "Session expired or invalid" }, { status: 401 });
    }

    const role = session.role;
    if (role !== "ADMIN" && role !== "SUPER_ADMIN" && role !== "VOLUNTEER") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { notifyType } = await request.json();

    if (!notifyType || !["admit_card", "result", "certificate"].includes(notifyType)) {
      return NextResponse.json({ success: false, message: "Invalid or missing notification type" }, { status: 400 });
    }

    // 1. Fetch Paid Candidates
    let candidates = [];
    if (!hasSupabaseAdminConfig) {
      // Sandbox Mode Mock Data
      candidates = [
        {
          cnts_id: "CNTS260001",
          student_name: "Aditya Verma",
          student_class: "7",
          whatsapp_number: "+919876543210",
          parent_email: "parent@example.com"
        },
        {
          cnts_id: "CNTS260002",
          student_name: "Sneha Patel",
          student_class: "8",
          whatsapp_number: "+919876543211",
          parent_email: "sneha.parent@example.com"
        }
      ];
    } else {
      const { data, error } = await (supabaseAdmin as any)
        .from("registrations")
        .select("cnts_id, student_name, student_class, whatsapp_number, parent_email")
        .eq("payment_status", "PAID");

      if (error) {
        console.error("[Bulk Notify API] Error querying registrations:", error);
        return NextResponse.json({ success: false, message: "Failed to query candidates from database" }, { status: 500 });
      }
      candidates = data || [];
    }

    if (candidates.length === 0) {
      return NextResponse.json({ success: true, sentCount: 0, message: "No candidates with payment_status = PAID were found." });
    }

    let successCount = 0;
    let failureCount = 0;

    // 2. Loop dispatch notifications
    for (const c of candidates) {
      const recipientPhone = c.whatsapp_number;
      const recipientEmail = c.parent_email || null;
      const studentName = c.student_name;
      const cntsId = c.cnts_id;

      if (!recipientPhone) {
        failureCount++;
        continue;
      }

      try {
        let res = { whatsapp: false, email: false };
        if (notifyType === "admit_card") {
          res = await NotificationService.sendAdmitCardReleased(
            recipientPhone,
            recipientEmail,
            studentName,
            cntsId
          );
        } else if (notifyType === "result") {
          res = await NotificationService.sendResultsReleased(
            recipientPhone,
            recipientEmail,
            studentName,
            cntsId
          );
        } else if (notifyType === "certificate") {
          res = await NotificationService.sendCertificateReleased(
            recipientPhone,
            recipientEmail,
            studentName,
            cntsId
          );
        }

        if (res.whatsapp || res.email) {
          successCount++;
        } else {
          failureCount++;
        }
      } catch (err) {
        console.error(`[Bulk Notify API] Failed for CNTS ID: ${cntsId}`, err);
        failureCount++;
      }
    }

    return NextResponse.json({
      success: true,
      sentCount: successCount,
      failedCount: failureCount,
      totalCount: candidates.length,
      message: `Successfully processed ${successCount} candidates. Failed/skipped ${failureCount}.`
    });
  } catch (error: any) {
    console.error("Bulk notify endpoint error:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
