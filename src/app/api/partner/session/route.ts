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

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ isAuthenticated: false });
    }

    const payload = await verifySession(sessionCookie.value, JWT_SECRET);
    if (!payload || payload.role !== 'PARTNER') {
      return NextResponse.json({ isAuthenticated: false });
    }

    let partnerData = null;

    if (payload.email) {
      const partners = await dbFetch(`partners?email=eq.${encodeURIComponent(payload.email)}&limit=1`);
      const dbPartner = Array.isArray(partners) ? partners[0] : null;

      if (dbPartner) {
        partnerData = {
          id: dbPartner.id,
          fullName: dbPartner.full_name,
          email: dbPartner.email,
          phone: dbPartner.phone,
          referralCode: dbPartner.referral_code,
          customSlug: dbPartner.custom_slug,
          partnerId: dbPartner.partner_id,
          primaryRole: dbPartner.primary_role || 'Content Creator & Educator',
          audienceScale: dbPartner.audience_scale || '10k - 50k',
          bio: dbPartner.bio,
          city: dbPartner.city,
          state: dbPartner.state,
          profileImageUrl: dbPartner.profile_image_url,
          status: dbPartner.status || 'PENDING',
          tier: dbPartner.tier || 'BRONZE',
          honorariumRate: dbPartner.honorarium_rate || 25,
          platformDetails: dbPartner.platform_details || [],
        };
      }
    }

    if (!partnerData) {
      // Session token exists but partner not found in database — revoke session
      cookieStore.delete('cnts_partner_session');
      return NextResponse.json({ isAuthenticated: false, message: 'Partner account not found.' });
    }

    return NextResponse.json({
      isAuthenticated: true,
      partner: partnerData,
    });
  } catch (error) {
    console.error('[Partner Session GET Error]:', error);
    return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('cnts_partner_session');
  return NextResponse.json({ success: true, message: 'Logged out successfully.' });
}
