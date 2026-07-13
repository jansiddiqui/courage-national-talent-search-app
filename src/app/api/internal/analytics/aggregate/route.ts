/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

const db = supabaseAdmin as any;

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get("x-api-key");
    const secret = process.env.INTERNAL_API_SECRET || "courage-internal-secret-token";

    // 1. Secret verification
    if (!apiKey || apiKey !== secret) {
      return NextResponse.json({ success: false, message: "Unauthorized access: Invalid API key." }, { status: 401 });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, message: "Sandbox mode: Aggregation skipped." });
    }

    // 2. Perform Registration Aggregation
    const { data: regs, error: regsErr } = await db
      .from("registrations")
      .select("id, registration_id, cnts_id, created_at, payment_status, school_id, state, district");

    if (regsErr) throw regsErr;

    // Fetch active parent telemetry sessions to compute active parent counts
    const { data: parentTelemetry, error: telErr } = await db
      .from("analytics_telemetry_events")
      .select("actor_id, created_at")
      .eq("event_type", "PARENT_SESSION_STARTED");

    if (telErr) console.error("[Aggregator] Telemetry fetch error:", telErr);

    const dailyRegsMap: Record<string, { started: number; completed: number; parentSet: Set<string> }> = {};
    const geoMap: Record<string, { state: string; district: string; count: number; completed: number }> = {};
    const schoolMap: Record<string, { total: number; sponsored: number }> = {};

    // Fetch active school quota allocations to match sponsored registrations
    const { data: allocations, error: allocErr } = await db
      .from("school_quota_allocations")
      .select("student_id")
      .eq("status", "ACTIVE");

    if (allocErr) console.error("[Aggregator] Quota allocations fetch error:", allocErr);
    const sponsoredSet = new Set(allocations?.map((a: any) => a.student_id) || []);

    regs?.forEach((r: any) => {
      const dateStr = new Date(r.created_at).toISOString().split("T")[0];
      if (!dailyRegsMap[dateStr]) {
        dailyRegsMap[dateStr] = { started: 0, completed: 0, parentSet: new Set() };
      }
      dailyRegsMap[dateStr].started++;
      
      const isCompleted = r.payment_status === "SUCCESS" || r.payment_status === "PAID";
      if (isCompleted) {
        dailyRegsMap[dateStr].completed++;
      }

      // Geo map
      const stateName = r.state || "UNKNOWN";
      const districtName = r.district || "UNKNOWN";
      const geoKey = `${stateName}_${districtName}`;
      if (!geoMap[geoKey]) {
        geoMap[geoKey] = { state: stateName, district: districtName, count: 0, completed: 0 };
      }
      geoMap[geoKey].count++;
      if (isCompleted) {
        geoMap[geoKey].completed++;
      }

      // School map
      if (r.school_id) {
        if (!schoolMap[r.school_id]) {
          schoolMap[r.school_id] = { total: 0, sponsored: 0 };
        }
        schoolMap[r.school_id].total++;
        if (r.registration_id && sponsoredSet.has(r.registration_id)) {
          schoolMap[r.school_id].sponsored++;
        }
      }
    });

    // Populate active parent set per day from telemetry events
    parentTelemetry?.forEach((evt: any) => {
      const dateStr = new Date(evt.created_at).toISOString().split("T")[0];
      if (dailyRegsMap[dateStr] && evt.actor_id) {
        dailyRegsMap[dateStr].parentSet.add(evt.actor_id);
      }
    });

    // Upsert daily registrations
    for (const [date, val] of Object.entries(dailyRegsMap)) {
      const rate = val.started > 0 ? (val.completed / val.started) * 100 : 0;
      const { error: upsertErr } = await db
        .from("analytics_daily_registrations")
        .upsert({
          date: date,
          total_started: val.started,
          total_completed: val.completed,
          conversion_rate: Number(rate.toFixed(2)),
          total_active_parents: val.parentSet.size
        }, { onConflict: "date" });
      if (upsertErr) console.error("[Aggregator] Daily regs upsert error:", upsertErr);
    }

    // 3. Perform Revenue Aggregation
    const { data: ledgerTrans, error: ledgerErr } = await db
      .from("school_fee_ledger")
      .select("created_at, transaction_type, amount");

    const dailyRevMap: Record<string, { gross: number; refund: number }> = {};

    // Add candidate registrations gross revenue (₹200.00 registration fee)
    regs?.forEach((r: any) => {
      if (r.payment_status === "SUCCESS" || r.payment_status === "PAID") {
        const dateStr = new Date(r.created_at).toISOString().split("T")[0];
        if (!dailyRevMap[dateStr]) {
          dailyRevMap[dateStr] = { gross: 0, refund: 0 };
        }
        dailyRevMap[dateStr].gross += 200.00;
      }
    });

    if (!ledgerErr && ledgerTrans) {
      ledgerTrans.forEach((t: any) => {
        const dateStr = new Date(t.created_at).toISOString().split("T")[0];
        if (!dailyRevMap[dateStr]) {
          dailyRevMap[dateStr] = { gross: 0, refund: 0 };
        }
        if (t.transaction_type === "PAYMENT") {
          dailyRevMap[dateStr].gross += Number(t.amount);
        } else if (t.transaction_type === "REFUND") {
          dailyRevMap[dateStr].refund += Number(t.amount);
        }
      });
    }

    // Upsert daily revenue
    for (const [date, val] of Object.entries(dailyRevMap)) {
      const net = val.gross - val.refund;
      const { error: upsertErr } = await db
        .from("analytics_daily_revenue")
        .upsert({
          date: date,
          gross_amount: val.gross,
          refund_amount: val.refund,
          net_amount: net
        }, { onConflict: "date" });
      if (upsertErr) console.error("[Aggregator] Daily revenue upsert error:", upsertErr);
    }

    // 4. Perform Geography Aggregation
    // Fetch real candidate scores to compute geographic averages
    const { data: results, error: resErr } = await db
      .from("assessment_results")
      .select("score, candidate_id");

    if (resErr) console.error("[Aggregator] Results fetch error:", resErr);

    const candidateScoresMap: Record<string, number> = {};
    results?.forEach((r: any) => {
      if (r.candidate_id) {
        candidateScoresMap[r.candidate_id.toUpperCase()] = Number(r.score);
      }
    });

    const geoScoresMap: Record<string, { totalScore: number; count: number }> = {};
    regs?.forEach((r: any) => {
      const stateName = r.state || "UNKNOWN";
      const districtName = r.district || "UNKNOWN";
      const geoKey = `${stateName}_${districtName}`;
      
      const lookupId = r.cnts_id || r.registration_id;
      if (lookupId && candidateScoresMap[lookupId.toUpperCase()] !== undefined) {
        if (!geoScoresMap[geoKey]) {
          geoScoresMap[geoKey] = { totalScore: 0, count: 0 };
        }
        geoScoresMap[geoKey].totalScore += candidateScoresMap[lookupId.toUpperCase()];
        geoScoresMap[geoKey].count++;
      }
    });

    for (const [geoKey, val] of Object.entries(geoMap)) {
      const scoreInfo = geoScoresMap[geoKey];
      const avgScore = scoreInfo && scoreInfo.count > 0 ? Number((scoreInfo.totalScore / scoreInfo.count).toFixed(2)) : null;
      const convRate = val.count > 0 ? Number(((val.completed / val.count) * 100).toFixed(2)) : 0;

      const { error: upsertErr } = await db
        .from("analytics_geography_summary")
        .upsert({
          state: val.state,
          district: val.district,
          total_candidates: val.count,
          average_score: avgScore,
          conversion_rate: convRate
        }, { onConflict: "state,district" });
      if (upsertErr) console.error("[Aggregator] Geography upsert error:", upsertErr);
    }

    // 5. Perform School Aggregation
    const schoolScoresMap: Record<string, { totalScore: number; count: number }> = {};
    regs?.forEach((r: any) => {
      if (r.school_id) {
        const lookupId = r.cnts_id || r.registration_id;
        if (lookupId && candidateScoresMap[lookupId.toUpperCase()] !== undefined) {
          if (!schoolScoresMap[r.school_id]) {
            schoolScoresMap[r.school_id] = { totalScore: 0, count: 0 };
          }
          schoolScoresMap[r.school_id].totalScore += candidateScoresMap[lookupId.toUpperCase()];
          schoolScoresMap[r.school_id].count++;
        }
      }
    });

    for (const [schoolId, val] of Object.entries(schoolMap)) {
      const scoreInfo = schoolScoresMap[schoolId];
      const avgScore = scoreInfo && scoreInfo.count > 0 ? Number((scoreInfo.totalScore / scoreInfo.count).toFixed(2)) : null;

      const { error: upsertErr } = await db
        .from("analytics_school_summary")
        .upsert({
          school_id: schoolId,
          total_students: val.total,
          used_sponsored: val.sponsored,
          average_score: avgScore
        }, { onConflict: "school_id" });
      if (upsertErr) console.error("[Aggregator] School summary upsert error:", upsertErr);
    }

    // 6. Perform Subject Aggregation
    const { data: attempts, error: attErr } = await db
      .from("question_attempts")
      .select("question_id, selected_answers, time_taken_seconds, session_id");

    const { data: questions, error: qErr } = await db
      .from("questions")
      .select("id, content");

    const { data: keys, error: keyErr } = await db
      .from("question_keys")
      .select("question_id, correct_options");

    if (!attErr && !qErr && !keyErr && attempts && questions && keys) {
      const questionMap = new Map<string, any>();
      questions.forEach((q: any) => questionMap.set(q.id, q));

      const keyMap = new Map<string, string[]>();
      keys.forEach((k: any) => {
        keyMap.set(k.question_id, Array.isArray(k.correct_options) ? k.correct_options : JSON.parse(k.correct_options || "[]"));
      });

      const subjectMap: Record<string, { total: number; correct: number; topics: Record<string, { total: number; correct: number }> }> = {};

      attempts.forEach((a: any) => {
        const q = questionMap.get(a.question_id);
        if (!q) return;

        const subjectName = q.content?.domain || "General Reasoning";
        const topicName = q.content?.topic || "General Deduction";

        if (!subjectMap[subjectName]) {
          subjectMap[subjectName] = { total: 0, correct: 0, topics: {} };
        }
        if (!subjectMap[subjectName].topics[topicName]) {
          subjectMap[subjectName].topics[topicName] = { total: 0, correct: 0 };
        }

        const selected = a.selected_answers || [];
        const correct = keyMap.get(a.question_id) || [];
        const isCorrect = selected.length === correct.length && selected.every((val: any) => correct.includes(val));

        subjectMap[subjectName].total++;
        subjectMap[subjectName].topics[topicName].total++;
        if (isCorrect) {
          subjectMap[subjectName].correct++;
          subjectMap[subjectName].topics[topicName].correct++;
        }
      });

      for (const [subj, val] of Object.entries(subjectMap)) {
        const avgScore = val.total > 0 ? Number(((val.correct / val.total) * 100).toFixed(2)) : 0;
        const weakTopics: string[] = [];
        for (const [topic, tVal] of Object.entries(val.topics)) {
          const topicAccuracy = tVal.total > 0 ? tVal.correct / tVal.total : 0;
          if (topicAccuracy < 0.50) {
            weakTopics.push(topic);
          }
        }

        const { error: upsertErr } = await db
          .from("analytics_subject_summary")
          .upsert({
            subject: subj,
            total_attempts: val.total,
            average_score: avgScore,
            weak_topics: weakTopics
          }, { onConflict: "subject" } as any);
        if (upsertErr) console.error("[Aggregator] Subject summary upsert error:", upsertErr);
      }
    }

    // 7. Perform Question Statistics & Psychometrics
    const { data: sessions, error: sessErr } = await db
      .from("candidate_sessions")
      .select("id, status, started_at, tab_switch_count, assessment_id");

    if (!sessErr && sessions && attempts && keys && questions) {
      // Group sessions by assessment
      const assessmentSessionsMap: Record<string, any[]> = {};
      sessions.forEach((s: any) => {
        // Scored valid session criteria: must be completed/submitted and duration/started_at valid
        const isValidSession = (s.status === "SUBMITTED" || s.status === "RESULT_GENERATED") && s.started_at !== null;
        if (isValidSession) {
          if (!assessmentSessionsMap[s.assessment_id]) {
            assessmentSessionsMap[s.assessment_id] = [];
          }
          assessmentSessionsMap[s.assessment_id].push(s);
        }
      });

      const keyMap = new Map<string, string[]>();
      keys.forEach((k: any) => {
        keyMap.set(k.question_id, Array.isArray(k.correct_options) ? k.correct_options : JSON.parse(k.correct_options || "[]"));
      });

      const questionMap = new Map<string, any>();
      questions.forEach((q: any) => questionMap.set(q.id, q));

      // Map session attempts
      const sessionAttemptsMap = new Map<string, any[]>();
      attempts.forEach((a: any) => {
        if (!sessionAttemptsMap.has(a.session_id)) {
          sessionAttemptsMap.set(a.session_id, []);
        }
        sessionAttemptsMap.get(a.session_id)!.push(a);
      });

      // Fetch score for each session from results to sort cohorts
      const sessionScoreMap = new Map<string, number>();
      results?.forEach((r: any) => {
        if (r.session_id) sessionScoreMap.set(r.session_id, Number(r.score));
      });

      // Process each question
      const processedQuestionsMap: Record<string, { totalVal: number; correctVal: number; totalTime: number; attemptsList: any[] }> = {};

      questions.forEach((q: any) => {
        processedQuestionsMap[q.id] = { totalVal: 0, correctVal: 0, totalTime: 0, attemptsList: [] };
      });

      for (const [asmId, sessList] of Object.entries(assessmentSessionsMap)) {
        const N = sessList.length;

        // Classify and collect attempts for each valid session
        sessList.forEach((s: any) => {
          const sAttempts = sessionAttemptsMap.get(s.id) || [];
          sAttempts.forEach((a: any) => {
            if (processedQuestionsMap[a.question_id]) {
              const selected = a.selected_answers || [];
              const correct = keyMap.get(a.question_id) || [];
              const isCorrect = selected.length === correct.length && selected.every((val: any) => correct.includes(val));

              processedQuestionsMap[a.question_id].totalVal++;
              processedQuestionsMap[a.question_id].totalTime += a.time_taken_seconds || 0;
              if (isCorrect) {
                processedQuestionsMap[a.question_id].correctVal++;
              }
              processedQuestionsMap[a.question_id].attemptsList.push({
                sessionId: s.id,
                isCorrect,
                score: sessionScoreMap.get(s.id) || 0
              });
            }
          });
        });

        // Calculate Discrimination index if sample size is sufficient (N >= 30)
        const k = Math.round(N * 0.27);
        const sortedSessions = [...sessList].sort((a, b) => (sessionScoreMap.get(a.id) || 0) - (sessionScoreMap.get(b.id) || 0));
        
        const lowerCohort = new Set(sortedSessions.slice(0, k).map(s => s.id));
        const upperCohort = new Set(sortedSessions.slice(N - k).map(s => s.id));

        const asmQuestions = questions.filter((q: any) => q.assessment_id === asmId);

        for (const q of asmQuestions) {
          const stats = processedQuestionsMap[q.id];
          if (!stats) continue;

          let difficulty: number | null = null;
          let discrimination: number | null = null;
          let status = "ACTIVE";

          // Difficulty insufficient checks: limit < 20 valid attempts
          if (stats.totalVal < 20) {
            difficulty = null;
            status = "INSUFFICIENT_SAMPLE";
          } else {
            difficulty = Number((stats.correctVal / stats.totalVal).toFixed(2));
          }

          // Discrimination checks: limit < 30 exam completions
          if (N < 30 || k === 0) {
            discrimination = null;
            if (status !== "INSUFFICIENT_SAMPLE") {
              status = "INSUFFICIENT_SAMPLE";
            }
          } else {
            // Count upper and lower accuracies
            let upperCorrect = 0, upperTotal = 0;
            let lowerCorrect = 0, lowerTotal = 0;

            stats.attemptsList.forEach(att => {
              if (upperCohort.has(att.sessionId)) {
                upperTotal++;
                if (att.isCorrect) upperCorrect++;
              }
              if (lowerCohort.has(att.sessionId)) {
                lowerTotal++;
                if (att.isCorrect) lowerCorrect++;
              }
            });

            const pU = upperTotal > 0 ? upperCorrect / upperTotal : 0;
            const pL = lowerTotal > 0 ? lowerCorrect / lowerTotal : 0;
            discrimination = Number((pU - pL).toFixed(2));
          }

          const avgTime = stats.totalVal > 0 ? Math.round(stats.totalTime / stats.totalVal) : 0;

          await db
            .from("analytics_question_statistics")
            .upsert({
              question_id: q.id,
              total_attempts: stats.totalVal,
              correct_attempts: stats.correctVal,
              average_solve_time_seconds: avgTime,
              difficulty_index: difficulty,
              discrimination_index: discrimination,
              sample_size: stats.totalVal,
              status: status
            }, { onConflict: "question_id" });
        }
      }
    }

    return NextResponse.json({ success: true, message: "Aggregation pipeline executed successfully." });

  } catch (error: any) {
    console.error("[Internal Aggregator] Pipeline failure:", error);
    return NextResponse.json({ success: false, message: "Failed to run aggregation pipeline." }, { status: 500 });
  }
}
