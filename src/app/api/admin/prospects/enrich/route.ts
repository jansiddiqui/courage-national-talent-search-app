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

    const skippedCount = { duplicate: 0 };
    const queuedJobs: string[] = [];

    if (prospectIds.length > 0) {
      // 1. Fetch valid existing prospects
      const { data: validProspects, error: fetchErr } = await (supabaseAdmin as any)
        .from("school_prospects")
        .select("id")
        .in("id", prospectIds);

      if (fetchErr) {
        console.error("[Enrich Selected API] Fetch prospects error:", fetchErr);
        return NextResponse.json({ success: false, message: "Failed to verify prospects." }, { status: 500 });
      }

      const validIds = (validProspects || []).map((p: any) => p.id);
      if (validIds.length > 0) {
        const idempotencyKeys = validIds.map((id: string) => `prospect_enrich_${id}`);

        // 2. Check existing pending/processing background jobs
        const { data: existingJobs, error: jobsErr } = await (supabaseAdmin as any)
          .from("admin_background_jobs")
          .select("idempotency_key")
          .in("idempotency_key", idempotencyKeys)
          .in("status", ["PENDING", "PROCESSING", "RETRY_PENDING"]);

        if (jobsErr) {
          console.error("[Enrich Selected API] Fetch existing jobs error:", jobsErr);
          return NextResponse.json({ success: false, message: "Failed to verify existing jobs." }, { status: 500 });
        }

        const existingKeys = new Set((existingJobs || []).map((j: any) => j.idempotency_key));
        const jobsToInsert: any[] = [];
        const prospectsToUpdate: string[] = [];

        for (const prospectId of validIds) {
          const key = `prospect_enrich_${prospectId}`;
          if (existingKeys.has(key)) {
            skippedCount.duplicate++;
          } else {
            jobsToInsert.push({
              job_type: "SCHOOL_PROSPECT_ENRICH",
              status: "PENDING",
              payload: { prospectId },
              idempotency_key: key,
              next_retry_at: new Date().toISOString(),
            });
            prospectsToUpdate.push(prospectId);
          }
        }

        if (jobsToInsert.length > 0) {
          // Batch upsert jobs
          const { data: insertedJobs, error: insertErr } = await (supabaseAdmin as any)
            .from("admin_background_jobs")
            .upsert(jobsToInsert, { onConflict: "idempotency_key" })
            .select("id");

          if (insertErr) {
            console.error("[Enrich Selected API] Batch insert error:", JSON.stringify(insertErr, null, 2));
            return NextResponse.json({ success: false, message: `Failed to queue enrichment jobs: ${insertErr.message || JSON.stringify(insertErr)}` }, { status: 500 });
          }

          if (insertedJobs) {
            insertedJobs.forEach((j: any) => queuedJobs.push(j.id));
          }

          // Batch update prospects enrichment status
          const { error: updateErr } = await (supabaseAdmin as any)
            .from("school_prospects")
            .update({ enrichment_status: "PENDING" })
            .in("id", prospectsToUpdate);

          if (updateErr) {
            console.error("[Enrich Selected API] Batch update prospects error:", JSON.stringify(updateErr, null, 2));
          }
        }
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
    console.error("[Enrich Selected API] Unexpected error:", err);
    return NextResponse.json({ success: false, message: `Unexpected error: ${err.message || err}` }, { status: 500 });
  }
}
