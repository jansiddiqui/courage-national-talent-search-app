/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { publishQuestionsForAssessment } from "@/domains/admin/QuestionGovernanceService";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";
import { writeAuditEntry } from "@/domains/admin/AdminAuditService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // 1. Sandbox fallback data
    if (!hasSupabaseAdminConfig) {
      const mockAssessments = [
        {
          id: "asm-1",
          title: "CNTS 2026 Mathematics Mock Paper 1",
          type: "MOCK_EXAM",
          duration_minutes: 60,
          sections: [
            { name: "Logical Reasoning", questionCount: 15, marks: 4.0, negativeMarks: 1.0 },
            { name: "Mathematics", questionCount: 15, marks: 4.0, negativeMarks: 1.0 }
          ],
          is_published: true,
          created_at: new Date().toISOString()
        },
        {
          id: "asm-2",
          title: "Reasoning Diagnostic Practice quiz",
          type: "PRACTICE_TEST",
          duration_minutes: 40,
          sections: [
            { name: "Analogies", questionCount: 10, marks: 3.0, negativeMarks: 0.0 }
          ],
          is_published: false,
          created_at: new Date().toISOString()
        }
      ];

      if (type) {
        return NextResponse.json({ success: true, assessments: mockAssessments.filter(a => a.type === type) });
      }
      return NextResponse.json({ success: true, assessments: mockAssessments });
    }


    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
      return NextResponse.json({ success: false, message: "Authentication session required." }, { status: 401 });
    }

    const payload = await verifySession(sessionCookie.value, JWT_SECRET);
    if (!payload || !payload.id) {
      return NextResponse.json({ success: false, message: "Forbidden: Admin session required." }, { status: 403 });
    }

    const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id, "assessment.update");
    if (!hasPerm) {
      return NextResponse.json({ success: false, message: "Forbidden: assessment.update permission required." }, { status: 403 });
    }

    // 2. Fetch from DB
    let query = (supabaseAdmin as any)
      .from("assessments")
      .select("*")
      .order("created_at", { ascending: false });

    if (type) {
      query = query.eq("type", type);
    }

    const { data: assessments, error } = await query;
    if (error) {
      console.error("[Exams API] GET error:", error);
      return NextResponse.json({ success: false, message: "Database query error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, assessments });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Sandbox Check — bypass auth if DB is not configured
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({
        success: true,
        assessment: {
          id: "mock-asm-id",
          title: "CNTS 2026 Mathematics Mock Paper 1",
          type: "MOCK_EXAM",
          duration_minutes: 60,
          sections: [
            { name: "Logical Reasoning", questionCount: 15, marks: 4.0, negativeMarks: 1.0 },
            { name: "Mathematics", questionCount: 15, marks: 4.0, negativeMarks: 1.0 }
          ],
          is_published: true,
          created_at: new Date().toISOString()
        }
      });
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
      return NextResponse.json({ success: false, message: "Authentication session required." }, { status: 401 });
    }

    const payload = await verifySession(sessionCookie.value, JWT_SECRET);
    if (!payload || !payload.id) {
      return NextResponse.json({ success: false, message: "Forbidden: Admin session required." }, { status: 403 });
    }

    const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id, "assessment.update");
    if (!hasPerm) {
      return NextResponse.json({ success: false, message: "Forbidden: assessment.update permission required." }, { status: 403 });
    }

    if (hasSupabaseAdminConfig) {
      const body = await request.json();
      const {
        id,
        title,
        type,
        duration_minutes,
        sections,
        is_published,
        questionBankIds
      } = body;

      if (!title || !type || !duration_minutes || !sections || !Array.isArray(sections)) {
        return NextResponse.json({ success: false, message: "Missing required parameters" }, { status: 400 });
      }

      let resultAssessment: any = null;

      if (id) {
        // Fetch current assessment for audit logging comparison
        const { data: current } = await (supabaseAdmin as any)
          .from("assessments")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        const { data: updated, error: updateErr } = await (supabaseAdmin as any)
          .from("assessments")
          .update({
            title: title.trim(),
            type,
            duration_minutes: Number(duration_minutes),
            sections,
            is_published: !!is_published
          })
          .eq("id", id)
          .select()
          .maybeSingle();

        if (updateErr) {
          console.error("[Exams API] Update DB error:", updateErr);
          return NextResponse.json({ success: false, message: "Database update error" }, { status: 500 });
        }
        resultAssessment = updated;

        // Log operation in audit trail using writeAuditEntry
        await writeAuditEntry(supabaseAdmin, {
          actorId: payload.id,
          actorRole: payload.role || "admin",
          action: "UPDATED_ASSESSMENT",
          module: "EXAMS",
          previousValue: current || {},
          newValue: updated || {},
          ipAddress: request.headers.get("x-forwarded-for") || "unknown"
        });
      } else {
        const { data: inserted, error: insertErr } = await (supabaseAdmin as any)
          .from("assessments")
          .insert({
            title: title.trim(),
            type,
            duration_minutes: Number(duration_minutes),
            sections,
            is_published: !!is_published
          })
          .select()
          .maybeSingle();

        if (insertErr) {
          console.error("[Exams API] Insert DB error:", insertErr);
          return NextResponse.json({ success: false, message: "Database insert error" }, { status: 500 });
        }
        resultAssessment = inserted;

        // Log operation in audit trail using writeAuditEntry
        await writeAuditEntry(supabaseAdmin, {
          actorId: payload.id,
          actorRole: payload.role || "admin",
          action: "CREATED_ASSESSMENT",
          module: "EXAMS",
          previousValue: {},
          newValue: inserted || {},
          ipAddress: request.headers.get("x-forwarded-for") || "unknown"
        });
      }

      // If assessment is published, snapshot the questions
      if (is_published && Array.isArray(questionBankIds) && questionBankIds.length > 0) {
        await publishQuestionsForAssessment(supabaseAdmin, resultAssessment.id, questionBankIds);
      }

      return NextResponse.json({ success: true, assessment: resultAssessment });
    }

    // Sandbox Mock response
    return NextResponse.json({
      success: true,
      assessment: {
        id: "mock-assessment-id",
        title: "Mock Assessment Name",
        type: "MOCK_EXAM",
        duration_minutes: 60,
        sections: [],
        is_published: true,
        created_at: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error("[Exams API] POST Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
