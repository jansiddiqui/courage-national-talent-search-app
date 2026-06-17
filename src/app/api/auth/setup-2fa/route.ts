import { NextResponse } from "next/server";
import { verifySession, signSession } from "@/lib/sessionHelper";
import { generateTotpSecret, generateRecoveryCodes } from "@/lib/totpHelper";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import QRCode from "qrcode";
import { authenticator } from "otplib";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function GET(request: Request) {
  try {
    const sessionCookie = request.headers.get("cookie")?.split("; ").find(c => c.startsWith("cnts_session="));
    if (!sessionCookie) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    
    const token = sessionCookie.split("=")[1];
    const session = await verifySession(token, JWT_SECRET);
    if (!session || !session.setup_required || session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { secret, encryptedSecret, otpauth } = generateTotpSecret(session.email);
    const qrCode = await QRCode.toDataURL(otpauth);

    // Temporarily store encrypted secret in session to verify on POST
    const tempSession = { ...session, pending_secret: encryptedSecret };
    const sessionToken = await signSession(tempSession, JWT_SECRET);

    const response = NextResponse.json({ success: true, qrCode, secret });
    response.cookies.set("cnts_session", sessionToken, { httpOnly: true, secure: true, sameSite: "lax" });
    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sessionCookie = request.headers.get("cookie")?.split("; ").find(c => c.startsWith("cnts_session="));
    if (!sessionCookie) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    
    const token = sessionCookie.split("=")[1];
    const session = await verifySession(token, JWT_SECRET);
    if (!session || !session.setup_required || !session.pending_secret) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { code, secret } = await request.json();
    
    // Verify the code against the generated secret
    const isValid = authenticator.verify({ token: code, secret });
    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid code" }, { status: 400 });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
    }

    // Generate recovery codes
    const { plainCodes, hashedCodes } = generateRecoveryCodes();

    // Save to database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any)
      .from("admin_users")
      .update({
        totp_secret: session.pending_secret,
        is_2fa_enabled: true,
        recovery_codes: hashedCodes
      })
      .eq("email", session.email);

    if (error) {
      return NextResponse.json({ success: false, error: "Failed to save security settings" }, { status: 500 });
    }

    // Upgrade session to full admin session
    const { pending_secret, setup_required, ...fullSession } = session;
    const upgradedSession = { ...fullSession, is_2fa_verified: true, last_2fa_time: Date.now() };
    const sessionToken = await signSession(upgradedSession, JWT_SECRET);

    const response = NextResponse.json({ success: true, recoveryCodes: plainCodes });
    response.cookies.set("cnts_session", sessionToken, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 30 * 24 * 60 * 60 });
    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
