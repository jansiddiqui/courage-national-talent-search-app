/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AdminFinanceService
 * Read-only access to school_fee_ledger for financial audit.
 * Large refunds (> ₹10,000) require a maker-checker approval request.
 */

export const LARGE_REFUND_THRESHOLD_INR = 10000;

export async function getLedgerForSchool(
  supabaseAdmin: any,
  schoolId: string,
  limit = 50
): Promise<any[]> {
  const { data } = await supabaseAdmin
    .from('school_fee_ledger')
    .select('*')
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}

export function isLargeRefund(amountInr: number): boolean {
  return amountInr > LARGE_REFUND_THRESHOLD_INR;
}
