import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/sessionHelper';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pfoxwfnfecxypbsftrrk.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

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

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cnts_partner_session');

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: 'Unauthorized partner session.' }, { status: 401 });
    }

    const payload = await verifySession(sessionCookie.value, SERVICE_KEY || 'partner-session-secret-key');
    if (!payload || !payload.partnerDbId) {
      return NextResponse.json({ error: 'Unauthorized partner session.' }, { status: 401 });
    }

    const partnerId = payload.partnerDbId;
    const { appealMessage } = await request.json();

    if (!appealMessage || appealMessage.trim().length < 20) {
      return NextResponse.json({ error: 'Appeal message must be at least 20 characters long.' }, { status: 400 });
    }

    const now = new Date().toISOString();

    const updatePayload = {
      appeal_status: 'PENDING',
      appeal_message: appealMessage.trim(),
      appeal_requested_at: now,
    };

    const { data: updated, ok } = await dbFetch(
      'PATCH',
      `partners?id=eq.${encodeURIComponent(partnerId)}`,
      updatePayload
    );

    if (!ok) {
      return NextResponse.json({ error: 'Failed to record appeal request.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Review request submitted successfully.',
      appealRequestedAt: now
    });

  } catch (error) {
    console.error('[Partner Appeal Submit Error]:', error);
    return NextResponse.json({ error: 'Failed to submit review request.' }, { status: 500 });
  }
}
