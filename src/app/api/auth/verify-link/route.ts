import { NextResponse } from "next/server";
import { verifySession, signSession } from "@/lib/sessionHelper";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function GET(request: Request) {
  const origin = request.headers.get("origin") || new URL(request.url).origin;
  try {
    if (!JWT_SECRET) {
      throw new Error("CRITICAL CONFIGURATION ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is required.");
    }
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(`${origin}/login?error=Missing login link token`);
    }

    const verified = await verifySession(token, JWT_SECRET);

    if (!verified) {
      return NextResponse.redirect(`${origin}/login?error=Your login link has expired or is invalid`);
    }

    // Generate a long-lived session cookie (30 days)
    const sessionPayload = {
      cntsId: verified.cntsId,
      email: verified.email,
      phone: verified.phone,
      role: verified.role,
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    };

    const sessionToken = await signSession(sessionPayload, JWT_SECRET);

    // Redirect to dashboard or admin dashboard
    const redirectPath = (verified.role === "ADMIN" || verified.role === "SUPER_ADMIN" || verified.role === "VOLUNTEER")
      ? "/admin"
      : "/dashboard";

    const response = NextResponse.redirect(`${origin}${redirectPath}`);
    response.cookies.set("cnts_session", sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    return response;
  } catch (e) {
    console.error("Link verification error:", e);
    return NextResponse.redirect(`${origin}/login?error=Internal link verification error`);
  }
}
