import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';

export type LedgerEntryType =
  | 'COMMISSION_EARNED'   // Student registration attributed
  | 'COMMISSION_APPROVED' // Admin / cooling window approval
  | 'PAYOUT_BATCHED'      // Added to weekly payout batch
  | 'PAYOUT_SETTLED'      // UTR recorded and partner wallet debited
  | 'COMMISSION_REVERSED' // Refund or duplicate registration reversal
  | 'MANUAL_ADJUSTMENT';  // Admin bonus or correction

export interface LedgerEventParams {
  partnerId: string;
  referralCode: string;
  entryType: LedgerEntryType;
  grossAmount: number;
  tdsDeducted?: number;
  netAmount: number;
  referenceId?: string;
  utr?: string;
  description: string;
  metadata?: Record<string, any>;
}

export class PartnerLedgerEngine {
  /**
   * Records an immutable double-entry transaction record in partner_payout_ledgers.
   * Nothing is ever overwritten; all events append to audit logs.
   */
  static async recordEvent(params: LedgerEventParams): Promise<{ success: boolean; entryId?: string; error?: string }> {
    const {
      partnerId,
      referralCode,
      entryType,
      grossAmount,
      tdsDeducted = Math.round(grossAmount * 0.05),
      netAmount,
      referenceId,
      utr,
      description,
      metadata = {}
    } = params;

    if (!hasSupabaseAdminConfig) {
      console.log('[PartnerLedgerEngine Sandbox Record]:', params);
      return { success: true, entryId: `LEDGER-SANDBOX-${Date.now()}` };
    }

    try {
      const { data, error } = await (supabaseAdmin as any)
        .from('partner_payout_ledgers')
        .insert({
          partner_id: partnerId,
          referral_code: referralCode,
          entry_type: entryType,
          gross_amount: grossAmount,
          tds_deducted: tdsDeducted,
          net_amount: netAmount,
          reference_id: referenceId || null,
          utr: utr || null,
          description,
          metadata,
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) {
        console.error('[PartnerLedgerEngine Insert Error]:', error);
        return { success: false, error: error.message };
      }

      return { success: true, entryId: data?.id };
    } catch (err: any) {
      console.error('[PartnerLedgerEngine Exception]:', err);
      return { success: false, error: err?.message || 'Ledger write exception' };
    }
  }

  /**
   * Fetches full ledger statement and summary metrics for a partner.
   */
  static async getPartnerWalletBalance(partnerId: string): Promise<{
    currentEarnings: number;
    pendingEarnings: number;
    approvedEarnings: number;
    paidEarnings: number;
    lastPaymentUtr?: string;
    lastPaymentDate?: string;
  }> {
    if (!hasSupabaseAdminConfig) {
      return {
        currentEarnings: 1250,
        pendingEarnings: 250,
        approvedEarnings: 1000,
        paidEarnings: 4500,
        lastPaymentUtr: 'UTR-98765432',
        lastPaymentDate: new Date().toISOString()
      };
    }

    try {
      const { data: entries, error } = await (supabaseAdmin as any)
        .from('partner_payout_ledgers')
        .select('*')
        .eq('partner_id', partnerId)
        .order('created_at', { ascending: false });

      if (error || !Array.isArray(entries)) {
        return {
          currentEarnings: 0,
          pendingEarnings: 0,
          approvedEarnings: 0,
          paidEarnings: 0
        };
      }

      let currentEarnings = 0;
      let pendingEarnings = 0;
      let approvedEarnings = 0;
      let paidEarnings = 0;
      let lastPaymentUtr: string | undefined;
      let lastPaymentDate: string | undefined;

      for (const entry of entries) {
        const net = Number(entry.net_amount || 0);

        if (entry.entry_type === 'COMMISSION_EARNED') {
          pendingEarnings += net;
          currentEarnings += net;
        } else if (entry.entry_type === 'COMMISSION_APPROVED') {
          approvedEarnings += net;
        } else if (entry.entry_type === 'PAYOUT_SETTLED') {
          paidEarnings += net;
          if (!lastPaymentUtr && entry.utr) {
            lastPaymentUtr = entry.utr;
            lastPaymentDate = entry.created_at;
          }
        }
      }

      return {
        currentEarnings,
        pendingEarnings,
        approvedEarnings,
        paidEarnings,
        lastPaymentUtr,
        lastPaymentDate
      };
    } catch {
      return {
        currentEarnings: 0,
        pendingEarnings: 0,
        approvedEarnings: 0,
        paidEarnings: 0
      };
    }
  }
}
