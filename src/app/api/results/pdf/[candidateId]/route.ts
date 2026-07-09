/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import crypto from "crypto";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ candidateId: string }> }
) {
  try {
    const { candidateId } = await params;
    if (!candidateId) {
      return NextResponse.json(
        { success: false, message: "Missing candidate ID parameter" },
        { status: 400 }
      );
    }

    const normalizedId = candidateId.trim().toUpperCase();

    // 1. Session check for Parent / Admin authorization
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (hasSupabaseAdminConfig) {
      if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
        return NextResponse.json(
          { success: false, message: "Authentication session required for PDF downloads." },
          { status: 401 }
        );
      }

      const payload = await verifySession(sessionCookie.value, JWT_SECRET);
      if (!payload) {
        return NextResponse.json(
          { success: false, message: "Invalid session token." },
          { status: 401 }
        );
      }

      const isAdmin = payload.role === "admin";

      // 2. Fetch candidate & result from DB to verify ownership and extract result data
      const { data: registration, error } = await (supabaseAdmin as any)
        .from("registrations")
        .select(`
          id,
          registration_id,
          cnts_id,
          student_name,
          student_class,
          school_name,
          school_city,
          state,
          district,
          payment_status,
          parent_email,
          whatsapp_number,
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
        .or(`registration_id.eq.${normalizedId},cnts_id.eq.${normalizedId}`)
        .maybeSingle();

      if (error || !registration) {
        return NextResponse.json(
          { success: false, message: "Candidate or results record not found" },
          { status: 404 }
        );
      }

      // Enforce Ownership check for non-admin requests
      if (!isAdmin) {
        const matchesEmail = payload.email && registration.parent_email?.toLowerCase() === payload.email.toLowerCase();
        const matchesPhone = payload.phone && registration.whatsapp_number === payload.phone;
        if (!matchesEmail && !matchesPhone) {
          return NextResponse.json(
            { success: false, message: "Forbidden: You do not have permission to view results for this candidate." },
            { status: 403 }
          );
        }
      }

      const result = registration.results;
      if (!result) {
        return NextResponse.json(
          { success: false, message: "Evaluation scoring pending for candidate" },
          { status: 404 }
        );
      }

      const formattedResult = Array.isArray(result) ? result[0] : result;

      // Generate secure validation hash
      const secureHash = crypto
        .createHash("sha256")
        .update(`${normalizedId}-${formattedResult.percentile}`)
        .digest("hex");

      // Fetch latest candidate session to link audit log
      const { data: session } = await (supabaseAdmin as any)
        .from("candidate_sessions")
        .select("id")
        .eq("candidate_id", normalizedId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      // Log the download event in audit logs if session exists
      if (session) {
        await (supabaseAdmin as any).from("result_audit_trail").insert({
          session_id: session.id,
          actor_id: payload.email || normalizedId,
          action: "DOWNLOADED",
          details: { ip: request.headers.get("x-forwarded-for") || "unknown", hash: secureHash }
        });
      }

      return NextResponse.json({
        success: true,
        report: {
          title: "CNTS Cognitive Profile Report",
          candidateId: normalizedId,
          studentName: registration.student_name,
          studentClass: registration.student_class,
          schoolName: registration.school_name,
          schoolCity: registration.school_city,
          percentile: formattedResult.percentile,
          rank: formattedResult.national_rank,
          verificationHash: secureHash,
          scores: {
            mathematics: formattedResult.mathematics_score,
            logical_reasoning: formattedResult.logical_reasoning_score,
            language: formattedResult.language_score,
            general_awareness: formattedResult.general_awareness_score
          }
        }
      });
    }

    // 3. Sandbox fallback (when DB is not configured)
    const mockHash = crypto
      .createHash("sha256")
      .update(`${normalizedId}-95.80`)
      .digest("hex");

    return NextResponse.json({
      success: true,
      report: {
        title: "CNTS Cognitive Profile Report",
        candidateId: normalizedId,
        studentName: "Aditya Verma",
        studentClass: "7",
        schoolName: "Delhi Public School",
        schoolCity: "Kanpur",
        percentile: 95.8,
        rank: 425,
        verificationHash: mockHash,
        scores: {
          mathematics: 85,
          logical_reasoning: 92,
          language: 78,
          general_awareness: 88
        }
      }
    });

  } catch (error: any) {
    console.error("PDF metadata generation error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during PDF metadata compilation" },
      { status: 500 }
    );
  }
}
