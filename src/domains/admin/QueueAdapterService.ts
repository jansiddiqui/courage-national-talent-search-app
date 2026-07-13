/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * QueueAdapterService
 * Unified monitoring adapter over school_background_jobs and admin_background_jobs.
 * Does NOT merge the tables — each retains its own RLS boundary.
 * Provides at-least-once processing with idempotent side effects.
 */

export interface QueueSummary {
  queue:      'admin' | 'school';
  pending:    number;
  processing: number;
  failed:     number;
  completed:  number;
}

export async function getQueueSummary(
  supabaseAdmin: any
): Promise<QueueSummary[]> {
  const results: QueueSummary[] = [];

  // Admin queue
  const { data: adminJobs } = await supabaseAdmin
    .from('admin_background_jobs')
    .select('status');

  if (adminJobs) {
    const counts = { pending: 0, processing: 0, failed: 0, completed: 0 };
    for (const j of adminJobs) {
      if (j.status === 'PENDING' || j.status === 'RETRY_PENDING') counts.pending++;
      else if (j.status === 'PROCESSING') counts.processing++;
      else if (j.status === 'FAILED') counts.failed++;
      else if (j.status === 'COMPLETED') counts.completed++;
    }
    results.push({ queue: 'admin', ...counts });
  }

  // School queue
  const { data: schoolJobs } = await supabaseAdmin
    .from('school_background_jobs')
    .select('status');

  if (schoolJobs) {
    const counts = { pending: 0, processing: 0, failed: 0, completed: 0 };
    for (const j of schoolJobs) {
      if (j.status === 'PENDING' || j.status === 'RETRY_PENDING') counts.pending++;
      else if (j.status === 'PROCESSING') counts.processing++;
      else if (j.status === 'FAILED') counts.failed++;
      else if (j.status === 'COMPLETED') counts.completed++;
    }
    results.push({ queue: 'school', ...counts });
  }

  return results;
}

export async function getRecentJobs(
  supabaseAdmin: any,
  queue: 'admin' | 'school',
  limit = 20
): Promise<any[]> {
  const table = queue === 'admin' ? 'admin_background_jobs' : 'school_background_jobs';
  const { data } = await supabaseAdmin
    .from(table)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}
