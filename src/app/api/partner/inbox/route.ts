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

    let notifications: any[] = [];

    if (hasSupabaseAdminConfig) {
      let query = (supabaseAdmin as any)
        .from('partner_notifications')
        .select('*');

      if (partnerId) {
        query = query.or(`partner_id.eq.${partnerId},target_all.eq.true,referral_code.eq.${referralCode || 'CNTSJN'}`);
      } else {
        query = query.eq('target_all', true);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        notifications = data.map((n: any) => ({
          id: n.id,
          sender: n.sender,
          time: new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          category: n.category || 'System',
          isUnread: !n.is_read,
          title: n.title,
          preview: n.preview,
          body: n.full_body,
        }));
      }
    }

    if (notifications.length === 0) {
      notifications = [
        {
          id: 'welcome-1',
          sender: 'Courage Partner Onboarding Desk',
          time: 'Today',
          category: 'System',
          isUnread: true,
          title: '🎉 Partner Account Under Verification',
          preview: 'Welcome to Courage National Talent Search 2026! Your partner workspace is currently pending official verification.',
          body: `Welcome to the official Courage Partner Program!\n\nYour application has been registered. Our admin team will verify your channels and grant full active status. You can now copy your referral link, generate AI promotion copy, and set up your payout UPI details.`,
        },
        {
          id: 'payout-1',
          sender: 'Finance Operations Team',
          time: 'Aug 3',
          category: 'Payout',
          isUnread: true,
          title: 'Weekly Payout Batch Scheduled — Monday Aug 10',
          preview: 'Your submitted withdrawal requests are batched for automated UPI disbursement on coming Monday.',
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
