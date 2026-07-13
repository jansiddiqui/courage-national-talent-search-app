import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { CandidateQuestionDTO, SessionStatus } from "@/domains/assessment/core/types";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Static mock questions fallback for local sandboxed environments
const mockQuestions = [
  {
    id: "q_1",
    domain: "Logical & Pattern Deduction",
    text: "Complete the sequence: Red, Blue, Red-Red, Blue-Blue, Red-Red-Red, ...",
    options: [
      { id: "opt_1_1", text: "Blue-Blue-Blue" },
      { id: "opt_1_2", text: "Red-Red-Red-Red" },
      { id: "opt_1_3", text: "Blue-Blue" },
      { id: "opt_1_4", text: "Red-Red" }
    ]
  },
  {
    id: "q_2",
    domain: "Quantitative Logic & Mathematics",
    text: "If 3 pencils cost ₹15, how much will 7 pencils cost?",
    options: [
      { id: "opt_2_1", text: "₹30" },
      { id: "opt_2_2", text: "₹35" },
      { id: "opt_2_3", text: "₹40" },
      { id: "opt_2_4", text: "₹25" }
    ]
  },
  {
    id: "q_3",
    domain: "Verbal & Language Ability",
    text: "Find the odd word out: Book, Pen, Eraser, Plate",
    options: [
      { id: "opt_3_1", text: "Book" },
      { id: "opt_3_2", text: "Pen" },
      { id: "opt_3_3", text: "Eraser" },
      { id: "opt_3_4", text: "Plate" }
    ]
  },
  {
    id: "q_4",
    domain: "Logical & Pattern Deduction",
    text: "Light is to Candle as Heat is to ...",
    options: [
      { id: "opt_4_1", text: "Ice" },
      { id: "opt_4_2", text: "Fire" },
      { id: "opt_4_3", text: "Dark" },
      { id: "opt_4_4", text: "Cold" }
    ]
  },
  {
    id: "q_5",
    domain: "Quantitative Logic & Mathematics",
    text: "Find the next number in the pattern: 2, 5, 9, 14, 20, ...",
    options: [
      { id: "opt_5_1", text: "25" },
      { id: "opt_5_2", text: "26" },
      { id: "opt_5_3", text: "27" },
      { id: "opt_5_4", text: "28" }
    ]
  },
  {
    id: "q_6",
    domain: "Logical & Pattern Deduction",
    text: "If RED is coded as 18-5-4 (based on alphabet positions), how is BLUE coded?",
    options: [
      { id: "opt_6_1", text: "2-12-21-5" },
      { id: "opt_6_2", text: "2-21-12-5" },
      { id: "opt_6_3", text: "1-12-21-5" },
      { id: "opt_6_4", text: "2-12-21-6" }
    ]
  },
  {
    id: "q_7",
    domain: "General Awareness & Critical Logic",
    text: "Why do we see lightning before we hear thunder?",
    options: [
      { id: "opt_7_1", text: "Light travels faster than sound" },
      { id: "opt_7_2", text: "Sound travels faster than light" },
      { id: "opt_7_3", text: "Thunder occurs later" },
      { id: "opt_7_4", text: "Clouds block sound" }
    ]
  },
  {
    id: "q_8",
    domain: "Verbal & Language Ability",
    text: "Choose the word that best completes the sentence: The researcher was ______ by the results because they contradicted his hypothesis.",
    options: [
      { id: "opt_8_1", text: "delighted" },
      { id: "opt_8_2", text: "surprised" },
      { id: "opt_8_3", text: "indifferent" },
      { id: "opt_8_4", text: "bored" }
    ]
  },
  {
    id: "q_9",
    domain: "Logical & Pattern Deduction",
    text: "A doctor gives you 3 pills and tells you to take one every half hour. How long will the pills last?",
    options: [
      { id: "opt_9_1", text: "1.5 Hours" },
      { id: "opt_9_2", text: "1 Hour" },
      { id: "opt_9_3", text: "2 Hours" },
      { id: "opt_9_4", text: "30 Minutes" }
    ]
  },
  {
    id: "q_10",
    domain: "General Awareness & Critical Logic",
    text: "Plants absorb water from the soil primarily through their:",
    options: [
      { id: "opt_10_1", text: "Leaves" },
      { id: "opt_10_2", text: "Stems" },
      { id: "opt_10_3", text: "Roots" },
      { id: "opt_10_4", text: "Flowers" }
    ]
  }
];

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

    const body = await request.json();
    const { assessmentId } = body;
    if (!assessmentId) {
      return NextResponse.json({ success: false, message: "Missing assessmentId" }, { status: 400 });
    }

    // 1. Sandbox local mode check
    if (!hasSupabaseAdminConfig) {
      const mockSessionId = "sess_mock_" + assessmentId + "_" + candidateId;
      const expiresAt = new Date(Date.now() + 600 * 1000).toISOString(); // 10 mins
      return NextResponse.json({
        success: true,
        sessionId: mockSessionId,
        expiresAt,
        seed: 481920,
        questions: mockQuestions
      });
    }

    // 2. Query Supabase
    // Check if there is an active session
    const { data: existingSession, error: sessErr } = await (supabaseAdmin as any)
      .from("candidate_sessions")
      .select("*")
      .eq("candidate_id", candidateId)
      .eq("assessment_id", assessmentId)
      .in("status", ["CREATED", "IN_PROGRESS", "SUBMITTING", "AUTO_SUBMITTING"])
      .maybeSingle();

    if (sessErr) {
      console.error("[Assessment API] existing session fetch error:", sessErr);
      return NextResponse.json({ success: false, message: "Database query error" }, { status: 500 });
    }

    let activeSession = existingSession;

    // Fetch assessment to get duration
    const { data: assessment, error: asmErr } = await (supabaseAdmin as any)
      .from("assessments")
      .select("*")
      .eq("id", assessmentId)
      .maybeSingle();

    if (asmErr || !assessment) {
      console.error("[Assessment API] assessment fetch error:", asmErr);
      return NextResponse.json({ success: false, message: "Assessment not found" }, { status: 404 });
    }

    if (!activeSession) {
      // Create new session
      const seed = Math.floor(100000 + Math.random() * 900000);
      const secureToken = "tok_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const durationMinutes = (assessment as any).duration_minutes || 60;
      const startedAt = new Date().toISOString();
      const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();

      const { data: inserted, error: insertErr } = await (supabaseAdmin as any)
        .from("candidate_sessions")
        .insert({
          candidate_id: candidateId,
          assessment_id: assessmentId,
          secure_token: secureToken,
          seed,
          status: "IN_PROGRESS" as SessionStatus,
          started_at: startedAt,
          expires_at: expiresAt
        })
        .select()
        .single();

      if (insertErr) {
        console.error("[Assessment API] session insert error:", insertErr);
        return NextResponse.json({ success: false, message: "Failed to initialize session" }, { status: 500 });
      }
      activeSession = inserted;
    }

    if (!activeSession) {
      return NextResponse.json({ success: false, message: "Active session failed to initialize" }, { status: 500 });
    }

    // Fetch existing question attempts for the session to support resume state
    let sessionAttempts: any[] = [];
    const { data: attempts } = await (supabaseAdmin as any)
      .from("question_attempts")
      .select("question_id, selected_answers, last_sequence_number")
      .eq("session_id", activeSession.id);
    if (attempts) {
      sessionAttempts = attempts;
    }

    // Fetch questions mapped to DTOs
    const { data: questions, error: qErr } = await (supabaseAdmin as any)
      .from("questions")
      .select("id, type, content, difficulty")
      .eq("assessment_id", assessmentId);

    if (qErr || !questions) {
      console.error("[Assessment API] questions fetch error:", qErr);
      return NextResponse.json({ success: false, message: "Failed to load questions" }, { status: 500 });
    }

    // Map questions to CandidateQuestionDTOs, stripping answer keys
    const candidateQuestions: CandidateQuestionDTO[] = (questions as any[]).map((q: any) => {
      // content JSON has options. Strip correct answer from content
      const content = q.content || {};
      const rawOptions = content.options || [];
      const options = rawOptions.map((opt: any) => ({
        id: opt.id || opt.text || "",
        text: opt.text || ""
      }));

      return {
        id: q.id,
        domain: content.domain || "Cognitive Logic",
        text: content.text || content.question || "",
        options
      };
    });

    return NextResponse.json({
      success: true,
      sessionId: activeSession.id,
      expiresAt: activeSession.expires_at,
      seed: activeSession.seed,
      attempts: sessionAttempts,
      questions: candidateQuestions.length > 0 ? candidateQuestions : mockQuestions
    });

  } catch (error: any) {
    console.error("[Assessment API] start error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
