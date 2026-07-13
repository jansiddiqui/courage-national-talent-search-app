import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { SignJWT } from "jose";
import { isRateLimited } from "@/lib/rateLimiter";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(process.env.SUPABASE_SERVICE_ROLE_KEY || "fallback_secret_key");

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const { limited } = await isRateLimited(ip, "school-login", 15, 60);
    if (limited) {
      return NextResponse.json(
        { success: false, message: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const { schoolCode, pin } = await request.json();

    if (!schoolCode || !pin) {
      return NextResponse.json({ success: false, message: "School Code and PIN are required" }, { status: 400 });
    }

    const cleanCode = schoolCode.trim().toUpperCase();
    const cleanPin = pin.trim();

    if (!hasSupabaseAdminConfig) {
      if (cleanCode === "DEMO-123" && cleanPin === "1234") {
        // Create mock session
        const token = await new SignJWT({
          schoolId: "demo-school-id",
          schoolCode: cleanCode,
          role: "SCHOOL"
        })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime("24h")
          .sign(JWT_SECRET);

        const cookieStore = await cookies();
        cookieStore.set("cnts_school_session", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 // 24 hours
        });

        return NextResponse.json({ success: true, message: "Logged in successfully" });
      }
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    // Production check
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: school, error } = await (supabaseAdmin as any)
      .from("schools")
      .select("id, status, pin")
      .eq("school_code", cleanCode)
      .maybeSingle();

    if (error || !school) {
      return NextResponse.json({ success: false, message: "Invalid School Code or PIN" }, { status: 401 });
    }

    const storedPin = school.pin || "";
    const isBcryptHash = storedPin.startsWith("$2a$") || storedPin.startsWith("$2b$") || storedPin.startsWith("$2y$");

    let isPinValid = false;
    let needsUpgrade = false;

    if (isBcryptHash) {
      isPinValid = await bcrypt.compare(cleanPin, storedPin);
    } else {
      // Legacy plaintext comparison
      isPinValid = (cleanPin === storedPin);
      if (isPinValid) {
        needsUpgrade = true;
      }
    }

    if (!isPinValid) {
      return NextResponse.json({ success: false, message: "Invalid School Code or PIN" }, { status: 401 });
    }

    if (school.status !== "ACTIVE") {
      return NextResponse.json({ success: false, message: "School account is inactive. Please contact support." }, { status: 403 });
    }

    // Lazy upgrade plaintext PIN to bcrypt hash (cost factor 12)
    if (needsUpgrade) {
      try {
        const hashedPin = await bcrypt.hash(cleanPin, 12);
        await (supabaseAdmin as any)
          .from("schools")
          .update({ pin: hashedPin })
          .eq("id", school.id);
        console.log(`[School Login] Successfully migrated school ${cleanCode} PIN to bcrypt hash.`);
      } catch (err) {
        console.error(`[School Login] Failed to migrate school PIN for ${cleanCode}:`, err);
      }
    }

    // Create session token
    const token = await new SignJWT({
      schoolId: school.id,
      schoolCode: cleanCode,
      role: "SCHOOL"
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set("cnts_school_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24
    });

    return NextResponse.json({ success: true, message: "Logged in successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
