import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/sessionHelper';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-partner-secret-key-cnts-2026';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let referralCode = searchParams.get('referralCode');

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cnts_partner_session');

    let partnerDbRecord: any = null;

    if (sessionCookie && sessionCookie.value) {
      const payload = await verifySession(sessionCookie.value, JWT_SECRET);
      if (payload && payload.referralCode) {
        if (!referralCode) {
          referralCode = payload.referralCode;
        }
      }
    }

    if (!referralCode) {
      referralCode = 'CNTSJN';
    }

    const cleanRef = referralCode.toUpperCase().trim();

    // Default rate
    let honorariumRate = 25;

    if (hasSupabaseAdminConfig) {
      // Get partner settings from DB
      const { data: pRecord } = await (supabaseAdmin as any)
        .from('partners')
        .select('*')
        .eq('referral_code', cleanRef)
        .maybeSingle();

      if (pRecord) {
        partnerDbRecord = pRecord;
        if (pRecord.honorarium_rate) {
          honorariumRate = Number(pRecord.honorarium_rate);
        }
      }
    }

    // Query real candidate registrations from registrations table exclusively
    let verifiedRegistrationsCount = 0;
    let conversionsRoster: any[] = [];

    if (hasSupabaseAdminConfig) {
      const { data: regs, error } = await (supabaseAdmin as any)
        .from('registrations')
        .select('id, registration_id, cnts_id, district, state, payment_status, registration_fee, created_at')
        .eq('referral_code', cleanRef)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(regs)) {
        verifiedRegistrationsCount = regs.length;

        conversionsRoster = regs.map((r: any) => ({
          refId: r.registration_id || r.cnts_id || `CNTS-2026-${r.id.substring(0, 4)}`,
          region: r.district ? `${r.district}, ${r.state || 'India'}` : 'Region Unspecified',
          fee: `₹${r.registration_fee || 99} Paid`,
          amount: `+₹${honorariumRate.toFixed(2)}`,
          date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: r.payment_status === 'PAID' ? 'Verified & Credited' : 'Pending Payment Verification',
        }));
      }
    }

    const totalHonorariumEarned = verifiedRegistrationsCount * honorariumRate;

    return NextResponse.json({
      success: true,
      referralCode: cleanRef,
      partnerName: partnerDbRecord?.full_name || 'Partner Account',
      status: partnerDbRecord ? (partnerDbRecord.status || 'APPROVED') : 'UNREGISTERED',
      honorariumRate,
      totalRegistrations: verifiedRegistrationsCount,
      totalHonorariumEarned: `₹${totalHonorariumEarned.toLocaleString('en-IN')}`,
      rawHonorariumEarned: totalHonorariumEarned,
      referralClicks: 0,
      conversionRate: verifiedRegistrationsCount > 0 ? '100.0%' : '0.0%',
      conversionsRoster,
    });
  } catch (error) {
    console.error('[Partner Stats Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch partner statistics.' }, { status: 500 });
  }
}
