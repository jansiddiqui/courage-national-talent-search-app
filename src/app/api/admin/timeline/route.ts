/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { TimelineService } from "@/domains/timeline/TimelineService";
import { writeAuditEntry } from "@/domains/admin/AdminAuditService";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Helper to authenticate admin
async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");
  if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) return null;

  const session = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!session) return null;

  const allowedAdminRoles = ["ADMIN", "SUPER_ADMIN", "VOLUNTEER", "EXAM_MANAGER"];
  if (!allowedAdminRoles.includes(session.role)) return null;

  return session;
}

export async function GET(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const selectedYear = searchParams.get("year") ? parseInt(searchParams.get("year")!, 10) : undefined;

    if (!hasSupabaseAdminConfig) {
      const config = await TimelineService.getTimelineConfig();
      const events = await TimelineService.getTimelineEvents();
      return NextResponse.json({
        success: true,
        editions: [
          {
            id: "fallback-2026",
            edition_year: 2026,
            name: "Courage National Talent Search 2026",
            slug: "cnts-2026",
            status: "PUBLISHED",
            is_current: true,
            registration_status: "OPEN",
            exam_status: "SCHEDULED",
            results_status: "SCHEDULED",
            certificates_status: "SCHEDULED",
            awards_status: "SCHEDULED",
            admit_card_status: "SCHEDULED"
          }
        ],
        activeEdition: config,
        events
      });
    }

    // 1. Fetch all editions
    const { data: editions, error: edErr } = await (supabaseAdmin as any)
      .from("cnts_editions")
      .select("*")
      .order("edition_year", { ascending: false });

    if (edErr) {
      console.error("[Admin Timeline API] Editions query error:", edErr);
      return NextResponse.json({ success: false, message: "Database query error" }, { status: 500 });
    }

    // Determine target edition
    const currentEdition = editions?.find((e: any) => e.is_current) || editions?.[0];
    const targetEdition = selectedYear 
      ? editions?.find((e: any) => e.edition_year === selectedYear) || currentEdition
      : currentEdition;

    // 2. Fetch timeline events for the target edition
    let events: any[] = [];
    if (targetEdition) {
      const { data: evData, error: evErr } = await (supabaseAdmin as any)
        .from("cnts_timeline_events")
        .select("*")
        .eq("edition_id", targetEdition.id)
        .order("display_order", { ascending: true });

      if (!evErr && evData) {
        events = evData;
      }
    }

    const config = await TimelineService.getTimelineConfig();

    return NextResponse.json({
      success: true,
      editions: editions || [],
      currentEdition,
      targetEdition,
      activeConfig: config,
      events
    });
  } catch (error: any) {
    console.error("[Admin Timeline API] Exception:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * POST: Create a new Annual CNTS Edition (e.g. CNTS 2027) with template events
 */
export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, message: "Forbidden: Admin authority required" }, { status: 403 });
    }

    const body = await request.json();
    const { editionYear, name, theme, status = "DRAFT", templateYear } = body;

    if (!editionYear || !name) {
      return NextResponse.json({ success: false, message: "Edition Year and Name are required" }, { status: 400 });
    }

    const yearNum = parseInt(editionYear, 10);
    const slug = `cnts-${yearNum}`;

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, message: "Sandbox mock: Edition created successfully" });
    }

    // Check if edition already exists
    const { data: existing } = await (supabaseAdmin as any)
      .from("cnts_editions")
      .select("id")
      .eq("edition_year", yearNum)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: false, message: `Edition for year ${yearNum} already exists` }, { status: 409 });
    }

    // Insert new edition
    const { data: newEdition, error: insErr } = await (supabaseAdmin as any)
      .from("cnts_editions")
      .insert({
        edition_year: yearNum,
        name,
        slug,
        theme: theme || `${yearNum} National Edition`,
        status,
        is_current: false,
        registration_status: "UPCOMING",
        exam_status: "SCHEDULED",
        results_status: "SCHEDULED",
        certificates_status: "SCHEDULED",
        awards_status: "SCHEDULED",
        admit_card_status: "SCHEDULED"
      })
      .select()
      .single();

    if (insErr || !newEdition) {
      console.error("[Admin Timeline API] Insert edition error:", insErr);
      return NextResponse.json({ success: false, message: "Failed to create new edition" }, { status: 500 });
    }

    // Fetch template events from previous year (default 2026) and shift dates by (yearNum - templateYear)
    const baseYear = templateYear || 2026;
    const { data: baseEdition } = await (supabaseAdmin as any)
      .from("cnts_editions")
      .select("id")
      .eq("edition_year", baseYear)
      .maybeSingle();

    if (baseEdition) {
      const { data: baseEvents } = await (supabaseAdmin as any)
        .from("cnts_timeline_events")
        .select("*")
        .eq("edition_id", baseEdition.id);

      if (baseEvents && baseEvents.length > 0) {
        const yearDiff = yearNum - baseYear;
        const newEvents = baseEvents.map((e: any) => {
          const startDate = new Date(e.start_at);
          startDate.setFullYear(startDate.getFullYear() + yearDiff);
          
          let endDate = null;
          if (e.end_at) {
            const endD = new Date(e.end_at);
            endD.setFullYear(endD.getFullYear() + yearDiff);
            endDate = endD.toISOString();
          }

          return {
            edition_id: newEdition.id,
            event_key: e.event_key,
            title: e.title.replace(String(baseYear), String(yearNum)),
            short_title: e.short_title,
            description: e.description,
            start_at: startDate.toISOString(),
            end_at: endDate,
            timezone: e.timezone || "Asia/Kolkata",
            event_type: e.event_type,
            audience: e.audience,
            status: "UPCOMING",
            is_public: e.is_public,
            is_active: e.is_active,
            display_order: e.display_order,
            icon: e.icon,
            metadata: e.metadata
          };
        });

        await (supabaseAdmin as any).from("cnts_timeline_events").insert(newEvents);
      }
    }

    // Write audit log
    await writeAuditEntry(supabaseAdmin, {
      actorId: session.id || "admin",
      actorRole: session.role || "ADMIN",
      action: "CREATE_CNTS_EDITION",
      module: "TIMELINE",
      previousValue: {},
      newValue: { editionYear: yearNum, name, status },
      ipAddress: "127.0.0.1",
      reason: "Created new annual CNTS edition"
    });

    TimelineService.invalidateCache();

    return NextResponse.json({
      success: true,
      message: `CNTS ${yearNum} edition created successfully with template timeline.`,
      edition: newEdition
    });
  } catch (error: any) {
    console.error("[Admin Timeline API] Create Edition Exception:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal server error" }, { status: 500 });
  }
}

/**
 * PUT: Update individual timeline event or edition release statuses
 */
export async function PUT(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { action, editionId, eventId, eventUpdates, editionUpdates, reason } = body;

    if (!hasSupabaseAdminConfig) {
      TimelineService.invalidateCache();
      return NextResponse.json({ success: true, message: "Sandbox mock: Update successful" });
    }

    if (action === "UPDATE_EVENT" && eventId) {
      const { data: existingEvent } = await (supabaseAdmin as any)
        .from("cnts_timeline_events")
        .select("*")
        .eq("id", eventId)
        .maybeSingle();

      const { data: updated, error: updErr } = await (supabaseAdmin as any)
        .from("cnts_timeline_events")
        .update({
          ...eventUpdates,
          updated_at: new Date().toISOString()
        })
        .eq("id", eventId)
        .select()
        .single();

      if (updErr) {
        return NextResponse.json({ success: false, message: updErr.message }, { status: 500 });
      }

      await writeAuditEntry(supabaseAdmin, {
        actorId: session.id || "admin",
        actorRole: session.role || "ADMIN",
        action: "UPDATE_TIMELINE_EVENT",
        module: "TIMELINE",
        previousValue: { start_at: existingEvent?.start_at, title: existingEvent?.title },
        newValue: { start_at: updated.start_at, title: updated.title },
        ipAddress: "127.0.0.1",
        reason: reason || "Administrative adjustment"
      });

      TimelineService.invalidateCache();
      return NextResponse.json({ success: true, message: "Timeline event updated successfully", event: updated });
    }

    if (action === "UPDATE_EDITION" && editionId) {
      const { data: existingEd } = await (supabaseAdmin as any)
        .from("cnts_editions")
        .select("*")
        .eq("id", editionId)
        .maybeSingle();

      const { data: updated, error: updErr } = await (supabaseAdmin as any)
        .from("cnts_editions")
        .update({
          ...editionUpdates,
          updated_at: new Date().toISOString()
        })
        .eq("id", editionId)
        .select()
        .single();

      if (updErr) {
        return NextResponse.json({ success: false, message: updErr.message }, { status: 500 });
      }

      // If marking as current, unset any other current editions
      if (editionUpdates.is_current === true) {
        await (supabaseAdmin as any)
          .from("cnts_editions")
          .update({ is_current: false })
          .neq("id", editionId);
      }

      await writeAuditEntry(supabaseAdmin, {
        actorId: session.id || "admin",
        actorRole: session.role || "ADMIN",
        action: "UPDATE_CNTS_EDITION_STATUS",
        module: "TIMELINE",
        previousValue: existingEd || {},
        newValue: editionUpdates,
        ipAddress: "127.0.0.1",
        reason: reason || "Administrative status update"
      });

      TimelineService.invalidateCache();
      return NextResponse.json({ success: true, message: "Edition updated successfully", edition: updated });
    }

    return NextResponse.json({ success: false, message: "Invalid action or parameters" }, { status: 400 });
  } catch (error: any) {
    console.error("[Admin Timeline API] Update Exception:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
