import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/sessionHelper';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pfoxwfnfecxypbsftrrk.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const JWT_SECRET = SERVICE_KEY || 'partner-session-secret-key';

async function dbFetch(method: string, path: string, body?: any): Promise<{ data: any; ok: boolean; status: number }> {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : 'return=representation'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch { data = text; }
  return { data, ok: res.ok, status: res.status };
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cnts_partner_session');

    let partnerId: string | null = null;
    if (sessionCookie && sessionCookie.value) {
      const payload = await verifySession(sessionCookie.value, JWT_SECRET);
      if (payload) {
        partnerId = payload.partnerDbId;
      }
    }

    if (!partnerId) {
      return NextResponse.json({ success: true, requests: [] });
    }

    const { data: requests } = await dbFetch(
      'GET',
      `partner_payout_requests?partner_id=eq.${encodeURIComponent(partnerId)}&order=requested_at.desc`
    );

    const payoutRequests = Array.isArray(requests) ? requests.map((r: any) => ({
      id: r.id,
      reqId: `REQ-${String(r.id).substring(0, 4).toUpperCase()}`,
      amount: `₹${Number(r.amount).toLocaleString('en-IN')}`,
      rawAmount: Number(r.amount),
      date: new Date(r.requested_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      batchDate: r.batch_date ? new Date(r.batch_date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }) : 'Monday, Aug 10, 2026',
      status: r.status === 'PENDING' ? 'Pending Weekly Batch' : r.status,
      method: 'Registered Payout Account',
    })) : [];

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

    if (!partnerId) {
      return NextResponse.json({ error: 'Unauthorized partner session.' }, { status: 401 });
    }

    const { amount } = await request.json();
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      return NextResponse.json({ error: 'Valid withdrawal amount is required.' }, { status: 400 });
    }

    const nextMonday = new Date();
    nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7 || 7));
    const batchDateStr = nextMonday.toISOString().split('T')[0];

    const { data: inserted, ok: insertOk } = await dbFetch('POST', 'partner_payout_requests', {
      partner_id: partnerId,
      referral_code: referralCode || 'CNTSJN',
      amount: numericAmount,
      status: 'PENDING',
      batch_date: batchDateStr,
    });

    const insertedObj = Array.isArray(inserted) ? inserted[0] : inserted;
    const newReqId = (insertOk && insertedObj?.id) ? `REQ-${String(insertedObj.id).substring(0, 4).toUpperCase()}` : `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

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
