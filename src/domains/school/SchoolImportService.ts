/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";
import { StudentRow } from "./SchoolImportValidation";

const db = supabaseAdmin as any;

export class SchoolImportService {
  /**
   * Initializes a background upload batch and queue record.
   */
  static async queueImportJob(
    schoolId: string,
    uploaderId: string,
    filename: string,
    storagePath: string,
    validatedRows: StudentRow[]
  ): Promise<string> {
    if (!hasSupabaseAdminConfig) {
      return "demo-batch-id";
    }

    // 1. Create upload batch tracker
    const { data: batch, error: batchErr } = await db
      .from("school_upload_batches")
      .insert({
        school_id: schoolId,
        uploaded_by: uploaderId,
        storage_path: storagePath,
        status: "PENDING",
        total_rows: validatedRows.length,
        success_rows: 0,
        failed_rows: 0,
        error_log: [],
      })
      .select("id")
      .single();

    if (batchErr || !batch) {
      throw new Error(`Failed to create upload batch: ${batchErr?.message}`);
    }

    // 2. Queue background processing job
    const idempotencyKey = `IMPORT-${batch.id}`;
    const { error: jobErr } = await db
      .from("school_background_jobs")
      .insert({
        school_id: schoolId,
        job_type: "BULK_IMPORT",
        status: "PENDING",
        total_items: validatedRows.length,
        processed_items: 0,
        payload: {
          batchId: batch.id,
          students: validatedRows,
        },
        idempotency_key: idempotencyKey,
      });

    if (jobErr) {
      // Cleanup batch if job insertion fails
      await db
        .from("school_upload_batches")
        .delete()
        .eq("id", batch.id);

      throw new Error(`Failed to queue background job: ${jobErr.message}`);
    }

    return batch.id;
  }
}
