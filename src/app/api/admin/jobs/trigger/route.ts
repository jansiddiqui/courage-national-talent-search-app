import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";

import { processWorkerJobs } from "@/app/api/admin/jobs/worker/route";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function authenticate() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");
  if (!sessionCookie?.value || !JWT_SECRET) return null;
  const session = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!session?.id && !session?.email && !session?.phone) return null;
  const hasPerm = await checkAdminPermission(supabaseAdmin, session.id || session.email || session.phone, "schools.edit");
  if (!hasPerm) return null;
  return session;
}

/**
 * POST /api/admin/jobs/trigger
 *
 * Admin-only endpoint to manually trigger the background worker.
 * Executes worker jobs directly in-process to guarantee immediate, reliable execution.
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

    // Execute background jobs directly in-process for immediate, deadlock-free processing
    const result = await processWorkerJobs();

    return NextResponse.json({
      success: true,
      message: `Worker executed successfully. Processed: ${result.processed}, Failed: ${result.failed}`,
      result
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
