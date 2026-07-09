/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (hasSupabaseAdminConfig) {
      if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
        return NextResponse.json({ success: false, message: "Authentication session required." }, { status: 401 });
      }

      const payload = await verifySession(sessionCookie.value, JWT_SECRET);
      if (!payload || payload.role !== "admin") {
        return NextResponse.json({ success: false, message: "Forbidden: Admin access required." }, { status: 403 });
      }

      const { data: users, error } = await (supabaseAdmin as any)
        .from("admin_users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[Users API] GET error:", error);
        return NextResponse.json({ success: false, message: "Database query error" }, { status: 500 });
      }

      return NextResponse.json({ success: true, users });
    }

    // Sandbox Mock response
    return NextResponse.json({
      success: true,
      users: [
        { id: "usr-1", email: "admin@example.com", phone_number: "918707884735", role: "SUPER_ADMIN", created_at: new Date().toISOString() },
        { id: "usr-2", email: "support@example.com", phone_number: "919988776655", role: "ADMIN", created_at: new Date().toISOString() }
      ]
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      email,
      phone_number,
      role
    } = body;

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("cnts_session");

    if (hasSupabaseAdminConfig) {
      if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
        return NextResponse.json({ success: false, message: "Authentication session required." }, { status: 401 });
      }

      const payload = await verifySession(sessionCookie.value, JWT_SECRET);
      if (!payload || payload.role !== "admin") {
        return NextResponse.json({ success: false, message: "Forbidden: Admin access required." }, { status: 403 });
      }

      if (!role) {
        return NextResponse.json({ success: false, message: "Role is required" }, { status: 400 });
      }

      let resultUser: any = null;

      if (id) {
        // Fetch current user details for comparison
        const { data: current } = await (supabaseAdmin as any)
          .from("admin_users")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        const { data: updated, error: updateErr } = await (supabaseAdmin as any)
          .from("admin_users")
          .update({
            email: email ? email.trim() : null,
            phone_number: phone_number ? phone_number.trim() : null,
            role
          })
          .eq("id", id)
          .select()
          .maybeSingle();

        if (updateErr) {
          console.error("[Users API] Update DB error:", updateErr);
          return NextResponse.json({ success: false, message: "Database update error" }, { status: 500 });
        }
        resultUser = updated;

        // Log operation in audit trail
        await (supabaseAdmin as any).from("admin_operations_audit_trail").insert({
          actor_id: payload.cntsId || null,
          actor_role: "ADMIN",
          action: "UPDATED_USER_ROLE",
          module: "USERS",
          previous_value: current || {},
          new_value: updated || {},
          ip_address: request.headers.get("x-forwarded-for") || "unknown"
        });
      } else {
        const { data: inserted, error: insertErr } = await (supabaseAdmin as any)
          .from("admin_users")
          .insert({
            email: email ? email.trim() : null,
            phone_number: phone_number ? phone_number.trim() : null,
            role
          })
          .select()
          .maybeSingle();

        if (insertErr) {
          console.error("[Users API] Insert DB error:", insertErr);
          return NextResponse.json({ success: false, message: "Database insert error" }, { status: 500 });
        }
        resultUser = inserted;

        // Log operation in audit trail
        await (supabaseAdmin as any).from("admin_operations_audit_trail").insert({
          actor_id: payload.cntsId || null,
          actor_role: "ADMIN",
          action: "CREATED_USER",
          module: "USERS",
          previous_value: {},
          new_value: inserted || {},
          ip_address: request.headers.get("x-forwarded-for") || "unknown"
        });
      }

      return NextResponse.json({ success: true, user: resultUser });
    }

    // Sandbox Mock response
    return NextResponse.json({
      success: true,
      user: {
        id: "mock-user-id",
        email: email || "new@example.com",
        phone_number: phone_number || "919999999999",
        role: role || "VOLUNTEER",
        created_at: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error("[Users API] POST Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
