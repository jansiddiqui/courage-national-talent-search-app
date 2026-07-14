/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";
import { writeAuditEntry } from "@/domains/admin/AdminAuditService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const db = supabaseAdmin as any;

export async function GET() {
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({
      roles: [{ id: "mock-id", name: "SUPER_ADMIN", description: "Full access" }],
      permissions: [{ key: "assessment.publish", description: "Publish exams" }]
    });
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");
  if (!sessionCookie?.value || !JWT_SECRET) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!payload || (!payload.id && !payload.email && !payload.phone)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id || payload.email || payload.phone, "rbac.manage");
  if (!hasPerm) return NextResponse.json({ error: "Forbidden: rbac.manage permission required." }, { status: 403 });

  const [rolesRes, permsRes] = await Promise.all([
    db.from("admin_roles").select("id, name, description, created_at"),
    db.from("admin_permissions").select("key, description"),
  ]);

  return NextResponse.json({ roles: rolesRes.data || [], permissions: permsRes.data || [] });
}

export async function POST(request: Request) {
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({ success: true, message: "Sandbox success" });
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");
  if (!sessionCookie?.value || !JWT_SECRET) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!payload || (!payload.id && !payload.email && !payload.phone)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id || payload.email || payload.phone, "rbac.manage");
  if (!hasPerm) return NextResponse.json({ error: "Forbidden: rbac.manage permission required." }, { status: 403 });

  const body = await request.json();
  const { action, roleId, adminId, permissionKey, roleName, roleDescription } = body;

  if (action === "assign_role") {
    const { error } = await db.from("admin_user_roles").upsert({ admin_id: adminId, role_id: roleId });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await writeAuditEntry(supabaseAdmin, {
      actorId: payload.id, actorRole: payload.role || "admin", action: "RBAC_ROLE_ASSIGNED",
      module: "RBAC", previousValue: {}, newValue: { adminId, roleId },
      ipAddress: request.headers.get("x-forwarded-for") || "unknown"
    });
    return NextResponse.json({ success: true });
  }

  if (action === "revoke_role") {
    const { error } = await db.from("admin_user_roles")
      .delete().eq("admin_id", adminId).eq("role_id", roleId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await writeAuditEntry(supabaseAdmin, {
      actorId: payload.id, actorRole: payload.role || "admin", action: "RBAC_ROLE_REVOKED",
      module: "RBAC", previousValue: { adminId, roleId }, newValue: {},
      ipAddress: request.headers.get("x-forwarded-for") || "unknown"
    });
    return NextResponse.json({ success: true });
  }

  if (action === "create_role") {
    const { data, error } = await db.from("admin_roles")
      .insert({ name: roleName, description: roleDescription })
      .select("id").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (permissionKey) {
      await db.from("admin_role_permissions").insert({ role_id: data.id, permission_key: permissionKey });
    }
    await writeAuditEntry(supabaseAdmin, {
      actorId: payload.id, actorRole: payload.role || "admin", action: "RBAC_ROLE_CREATED",
      module: "RBAC", previousValue: {}, newValue: { roleName, roleDescription, roleId: data.id },
      ipAddress: request.headers.get("x-forwarded-for") || "unknown"
    });
    return NextResponse.json({ success: true, roleId: data.id });
  }

  if (action === "assign_permission") {
    const { error } = await db.from("admin_role_permissions")
      .upsert({ role_id: roleId, permission_key: permissionKey });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await writeAuditEntry(supabaseAdmin, {
      actorId: payload.id, actorRole: payload.role || "admin", action: "RBAC_PERMISSION_ASSIGNED",
      module: "RBAC", previousValue: {}, newValue: { roleId, permissionKey },
      ipAddress: request.headers.get("x-forwarded-for") || "unknown"
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
