/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject");

    // 1. Sandbox fallback data
    if (!hasSupabaseAdminConfig) {
      const mockQuestions = [
        {
          id: "q-1",
          question_text: "Solve: 25 * (45 - 20) / 5",
          explanation: "Subtract 20 from 45 first (25), multiply by 25 (625), divide by 5 (125).",
          difficulty_index: 0.35,
          bloom_taxonomy: "APPLYING",
          subject: "Mathematics",
          chapter: "Arithmetic",
          topic: "BODMAS",
          subtopic: "Order of operations",
          estimated_solve_time: 45,
          marks: 4.00,
          negative_marks: 1.00,
          options: [
            { id: "opt-1", text: "125", isCorrect: true },
            { id: "opt-2", text: "100", isCorrect: false },
            { id: "opt-3", text: "150", isCorrect: false },
            { id: "opt-4", text: "75", isCorrect: false }
          ],
          approval_status: "APPROVED",
          version: 1,
          created_at: new Date().toISOString()
        },
        {
          id: "q-2",
          question_text: "Find the odd one out: Circle, Sphere, Square, Triangle",
          explanation: "Sphere is a 3D shape while others are 2D flat shapes.",
          difficulty_index: 0.20,
          bloom_taxonomy: "ANALYZING",
          subject: "Reasoning",
          chapter: "Classification",
          topic: "Odd One Out",
          subtopic: "Geometric properties",
          estimated_solve_time: 30,
          marks: 3.00,
          negative_marks: 0.75,
          options: [
            { id: "opt-1", text: "Circle", isCorrect: false },
            { id: "opt-2", text: "Sphere", isCorrect: true },
            { id: "opt-3", text: "Square", isCorrect: false },
            { id: "opt-4", text: "Triangle", isCorrect: false }
          ],
          approval_status: "APPROVED",
          version: 1,
          created_at: new Date().toISOString()
        }
      ];

      if (subject) {
        return NextResponse.json({ success: true, questions: mockQuestions.filter(q => q.subject === subject) });
      }
      return NextResponse.json({ success: true, questions: mockQuestions });
    }

    // 2. Fetch from DB
    let query = (supabaseAdmin as any)
      .from("admin_question_bank")
      .select("*")
      .order("created_at", { ascending: false });

    if (subject) {
      query = query.eq("subject", subject);
    }

    const { data: questions, error } = await query;
    if (error) {
      console.error("[Questions API] GET error:", error);
      return NextResponse.json({ success: false, message: "Database query error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, questions });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (hasSupabaseAdminConfig) {
      if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
        return NextResponse.json({ success: false, message: "Authentication session required." }, { status: 401 });
      }

      const payload = await verifySession(sessionCookie.value, JWT_SECRET);
      if (!payload || payload.role !== "admin") {
        return NextResponse.json({ success: false, message: "Forbidden: Admin access required." }, { status: 403 });
      }

      const body = await request.json();
      const {
        id,
        question_text,
        explanation,
        difficulty_index,
        bloom_taxonomy,
        subject,
        chapter,
        topic,
        subtopic,
        estimated_solve_time,
        marks,
        negative_marks,
        options,
        approval_status
      } = body;

      if (!question_text || !subject || !chapter || !topic || !options || !Array.isArray(options)) {
        return NextResponse.json({ success: false, message: "Missing required parameters" }, { status: 400 });
      }

      let resultQuestion: any = null;

      if (id) {
        // Fetch current version for increment
        const { data: current } = await (supabaseAdmin as any)
          .from("admin_question_bank")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        const currentVersion = current?.version || 1;

        const { data: updated, error: updateErr } = await (supabaseAdmin as any)
          .from("admin_question_bank")
          .update({
            question_text,
            explanation,
            difficulty_index: Number(difficulty_index || 0.50),
            bloom_taxonomy,
            subject,
            chapter,
            topic,
            subtopic,
            estimated_solve_time: Number(estimated_solve_time || 60),
            marks: Number(marks || 4.00),
            negative_marks: Number(negative_marks || 0.00),
            options,
            approval_status,
            version: currentVersion + 1
          })
          .eq("id", id)
          .select()
          .maybeSingle();

        if (updateErr) {
          console.error("[Questions API] Update DB error:", updateErr);
          return NextResponse.json({ success: false, message: "Database update error" }, { status: 500 });
        }
        resultQuestion = updated;

        // Log operation in audit trail
        await (supabaseAdmin as any).from("admin_operations_audit_trail").insert({
          actor_id: payload.cntsId || null,
          actor_role: "ADMIN",
          action: "MODIFIED_QUESTION",
          module: "QUESTIONS",
          previous_value: current || {},
          new_value: updated || {},
          ip_address: request.headers.get("x-forwarded-for") || "unknown"
        });
      } else {
        const { data: inserted, error: insertErr } = await (supabaseAdmin as any)
          .from("admin_question_bank")
          .insert({
            question_text,
            explanation,
            difficulty_index: Number(difficulty_index || 0.50),
            bloom_taxonomy: bloom_taxonomy || "UNDERSTANDING",
            subject,
            chapter,
            topic,
            subtopic,
            estimated_solve_time: Number(estimated_solve_time || 60),
            marks: Number(marks || 4.00),
            negative_marks: Number(negative_marks || 0.00),
            options,
            approval_status: approval_status || "DRAFT",
            version: 1
          })
          .select()
          .maybeSingle();

        if (insertErr) {
          console.error("[Questions API] Insert DB error:", insertErr);
          return NextResponse.json({ success: false, message: "Database insert error" }, { status: 500 });
        }
        resultQuestion = inserted;

        // Log operation in audit trail
        await (supabaseAdmin as any).from("admin_operations_audit_trail").insert({
          actor_id: payload.cntsId || null,
          actor_role: "ADMIN",
          action: "CREATED_QUESTION",
          module: "QUESTIONS",
          previous_value: {},
          new_value: inserted || {},
          ip_address: request.headers.get("x-forwarded-for") || "unknown"
        });
      }

      return NextResponse.json({ success: true, question: resultQuestion });
    }

    // Sandbox Mock response
    return NextResponse.json({
      success: true,
      question: {
        id: "mock-question-id",
        question_text: "Mock Question Text Details",
        explanation: "Mock Explanation details",
        difficulty_index: 0.50,
        bloom_taxonomy: "UNDERSTANDING",
        subject: "Mathematics",
        chapter: "Algebra",
        topic: "Equations",
        subtopic: "Linear equations",
        estimated_solve_time: 60,
        marks: 4.00,
        negative_marks: 1.00,
        options: [],
        approval_status: "DRAFT",
        version: 1,
        created_at: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error("[Questions API] POST Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
