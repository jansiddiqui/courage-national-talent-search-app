import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cntsId = searchParams.get("cntsId")?.trim().toUpperCase();

    if (!JWT_SECRET) {
      return NextResponse.json({ success: false, message: "Server misconfiguration" }, { status: 500 });
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(sessionCookie.value, JWT_SECRET);
    if (!session) {
      return NextResponse.json({ success: false, message: "Session expired" }, { status: 401 });
    }

    // Resolve target cntsId
    const targetId = cntsId || session.cntsId;
    if (!targetId) {
      return NextResponse.json({ success: false, message: "Candidate ID is required" }, { status: 400 });
    }

    const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN" || session.role === "VOLUNTEER";

    if (!hasSupabaseAdminConfig) {
      // Sandbox mode mock progress
      return NextResponse.json({
        success: true,
        progress: {
          profile: {
            id: targetId,
            preferredLanguage: "en",
            preferredLearningMode: "beginner",
            totalXP: 350,
            streak: 3,
            joinedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
            lastActive: Date.now()
          },
          completedTopics: ["number-series", "alphabet-series"],
          completedQuestions: ["q1", "q2", "q3"],
          bookmarks: [],
          achievements: [
            { id: "quest_begun", title: { en: "Quest Begun", hi: "खोज शुरू" }, description: { en: "Solved your first practice question.", hi: "पहला अभ्यास प्रश्न।" }, icon: "⭐", unlockedAt: Date.now() }
          ],
          skillsXP: { "Verbal": 120, "Numerical": 130 },
          sessions: [
            { sessionId: "s1", startTime: Date.now() - 3600000, endTime: Date.now(), topicsVisited: ["number-series"], questionsAttempted: 10, correctAnswers: 8, xpEarned: 250 }
          ]
        }
      });
    }

    // 1. Authorize: fetch registrations associated with this parent session
    let authorized = false;
    if (isAdmin) {
      authorized = true;
    } else {
      // Find candidate registrations for this parent email or phone
      const filters = [];
      if (session.cntsId) {
        filters.push(`cnts_id.eq.${session.cntsId}`);
        filters.push(`registration_id.eq.${session.cntsId}`);
      }
      if (session.email) {
        filters.push(`parent_email.eq.${session.email}`);
      }
      if (session.phone) {
        filters.push(`mobile_number.eq.${session.phone}`);
        filters.push(`whatsapp_number.eq.${session.phone}`);
      }

      if (filters.length > 0) {
        const { data: regs } = await (supabaseAdmin as any)
          .from("registrations")
          .select("cnts_id, registration_id")
          .or(filters.join(","));

        if (regs) {
          authorized = regs.some(
            (r: any) =>
              (r.cnts_id && r.cnts_id.toUpperCase() === targetId) ||
              (r.registration_id && r.registration_id.toUpperCase() === targetId)
          );
        }
      }
    }

    if (!authorized) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    // 2. Fetch Progress from public.student_progress table
    const { data: progressRow, error } = await (supabaseAdmin as any)
      .from("student_progress")
      .select("progress_data")
      .eq("cnts_id", targetId)
      .maybeSingle();

    if (error) {
      console.error("[Progress API] Get error:", error);
      return NextResponse.json({ success: false, message: "Database query error" }, { status: 500 });
    }

    if (!progressRow) {
      // Return success but progress: null (caller will construct defaults)
      return NextResponse.json({ success: true, progress: null });
    }

    return NextResponse.json({ success: true, progress: progressRow.progress_data });
  } catch (err: any) {
    console.error("[Progress API] GET exception:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { progress } = await request.json();
    if (!progress) {
      return NextResponse.json({ success: false, message: "Progress payload is required" }, { status: 400 });
    }

    if (!JWT_SECRET) {
      return NextResponse.json({ success: false, message: "Server misconfiguration" }, { status: 500 });
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(sessionCookie.value, JWT_SECRET);
    if (!session) {
      return NextResponse.json({ success: false, message: "Session expired" }, { status: 401 });
    }

    const targetId = session.cntsId;
    if (!targetId) {
      return NextResponse.json({ success: false, message: "Direct student session required for saving progress" }, { status: 403 });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, message: "Progress saved (Sandbox)" });
    }

    // Upsert Progress row in public.student_progress
    const { error } = await (supabaseAdmin as any)
      .from("student_progress")
      .upsert({
        cnts_id: targetId,
        progress_data: progress,
        updated_at: new Date().toISOString()
      }, { onConflict: "cnts_id" });

    if (error) {
      console.error("[Progress API] Upsert error:", error);
      return NextResponse.json({ success: false, message: "Database save failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Progress API] POST exception:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
