import { NextResponse } from 'next/server';
import { EmailService } from '@/services/emailService';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pfoxwfnfecxypbsftrrk.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

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
    const { email, referralCode, phone } = await request.json();

    // Resolve the email to use
    let cleanEmail = '';

    if (email && email.includes('@')) {
      cleanEmail = email.trim().toLowerCase();
    } else if (referralCode) {
      // Look up partner by referral code to find their email
      const { data: partners } = await dbFetch('GET', `partners?referral_code=eq.${encodeURIComponent(referralCode.trim().toUpperCase())}&limit=1`);
      const partner = Array.isArray(partners) ? partners[0] : null;
      if (!partner) {
        return NextResponse.json({ error: 'No partner found with that referral code.' }, { status: 404 });
      }
      cleanEmail = partner.email;
    } else if (phone) {
      // Look up partner by phone number
      const cleanPhone = phone.trim().replace(/\s/g, '');
      const { data: partners } = await dbFetch('GET', `partners?phone=eq.${encodeURIComponent(cleanPhone)}&limit=1`);
      const partner = Array.isArray(partners) ? partners[0] : null;
      if (!partner) {
        return NextResponse.json({ error: 'No partner found with that phone number.' }, { status: 404 });
      }
      cleanEmail = partner.email;
    } else {
      return NextResponse.json({ error: 'Please provide your registered email, phone number, or referral code.' }, { status: 400 });
    }

    // Generate secure 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Invalidate existing unused OTPs for this email
    await dbFetch('PATCH', `partner_otps?email=eq.${encodeURIComponent(cleanEmail)}&is_used=eq.false`, { is_used: true });

    // Save new OTP to database
    const { ok: insertOk, data: insertErr } = await dbFetch('POST', 'partner_otps', {
      email: cleanEmail,
      otp_code: otpCode,
      expires_at: expiresAt,
      is_used: false,
    });

    if (!insertOk) {
      console.error('[Send OTP] DB insert failed:', JSON.stringify(insertErr));
    }

    // Send OTP via email
    try {
      const emailService = new EmailService();
      await emailService.sendEmail(
        cleanEmail,
        '🔐 Your Courage Partner Login OTP',
        `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8faff; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="background: #1e293b; display: inline-block; padding: 10px 20px; border-radius: 12px; color: #fbbf24; font-weight: 900; font-size: 18px; letter-spacing: 1px;">COURAGE PARTNER</div>
            </div>
            <h2 style="color: #0f172a; font-size: 22px; margin-bottom: 8px;">Your Login OTP</h2>
            <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">Use the code below to log in to your Courage Partner workspace. This OTP expires in <strong>10 minutes</strong>.</p>
            <div style="background: #fff; border: 2px solid #6366f1; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <div style="font-size: 42px; font-weight: 900; letter-spacing: 10px; color: #4f46e5; font-family: monospace;">${otpCode}</div>
            </div>
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">If you didn't request this OTP, please ignore this email. Do not share this code with anyone.</p>
          </div>
        `
      );
      console.log(`[PARTNER OTP] Sent to ${cleanEmail}`);
    } catch (emailErr) {
      console.error('[Send OTP] Email dispatch failed:', emailErr);
      // OTP is still in DB — partner can contact support
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${cleanEmail}. Check your inbox (and spam folder).`,
      email: cleanEmail,
      // Only expose OTP in development for easy testing
      devOtp: process.env.NODE_ENV !== 'production' ? otpCode : undefined,
    });

  } catch (error) {
    console.error('[Send OTP Error]:', error);
    return NextResponse.json({ error: 'Failed to send OTP. Please try again.' }, { status: 500 });
  }
}
