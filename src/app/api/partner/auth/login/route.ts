import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signSession } from '@/lib/sessionHelper';

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

export async function POST(request: Request) {
  try {
    const { identity, password } = await request.json();

    if (!identity || !password) {
      return NextResponse.json({ error: 'Email/phone and password are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const cleanIdentity = identity.trim().toLowerCase();

    // Look up partner by email OR phone
    let partners: any[] = [];
    if (cleanIdentity.includes('@')) {
      partners = await dbFetch(`partners?email=eq.${encodeURIComponent(cleanIdentity)}&limit=1`);
    } else {
      // Try phone lookup
      const cleanPhone = identity.trim().replace(/\s/g, '');
      partners = await dbFetch(`partners?phone=eq.${encodeURIComponent(cleanPhone)}&limit=1`);
    }

    const partner = partners[0];

    if (!partner) {
      // Use a generic message to prevent email enumeration
      return NextResponse.json({ error: 'Invalid credentials. Please check your email/phone and password.' }, { status: 401 });
    }

    // Check password — must be set during registration
    if (!partner.password_hash) {
      return NextResponse.json({
        error: 'No password set for this account. Please use OTP login instead.',
        useOtp: true
      }, { status: 401 });
    }

    // Direct string comparison (passwords stored as plaintext during registration)
    if (partner.password_hash !== password) {
      return NextResponse.json({ error: 'Invalid credentials. Please check your email/phone and password.' }, { status: 401 });
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

    // Set secure session cookie
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
      partner: partnerData,
    });

  } catch (error) {
    console.error('[Partner Password Login Error]:', error);
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 });
  }
}
