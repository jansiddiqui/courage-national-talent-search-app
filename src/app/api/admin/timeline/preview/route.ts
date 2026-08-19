/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { TimelineService } from "@/domains/timeline/TimelineService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { proposedEvents, changedEventKey, newDate } = body;

    if (!proposedEvents || !Array.isArray(proposedEvents)) {
      return NextResponse.json({ success: false, message: "Invalid payload: proposedEvents array required" }, { status: 400 });
    }

    const validation = TimelineService.validateTimelineDependencies(proposedEvents);

    // Identify dependent milestones affected by changing this event key
    const affectedEvents: string[] = [];
    if (changedEventKey === "EXAM_START" || changedEventKey === "EXAM_DATE") {
      affectedEvents.push("REGISTRATION_CLOSE", "ADMIT_CARD_RELEASE", "RESULT_RELEASE", "TALENT_PROFILE_RELEASE", "CERTIFICATE_RELEASE", "AWARDS_DATE");
    } else if (changedEventKey === "REGISTRATION_CLOSE") {
      affectedEvents.push("ADMIT_CARD_RELEASE", "EXAM_START");
    } else if (changedEventKey === "RESULT_RELEASE") {
      affectedEvents.push("TALENT_PROFILE_RELEASE", "CERTIFICATE_RELEASE", "AWARDS_DATE");
    }

    return NextResponse.json({
      success: true,
      isValid: validation.valid,
      errors: validation.errors,
      warnings: validation.warnings,
      affectedEvents,
      preview: {
        changedEventKey,
        newDate,
        totalEventsCount: proposedEvents.length
      }
    });
  } catch (error: any) {
    console.error("[Timeline Preview API] Exception:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to preview timeline changes" }, { status: 500 });
  }
}
