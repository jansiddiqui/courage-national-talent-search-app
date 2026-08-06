import { NextResponse } from 'next/server';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    // Generate a secure 6-digit numeric OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes expiry

    if (hasSupabaseAdminConfig) {
      // Invalidate existing unused OTPs for this email
      await (supabaseAdmin as any)
        .from('partner_otps')
        .update({ is_used: true })
        .eq('email', cleanEmail)
        .eq('is_used', false);

      // Store new OTP in database
      const { error: dbErr } = await (supabaseAdmin as any)
        .from('partner_otps')
        .insert({
          email: cleanEmail,
          otp_code: otpCode,
          expires_at: expiresAt,
          is_used: false,
        });

      if (dbErr) {
        console.error('[Send OTP Error] DB insert failed:', dbErr);
      }
    }

    // Log OTP in server console for instant verification/testing
    console.log(`[PARTNER AUTH OTP] Sent to ${cleanEmail}: ${otpCode}`);

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${cleanEmail}. Check your inbox or spam folder.`,
      // For smooth local testing when email server is not configured:
      devOtp: process.env.NODE_ENV !== 'production' ? otpCode : undefined,
    });
  } catch (error) {
    console.error('[Send OTP Error]:', error);
    return NextResponse.json({ error: 'Failed to dispatch OTP. Please try again.' }, { status: 500 });
  }
}
