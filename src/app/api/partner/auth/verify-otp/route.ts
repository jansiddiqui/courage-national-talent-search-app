import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signSession } from '@/lib/sessionHelper';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pfoxwfnfecxypbsftrrk.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const JWT_SECRET = SERVICE_KEY || 'partner-session-secret-key';

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
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    // Look up OTP in database
    const { data: otpRecords } = await dbFetch(
      'GET',
      `partner_otps?email=eq.${encodeURIComponent(cleanEmail)}&otp_code=eq.${cleanOtp}&is_used=eq.false&expires_at=gt.${new Date().toISOString()}&order=created_at.desc&limit=1`
    );

    const otpRecord = Array.isArray(otpRecords) ? otpRecords[0] : null;

    if (!otpRecord) {
      return NextResponse.json({ error: 'Invalid or expired OTP code. Please request a new one.' }, { status: 401 });
    }

    // Mark OTP as used
    await dbFetch('PATCH', `partner_otps?id=eq.${otpRecord.id}`, { is_used: true });

    // Look up partner in database
    const { data: partners } = await dbFetch('GET', `partners?email=eq.${encodeURIComponent(cleanEmail)}&limit=1`);
    const partner = Array.isArray(partners) ? partners[0] : null;

    if (!partner) {
      // OTP valid but partner not registered — prompt them to apply
      return NextResponse.json({
        success: true,
        isRegistered: false,
        message: 'OTP verified. Please complete your partner registration.',
        email: cleanEmail,
      });
    }

    // Block PENDING and SUSPENDED partners before issuing any session
    const partnerStatus: string = partner.status || 'PENDING';
    if (partnerStatus === 'PENDING') {
      return NextResponse.json({
        success: false,
        isRegistered: true,
        accountStatus: 'PENDING',
        error: 'Your application is still under review. You will be notified by email once your account is approved.',
      }, { status: 403 });
    }
    if (partnerStatus === 'SUSPENDED') {
      return NextResponse.json({
        success: false,
        isRegistered: true,
        accountStatus: 'SUSPENDED',
        error: 'Your partner account has been suspended. Please check your email for details or contact support.',
      }, { status: 403 });
    }

    // Build partner data
    const partnerData = {
      id: partner.id,
      fullName: partner.full_name,
      email: partner.email,
      phone: partner.phone,
      referralCode: partner.referral_code,
      customSlug: partner.custom_slug,
      partnerId: partner.partner_id,
      primaryRole: partner.primary_role || 'Content Creator & Educator',
      audienceScale: partner.audience_scale || '10k - 50k',
      bio: partner.bio,
      city: partner.city,
      state: partner.state,
      profileImageUrl: partner.profile_image_url,
      status: partner.status || 'PENDING',
      tier: partner.tier || 'BRONZE',
      honorariumRate: partner.honorarium_rate || 25,
      platformDetails: partner.platform_details || [],
    };

    // Generate session JWT
    const token = await signSession(
      {
        partnerDbId: partnerData.id,
        email: partnerData.email,
        fullName: partnerData.fullName,
        referralCode: partnerData.referralCode,
        customSlug: partnerData.customSlug,
        status: partnerData.status,
        role: 'PARTNER',
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      },
      JWT_SECRET
    );

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('cnts_partner_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      isRegistered: true,
      partner: partnerData,
    });


  } catch (error) {
    console.error('[Verify OTP Error]:', error);
    return NextResponse.json({ error: 'Failed to verify OTP. Please try again.' }, { status: 500 });
  }
}
