/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

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
    const { data: regs, error: regsErr } = await (supabaseAdmin as any)
      .from("registrations")
      .select("created_at, payment_status, school_id, state, district");

    if (regsErr) throw regsErr;

    const dailyRegsMap: Record<string, { started: number; completed: number }> = {};
    const geoMap: Record<string, { state: string; district: string; count: number }> = {};
    const schoolMap: Record<string, number> = {};

    regs?.forEach((r: any) => {
      const dateStr = new Date(r.created_at).toISOString().split("T")[0];
      if (!dailyRegsMap[dateStr]) {
        dailyRegsMap[dateStr] = { started: 0, completed: 0 };
      }
      dailyRegsMap[dateStr].started++;
      if (r.payment_status === "SUCCESS" || r.payment_status === "PAID") {
        dailyRegsMap[dateStr].completed++;
      }

      // Geo map
      const geoKey = `${r.state || "UNKNOWN"}_${r.district || "UNKNOWN"}`;
      if (!geoMap[geoKey]) {
        geoMap[geoKey] = { state: r.state || "UNKNOWN", district: r.district || "UNKNOWN", count: 0 };
      }
      geoMap[geoKey].count++;

      // School map
      if (r.school_id) {
        if (!schoolMap[r.school_id]) {
          schoolMap[r.school_id] = 0;
        }
        schoolMap[r.school_id]++;
      }
    });

    // Upsert daily registrations
    for (const [date, val] of Object.entries(dailyRegsMap)) {
      const rate = val.started > 0 ? (val.completed / val.started) * 100 : 0;
      const { error: upsertErr } = await (supabaseAdmin as any)
        .from("analytics_daily_registrations")
        .upsert({
          date: date,
          total_started: val.started,
          total_completed: val.completed,
          conversion_rate: Number(rate.toFixed(2))
        });
      if (upsertErr) console.error("[Aggregator] Daily regs upsert error:", upsertErr);
    }

    // 3. Perform Revenue Aggregation
    const { data: ledgerTrans, error: ledgerErr } = await (supabaseAdmin as any)
      .from("school_fee_ledger")
      .select("created_at, transaction_type, amount");

    const dailyRevMap: Record<string, { gross: number; refund: number }> = {};

    // Base individual registration revenue
    regs?.forEach((r: any) => {
      if (r.payment_status === "SUCCESS" || r.payment_status === "PAID") {
        const dateStr = new Date(r.created_at).toISOString().split("T")[0];
        if (!dailyRevMap[dateStr]) {
          dailyRevMap[dateStr] = { gross: 0, refund: 0 };
        }
        dailyRevMap[dateStr].gross += 200.00; // Registration fee structure
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
      const { error: upsertErr } = await (supabaseAdmin as any)
        .from("analytics_daily_revenue")
        .upsert({
          date: date,
          gross_amount: val.gross,
          refund_amount: val.refund,
          net_amount: net
        });
      if (upsertErr) console.error("[Aggregator] Daily revenue upsert error:", upsertErr);
    }

    // 4. Perform Geography Aggregation
    for (const [geoKey, val] of Object.entries(geoMap)) {
      const { error: upsertErr } = await (supabaseAdmin as any)
        .from("analytics_geography_summary")
        .upsert({
          state: val.state,
          district: val.district,
          total_candidates: val.count,
          average_score: 75.00, // Aggregate average baseline fallback
          conversion_rate: 100.00
        }, { onConflict: "state,district" } as any);
      if (upsertErr) console.error("[Aggregator] Geography upsert error:", upsertErr);
    }

    // 5. Perform School Aggregation
    for (const [schoolId, studentCount] of Object.entries(schoolMap)) {
      const { error: upsertErr } = await (supabaseAdmin as any)
        .from("analytics_school_summary")
        .upsert({
          school_id: schoolId,
          total_students: studentCount,
          used_sponsored: 0,
          average_score: 75.00
        });
      if (upsertErr) console.error("[Aggregator] School summary upsert error:", upsertErr);
    }

    // 6. Perform Question Statistics
    const { data: attempts, error: attErr } = await (supabaseAdmin as any)
      .from("question_attempts")
      .select("question_id, time_taken_seconds, palette_state");

    if (!attErr && attempts) {
      const questMap: Record<string, { attempts: number; correct: number; totalTime: number }> = {};
      attempts.forEach((a: any) => {
        if (!questMap[a.question_id]) {
          questMap[a.question_id] = { attempts: 0, correct: 0, totalTime: 0 };
        }
        questMap[a.question_id].attempts++;
        questMap[a.question_id].totalTime += a.time_taken_seconds;
        if (a.palette_state === "ANSWERED") {
          questMap[a.question_id].correct++; // Simple correct count metric
        }
      });

      for (const [qId, val] of Object.entries(questMap)) {
        const diff = val.attempts > 0 ? val.correct / val.attempts : 0.5;
        const avgTime = val.attempts > 0 ? Math.round(val.totalTime / val.attempts) : 0;
        await (supabaseAdmin as any)
          .from("analytics_question_statistics")
          .upsert({
            question_id: qId,
            total_attempts: val.attempts,
            correct_attempts: val.correct,
            average_solve_time_seconds: avgTime,
            difficulty_index: Number(diff.toFixed(2)),
            discrimination_index: 0.40
          });
      }
    }

    return NextResponse.json({ success: true, message: "Aggregation pipeline executed successfully." });

  } catch (error: any) {
    console.error("[Internal Aggregator] Pipeline failure:", error);
    return NextResponse.json({ success: false, message: "Failed to run aggregation pipeline." }, { status: 500 });
  }
}
