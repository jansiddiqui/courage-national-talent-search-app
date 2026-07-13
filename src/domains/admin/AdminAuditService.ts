/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AdminAuditService
 * Writes immutable entries to admin_operations_audit_trail.
 * The database trigger prevents UPDATE/DELETE on this table.
 */

export interface AuditEntry {
  actorId:       string | null;
  actorRole:     string;
  action:        string;
  module:        string;
  previousValue: Record<string, any>;
  newValue:      Record<string, any>;
  ipAddress:     string;
  reason?:       string;
  correlationId?: string;
  requestId?:    string;
  userAgent?:    string;
}

export async function writeAuditEntry(
  supabaseAdmin: any,
  entry: AuditEntry
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('admin_operations_audit_trail')
    .insert({
      actor_id:       entry.actorId,
      actor_role:     entry.actorRole,
      action:         entry.action,
      module:         entry.module,
      previous_value: entry.previousValue,
      new_value:      entry.newValue,
      ip_address:     entry.ipAddress,
      reason:         entry.reason ?? null,
      correlation_id: entry.correlationId ?? null,
      request_id:     entry.requestId ?? null,
      user_agent:     entry.userAgent ?? null,
    });

  if (error) {
    // Log but do not throw — audit failure must not break the primary operation
    console.error('[AdminAuditService] Failed to write audit entry:', error);
  }
}
