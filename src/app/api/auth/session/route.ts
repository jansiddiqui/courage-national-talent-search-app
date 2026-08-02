import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/sessionHelper";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

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

    let realName = payload.name || payload.fullName;

    // Fetch proper name column from admin_users database table
    if (!realName && hasSupabaseAdminConfig) {
      try {
        const { data: adminUsers } = await (supabaseAdmin as any)
          .from("admin_users")
          .select("id, name, email, phone_number");

        if (Array.isArray(adminUsers)) {
          const matched = adminUsers.find((u: any) =>
            (u.email && payload.email && u.email.toLowerCase().trim() === payload.email.toLowerCase().trim()) ||
            (u.phone_number && payload.phone && u.phone_number.includes(payload.phone)) ||
            (u.id && payload.id && u.id === payload.id)
          );
          if (matched && matched.name && matched.name.trim()) {
            realName = matched.name.trim();
          }
        }
      } catch (dbErr) {
        console.error("[Session API] Admin user query error:", dbErr);
      }
    }

    // Fallback if name column is not populated in DB
    if (!realName) {
      realName = payload.email
        ? payload.email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
        : "Admin Agent";
    }

    return NextResponse.json({
      isAuthenticated: true,
      cntsId: payload.cntsId,
      name: realName,
      email: payload.email,
      phoneNumber: payload.phone,
      role: payload.role
    });
  } catch (e) {
    return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }
}
