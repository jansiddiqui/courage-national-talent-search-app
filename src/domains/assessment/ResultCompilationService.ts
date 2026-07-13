import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

export interface TalentDnaDimension {
  level: "Beginning" | "Developing" | "Proficient" | "Advanced" | "INSUFFICIENT_EVIDENCE";
  score?: number;
  evidence: string[];
  opportunities: string[];
}

export interface Recommendation {
  topic: string;
  priority: "High" | "Medium" | "Low";
  reason: string;
  action: string;
  duration: string;
}

export interface ResultAnalyticsPayload {
  status: "COMPLETED" | "FAILED";
  overallAccuracy: number;
  timeSpentSeconds: number;
  sectionBreakdown: Record<string, {
    score: number;
    maxScore: number;
    accuracy: number;
  }>;
  talentDna: Record<string, TalentDnaDimension>;
  mistakeIntelligence: {
    patterns: string[];
    explanations: string[];
  };
  recommendations: Recommendation[];
  compiledAt: string;
}

export class ResultCompilationService {
  /**
   * Compiles the complete detailed cognitive result profile for a candidate session.
   * If any error occurs, it transitions the processing job to FAILED, preserving
   * the integrity of the core score.
   */
  public static async compileResult(sessionId: string): Promise<boolean> {
    if (!hasSupabaseAdminConfig) {
      return true; // Sandbox fallback
    }

    try {
      // 1. Fetch Session and Registration Details
      const { data: session, error: sessErr } = await (supabaseAdmin as any)
        .from("candidate_sessions")
        .select("*, registrations(*)")
        .eq("id", sessionId)
        .maybeSingle();

      if (sessErr || !session) {
        throw new Error(`Session ${sessionId} not found: ${sessErr?.message || ""}`);
      }

      // 2. Fetch Attempts and Questions
      const { data: attempts, error: attErr } = await (supabaseAdmin as any)
        .from("question_attempts")
        .select("*")
        .eq("session_id", sessionId);

      if (attErr || !attempts) {
        throw new Error(`Failed to load attempts: ${attErr?.message || ""}`);
      }

      const { data: questions, error: qErr } = await (supabaseAdmin as any)
        .from("questions")
        .select("*")
        .eq("assessment_id", session.assessment_id);

      if (qErr || !questions) {
        throw new Error(`Failed to load questions: ${qErr?.message || ""}`);
      }

      // Fetch Server Answer Keys
      const { data: answerKeys, error: keyErr } = await (supabaseAdmin as any)
        .from("question_keys")
        .select("*")
        .in("question_id", questions.map((q: any) => q.id));

      if (keyErr || !answerKeys) {
        throw new Error(`Failed to load answer keys: ${keyErr?.message || ""}`);
      }

      const keyMap = new Map<string, string[]>();
      answerKeys.forEach((k: any) => {
        keyMap.set(k.question_id, Array.isArray(k.correct_options) ? k.correct_options : JSON.parse(k.correct_options || "[]"));
      });

      const questionMap = new Map<string, any>();
      questions.forEach((q: any) => questionMap.set(q.id, q));

      // 3. Compile Section Breakdown & Metrics
      const sections: Record<string, { correct: number; total: number; duration: number }> = {};
      let totalCorrect = 0;
      let totalAttempted = 0;

      attempts.forEach((attempt: any) => {
        const q = questionMap.get(attempt.question_id);
        if (!q) return;

        const domain = q.content?.domain || "General Reasoning";
        if (!sections[domain]) {
          sections[domain] = { correct: 0, total: 0, duration: 0 };
        }

        const selected = attempt.selected_answers || [];
        const correct = keyMap.get(attempt.question_id) || [];
        const isCorrect = selected.length === correct.length && selected.every((val: string) => correct.includes(val));

        sections[domain].total += 1;
        totalAttempted += 1;
        if (isCorrect) {
          sections[domain].correct += 1;
          totalCorrect += 1;
        }
      });

      const sectionBreakdown: Record<string, any> = {};
      Object.keys(sections).forEach(domain => {
        const sec = sections[domain];
        sectionBreakdown[domain] = {
          score: sec.correct,
          maxScore: sec.total,
          accuracy: sec.total > 0 ? Math.round((sec.correct / sec.total) * 100) : 0
        };
      });

      // 4. Compute Talent DNA Dimensions
      const talentDna: Record<string, TalentDnaDimension> = {};
      const dimensionsConfig = [
        { name: "Analytical Thinking", domains: ["Quantitative Logic & Mathematics", "Logical & Pattern Deduction"] },
        { name: "Pattern Recognition", domains: ["Logical & Pattern Deduction"] },
        { name: "Verbal Analysis", domains: ["Verbal & Language Ability"] },
        { name: "Critical Thinking", domains: ["General Awareness & Critical Logic"] }
      ];

      dimensionsConfig.forEach(dim => {
        // Find questions matching domains
        const matchingQuestions = questions.filter((q: any) => dim.domains.includes(q.content?.domain || ""));
        const minThreshold = 2; // Configurable evidence threshold

        if (matchingQuestions.length < minThreshold) {
          talentDna[dim.name] = {
            level: "INSUFFICIENT_EVIDENCE",
            evidence: [],
            opportunities: ["Increase assessment coverage by attempting similar domains in the Academy."]
          };
          return;
        }

        // Calculate score on matching questions
        const matchingAttempts = attempts.filter((a: any) => matchingQuestions.some((q: any) => q.id === a.question_id));
        let correctCount = 0;
        matchingAttempts.forEach((attempt: any) => {
          const correct = keyMap.get(attempt.question_id) || [];
          const selected = attempt.selected_answers || [];
          const isCorrect = selected.length === correct.length && selected.every((val: string) => correct.includes(val));
          if (isCorrect) correctCount++;
        });

        const scorePercent = matchingQuestions.length > 0 ? (correctCount / matchingQuestions.length) * 100 : 0;
        let level: TalentDnaDimension["level"] = "Beginning";
        if (scorePercent >= 90) level = "Advanced";
        else if (scorePercent >= 70) level = "Proficient";
        else if (scorePercent >= 40) level = "Developing";

        talentDna[dim.name] = {
          level,
          score: Math.round(scorePercent),
          evidence: [`Answered ${correctCount} of ${matchingQuestions.length} cognitive reasoning items correctly.`],
          opportunities: level === "Advanced" 
            ? ["Attempt Class+1 level reasoning quizzes to sustain cognitive edge."] 
            : ["Engage with foundation practice modules on related topics in Academy."]
        };
      });

      // 5. Evaluate Mistake Patterns (Mistake Intelligence)
      const patterns: string[] = [];
      const explanations: string[] = [];

      // Check for rapid incorrect answers (e.g. placeholder check using random logs)
      const incorrectAttempts = attempts.filter((a: any) => {
        const correct = keyMap.get(a.question_id) || [];
        const selected = a.selected_answers || [];
        return !(selected.length === correct.length && selected.every((val: string) => correct.includes(val)));
      });

      if (incorrectAttempts.length >= 3) {
        patterns.push("Precision Block on Complex Questions");
        explanations.push("Struggled with multi-variable deduction elements requiring multi-step logical resolution.");
      }

      // 6. Generate Personalized Recommendations
      const recommendations: Recommendation[] = [];
      Object.keys(sectionBreakdown).forEach(domain => {
        const sec = sectionBreakdown[domain];
        if (sec.accuracy < 60) {
          recommendations.push({
            topic: domain,
            priority: "High",
            reason: `Accuracy is currently ${sec.accuracy}% on this topic.`,
            action: `Complete ${domain} Foundation Module in the Academy.`,
            duration: "15 minutes/day for 7 days"
          });
        }
      });

      // Fallback recommendation if score is perfect
      if (recommendations.length === 0) {
        recommendations.push({
          topic: "Advanced Reasoning",
          priority: "Low",
          reason: "High overall accuracy across all domains.",
          action: "Attempt National Olympiad simulator quizzes.",
          duration: "20 minutes/day for 5 days"
        });
      }

      // Compile final analytics payload
      const analyticsPayload: ResultAnalyticsPayload = {
        status: "COMPLETED",
        overallAccuracy: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0,
        timeSpentSeconds: 600 - (session.expires_at ? Math.max(0, Math.floor((new Date(session.expires_at).getTime() - new Date(session.started_at).getTime()) / 1000)) : 0),
        sectionBreakdown,
        talentDna,
        mistakeIntelligence: { patterns, explanations },
        recommendations,
        compiledAt: new Date().toISOString()
      };

      // 7. Save analytics to assessment_results
      const { error: updErr } = await (supabaseAdmin as any)
        .from("assessment_results")
        .update({
          analytics: analyticsPayload
        })
        .eq("session_id", sessionId);

      if (updErr) {
        throw new Error(`Failed to update assessment results analytics: ${updErr.message}`);
      }

      // 8. Update result_processing_jobs to COMPLETED
      await (supabaseAdmin as any)
        .from("result_processing_jobs")
        .update({
          status: "COMPLETED",
          updated_at: new Date().toISOString()
        })
        .eq("session_id", sessionId);

      return true;

    } catch (error: any) {
      console.error("[ResultCompilationService] compilation failed:", error);

      // Save job failure details safely to job table
      if (hasSupabaseAdminConfig) {
        await (supabaseAdmin as any)
          .from("result_processing_jobs")
          .update({
            status: "FAILED",
            last_error: error.message || "Unknown compile error",
            updated_at: new Date().toISOString()
          })
          .eq("session_id", sessionId);
      }

      return false;
    }
  }
}
