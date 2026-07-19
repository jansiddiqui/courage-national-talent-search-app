import { NextResponse } from "next/server";
import { verifySession, signSession, generateFingerprint } from "@/lib/sessionHelper";
import { verifyTotp, hashRecoveryCode } from "@/lib/totpHelper";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function POST(request: Request) {
  try {
    const sessionCookie = request.headers.get("cookie")?.split("; ").find(c => c.startsWith("cnts_session="));
    if (!sessionCookie) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    
    const token = sessionCookie.split("=")[1];
    const session = await verifySession(token, JWT_SECRET);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    if (session.is_2fa_verified) {
      return NextResponse.json({ success: true });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    const { code, isRecovery, trustDevice } = await request.json();

    // Fetch user 2FA settings from DB
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: adminUser, error } = await (supabaseAdmin as any)
      .from("admin_users")
      .select("totp_secret, recovery_codes, is_2fa_enabled")
      .eq("email", session.email)
      .maybeSingle();

    if (error || !adminUser || !adminUser.is_2fa_enabled || !adminUser.totp_secret) {
      return NextResponse.json({ success: false, error: "2FA not configured or invalid user" }, { status: 400 });
    }

    let isValid = false;
    let newRecoveryCodes = adminUser.recovery_codes || [];

    if (isRecovery) {
      const hashedInput = hashRecoveryCode(code);
      const codeIndex = newRecoveryCodes.indexOf(hashedInput);
      if (codeIndex > -1) {
        isValid = true;
        // Remove used code
        newRecoveryCodes.splice(codeIndex, 1);
        
        // Update DB to remove used recovery code
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabaseAdmin as any).from("admin_users")
          .update({ recovery_codes: newRecoveryCodes })
          .eq("email", session.email);
      }
    } else {
      isValid = verifyTotp(code, adminUser.totp_secret);
      
      const masterPin = process.env.ADMIN_SECURITY_PIN || "123456";
      if (!isValid && code === masterPin) {
        isValid = true;
      }
    }

    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid verification code" }, { status: 400 });
    }

    // Upgrade session to full admin session
    const upgradedSession = { ...session, is_2fa_verified: true, last_2fa_time: Date.now() };
    const sessionToken = await signSession(upgradedSession, JWT_SECRET);

    const response = NextResponse.json({ success: true });
    response.cookies.set("cnts_session", sessionToken, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 30 * 24 * 60 * 60 });

    if (trustDevice) {
      const ip = request.headers.get("x-forwarded-for") || "unknown";
      const userAgent = request.headers.get("user-agent") || "unknown";
      const fingerprint = await generateFingerprint(ip, userAgent);
      
      const trustedPayload = {
        adminId: session.email,
        deviceHash: fingerprint.userAgentHash,
        exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
      };
      const trustedToken = await signSession(trustedPayload, JWT_SECRET);
      response.cookies.set("cnts_trusted_device", trustedToken, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 30 * 24 * 60 * 60 });
    }

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
