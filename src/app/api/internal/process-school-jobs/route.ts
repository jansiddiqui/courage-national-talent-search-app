import { NextResponse } from "next/server";
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { NotificationService } from "@/services/NotificationService";

const db = supabaseAdmin as any;

export async function POST(request: Request) {
  try {
    if (!hasSupabaseAdminConfig) {
      return NextResponse.json({ success: true, message: "Mock execution successful" });
    }

    const workerId = "00000000-0000-0000-0000-000000000001"; // Fixed worker ID
    const leaseSeconds = 300; // 5 minute lock lease

    // 1. Claim next pending job using atomic skip-locked database query
    const { data: job, error: claimErr } = await db.rpc("claim_next_school_job", {
      p_worker_id: workerId,
      p_lease_seconds: leaseSeconds,
    }).maybeSingle();

    if (claimErr) {
      return NextResponse.json({ success: false, message: `Job claim failed: ${claimErr.message}` }, { status: 500 });
    }

    if (!job) {
      return NextResponse.json({ success: true, message: "No jobs to process" });
    }

    console.log(`[Job Worker] Claimed job ${job.id} (${job.job_type})`);

    const payload = job.payload as any;
    const batchId = payload.batchId;
    const students = payload.students || [];

    if (job.job_type === "BULK_IMPORT") {
      // 2. Fetch school configurations and target session
      const { data: school } = await db
        .from("schools")
        .select("name, city, state")
        .eq("id", job.school_id)
        .single();

      const { data: config } = await db
        .from("school_session_configs")
        .select("id, academic_session_id")
        .eq("school_id", job.school_id)
        .eq("status", "ACTIVE")
        .single();

      if (!school || !config) {
        // Mark job as failed
        await db
          .from("school_background_jobs")
          .update({ status: "FAILED", last_error: "School configuration or session not found" })
          .eq("id", job.id);

        await db
          .from("school_upload_batches")
          .update({ status: "FAILED", error_log: ["School configuration or session not found"] })
          .eq("id", batchId);

        return NextResponse.json({ success: false, message: "School or session configuration missing" });
      }

      // Update upload batch status to VALIDATING/PROCESSING
      await db
        .from("school_upload_batches")
        .update({ status: "VALIDATING" })
        .eq("id", batchId);

      const stateValue = school.state || school.city || "";
      const districtValue = school.city || "";

      let successCount = 0;
      let failedCount = 0;
      const errorLog: string[] = [];

      for (const [index, student] of students.entries()) {
        const studentName = student.studentName;
        const studentClass = student.studentClass;
        const dob = student.dob;
        const parentMobile = student.parentMobile;
        const parentEmail = student.parentEmail || "school_bulk@cnts.in";
        const parentName = student.parentName || "Provided by School";
        const gender = student.gender || "";
        const language = student.language || "English";

        // A. Generate registration ID
        const regId = `CNTS26${Math.floor(100000 + Math.random() * 900000)}`;
        const idempotencyKey = `ALLOC-${batchId}-${index}`;

        try {
          // B. Create candidate registration record linked to academic session
          const { error: regErr } = await db
            .from("registrations")
            .insert({
              registration_id: regId,
              student_name: studentName,
              dob,
              student_class: studentClass,
              school_name: school.name,
              school_city: school.city,
              school_code: "", // Backfilled or populated if needed
              school_id: job.school_id,
              parent_name: parentName,
              mobile_number: parentMobile,
              whatsapp_number: parentMobile,
              parent_email: parentEmail,
              state: stateValue,
              district: districtValue,
              language,
              why_participating: `School Bulk Registration | Gender: ${gender}`,
              how_heard: "School",
              payment_status: "SPONSORED",
              registration_source: "SCHOOL",
              registration_status: "REGISTERED",
              academic_session_id: config.academic_session_id,
            });

          if (regErr) {
            throw new Error(`Registration failed: ${regErr.message}`);
          }

          // C. Call quota allocation transaction RPC
          const { data: allocated, error: allocErr } = await db.rpc("allocate_school_quota", {
            p_config_id: config.id,
            p_registration_id: regId,
            p_idempotency_key: idempotencyKey,
          });

          if (allocErr || !allocated) {
            // Delete registration draft if quota allocation fails
            await db
              .from("registrations")
              .delete()
              .eq("registration_id", regId);

            throw new Error(`Quota allocation failed: ${allocErr?.message || 'Quota limit exceeded'}`);
          }

          successCount++;

          // Send confirmation notifications (non-blocking)
          NotificationService.sendRegistrationSuccess(
            parentMobile,
            parentEmail !== "school_bulk@cnts.in" ? parentEmail : null,
            studentName,
            studentClass,
            regId
          ).catch((err) =>
            console.error(`[Background Worker] Notification failed for ${studentName}:`, err)
          );

        } catch (err: any) {
          failedCount++;
          errorLog.push(`Row ${index + 1} (${studentName}): ${err.message}`);
        }

        // D. Update job progress counters periodically
        if ((index + 1) % 10 === 0 || (index + 1) === students.length) {
          await db
            .from("school_background_jobs")
            .update({
              processed_items: index + 1,
              updated_at: new Date().toISOString(),
            })
            .eq("id", job.id);
        }
      }

      // 3. Mark batch and background job as completed
      await db
        .from("school_background_jobs")
        .update({
          status: failedCount === students.length ? "FAILED" : "COMPLETED",
          last_error: errorLog.length > 0 ? errorLog.slice(0, 3).join("\n") : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id);

      await db
        .from("school_upload_batches")
        .update({
          status: "PROCESSED",
          success_rows: successCount,
          failed_rows: failedCount,
          error_log: errorLog,
        })
        .eq("id", batchId);
      
      console.log(`[Job Worker] Job ${job.id} completed. Success: ${successCount}, Failed: ${failedCount}`);
    }

    return NextResponse.json({ success: true, jobId: job.id });
  } catch (error: any) {
    console.error("[Job Worker] Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
