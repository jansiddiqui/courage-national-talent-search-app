/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";
import { writeAuditEntry } from "@/domains/admin/AdminAuditService";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function authenticateAndAuthorize(permissionKey: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");

  if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) return null;

  const session = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!session || (!session.id && !session.email && !session.phone)) return null;

  const hasPerm = await checkAdminPermission(supabaseAdmin, session.id || session.email || session.phone, permissionKey);
  if (!hasPerm) return null;

  return session;
}

const MOCK_SCHOOLS = [
  { id: "sch-1", school_code: "SCH001", name: "Greenfield Academy", city: "Delhi", board: "CBSE", school_type: "PRIVATE", coordinator_name: "Ramesh Kumar", quota: 100, used_quota: 42, status: "ACTIVE", joined_at: new Date().toISOString() },
  { id: "sch-2", school_code: "SCH002", name: "Delhi Public School", city: "Kanpur", board: "CBSE", school_type: "PRIVATE", coordinator_name: "Sanjay Gupta", quota: 200, used_quota: 95, status: "ACTIVE", joined_at: new Date().toISOString() }
];

export async function GET(request: Request) {
  try {
    // Sandbox Check — bypass auth and return mock schools if DB is not configured
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, schools: MOCK_SCHOOLS, total: MOCK_SCHOOLS.length });
    }

    const session = await authenticateAndAuthorize("schools.view");
    if (!session) {
      return NextResponse.json({ success: false, message: "Forbidden: schools.view permission required." }, { status: 403 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const page = parseInt(url.searchParams.get("page") || "1");
    const offset = (page - 1) * limit;

    const { data: schools, count, error } = await (supabaseAdmin as any)
      .from("schools")
      .select("*", { count: "exact" })
      .order("joined_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("[Schools API] Fetch error:", error);
      return NextResponse.json({ success: false, message: "Failed to fetch schools" }, { status: 500 });
    }

    return NextResponse.json({ success: true, schools: schools || [], total: count || 0 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Sandbox Check — bypass auth if DB is not configured
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, message: "Sandbox success" });
    }

    const session = await authenticateAndAuthorize("schools.edit");
    if (!session) {
      return NextResponse.json({ success: false, message: "Forbidden: schools.edit permission required." }, { status: 403 });
    }

    const body = await request.json();

    if (!body.school_code || !body.name || !body.city || !body.board || !body.pin) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const cleanPin = body.pin.trim();
    const hashedPin = await bcrypt.hash(cleanPin, 12);

    const { data, error } = await (supabaseAdmin as any)
      .from("schools")
      .insert({
        school_code: body.school_code.trim().toUpperCase(),
        name: body.name,
        city: body.city,
        board: body.board,
        school_type: body.school_type || "OTHER",
        coordinator_name: body.coordinator_name || "",
        coordinator_mobile: body.coordinator_mobile || "",
        coordinator_email: body.coordinator_email || "",
        quota: parseInt(body.quota) || 0,
        used_quota: 0,
        sponsorship_mode: body.sponsorship_mode || "FULL",
        student_discount_percent: body.student_discount_percent !== undefined ? parseInt(body.student_discount_percent) : 20,
        school_rebate_percent: body.school_rebate_percent !== undefined ? parseInt(body.school_rebate_percent) : 10,
        pin: hashedPin,
        status: body.status || "ACTIVE",
        notes: body.notes || null,
        is_featured: body.is_featured || false,
        created_by: session.id,
      })
      .select()
      .single();

    if (error) {
      console.error("[Schools API] Insert error:", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    await writeAuditEntry(supabaseAdmin, {
      actorId: session.id,
      actorRole: session.role || "admin",
      action: "CREATED_SCHOOL",
      module: "SCHOOLS",
      previousValue: {},
      newValue: { school_code: data?.school_code, name: data?.name },
      ipAddress: request.headers.get("x-forwarded-for") || "unknown"
    });

    return NextResponse.json({ success: true, school: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Sandbox Check — bypass auth if DB is not configured
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, message: "Sandbox update success" });
    }

    const session = await authenticateAndAuthorize("schools.edit");
    if (!session) {
      return NextResponse.json({ success: false, message: "Forbidden: schools.edit permission required." }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing school ID" }, { status: 400 });
    }

    if (updates.pin) {
      updates.pin = await bcrypt.hash(updates.pin.trim(), 12);
    }

    const { error } = await (supabaseAdmin as any)
      .from("schools")
      .update(updates)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    await writeAuditEntry(supabaseAdmin, {
      actorId: session.id,
      actorRole: session.role || "admin",
      action: "UPDATED_SCHOOL",
      module: "SCHOOLS",
      previousValue: { id },
      newValue: updates,
      ipAddress: request.headers.get("x-forwarded-for") || "unknown"
    });

    return NextResponse.json({ success: true, message: "School updated" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
