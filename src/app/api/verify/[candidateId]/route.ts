/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ candidateId: string }> }
) {
  try {
    const { candidateId } = await params;
    if (!candidateId) {
      return NextResponse.json(
        { success: false, message: "Missing Candidate ID" },
        { status: 400 }
      );
    }

    const normalizedId = candidateId.trim().toUpperCase();

    // 1. Sandbox fallback when Supabase is not configured
    if (!hasSupabaseAdminConfig) {
      const mockIds = ["CNTS260001", "CNTS26-DEMO5", "CNTS26-8XK4P", "CNTS26-YBJTA"];
      
      // Let any CNTS prefix pass in sandbox for ease of testing, or match mockIds
      if (mockIds.includes(normalizedId) || normalizedId.startsWith("CNTS")) {
        return NextResponse.json({
          success: true,
          candidate: {
            registration_id: normalizedId,
            cnts_id: normalizedId.includes("-") ? `CNTS26${normalizedId.split("-")[1] || "0001"}` : normalizedId,
            student_name: "Aditya Verma",
            student_class: "7",
            school_name: "Delhi Public School",
            school_city: "Kanpur",
            state: "Uttar Pradesh",
            district: "Kanpur Nagar",
            payment_status: "PAID",
            registration_status: "REGISTERED",
            created_at: "2026-06-15T12:00:00.000Z"
          }
        });
      }

      return NextResponse.json(
        { success: false, message: "Candidate registration not found" },
        { status: 404 }
      );
    }

    // 2. Fetch candidate from database (excluding sensitive PII)
    const { data: candidate, error } = await (supabaseAdmin as any)
      .from("registrations")
      .select("registration_id, cnts_id, student_name, student_class, school_name, school_city, state, district, payment_status, registration_status, created_at")
      .or(`registration_id.eq.${normalizedId},cnts_id.eq.${normalizedId}`)
      .maybeSingle();

    if (error) {
      console.error("[Candidate Verify API] DB error:", error);
      return NextResponse.json(
        { success: false, message: "Database query error" },
        { status: 500 }
      );
    }

    if (!candidate) {
      return NextResponse.json(
        { success: false, message: "Candidate registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      candidate
    });
  } catch (error: any) {
    console.error("[Candidate Verify API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
