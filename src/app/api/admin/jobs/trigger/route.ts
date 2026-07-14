import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const CRON_SECRET = process.env.CRON_SECRET;
const WORKER_URL_BASE = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function authenticate() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");
  if (!sessionCookie?.value || !JWT_SECRET) return null;
  const session = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!session?.id) return null;
  const hasPerm = await checkAdminPermission(supabaseAdmin, session.id, "schools.edit");
  if (!hasPerm) return null;
  return session;
}

/**
 * POST /api/admin/jobs/trigger
 *
 * Admin-only endpoint to manually trigger the background worker.
 * Intended for local development where no CRON scheduler is available.
 *
 * In production, the worker should be triggered by Vercel Cron or an external scheduler.
 * This endpoint proxies the call to the actual worker endpoint using CRON_SECRET.
 *
 * Security: requires admin session + schools.edit permission.
 * Production worker authentication is NOT weakened by this endpoint.
 */
export async function POST(request: Request) {
  try {
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: false, message: "Database not configured." }, { status: 503 });
    }

    const session = await authenticate();
    if (!session) {
      return NextResponse.json({ success: false, message: "Forbidden: admin session with schools.edit required." }, { status: 403 });
    }

    if (!CRON_SECRET) {
      return NextResponse.json({
        success: false,
        message: "CRON_SECRET is not configured. Set CRON_SECRET in .env.local to use the manual worker trigger.",
      }, { status: 503 });
    }

    // Proxy to the actual worker endpoint
    const workerUrl = `${WORKER_URL_BASE}/api/admin/jobs/worker`;
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "x-cron-secret": CRON_SECRET,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json({
      success: response.ok,
      workerResponse: data,
      message: response.ok
        ? "Worker triggered successfully."
        : `Worker returned ${response.status}.`,
    }, { status: response.ok ? 200 : response.status });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
