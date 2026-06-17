import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "./lib/sessionHelper";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

/**
 * Route protection middleware to secure parent dashboard and admin panel using custom session cookie
 */
export async function middleware(request: NextRequest) {
  if (!JWT_SECRET) {
    console.error("CRITICAL CONFIGURATION ERROR: SUPABASE_SERVICE_ROLE_KEY is missing!");
    throw new Error("CRITICAL CONFIGURATION ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is required.");
  }
  const sessionCookie = request.cookies.get("cnts_session")?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login?error=Please login to access your portal", request.url));
  }

  const session = await verifySession(sessionCookie, JWT_SECRET);

  if (!session) {
    const response = NextResponse.redirect(new URL("/login?error=Session expired. Please login again", request.url));
    response.cookies.delete("cnts_session");
    return response;
  }

  const { pathname } = request.nextUrl;

  // Admin Route Gating
  if (pathname.startsWith("/admin")) {
    const role = session.role;
    if (role !== "ADMIN" && role !== "SUPER_ADMIN" && role !== "VOLUNTEER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Config to apply middleware to dashboard and admin subpaths
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
