import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/sessionHelper";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function GET() {
  try {
    if (!JWT_SECRET) {
      throw new Error("CRITICAL CONFIGURATION ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is required.");
    }
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ isAuthenticated: false });
    }

    const payload = await verifySession(sessionCookie.value, JWT_SECRET);
    if (!payload) {
      return NextResponse.json({ isAuthenticated: false });
    }

    return NextResponse.json({
      isAuthenticated: true,
      cntsId: payload.cntsId,
      email: payload.email,
      phoneNumber: payload.phone,
      role: payload.role
    });
  } catch (e) {
    return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }
}
