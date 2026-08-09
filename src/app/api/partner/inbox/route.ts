import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/sessionHelper';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pfoxwfnfecxypbsftrrk.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const JWT_SECRET = SERVICE_KEY || 'partner-session-secret-key';

async function dbFetch(path: string): Promise<any[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    }
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return []; }
}

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

    let notifications: any[] = [];

    const rawData = await dbFetch(`partner_notifications?order=created_at.desc`);
    if (Array.isArray(rawData) && rawData.length > 0) {
      const filtered = rawData.filter((n: any) => 
        n.target_all || 
        (partnerId && n.partner_id === partnerId) || 
        (referralCode && n.referral_code === referralCode)
      );

      notifications = filtered.map((n: any) => ({
        id: n.id,
        sender: n.sender || 'Courage Verification Desk',
        time: new Date(n.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        category: n.category || 'System',
        isUnread: !n.is_read,
        title: n.title,
        preview: n.preview,
        body: n.full_body,
      }));
    }

    if (notifications.length === 0) {
      notifications = [
        {
          id: 'welcome-1',
          sender: 'Courage Partner Onboarding Desk',
          time: 'Today',
          category: 'System',
          isUnread: true,
          title: '🎉 Welcome to Courage Partner Workspace',
          preview: 'Your official partner workspace is live. Share your link & track student enrolments in real time.',
          body: `Welcome to the official Courage Partner Program!\n\nYour application has been registered. You can now copy your referral link, generate AI promotion copy, and set up your payout UPI details for automatic Monday payouts.`,
        },
        {
          id: 'payout-1',
          sender: 'Finance Operations Team',
          time: 'Today',
          category: 'Payout',
          isUnread: false,
          title: 'Weekly Monday Honorarium Settlement',
          preview: 'All verified candidate honorarium earnings are batched for automated UPI disbursement every Monday.',
          body: `All verified referral earnings for the current cycle will be processed on Monday morning. Please ensure your payout UPI or Bank Account details are configured in the Payouts tab.`,
        },
      ];
    }

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount: notifications.filter(n => n.isUnread).length,
    });
  } catch (error) {
    console.error('[Inbox GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch inbox notifications.' }, { status: 500 });
  }
}
