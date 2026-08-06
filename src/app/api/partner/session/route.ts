import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/sessionHelper';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-partner-secret-key-cnts-2026';

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

    let partnerData: {
      id: string;
      fullName: string;
      email: string;
      phone?: string | null;
      referralCode: string;
      customSlug: string;
      partnerId: string;
      primaryRole: string;
      audienceScale: string;
      status: string;
      tier: string;
      honorariumRate: number;
    } = {
      id: payload.partnerDbId || 'demo-id',
      fullName: payload.fullName || 'Jan Mohammad',
      email: payload.email || 'partner@example.com',
      phone: payload.phone || null,
      referralCode: payload.referralCode || 'CNTSJN',
      customSlug: payload.referralCode ? payload.referralCode.toLowerCase() : 'cntsjn',
      partnerId: 'CP-2026-000412',
      primaryRole: 'Content Creator & Educator',
      audienceScale: '10k - 50k',
      status: payload.status || 'PENDING',
      tier: 'BRONZE',
      honorariumRate: 25,
    };

    if (hasSupabaseAdminConfig && payload.email) {
      const { data: dbPartner } = await (supabaseAdmin as any)
        .from('partners')
        .select('*')
        .eq('email', payload.email)
        .maybeSingle();

      if (!dbPartner) {
        // Partner record was deleted from Supabase DB — clear cookie and revoke session
        cookieStore.delete('cnts_partner_session');
        return NextResponse.json({ isAuthenticated: false, message: 'Partner record no longer exists.' });
      }

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
        status: dbPartner.status || 'PENDING',
        tier: dbPartner.tier || 'BRONZE',
        honorariumRate: dbPartner.honorarium_rate || 25,
      };
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
