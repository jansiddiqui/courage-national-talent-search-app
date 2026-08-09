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
    const sessionCookie = cookieStore.get('cnts_session');

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ error: 'Unauthorized admin session' }, { status: 401 });
    }

    const adminSession = await verifySession(sessionCookie.value, SERVICE_KEY || 'admin-secret');
    if (!adminSession || (adminSession.role !== 'ADMIN' && adminSession.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden admin action' }, { status: 403 });
    }

    const { partnerId, reason, note } = await request.json();

    if (!partnerId || !reason) {
      return NextResponse.json({ error: 'partnerId and reason are required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const adminEmail = adminSession.email || 'Admin Operations';

    const updatePayload = {
      status: 'SUSPENDED',
      suspension_reason: reason,
      suspension_note: note || '',
      suspended_at: now,
      suspended_by: adminEmail,
      appeal_status: 'NONE'
    };

    const { data: updated, ok } = await dbFetch(
      'PATCH',
      `partners?id=eq.${encodeURIComponent(partnerId)}`,
      updatePayload
    );

    if (!ok) {
      return NextResponse.json({ error: 'Failed to suspend partner record' }, { status: 500 });
    }

    const partnerRecord = Array.isArray(updated) ? updated[0] : updated;

    // Send Notification to Partner Inbox
    await dbFetch('POST', 'partner_notifications', {
      partner_id: partnerId,
      referral_code: partnerRecord?.referral_code || 'PARTNER',
      sender: 'Courage Compliance Desk',
      title: '⚠️ Account Suspended — Compliance Review Required',
      preview: `Your partner account has been suspended: ${reason}`,
      full_body: `Your Courage Partner workspace access has been restricted by our compliance team.\n\nReason: ${reason}\nNote: ${note || 'N/A'}\nDate: ${new Date(now).toLocaleDateString()}\n\nYou can log in to your workspace handle to view the suspension reason and submit a review appeal.`,
      category: 'System',
      is_read: false
    });

    return NextResponse.json({
      success: true,
      message: 'Partner suspended successfully.',
      partner: partnerRecord
    });

  } catch (error) {
    console.error('[Admin Partner Suspend Error]:', error);
    return NextResponse.json({ error: 'Failed to execute suspension.' }, { status: 500 });
  }
}
