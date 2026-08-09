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
      'Prefer': 'return=representation'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch { data = text; }
  return { data, ok: res.ok, status: res.status };
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cnts_partner_session');

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: 'Unauthorized partner session.' }, { status: 401 });
    }

    const payload = await verifySession(sessionCookie.value, JWT_SECRET);
    if (!payload || !payload.partnerDbId) {
      return NextResponse.json({ error: 'Unauthorized partner session.' }, { status: 401 });
    }

    const partnerId = payload.partnerDbId;

    if (id && !id.startsWith('mock-')) {
      // Ensure partner can ONLY cancel their own payout request
      await dbFetch(
        'PATCH',
        `partner_payout_requests?id=eq.${encodeURIComponent(id)}&partner_id=eq.${encodeURIComponent(partnerId)}`,
        { status: 'CANCELLED' }
      );
    }

    return NextResponse.json({ success: true, message: 'Withdrawal request cancelled successfully.' });
  } catch (error) {
    console.error('[Payout Cancel Error]:', error);
    return NextResponse.json({ error: 'Failed to cancel request.' }, { status: 500 });
  }
}
