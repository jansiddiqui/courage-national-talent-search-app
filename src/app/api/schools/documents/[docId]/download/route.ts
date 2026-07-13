import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SchoolAuthService } from "@/domains/school/SchoolAuthService";
import { SchoolDocumentService } from "@/domains/school/SchoolDocumentService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cnts_school_session")?.value;

    const session = await SchoolAuthService.verifySession(token);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { docId } = await params;
    const downloadUrl = await SchoolDocumentService.getSignedDownloadUrl(session.schoolId, docId);

    return NextResponse.json({ success: true, downloadUrl });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
