import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SchoolAuthService } from "@/domains/school/SchoolAuthService";
import { StudentRosterService } from "@/domains/school/StudentRosterService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cnts_school_session")?.value;

    const session = await SchoolAuthService.verifySession(token);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { studentId } = await params;
    const profile = await StudentRosterService.getStudent360(session.schoolId, studentId);
    
    if (!profile) {
      return NextResponse.json({ success: false, message: "Student profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
