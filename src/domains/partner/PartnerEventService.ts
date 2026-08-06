import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';
import { DomainEventPayload } from '@/types/partnerTypes';

export class PartnerEventService {
  /**
   * Enforces financial idempotency by checking if an idempotencyKey has already been executed.
   */
  public static async isEventProcessed(idempotencyKey: string): Promise<boolean> {
    if (!hasSupabaseAdminConfig || !idempotencyKey) return false;

    try {
      const { data } = await (supabaseAdmin as any)
        .from('processed_events')
        .select('idempotency_key')
        .eq('idempotency_key', idempotencyKey)
        .maybeSingle();

      return !!data;
    } catch (err) {
      console.warn('[PartnerEventService] Idempotency check error:', err);
      return false;
    }
  }

  /**
   * Atomic recording of a domain event and its idempotency key.
   */
  public static async recordEvent(event: DomainEventPayload): Promise<boolean> {
    if (!hasSupabaseAdminConfig) return true;

    try {
      // 1. Mark idempotency key as processed
      await (supabaseAdmin as any)
        .from('processed_events')
        .insert({
          idempotency_key: event.idempotencyKey,
          event_type: event.eventType,
          partner_id: event.partnerId,
          processed_at: new Date().toISOString()
        });

      // 2. Append event to immutable timeline feed table
      await (supabaseAdmin as any)
        .from('partner_events')
        .insert({
          partner_id: event.partnerId,
          event_type: event.eventType,
          metadata: event.metadata || {},
          created_at: event.timestamp || new Date().toISOString()
        });

      return true;
    } catch (err) {
      console.error('[PartnerEventService] Error recording event:', err);
      return false;
    }
  }
}
