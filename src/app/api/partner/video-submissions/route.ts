import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/sessionHelper';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-partner-secret-key-cnts-2026';

// In-memory fallback store for video submissions if DB table is initializing
let memoryVideoSubmissions: any[] = [];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const referralCode = searchParams.get('referralCode') || 'CNTSJN';

    let submissions: any[] = [];

    if (hasSupabaseAdminConfig) {
      const { data, error } = await (supabaseAdmin as any)
        .from('partner_video_submissions')
        .select('*')
        .eq('referral_code', referralCode.toUpperCase().trim())
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        submissions = data;
      }
    }

    if (submissions.length === 0) {
      submissions = memoryVideoSubmissions.filter(s => s.referralCode === referralCode.toUpperCase().trim());
    }

    return NextResponse.json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error('[Video Submissions GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch video submissions.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoTopicId, videoTitle, platform, videoUrl, notes, referralCode } = body;

    if (!videoUrl || !videoTitle) {
      return NextResponse.json({ error: 'Video URL and title are required.' }, { status: 400 });
    }

    const cleanRef = (referralCode || 'CNTSJN').toUpperCase().trim();

    const submissionRecord = {
      id: `SUB-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      referral_code: cleanRef,
      referralCode: cleanRef,
      video_topic_id: videoTopicId || 'v1',
      video_title: videoTitle,
      videoTitle,
      platform: platform || 'Instagram Reel',
      video_url: videoUrl,
      videoUrl,
      notes: notes || '',
      status: 'PENDING_REVIEW',
      created_at: new Date().toISOString(),
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    if (hasSupabaseAdminConfig) {
      try {
        await (supabaseAdmin as any)
          .from('partner_video_submissions')
          .insert({
            referral_code: cleanRef,
            video_topic_id: videoTopicId || 'v1',
            video_title: videoTitle,
            platform: platform || 'Instagram Reel',
            video_url: videoUrl,
            notes: notes || '',
            status: 'PENDING_REVIEW',
          });
      } catch (dbErr) {
        console.warn('Supabase video submission insert notice:', dbErr);
      }
    }

    memoryVideoSubmissions.unshift(submissionRecord);

    return NextResponse.json({
      success: true,
      message: 'Video submitted successfully for admin review!',
      submission: submissionRecord
    });
  } catch (error) {
    console.error('[Video Submission POST Error]:', error);
    return NextResponse.json({ error: 'Failed to record video submission.' }, { status: 500 });
  }
}
