import { NextResponse } from 'next/server';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';

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

    return NextResponse.json({
      success: true,
      requests,
      pendingCount: requests.filter(r => r.status === 'PENDING').length,
    });
  } catch (error) {
    console.error('[Admin Payouts GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch payout requests.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { requestId, status, transactionRef, adminNote } = await request.json();

    if (!requestId || !status) {
      return NextResponse.json({ error: 'requestId and status are required' }, { status: 400 });
    }

    if (hasSupabaseAdminConfig) {
      const updatePayload: any = {
        status: status.toUpperCase(),
        admin_note: adminNote || null,
      };

      if (status.toUpperCase() === 'SETTLED') {
        updatePayload.settled_at = new Date().toISOString();
        updatePayload.transaction_ref = transactionRef || `UTR-${Math.floor(10000000 + Math.random() * 90000000)}`;
      }

      const { data: updated, error } = await (supabaseAdmin as any)
        .from('partner_payout_requests')
        .update(updatePayload)
        .eq('id', requestId)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Notify partner in inbox if settled
      if (updated && updated.partner_id && status.toUpperCase() === 'SETTLED') {
        await (supabaseAdmin as any)
          .from('partner_notifications')
          .insert({
            partner_id: updated.partner_id,
            referral_code: updated.referral_code,
            sender: 'Finance Operations Desk',
            title: `💰 Honorarium Payout Settled: ₹${updated.amount}`,
            preview: `Your weekly payout request of ₹${updated.amount} has been successfully settled.`,
            full_body: `Your withdrawal request of ₹${updated.amount} has been disbursed.\n\nTransaction Ref / UTR: ${updated.transaction_ref}\nDate: ${new Date().toLocaleDateString()}\n\nThank you for being a valued Courage Partner!`,
            category: 'Payout',
            is_read: false,
          });
      }

      return NextResponse.json({ success: true, request: updated });
    }

    return NextResponse.json({ success: true, message: 'Updated in sandbox mode' });
  } catch (error) {
    console.error('[Admin Payouts PATCH Error]:', error);
    return NextResponse.json({ error: 'Failed to update payout request.' }, { status: 500 });
  }
}
