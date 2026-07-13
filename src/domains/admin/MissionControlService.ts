/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * MissionControlService
 * Aggregates real-time platform health metrics from the database.
 * CPU/Memory metrics are not available in serverless — omitted.
 */

export interface PlatformHealth {
  queueBacklog:        number;
  pendingApprovals:    number;
  openSupportTickets:  number;
  recentAuditActions:  number;
  activeAdmins:        number;
}

export async function getPlatformHealth(
  supabaseAdmin: any
): Promise<PlatformHealth> {
  const [queueRes, approvalsRes, ticketsRes, auditRes, adminsRes] = await Promise.all([
    supabaseAdmin
      .from('admin_background_jobs')
      .select('id', { count: 'exact', head: true })
      .in('status', ['PENDING', 'RETRY_PENDING']),
    supabaseAdmin
      .from('approval_requests')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'PENDING'),
    supabaseAdmin
      .from('support_tickets')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'OPEN'),
    supabaseAdmin
      .from('admin_operations_audit_trail')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    supabaseAdmin
      .from('admin_users')
      .select('id', { count: 'exact', head: true }),
  ]);

  return {
    queueBacklog:       queueRes.count    ?? 0,
    pendingApprovals:   approvalsRes.count ?? 0,
    openSupportTickets: ticketsRes.count   ?? 0,
    recentAuditActions: auditRes.count     ?? 0,
    activeAdmins:       adminsRes.count    ?? 0,
  };
}
