import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { verifySession } from "@/lib/sessionHelper";
import { checkAdminPermission } from "@/domains/admin/AdminAuthService";
import { writeAuditEntry } from "@/domains/admin/AdminAuditService";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function authenticate(permissionKey: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cnts_session");

  if (!sessionCookie || !sessionCookie.value || !JWT_SECRET) return null;

  const session = await verifySession(sessionCookie.value, JWT_SECRET);
  if (!session || (!session.id && !session.email && !session.phone)) return null;

  const hasPerm = await checkAdminPermission(supabaseAdmin, session.id || session.email || session.phone, permissionKey);
  if (!hasPerm) return null;

  return session;
}

export async function POST(request: Request) {
  try {
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: false, message: "Sandbox sandbox mode." }, { status: 503 });
    }

    const session = await authenticate("schools.edit");
    if (!session) {
      return NextResponse.json({ success: false, message: "Forbidden: schools.edit permission required." }, { status: 403 });
    }

    const { prospectIds } = await request.json();
    if (!prospectIds || !Array.isArray(prospectIds) || prospectIds.length === 0) {
      return NextResponse.json({ success: false, message: "prospectIds array is required" }, { status: 400 });
    }

    const queuedJobs: string[] = [];
    const skippedCount = { duplicate: 0 };

    for (const prospectId of prospectIds) {
      // 1. Check if prospect exists
      const { data: prospect } = await (supabaseAdmin as any)
        .from("school_prospects")
        .select("name")
        .eq("id", prospectId)
        .maybeSingle();

      if (!prospect) continue;

      const idempotencyKey = `prospect_enrich_${prospectId}`;

      // 2. Check if a duplicate pending/processing job already exists
      const { data: existingJob } = await (supabaseAdmin as any)
        .from("admin_background_jobs")
        .select("id")
        .eq("idempotency_key", idempotencyKey)
        .in("status", ["PENDING", "PROCESSING", "RETRY_PENDING"])
        .maybeSingle();

      if (existingJob) {
        skippedCount.duplicate++;
        continue;
      }

      // 3. Queue the job
      const { data: job, error: queueErr } = await (supabaseAdmin as any)
        .from("admin_background_jobs")
        .insert({
          job_type: "SCHOOL_PROSPECT_ENRICH",
          status: "PENDING",
          payload: { prospectId },
          idempotency_key: idempotencyKey,
          run_at: new Date().toISOString()
        })
        .select()
        .single();

      if (!queueErr && job) {
        // Optimistically set status to PENDING
        await (supabaseAdmin as any)
          .from("school_prospects")
          .update({ enrichment_status: "PENDING" })
          .eq("id", prospectId);

        queuedJobs.push(job.id);
      }
    }

    // Write audit trail
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    await writeAuditEntry(supabaseAdmin, {
      actorId: session.id,
      actorRole: "ADMIN",
      action: "QUEUED_PROSPECT_ENRICHMENT",
      module: "SCHOOLS",
      previousValue: {},
      newValue: { prospectCount: prospectIds.length, queuedJobs, skippedCount },
      ipAddress: ip
    });

    return NextResponse.json({
      success: true,
      queuedJobsCount: queuedJobs.length,
      skippedCount,
      queuedJobs
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
