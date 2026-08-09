import { NextResponse } from 'next/server';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';
import { ProviderFactory } from '@/lib/payouts/ProviderFactory';
import { PayoutBatchItem } from '@/lib/payouts/PayoutProvider';

export async function GET() {
  try {
    let requests: any[] = [];

    if (hasSupabaseAdminConfig) {
      const { data, error } = await (supabaseAdmin as any)
        .from('partner_payout_requests')
        .select(`
          *,
          partners (full_name, email, phone, referral_code, honorarium_rate)
        `)
        .order('requested_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        requests = data;
      }
    }

    const pendingRequests = requests.filter(r => r.status === 'PENDING' || r.status === 'BATCHED');
    const totalPendingAmount = pendingRequests.reduce((sum, r) => sum + Number(r.amount || 0), 0);

    return NextResponse.json({
      success: true,
      requests,
      pendingCount: pendingRequests.length,
      totalPendingAmount
    });
  } catch (error) {
    console.error('[Admin Payouts GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch payout requests.' }, { status: 500 });
  }
}

// POST: Batch Creation & CSV/Excel Export Generation
export async function POST(request: Request) {
  try {
    const { action, requestIds } = await request.json();
    const payoutProvider = ProviderFactory.getPayoutProvider();

    let requestsToBatch: PayoutBatchItem[] = [];

    if (hasSupabaseAdminConfig) {
      let query = (supabaseAdmin as any)
        .from('partner_payout_requests')
        .select(`
          *,
          partners (full_name, email, phone, referral_code)
        `);

      if (Array.isArray(requestIds) && requestIds.length > 0) {
        query = query.in('id', requestIds);
      } else {
        query = query.eq('status', 'PENDING');
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        requestsToBatch = data.map(r => {
          const partnerInfo = r.partners || {};
          const gross = Number(r.amount);
          const tds = Math.round(gross * 0.05);
          return {
            id: r.id,
            partnerId: r.partner_id,
            partnerName: partnerInfo.full_name || 'Partner',
            email: partnerInfo.email,
            phone: partnerInfo.phone,
            referralCode: r.referral_code || partnerInfo.referral_code,
            payoutMethod: r.payout_method || 'UPI',
            destinationAddress: r.destination_address || 'Saved Destination',
            bankName: r.bank_name || 'Bank',
            amount: gross,
            tdsDeducted: tds,
            netPayable: gross - tds,
            status: r.status
          };
        });
      }
    }

    const batchSummary = await payoutProvider.createBatch(requestsToBatch);

    if (action === 'EXPORT_CSV' || action === 'EXPORT_EXCEL') {
      const csvContent = payoutProvider.generateCsvExport(batchSummary);
      return new Response(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="CNTS_Payout_Batch_${batchSummary.batchId}.csv"`
        }
      });
    }

    return NextResponse.json({
      success: true,
      batchSummary
    });
  } catch (error: any) {
    console.error('[Admin Payouts POST Error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create payout batch.' }, { status: 500 });
  }
}

// PATCH: Single Manual UTR Settlement
export async function PATCH(request: Request) {
  try {
    const { requestId, status, transactionRef, adminNote } = await request.json();

    if (!requestId) {
      return NextResponse.json({ error: 'requestId is required' }, { status: 400 });
    }

    const payoutProvider = ProviderFactory.getPayoutProvider();

    if (status?.toUpperCase() === 'SETTLED') {
      const item = await payoutProvider.processSingleSettlement({
        requestId,
        transactionRef,
        remarks: adminNote
      });

      return NextResponse.json({ success: true, request: item });
    }

    // Default status update if not settled
    if (hasSupabaseAdminConfig) {
      const { data: updated, error } = await (supabaseAdmin as any)
        .from('partner_payout_requests')
        .update({
          status: status ? status.toUpperCase() : 'PENDING',
          admin_note: adminNote || null
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, request: updated });
    }

    return NextResponse.json({ success: true, message: 'Updated in sandbox mode' });
  } catch (error: any) {
    console.error('[Admin Payouts PATCH Error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update payout request.' }, { status: 500 });
  }
}

// PUT: Bulk Excel/CSV Re-Upload Settlement Parser & Auto-Updater
export async function PUT(request: Request) {
  try {
    const { rows } = await request.json();

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'rows array is required for bulk settlement.' }, { status: 400 });
    }

    const payoutProvider = ProviderFactory.getPayoutProvider();
    const result = await payoutProvider.processBulkExcelSettlement(rows);

    return NextResponse.json({
      success: true,
      settledCount: result.settledCount,
      failedCount: result.failedCount,
      updatedIds: result.updatedIds
    });
  } catch (error: any) {
    console.error('[Admin Payouts PUT Error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to process bulk Excel settlement.' }, { status: 500 });
  }
}
