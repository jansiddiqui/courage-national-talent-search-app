import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Helper to authenticate admin
async function authenticateAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const session = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!session) return null;

  const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN" || session.role === "VOLUNTEER";
  return isAdmin ? session : null;
}

export async function GET() {
  try {
    const adminSession = await authenticateAdmin();
    if (!adminSession) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, schools: [] });
    }

    // Cast to any to bypass postgrest typescript mapping conflicts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: schools, error } = await (supabaseAdmin as any)
      .from("schools")
      .select("*")
      .order("joined_at", { ascending: false });

    if (error) {
      console.error("[Schools API] Fetch error:", error);
      return NextResponse.json({ success: false, message: "Failed to fetch schools" }, { status: 500 });
    }

    return NextResponse.json({ success: true, schools: schools || [] });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const adminSession = await authenticateAdmin();
    if (!adminSession) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.school_code || !body.name || !body.city || !body.board || !body.pin) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, message: "Sandbox success" });
    }

    const cleanPin = body.pin.trim();
    const hashedPin = await bcrypt.hash(cleanPin, 12);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseAdmin as any)
      .from("schools")
      .insert({
        school_code: body.school_code.trim().toUpperCase(),
        name: body.name,
        city: body.city,
        board: body.board,
        school_type: body.school_type || 'OTHER',
        coordinator_name: body.coordinator_name || '',
        coordinator_mobile: body.coordinator_mobile || '',
        coordinator_email: body.coordinator_email || '',
        quota: parseInt(body.quota) || 0,
        used_quota: 0,
        sponsorship_mode: body.sponsorship_mode || 'FULL',
        pin: hashedPin,
        status: body.status || 'ACTIVE',
        notes: body.notes || null,
        is_featured: body.is_featured || false,
        created_by: adminSession.userId,
      })
      .select()
      .single();

    if (error) {
      console.error("[Schools API] Insert error:", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, school: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const adminSession = await authenticateAdmin();
    if (!adminSession) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing school ID" }, { status: 400 });
    }

    if (updates.pin) {
      updates.pin = await bcrypt.hash(updates.pin.trim(), 12);
    }

    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, message: "Sandbox update success" });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabaseAdmin as any)
      .from("schools")
      .update(updates)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "School updated" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
