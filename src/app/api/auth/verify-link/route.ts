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

    let is2FaEnabled = false;
    let isVerifyRoute = false;
    let isSetupRoute = false;

    // Check if user is admin
    const isAdmin = verified.role === "ADMIN" || verified.role === "SUPER_ADMIN" || verified.role === "VOLUNTEER";

    // Handle Trusted Device bypassing 2FA
    let isTrustedDevice = false;
    const trustedDeviceCookie = request.headers.get("cookie")?.split("; ").find(c => c.startsWith("cnts_trusted_device="));
    if (isAdmin && trustedDeviceCookie) {
      try {
        const trustedToken = trustedDeviceCookie.split("=")[1];
        const trustedPayload = await verifySession(trustedToken, JWT_SECRET);
        // Ensure the trusted cookie belongs to this admin and hasn't expired
        if (trustedPayload && trustedPayload.adminId === verified.email && trustedPayload.exp > Date.now()) {
          isTrustedDevice = true;
        }
      } catch (err) {
        // invalid cookie, ignore
      }
    }

    if (isAdmin) {
      const { supabaseAdmin, hasSupabaseAdminConfig } = await import("@/lib/supabaseAdmin");
      if (hasSupabaseAdminConfig) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabaseAdmin as any).from("admin_users")
          .select("is_2fa_enabled")
          .eq("email", verified.email)
          .maybeSingle();
        if (data && data.is_2fa_enabled) {
          is2FaEnabled = true;
        }
      }
      
      if (!isTrustedDevice) {
        if (!is2FaEnabled) {
          isSetupRoute = true;
        } else {
          isVerifyRoute = true;
        }
      }
    }

    // Fingerprint
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const { generateFingerprint } = await import("@/lib/sessionHelper");
    const fingerprint = await generateFingerprint(ip, userAgent);

    // Generate a long-lived session cookie (30 days)
    const sessionPayload = {
      cntsId: verified.cntsId,
      email: verified.email,
      phone: verified.phone,
      role: verified.role,
      ipHash: fingerprint.ipHash,
      userAgentHash: fingerprint.userAgentHash,
      // For Admins
      is_2fa_verified: isTrustedDevice ? true : !isAdmin,
      setup_required: isSetupRoute,
      last_2fa_time: isTrustedDevice ? Date.now() : 0,
      exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    };

    const sessionToken = await signSession(sessionPayload, JWT_SECRET);

    // Redirect to dashboard or admin dashboard
    let redirectPath = "/dashboard";
    if (isAdmin) {
      if (isSetupRoute) redirectPath = "/admin/setup-2fa";
      else if (isVerifyRoute) redirectPath = "/admin/verify-2fa";
      else redirectPath = "/admin";
    }

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
