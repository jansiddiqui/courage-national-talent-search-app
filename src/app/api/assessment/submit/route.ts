import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { SubmitRequest, SubmissionReceipt, SessionStatus } from "@/domains/assessment/core/types";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    let candidateId = "candidate_guest";
    if (sessionCookie?.value && JWT_SECRET) {
      const parsed = await verifySession(sessionCookie.value, JWT_SECRET);
      if (parsed && parsed.cntsId) {
        candidateId = parsed.cntsId;
      }
    }

    const body: SubmitRequest = await request.json();
    const { sessionId, idempotencyKey, isAutoSubmit } = body;

    if (!sessionId || !idempotencyKey) {
      return NextResponse.json({ success: false, message: "Missing sessionId or idempotencyKey" }, { status: 400 });
    }

    // 1. Sandbox local mode fallback
    if (!hasSupabaseAdminConfig) {
      const mockReceipt: SubmissionReceipt = {
        receiptId: "REC_mock_" + Math.random().toString(36).substring(2, 9),
        sessionId,
        candidateId,
        score: 7.0, // Mock score for local sandbox
        submittedAt: new Date().toISOString(),
        status: "SCORED" as SessionStatus
      };
      return NextResponse.json({ success: true, ...mockReceipt });
    }

    // 2. Fetch session from DB using transactional-equivalent or direct checks
    const { data: session, error: sessErr } = await (supabaseAdmin as any)
      .from("candidate_sessions")
      .select("*")
      .eq("id", sessionId)
      .maybeSingle();

    if (sessErr || !session) {
      console.error("[Submit API] session fetch error:", sessErr);
      return NextResponse.json({ success: false, message: "Session not found" }, { status: 404 });
    }

    // 3. Authorization check
    if (session.candidate_id !== candidateId) {
      return NextResponse.json({ success: false, message: "Unauthorized session access" }, { status: 403 });
    }

    // 4. Idempotency Check
    // If the idempotency key matches, return the pre-existing result immediately
    if (session.submission_idempotency_key === idempotencyKey && session.status === "SCORED") {
      const { data: existingResult } = await (supabaseAdmin as any)
        .from("assessment_results")
        .select("*")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (existingResult) {
        return NextResponse.json({
          success: true,
          receiptId: existingResult.receipt_id,
          sessionId,
          candidateId,
          score: existingResult.score,
          submittedAt: existingResult.submitted_at,
          status: "SCORED" as SessionStatus
        });
      }
    }

    // Reject late requests if already locked or completed under a different idempotency key
    if (
      session.status === "SUBMITTED" ||
      session.status === "SCORING" ||
      session.status === "SCORED" ||
      session.status === "LOCKED"
    ) {
      return NextResponse.json({
        success: false,
        message: "Session is already locked or completed under a different idempotency key"
      }, { status: 409 });
    }

    // 5. State Machine Transition & Atomic Freeze
    // Transition status to SUBMITTING or AUTO_SUBMITTING
    const intermediateStatus: SessionStatus = isAutoSubmit ? "AUTO_SUBMITTING" : "SUBMITTING";

    const { error: lockErr } = await (supabaseAdmin as any)
      .from("candidate_sessions")
      .update({ status: intermediateStatus })
      .eq("id", sessionId);

    if (lockErr) {
      console.error("[Submit API] lock error:", lockErr);
      return NextResponse.json({ success: false, message: "Failed to transition session state" }, { status: 500 });
    }

    // Fetch all current candidate attempts
    const { data: attempts, error: attErr } = await (supabaseAdmin as any)
      .from("question_attempts")
      .select("*")
      .eq("session_id", sessionId);

    if (attErr || !attempts) {
      console.error("[Submit API] attempts fetch error:", attErr);
      return NextResponse.json({ success: false, message: "Failed to fetch session answers" }, { status: 500 });
    }

    // Transition to SUBMITTED and freeze answer snapshot (reject future syncs)
    const snapshot = attempts.map((a: any) => ({
      questionId: a.question_id,
      selectedAnswers: a.selected_answers
    }));

    const { error: freezeErr } = await (supabaseAdmin as any)
      .from("candidate_sessions")
      .update({
        status: "SUBMITTED" as SessionStatus,
        submission_idempotency_key: idempotencyKey,
        frozen_answers_snapshot: snapshot
      })
      .eq("id", sessionId);

    if (freezeErr) {
      console.error("[Submit API] freeze error:", freezeErr);
      return NextResponse.json({ success: false, message: "Failed to freeze session answers" }, { status: 500 });
    }

    // 6. Server-Side Grading
    // Fetch server-only answer keys
    const { data: answerKeys, error: keyErr } = await (supabaseAdmin as any)
      .from("question_keys")
      .select("question_id, correct_options")
      .in("question_id", snapshot.map((s: any) => s.questionId));

    if (keyErr || !answerKeys) {
      console.error("[Submit API] answer keys query error:", keyErr);
      return NextResponse.json({ success: false, message: "Failed to load evaluation keys" }, { status: 500 });
    }

    const keyMap = new Map<string, string[]>();
    answerKeys.forEach((k: any) => {
      const correctOpts = Array.isArray(k.correct_options) 
        ? k.correct_options 
        : JSON.parse(k.correct_options || "[]");
      keyMap.set(k.question_id, correctOpts);
    });

    let score = 0;
    snapshot.forEach((attempt: any) => {
      const correct = keyMap.get(attempt.questionId);
      if (correct) {
        // Compare option ID arrays
        const selected = attempt.selectedAnswers || [];
        const isMatch = selected.length === correct.length &&
          selected.every((val: string) => correct.includes(val));
        if (isMatch) {
          score += 1.0;
        }
      }
    });

    // 7. Write Immutable Result Record
    const receiptId = "REC_" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const submittedAt = new Date().toISOString();

    const { error: resultErr } = await (supabaseAdmin as any)
      .from("assessment_results")
      .insert({
        session_id: sessionId,
        candidate_id: candidateId,
        assessment_id: session.assessment_id,
        score,
        receipt_id: receiptId,
        submitted_at: submittedAt
      });

    if (resultErr) {
      console.error("[Submit API] result write error:", resultErr);
      return NextResponse.json({ success: false, message: "Failed to save evaluation result" }, { status: 500 });
    }

    // 8. Final transition to SCORED
    await (supabaseAdmin as any)
      .from("candidate_sessions")
      .update({
        status: "SCORED" as SessionStatus,
        submission_receipt_id: receiptId
      })
      .eq("id", sessionId);

    return NextResponse.json({
      success: true,
      receiptId,
      sessionId,
      candidateId,
      score,
      submittedAt,
      status: "SCORED" as SessionStatus
    });

  } catch (error: any) {
    console.error("[Submit API] grading error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
