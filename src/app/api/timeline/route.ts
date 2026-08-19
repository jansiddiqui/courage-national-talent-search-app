import { NextResponse } from "next/server";
import { TimelineService } from "@/domains/timeline/TimelineService";

export async function GET() {
  try {
    const config = await TimelineService.getTimelineConfig();
    const events = await TimelineService.getTimelineEvents();
    const publicEvents = events.filter(e => e.is_public && e.is_active);

    return NextResponse.json({
      success: true,
      edition: {
        year: config.editionYear,
        name: config.editionName,
        slug: config.editionSlug,
        status: config.editionStatus,
        isCurrent: config.isCurrent
      },
      timeline: config,
      events: publicEvents
    });
  } catch (error: any) {
    console.error("[Public Timeline API] Exception:", error);
    return NextResponse.json({ success: false, error: "Failed to retrieve active timeline" }, { status: 500 });
  }
}
