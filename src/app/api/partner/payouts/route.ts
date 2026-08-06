import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/sessionHelper';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-partner-secret-key-cnts-2026';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cnts_partner_session');

    let partnerId: string | null = null;
    let referralCode: string | null = null;

    if (sessionCookie && sessionCookie.value) {
      const payload = await verifySession(sessionCookie.value, JWT_SECRET);
      if (payload) {
        partnerId = payload.partnerDbId;
        referralCode = payload.referralCode;
      }
    }

    let payoutRequests: any[] = [];

    if (hasSupabaseAdminConfig && partnerId) {
      const { data: requests, error } = await (supabaseAdmin as any)
        .from('partner_payout_requests')
        .select('*')
        .eq('partner_id', partnerId)
        .order('requested_at', { ascending: false });

      if (!error && Array.isArray(requests)) {
        payoutRequests = requests.map((r: any) => ({
          id: r.id,
          reqId: `REQ-${r.id.substring(0, 4).toUpperCase()}`,
          amount: `₹${Number(r.amount).toLocaleString('en-IN')}`,
          rawAmount: Number(r.amount),
          date: new Date(r.requested_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          batchDate: r.batch_date ? new Date(r.batch_date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }) : 'Monday, Aug 10, 2026',
          status: r.status === 'PENDING' ? 'Pending Weekly Batch' : r.status,
          method: 'Registered Payout Account',
        }));
      }
    }

    // Return real payout requests exclusively from Supabase DB

    return NextResponse.json({
      success: true,
      requests: payoutRequests,
    });
  } catch (error) {
    console.error('[Payouts GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch payout requests.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cnts_partner_session');

    let partnerId: string | null = null;
    let referralCode: string | null = null;

    if (sessionCookie && sessionCookie.value) {
      const payload = await verifySession(sessionCookie.value, JWT_SECRET);
      if (payload) {
        partnerId = payload.partnerDbId;
        referralCode = payload.referralCode;
      }
    }

    const { amount } = await request.json();
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      return NextResponse.json({ error: 'Valid withdrawal amount is required.' }, { status: 400 });
    }

    const nextMonday = new Date();
    nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7 || 7));
    const batchDateStr = nextMonday.toISOString().split('T')[0];

    let newReqId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

    if (hasSupabaseAdminConfig && partnerId) {
      const { data: inserted, error } = await (supabaseAdmin as any)
        .from('partner_payout_requests')
        .insert({
          partner_id: partnerId,
          referral_code: referralCode || 'CNTSJN',
          amount: numericAmount,
          status: 'PENDING',
          batch_date: batchDateStr,
        })
        .select()
        .single();

      if (!error && inserted) {
        newReqId = `REQ-${inserted.id.substring(0, 4).toUpperCase()}`;
      }
    }

    return NextResponse.json({
      success: true,
      request: {
        id: newReqId,
        amount: `₹${numericAmount.toLocaleString('en-IN')}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        batchDate: nextMonday.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Pending Weekly Batch',
        method: 'Registered Payout Account',
      },
    });
  } catch (error) {
    console.error('[Payout POST Error]:', error);
    return NextResponse.json({ error: 'Failed to submit withdrawal request.' }, { status: 500 });
  }
}
