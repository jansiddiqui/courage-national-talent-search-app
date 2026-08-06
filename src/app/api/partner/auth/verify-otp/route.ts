import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';
import { signSession } from '@/lib/sessionHelper';

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-partner-secret-key-cnts-2026';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    let isValidOtp = false;

    if (hasSupabaseAdminConfig) {
      const { data: record, error } = await (supabaseAdmin as any)
        .from('partner_otps')
        .select('*')
        .eq('email', cleanEmail)
        .eq('otp_code', cleanOtp)
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (record) {
        isValidOtp = true;
        // Mark OTP as used
        await (supabaseAdmin as any)
          .from('partner_otps')
          .update({ is_used: true })
          .eq('id', record.id);
      }
    } else {
      // In sandbox/testing mode, accept 6-digit numeric OTPs or '123456'
      if (cleanOtp.length === 6 && /^\d+$/.test(cleanOtp)) {
        isValidOtp = true;
      }
    }

    if (!isValidOtp) {
      return NextResponse.json({ error: 'Invalid or expired OTP code.' }, { status: 401 });
    }

    // Look up partner in database
    let partnerData = null;

    if (hasSupabaseAdminConfig) {
      const { data: partner } = await (supabaseAdmin as any)
        .from('partners')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (partner) {
        partnerData = {
          id: partner.id,
          fullName: partner.full_name,
          email: partner.email,
          phone: partner.phone,
          referralCode: partner.referral_code,
          customSlug: partner.custom_slug,
          partnerId: partner.partner_id,
          primaryRole: partner.primary_role || 'Content Creator & Educator',
          audienceScale: partner.audience_scale || '10k - 50k',
          status: partner.status || 'PENDING',
          tier: partner.tier || 'BRONZE',
          honorariumRate: partner.honorarium_rate || 25,
        };
      }
    }

    // If partner not registered in DB yet, return prompt to apply
    if (!partnerData) {
      return NextResponse.json({
        success: true,
        isRegistered: false,
        message: 'OTP verified. Please complete your partner registration.',
        email: cleanEmail,
      });
    }

    // Generate session JWT token
    const token = await signSession(
      {
        partnerDbId: partnerData.id,
        email: partnerData.email,
        fullName: partnerData.fullName,
        referralCode: partnerData.referralCode,
        status: partnerData.status,
        role: 'PARTNER',
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      },
      JWT_SECRET
    );

    // Set cookie
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
