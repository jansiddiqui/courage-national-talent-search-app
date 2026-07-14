import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function GET(request: Request) {
  if (!hasSupabaseAdminConfig) {
    return NextResponse.json({
      logs: [
        { id: "mock-a1", action: "QUESTION_APPROVED", module: "QUESTION_BANK", actor_role: "admin", created_at: new Date().toISOString() }
      ],
      total: 1
    });
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");

  if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const payload = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!payload || (!payload.id && !payload.email)) {
    return NextResponse.json({ error: "Forbidden: Admin session required." }, { status: 403 });
  }

  const hasPerm = await checkAdminPermission(supabaseAdmin, payload.id || payload.email, "audit.view");
  if (!hasPerm) {
    return NextResponse.json({ error: "Forbidden: audit.view permission required." }, { status: 403 });
  }

  const url = new URL(request.url);
  const module = url.searchParams.get("module");
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const page = parseInt(url.searchParams.get("page") || "1");
  const offset = (page - 1) * limit;

  let query = (supabaseAdmin as any)
    .from("admin_operations_audit_trail")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (module) {
    query = query.eq("module", module);
  }

  const { data, count, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ logs: data || [], total: count || 0 });
}
