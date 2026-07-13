/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const regId = searchParams.get("regId");
    const dob = searchParams.get("dob");

    if (!regId || !dob) {
      return NextResponse.json(
        { success: false, message: "Missing required query parameters: regId and dob" },
        { status: 400 }
      );
    }

    const cleanRegId = regId.trim().toUpperCase();
    const cleanDob = dob.trim();

    // 1. Sandbox check
    if (!hasSupabaseAdminConfig) {
      if (cleanRegId === "CNTS26-8XK4P" && cleanDob === "2013-05-14") {
        return NextResponse.json({
          success: true,
          candidate: {
            registration_id: "CNTS26-8XK4P",
            cnts_id: "CNTS260001",
            student_name: "Aditya Verma",
            student_class: "7",
            school_name: "Delhi Public School",
            school_city: "Kanpur",
            state: "Uttar Pradesh",
            district: "Kanpur Nagar",
            language: "English",
            dob: "2013-05-14",
            payment_status: "PAID"
          },
          result: {
            overall_score: 85.75,
            percentile: 95.8,
            national_rank: 425,
            state_rank: 32,
            logical_reasoning_score: 92,
            mathematics_score: 85,
            language_score: 78,
            general_awareness_score: 88
          }
        });
      } else {
        return NextResponse.json(
          { success: false, message: "No candidate found matching this ID and DOB in sandbox mode." },
          { status: 404 }
        );
      }
    }

    // 2. Query Database for release gates (only check if outside sandbox)
    const { data: setting } = await (supabaseAdmin as any)
      .from("system_settings")
      .select("setting_value")
      .eq("setting_key", "result_status")
      .maybeSingle();

    const isReleased = setting?.setting_value === "RELEASED";
    if (!isReleased) {
      return NextResponse.json(
        { success: false, message: "Results release window is pending timeline finalization." },
        { status: 403 }
      );
    }

    const { data: registration, error } = await (supabaseAdmin as any)
      .from("registrations")
      .select(`
        registration_id,
        cnts_id,
        student_name,
        student_class,
        school_name,
        school_city,
        state,
        district,
        language,
        dob,
        payment_status,
        results:results (
          overall_score,
          percentile,
          national_rank,
          state_rank,
          logical_reasoning_score,
          mathematics_score,
          language_score,
          general_awareness_score
        )
      `)
      .or(`registration_id.eq.${cleanRegId},cnts_id.eq.${cleanRegId}`)
      .eq("dob", cleanDob)
      .eq("payment_status", "PAID")
      .maybeSingle();

    if (error) {
      console.error("[Results Search API] Database query error:", error);
      return NextResponse.json(
        { success: false, message: "Database query error while retrieving results" },
        { status: 500 }
      );
    }

    if (!registration) {
      return NextResponse.json(
        { success: false, message: "No paid candidate registration found matching this ID and Date of Birth." },
        { status: 404 }
      );
    }

    const result = registration.results;
    if (!result) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Candidate found, but cognitive evaluation report is not published yet or scoring is pending." 
        },
        { status: 404 }
      );
    }

    // Fetch assessment result attempt record & processing job state
    const { data: assessmentResult } = await (supabaseAdmin as any)
      .from("assessment_results")
      .select("id, session_id, analytics, receipt_id, verification_token, submitted_at")
      .eq("candidate_id", registration.cnts_id)
      .maybeSingle();

    if (assessmentResult) {
      const { data: job } = await (supabaseAdmin as any)
        .from("result_processing_jobs")
        .select("status, retry_count, last_error")
        .eq("session_id", assessmentResult.session_id)
        .maybeSingle();

      if (job && job.status !== "COMPLETED") {
        return NextResponse.json({
          success: true,
          processingStatus: job.status,
          candidate: {
            registration_id: registration.registration_id,
            cnts_id: registration.cnts_id,
            student_name: registration.student_name,
            student_class: registration.student_class
          }
        });
      }
    }

    // Format output with joined cognitive analytics
    return NextResponse.json({
      success: true,
      candidate: {
        registration_id: registration.registration_id,
        cnts_id: registration.cnts_id,
        student_name: registration.student_name,
        student_class: registration.student_class,
        school_name: registration.school_name,
        school_city: registration.school_city,
        state: registration.state,
        district: registration.district,
        language: registration.language,
        dob: registration.dob,
        payment_status: registration.payment_status
      },
      result: {
        overall_score: result.overall_score,
        percentile: result.percentile,
        national_rank: result.national_rank,
        state_rank: result.state_rank,
        logical_reasoning_score: result.logical_reasoning_score,
        mathematics_score: result.mathematics_score,
        language_score: result.language_score,
        general_awareness_score: result.general_awareness_score
      },
      analytics: assessmentResult?.analytics || null,
      verificationToken: assessmentResult?.verification_token || null
    });

  } catch (error: any) {
    console.error("Results search endpoint error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
