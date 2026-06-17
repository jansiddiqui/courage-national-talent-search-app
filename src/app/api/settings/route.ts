/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

const DEFAULT_SETTINGS: Record<string, string> = {
  registration_status: "OPEN",
  payment_status: "ENABLED",
  admit_card_status: "PENDING",
  result_status: "HIDDEN",
  certificate_status: "PENDING",
  announcement_status: "ACTIVE"
};

async function checkAdminSession() {
  if (!JWT_SECRET) {
    throw new Error("CRITICAL CONFIGURATION ERROR: SUPABASE_SERVICE_ROLE_KEY is required.");
  }
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    const session = await verifySession(sessionCookie.value, JWT_SECRET!);
    if (!session) {
      return null;
    }

    const role = session.role;
    if (role !== "ADMIN" && role !== "SUPER_ADMIN" && role !== "VOLUNTEER") {
      return null;
    }

    return session;
  } catch (e) {
    return null;
  }
}

// GET: Returns settings for anyone
export async function GET() {
  try {
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
    }

    const { data, error } = await (supabaseAdmin as any)
      .from("system_settings")
      .select("setting_key, setting_value");

    if (error) {
      console.error("[Settings GET API] Database error:", error);
      return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
    }

    const settings: Record<string, string> = { ...DEFAULT_SETTINGS };
    if (data && data.length > 0) {
      data.forEach((row: { setting_key: string; setting_value: string }) => {
        settings[row.setting_key] = row.setting_value;
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("Settings GET API error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// POST/PATCH: Updates settings (restricted to Admin sessions only)
export async function POST(request: Request) {
  try {
    const admin = await checkAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { key, value } = await request.json();

    if (!key || value === undefined) {
      return NextResponse.json({ success: false, message: "Key and value are required." }, { status: 400 });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, message: "Setting updated (Sandbox)" });
    }

    // Check if key already exists
    const { data: existing } = await (supabaseAdmin as any)
      .from("system_settings")
      .select("setting_key")
      .eq("setting_key", key)
      .maybeSingle();

    let writeError;
    if (existing) {
      const { error } = await (supabaseAdmin as any)
        .from("system_settings")
        .update({ setting_value: value, updated_at: new Date().toISOString() })
        .eq("setting_key", key);
      writeError = error;
    } else {
      const { error } = await (supabaseAdmin as any)
        .from("system_settings")
        .insert({ setting_key: key, setting_value: value });
      writeError = error;
    }

    if (writeError) {
      console.error("[Settings POST API] Database error:", writeError);
      return NextResponse.json({ success: false, message: "Failed to save settings." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Setting saved successfully." });
  } catch (error: any) {
    console.error("Settings POST API error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
