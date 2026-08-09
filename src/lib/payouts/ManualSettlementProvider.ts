import { PayoutProvider, PayoutBatchItem, PayoutBatchSummary, ManualSettlementRecord, BulkExcelSettlementRow } from './PayoutProvider';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';

export class ManualSettlementProvider implements PayoutProvider {
  name = 'MANUAL_SETTLEMENT_PROVIDER';

  async createBatch(items: PayoutBatchItem[]): Promise<PayoutBatchSummary> {
    const batchId = `BATCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const batchDate = new Date().toISOString();

    const grossAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const totalTds = items.reduce((sum, item) => sum + (item.tdsDeducted || Math.round(item.amount * 0.05)), 0);
    const netPayableAmount = grossAmount - totalTds;

    const batchedItems = items.map(item => ({
      ...item,
      status: 'BATCHED' as const,
      tdsDeducted: item.tdsDeducted || Math.round(item.amount * 0.05),
      netPayable: item.amount - (item.tdsDeducted || Math.round(item.amount * 0.05))
    }));

    return {
      batchId,
      batchDate,
      totalPartners: items.length,
      grossAmount,
      totalTds,
      netPayableAmount,
      status: 'APPROVED',
      items: batchedItems
    };
  }

  generateCsvExport(batch: PayoutBatchSummary): string {
    const headers = [
      'Request ID',
      'Partner ID',
      'Partner Name',
      'Email',
      'Phone',
      'Referral Code',
      'Payout Method',
      'Destination (UPI / Account+IFSC)',
      'Bank Name',
      'Gross Amount (INR)',
      '5% TDS (INR)',
      'Net Payable (INR)',
      'Status',
      'UTR / Transaction Reference',
      'Remarks'
    ];

    const rows = batch.items.map(item => [
      `"${item.id}"`,
      `"${item.partnerId}"`,
      `"${item.partnerName.replace(/"/g, '""')}"`,
      `"${item.email || ''}"`,
      `"${item.phone || ''}"`,
      `"${item.referralCode}"`,
      `"${item.payoutMethod}"`,
      `"${item.destinationAddress}"`,
      `"${item.bankName}"`,
      item.amount,
      item.tdsDeducted,
      item.netPayable,
      `"${item.status}"`,
      `"${item.transactionRef || ''}"`,
      `"${item.adminNote || ''}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  async processSingleSettlement(record: ManualSettlementRecord): Promise<PayoutBatchItem> {
    const { requestId, transactionRef, remarks } = record;
    const settledAt = record.paymentDate || new Date().toISOString();
    const finalUtr = transactionRef || `UTR-${Math.floor(10000000 + Math.random() * 90000000)}`;

    if (hasSupabaseAdminConfig) {
      const { data: updated, error } = await (supabaseAdmin as any)
        .from('partner_payout_requests')
        .update({
          status: 'SETTLED',
          transaction_ref: finalUtr,
          settled_at: settledAt,
          admin_note: remarks || 'Manual Bank Settlement Executed'
        })
        .eq('id', requestId)
        .select(`
          *,
          partners (full_name, email, phone, referral_code)
        `)
        .single();

      if (error) {
        throw new Error(`Failed to update payout request: ${error.message}`);
      }

      if (updated) {
        // Send Partner Inbox Notification
        const partnerInfo = updated.partners || {};
        await (supabaseAdmin as any)
          .from('partner_notifications')
          .insert({
            partner_id: updated.partner_id,
            referral_code: updated.referral_code || partnerInfo.referral_code,
            sender: 'Finance Operations Desk',
            title: `💰 Honorarium Payout Settled: ₹${updated.amount}`,
            preview: `Your weekly payout request of ₹${updated.amount} has been successfully settled via bank transfer.`,
            full_body: `Your withdrawal request of ₹${updated.amount} has been disbursed.\n\nTransaction Ref / UTR: ${finalUtr}\nDate: ${new Date(settledAt).toLocaleDateString()}\n\nThank you for being a valued Courage Partner!`,
            category: 'Payout',
            is_read: false,
          });

        return {
          id: updated.id,
          partnerId: updated.partner_id,
          partnerName: partnerInfo.full_name || 'Partner',
          email: partnerInfo.email,
          phone: partnerInfo.phone,
          referralCode: updated.referral_code,
          payoutMethod: updated.payout_method || 'UPI',
          destinationAddress: updated.destination_address || 'Saved Account',
          bankName: updated.bank_name || 'Bank',
          amount: Number(updated.amount),
          tdsDeducted: Math.round(Number(updated.amount) * 0.05),
          netPayable: Number(updated.amount) - Math.round(Number(updated.amount) * 0.05),
          status: 'SETTLED',
          transactionRef: finalUtr,
          settledAt,
          adminNote: remarks
        };
      }
    }

    return {
      id: requestId,
      partnerId: 'P-DEMO',
      partnerName: 'Sandbox Partner',
      referralCode: 'DEMO',
      payoutMethod: 'UPI',
      destinationAddress: 'demo@upi',
      bankName: 'Demo Bank',
      amount: 1000,
      tdsDeducted: 50,
      netPayable: 950,
      status: 'SETTLED',
      transactionRef: finalUtr,
      settledAt,
      adminNote: remarks
    };
  }

  async processBulkExcelSettlement(rows: BulkExcelSettlementRow[]): Promise<{ settledCount: number; failedCount: number; updatedIds: string[] }> {
    let settledCount = 0;
    let failedCount = 0;
    const updatedIds: string[] = [];

    for (const row of rows) {
      try {
        if (row.requestId && row.transactionRef && row.status === 'SETTLED') {
          await this.processSingleSettlement({
            requestId: row.requestId,
            transactionRef: row.transactionRef,
            remarks: row.remarks || 'Bulk Excel Re-Upload Auto-Settlement'
          });
          settledCount++;
          updatedIds.push(row.requestId);
        } else {
          failedCount++;
        }
      } catch (err) {
        console.error(`[Bulk Excel Settlement Item Failure - ID: ${row.requestId}]:`, err);
        failedCount++;
      }
    }

    return { settledCount, failedCount, updatedIds };
  }

  async getPayoutStatus(requestId: string): Promise<PayoutBatchItem | null> {
    if (hasSupabaseAdminConfig) {
      const { data, error } = await (supabaseAdmin as any)
        .from('partner_payout_requests')
        .select(`
          *,
          partners (full_name, email, phone, referral_code)
        `)
        .eq('id', requestId)
        .maybeSingle();

      if (!error && data) {
        const partnerInfo = data.partners || {};
        return {
          id: data.id,
          partnerId: data.partner_id,
          partnerName: partnerInfo.full_name || 'Partner',
          email: partnerInfo.email,
          phone: partnerInfo.phone,
          referralCode: data.referral_code,
          payoutMethod: data.payout_method || 'UPI',
          destinationAddress: data.destination_address || 'Saved Account',
          bankName: data.bank_name || 'Bank',
          amount: Number(data.amount),
          tdsDeducted: Math.round(Number(data.amount) * 0.05),
          netPayable: Number(data.amount) - Math.round(Number(data.amount) * 0.05),
          status: data.status,
          transactionRef: data.transaction_ref,
          settledAt: data.settled_at,
          adminNote: data.admin_note
        };
      }
    }

    return null;
  }
}
