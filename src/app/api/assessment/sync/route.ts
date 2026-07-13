import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { SyncRequest, SyncResponse, SessionStatus } from "@/domains/assessment/core/types";

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

    const body: SyncRequest = await request.json();
    const { sessionId, mutations } = body;

    if (!sessionId || !mutations || !Array.isArray(mutations)) {
      return NextResponse.json({ success: false, message: "Invalid sync request payload" }, { status: 400 });
    }

    // 1. Sandbox local mode fallback
    if (!hasSupabaseAdminConfig) {
      const maxSeq = mutations.reduce((max, m) => Math.max(max, m.sequenceNumber), 0);
      return NextResponse.json({
        success: true,
        highestAcknowledgedSequence: maxSeq,
        timeRemainingSeconds: 600,
        status: "IN_PROGRESS" as SessionStatus
      });
    }

    // 2. Fetch session from Supabase
    const { data: session, error: sessErr } = await (supabaseAdmin as any)
      .from("candidate_sessions")
      .select("*")
      .eq("id", sessionId)
      .maybeSingle();

    if (sessErr || !session) {
      console.error("[Sync API] session fetch error:", sessErr);
      return NextResponse.json({ success: false, message: "Session not found" }, { status: 404 });
    }

    // 3. Authorization & ownership checks
    if (session.candidate_id !== candidateId) {
      return NextResponse.json({ success: false, message: "Unauthorized session access" }, { status: 403 });
    }

    // 4. Expiry / status validation
    const now = new Date();
    const expiresAt = new Date(session.expires_at);

    if (session.status !== "CREATED" && session.status !== "IN_PROGRESS") {
      return NextResponse.json({
        success: false,
        message: `Sync rejected: session status is ${session.status}`,
        status: session.status as SessionStatus
      }, { status: 400 });
    }

    if (now >= expiresAt) {
      // Transition to auto-submitting/submitted status dynamically
      await (supabaseAdmin as any)
        .from("candidate_sessions")
        .update({ status: "AUTO_SUBMITTING" as SessionStatus })
        .eq("id", sessionId);

      return NextResponse.json({
        success: false,
        message: "Sync rejected: session time expired",
        status: "AUTO_SUBMITTING" as SessionStatus
      }, { status: 400 });
    }

    // 5. Query assessment questions to validate membership
    const { data: questions, error: qErr } = await (supabaseAdmin as any)
      .from("questions")
      .select("id, content")
      .eq("assessment_id", session.assessment_id);

    if (qErr || !questions) {
      console.error("[Sync API] questions validation query error:", qErr);
      return NextResponse.json({ success: false, message: "Failed to validate questions" }, { status: 500 });
    }

    const questionMap = new Map<string, any>();
    questions.forEach((q: any) => questionMap.set(q.id, q));

    // 6. Process mutations and check sequence freshness
    let highestAckSeq = 0;

    for (const mutation of mutations) {
      const q = questionMap.get(mutation.questionId);
      if (!q) {
        // Skip invalid questions not belonging to this assessment
        continue;
      }

      // Option ID check: ensure selected options are defined on the question structure
      const options = q.content?.options || [];
      const optionIds = options.map((opt: any) => opt.id || opt.text || "");
      const allOptionsValid = mutation.selectedOptionIds.every(id => optionIds.includes(id));
      if (!allOptionsValid) {
        continue;
      }

      // Check current attempt in DB to reject old sequence numbers
      const { data: attempt } = await (supabaseAdmin as any)
        .from("question_attempts")
        .select("last_sequence_number")
        .eq("session_id", sessionId)
        .eq("question_id", mutation.questionId)
        .maybeSingle();

      if (attempt && Number(mutation.sequenceNumber) <= Number(attempt.last_sequence_number)) {
        // Skip stale sequence number mutations
        continue;
      }

      // Upsert question attempt atomically
      const { error: upsertErr } = await (supabaseAdmin as any)
        .from("question_attempts")
        .upsert({
          session_id: sessionId,
          question_id: mutation.questionId,
          selected_answers: mutation.selectedOptionIds,
          last_sequence_number: mutation.sequenceNumber,
          palette_state: "ANSWERED",
          updated_at: new Date().toISOString()
        }, {
          onConflict: "session_id,question_id"
        });

      if (upsertErr) {
        console.error("[Sync API] upsert attempt error:", upsertErr);
        continue;
      }

      highestAckSeq = Math.max(highestAckSeq, mutation.sequenceNumber);
    }

    // Calculate remaining seconds
    const timeRemainingSeconds = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));

    return NextResponse.json({
      success: true,
      highestAcknowledgedSequence: highestAckSeq,
      timeRemainingSeconds,
      status: session.status as SessionStatus
    });

  } catch (error: any) {
    console.error("[Sync API] sync route error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
