import { NextResponse } from 'next/server';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    let submissions: any[] = [];

    if (hasSupabaseAdminConfig) {
      const { data, error } = await (supabaseAdmin as any)
        .from('partner_video_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        submissions = data;
      }
    }

    return NextResponse.json({
      success: true,
      submissions,
      total: submissions.length,
      pendingCount: submissions.filter(s => s.status === 'PENDING_REVIEW' || s.status === 'PENDING').length
    });
  } catch (error) {
    console.error('[Admin Video Submissions GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch video submissions.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { submissionId, status, adminNotes } = await request.json();

    if (!submissionId || !status) {
      return NextResponse.json({ error: 'submissionId and status are required' }, { status: 400 });
    }

    if (hasSupabaseAdminConfig) {
      await (supabaseAdmin as any)
        .from('partner_video_submissions')
        .update({
          status: status.toUpperCase(),
          admin_notes: adminNotes || null,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', submissionId);
    }

    return NextResponse.json({
      success: true,
      message: `Video submission updated to ${status}`
    });
  } catch (error) {
    console.error('[Admin Video Submissions PATCH Error]:', error);
    return NextResponse.json({ error: 'Failed to update video submission status.' }, { status: 500 });
  }
}
