import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/sessionHelper';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-partner-secret-key-cnts-2026';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cnts_partner_session');

    let partnerId: string | null = null;

    if (sessionCookie && sessionCookie.value) {
      const payload = await verifySession(sessionCookie.value, JWT_SECRET);
      if (payload) {
        partnerId = payload.partnerDbId;
      }
    }

    if (hasSupabaseAdminConfig && partnerId && id && !id.startsWith('mock-')) {
      await (supabaseAdmin as any)
        .from('partner_payout_requests')
        .update({ status: 'CANCELLED' })
        .eq('id', id)
        .eq('partner_id', partnerId);
    }

    return NextResponse.json({ success: true, message: 'Withdrawal request cancelled successfully.' });
  } catch (error) {
    console.error('[Payout Cancel Error]:', error);
    return NextResponse.json({ error: 'Failed to cancel request.' }, { status: 500 });
  }
}
