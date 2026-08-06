import { NextResponse } from 'next/server';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (hasSupabaseAdminConfig && id && !id.startsWith('welcome-') && !id.startsWith('payout-')) {
      await (supabaseAdmin as any)
        .from('partner_notifications')
        .update({ is_read: true })
        .eq('id', id);
    }

    return NextResponse.json({ success: true, message: 'Marked as read.' });
  } catch (error) {
    console.error('[Inbox Mark Read Error]:', error);
    return NextResponse.json({ error: 'Failed to mark as read.' }, { status: 500 });
  }
}
