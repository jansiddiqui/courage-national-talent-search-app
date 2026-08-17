import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signSession } from '@/lib/sessionHelper';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import bcrypt from 'bcryptjs';

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
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`login:${clientIp}`, { windowMs: 15 * 60 * 1000, maxRequests: 10 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.` },
        { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
      );
    }

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

    // Password verification with safe migration for legacy plaintext records
    const storedHash: string = partner.password_hash;
    const isBcryptHash = storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$');

    let passwordMatches: boolean;
    if (isBcryptHash) {
      // Normal path: compare against stored bcrypt hash
      passwordMatches = await bcrypt.compare(password, storedHash);
    } else {
      // Migration path: record still has a legacy plaintext value
      passwordMatches = storedHash === password;
      if (passwordMatches) {
        // Upgrade to hash on next successful login (fire-and-forget, non-blocking)
        const newHash = await bcrypt.hash(password, 12);
        fetch(`${SUPABASE_URL}/rest/v1/partners?id=eq.${encodeURIComponent(partner.id)}`, {
          method: 'PATCH',
          headers: {
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password_hash: newHash }),
        }).catch((upgradeErr) => {
          console.error('[Password Hash Upgrade Error]:', upgradeErr);
        });
      }
    }

    if (!passwordMatches) {
      return NextResponse.json({ error: 'Invalid credentials. Please check your email/phone and password.' }, { status: 401 });
    }

    // Block PENDING and SUSPENDED partners from obtaining an active session
    const partnerStatus: string = partner.status || 'PENDING';
    if (partnerStatus === 'PENDING') {
      return NextResponse.json({
        error: 'Your application is still under review. You will be notified by email once approved.',
        accountStatus: 'PENDING',
      }, { status: 403 });
    }
    if (partnerStatus === 'SUSPENDED') {
      return NextResponse.json({
        error: 'Your partner account has been suspended. Please check your email for details or contact support.',
        accountStatus: 'SUSPENDED',
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
        partnerId: partnerData.partnerId,
        email: partnerData.email,
        phone: partnerData.phone,
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
