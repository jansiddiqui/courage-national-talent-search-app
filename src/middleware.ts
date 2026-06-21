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
  const { pathname } = request.nextUrl;

  // Bypass parent session check for school dashboard paths
  if (pathname.startsWith("/dashboard/school")) {
    return NextResponse.next();
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

  // Admin Route Gating
  if (pathname.startsWith("/admin")) {
    const role = session.role;
    if (role !== "ADMIN" && role !== "SUPER_ADMIN" && role !== "VOLUNTEER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Fingerprint Validation
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const { generateFingerprint } = await import("./lib/sessionHelper");
    const currentFingerprint = await generateFingerprint(ip, userAgent);

    if (session.ipHash && session.userAgentHash) {
      if (session.ipHash !== currentFingerprint.ipHash || session.userAgentHash !== currentFingerprint.userAgentHash) {
        // Fingerprint mismatch - force re-auth
        const response = NextResponse.redirect(new URL("/login?error=Session invalidated due to network change. Please login again.", request.url));
        response.cookies.delete("cnts_session");
        return response;
      }
    }

    // 2FA Gating
    const isSetupRoute = pathname === "/admin/setup-2fa";
    const isVerifyRoute = pathname === "/admin/verify-2fa";

    if (session.setup_required && !isSetupRoute) {
      return NextResponse.redirect(new URL("/admin/setup-2fa", request.url));
    }

    if (!session.is_2fa_verified && !isSetupRoute && !isVerifyRoute) {
      return NextResponse.redirect(new URL("/admin/verify-2fa", request.url));
    }

    if (session.is_2fa_verified && (isSetupRoute || isVerifyRoute)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

// Config to apply middleware to dashboard and admin subpaths
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
