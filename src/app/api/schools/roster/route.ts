import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SchoolAuthService } from "@/domains/school/SchoolAuthService";
import { StudentRosterService } from "@/domains/school/StudentRosterService";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cnts_school_session")?.value;

    const session = await SchoolAuthService.verifySession(token);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const studentClass = searchParams.get("class") || undefined;
    const photoStatus = (searchParams.get("photoStatus") || "ALL") as any;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "50", 10);

    const data = await StudentRosterService.getRoster(session.schoolId, session.activeSessionId, {
      search,
      studentClass,
      photoStatus,
      page,
      pageSize,
    });

    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
