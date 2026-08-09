import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/sessionHelper';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pfoxwfnfecxypbsftrrk.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function dbFetch(method: string, path: string, body?: any): Promise<{ data: any; error: any; ok: boolean; status: number }> {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : 'return=representation'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch { data = text; }
  return { data, error: res.ok ? null : data, ok: res.ok, status: res.status };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const referralCode = searchParams.get('referralCode') || 'CNTSJN';

    const cleanRef = referralCode.toUpperCase().trim();

    const { data: dbSubmissions } = await dbFetch(
      'GET',
      `partner_video_submissions?referral_code=eq.${encodeURIComponent(cleanRef)}&order=created_at.desc`
    );

    const submissions = Array.isArray(dbSubmissions) ? dbSubmissions : [];

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

    // Try to derive referral code from trusted session JWT first
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cnts_partner_session');
    let sessionRefCode: string | null = null;
    if (sessionCookie && sessionCookie.value) {
      const payload = await verifySession(sessionCookie.value, SERVICE_KEY || 'partner-session-secret-key');
      if (payload && payload.referralCode) {
        sessionRefCode = payload.referralCode;
      }
    }

    const cleanRef = (sessionRefCode || referralCode || 'CNTSJN').toUpperCase().trim();

    const submissionPayload = {
      referral_code: cleanRef,
      video_topic_id: videoTopicId || 'v1',
      video_title: videoTitle,
      platform: platform || (videoUrl.includes('youtube') || videoUrl.includes('youtu.be') ? 'YouTube Short' : 'Instagram Reel'),
      video_url: videoUrl,
      notes: notes || '',
      status: 'PENDING_REVIEW',
    };

    const { data: inserted, error: insertErr } = await dbFetch('POST', 'partner_video_submissions', submissionPayload);

    if (insertErr) {
      console.error('[Video Submission POST Error]:', JSON.stringify(insertErr));
    }

    const record = Array.isArray(inserted) ? inserted[0] : (inserted || submissionPayload);

    return NextResponse.json({
      success: true,
      message: 'Video submitted successfully for admin review!',
      submission: record
    });
  } catch (error) {
    console.error('[Video Submission POST Error]:', error);
    return NextResponse.json({ error: 'Failed to record video submission.' }, { status: 500 });
  }
}
