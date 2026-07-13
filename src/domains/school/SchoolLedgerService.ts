import { supabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabaseAdmin";

const db = supabaseAdmin as any;

export interface LedgerTransaction {
  id: string;
  transactionType: "INVOICE" | "PAYMENT" | "REFUND" | "SPONSORED_CREDIT" | "CREDIT_NOTE" | "ADJUSTMENT";
  amount: number;
  referenceId?: string;
  createdAt: string;
}

export class SchoolLedgerService {
  /**
   * Calculates the current outstanding balance dynamically by aggregating ledger records.
   * Debits (INVOICE, REFUND) increase outstanding balance.
   * Credits (PAYMENT, SPONSORED_CREDIT, CREDIT_NOTE) decrease outstanding balance.
   */
  static async calculateBalance(schoolId: string): Promise<number> {
    if (!hasSupabaseAdminConfig) return 0;

    const { data: txs, error } = await db
      .from("school_fee_ledger")
      .select("transaction_type, amount")
      .eq("school_id", schoolId);

    if (error) {
      throw new Error(`Ledger fetch failed: ${error.message}`);
    }

    let outstanding = 0;

    for (const tx of txs || []) {
      const type = tx.transaction_type;
      const amt = Number(tx.amount);

      if (type === "INVOICE" || type === "REFUND") {
        outstanding += amt;
      } else if (type === "PAYMENT" || type === "SPONSORED_CREDIT" || type === "CREDIT_NOTE") {
        outstanding -= amt;
      } else if (type === "ADJUSTMENT") {
        // For general adjustment, addition/subtraction is determined by the sign of the amount
        outstanding += amt;
      }
    }

    return outstanding;
  }

  /**
   * Returns the ledger statements order by date.
   */
  static async getLedgerHistory(schoolId: string): Promise<LedgerTransaction[]> {
    if (!hasSupabaseAdminConfig) return [];

    const { data, error } = await db
      .from("school_fee_ledger")
      .select("id, transaction_type, amount, reference_id, created_at")
      .eq("school_id", schoolId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Ledger history fetch failed: ${error.message}`);
    }

    return (data || []).map((t: any) => ({
      id: t.id,
      transactionType: t.transaction_type,
      amount: Number(t.amount),
      referenceId: t.reference_id || undefined,
      createdAt: t.created_at,
    }));
  }
}
