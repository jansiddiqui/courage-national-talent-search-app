import { NextResponse } from 'next/server';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    const { title, preview, fullBody, category, targetAll, referralCode } = await request.json();

    if (!title || !fullBody) {
      return NextResponse.json({ error: 'Title and Full Body are required' }, { status: 400 });
    }

    if (hasSupabaseAdminConfig) {
      const { data, error } = await (supabaseAdmin as any)
        .from('partner_notifications')
        .insert({
          target_all: targetAll ?? true,
          referral_code: referralCode || null,
          sender: 'Courage Campaign Desk',
          title,
          preview: preview || title,
          full_body: fullBody,
          category: category || 'System',
          is_read: false,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, notification: data });
    }

    return NextResponse.json({ success: true, message: 'Broadcast dispatched in sandbox mode' });
  } catch (error) {
    console.error('[Admin Partner Broadcast Error]:', error);
    return NextResponse.json({ error: 'Failed to send broadcast.' }, { status: 500 });
  }
}
