import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/sessionHelper';
import { EmailService } from '@/services/emailService';
import { getPartnerReinstatementTemplate } from '@/lib/emailTemplates';

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

    const { partnerId, note } = await request.json();

    if (!partnerId) {
      return NextResponse.json({ error: 'partnerId is required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const adminEmail = adminSession.email || 'Admin Operations';

    const updatePayload = {
      status: 'APPROVED',
      appeal_status: 'APPROVED',
      appeal_reviewed_at: now,
      appeal_reviewed_by: adminEmail
    };

    const { data: updated, ok } = await dbFetch(
      'PATCH',
      `partners?id=eq.${encodeURIComponent(partnerId)}`,
      updatePayload
    );

    if (!ok) {
      return NextResponse.json({ error: 'Failed to reinstate partner record' }, { status: 500 });
    }

    const partnerRecord = Array.isArray(updated) ? updated[0] : updated;

    // 1. Send Notification to Partner Inbox (non-blocking)
    try {
      await dbFetch('POST', 'partner_notifications', {
        partner_id: partnerId,
        referral_code: partnerRecord?.referral_code || 'PARTNER',
        sender: 'Courage Verification Desk',
        title: '🟢 Partner Account Reinstated',
        preview: 'Your Courage Partner account access has been fully restored.',
        full_body: `Great news ${partnerRecord?.full_name || ''}!\n\nYour Courage Partner account has been officially REINSTATED by our compliance desk.\n\nNote: ${note || 'Account review completed.'}\n\nYou can now access your full partner dashboard, share your link, and submit withdrawal requests.`,
        category: 'System',
        is_read: false
      });
    } catch (notifErr) {
      console.error('[Partner Reinstatement Notification Error - Non Blocking]:', notifErr);
    }


    // 2. Send Reinstatement Email (Non-blocking)
    if (partnerRecord?.email) {
      try {
        const emailService = new EmailService();
        const reinstatementHtml = getPartnerReinstatementTemplate({
          fullName: partnerRecord.full_name || 'Partner',
          email: partnerRecord.email,
          partnerId: partnerRecord.partner_id || `CP-2026-${partnerRecord.id}`,
          reinstatedAt: now,
          note: note || '',
          customSlug: partnerRecord.custom_slug,
        });
        await emailService.sendEmail(
          partnerRecord.email,
          'Your Courage Partner account has been reinstated',
          reinstatementHtml
        );
      } catch (emailErr) {
        console.error('[Partner Reinstatement Email Error - Non Blocking]:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Partner reinstated successfully.',
      partner: partnerRecord
    });

  } catch (error) {
    console.error('[Admin Partner Reinstate Error]:', error);
    return NextResponse.json({ error: 'Failed to execute reinstatement.' }, { status: 500 });
  }
}
