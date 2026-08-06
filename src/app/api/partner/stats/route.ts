import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/sessionHelper';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';
import { PartnerReferralEngine } from '@/domains/partner-referral/PartnerReferralEngine';
import { PartnerScoreService } from '@/domains/partner/PartnerScoreService';
import { PartnerAchievementService } from '@/domains/partner/PartnerAchievementService';

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

    if (hasSupabaseAdminConfig) {
      // Get partner settings from DB
      const { data: pRecord } = await (supabaseAdmin as any)
        .from('partners')
        .select('*')
        .eq('referral_code', cleanRef)
        .maybeSingle();

      if (pRecord) {
        partnerDbRecord = pRecord;
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
          date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: r.payment_status === 'PAID' ? 'Verified & Credited' : 'Pending Payment Verification',
        }));
      }
    }

    // 1. Calculate Live Priority Rule Commission
    const totalReach = Number(partnerDbRecord?.total_reach || 12500);
    const adminOverrideRate = partnerDbRecord?.honorarium_rate ? Number(partnerDbRecord.honorarium_rate) : null;

    const ruleResult = PartnerReferralEngine.calculateEffectiveCommission({
      totalReach,
      verifiedRegistrations: verifiedRegistrationsCount,
      adminOverrideRate
    });

    const honorariumRate = ruleResult.effectiveRate;
    const totalHonorariumEarned = verifiedRegistrationsCount * honorariumRate;

    // 2. Calculate Live Multi-Subscores (Trust, Performance, Growth, Compliance)
    const multiScores = PartnerScoreService.calculateScores({
      verifiedRegistrations: verifiedRegistrationsCount,
      flaggedRegistrations: partnerDbRecord?.status === 'SUSPENDED' ? 1 : 0
    });

    // 3. Evaluate Unlocked Achievements & Badges
    const achievements = PartnerAchievementService.evaluateAchievements({
      verifiedRegistrations: verifiedRegistrationsCount,
      trustScore: multiScores.trustScore,
      profileType: partnerDbRecord?.profile_type || 'CREATOR'
    });

    // 4. Fetch Timeline Events Feed from partner_events
    let timelineFeed: any[] = [];
    if (hasSupabaseAdminConfig && partnerDbRecord?.id) {
      const { data: eventsData } = await (supabaseAdmin as any)
        .from('partner_events')
        .select('*')
        .eq('partner_id', partnerDbRecord.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (eventsData) {
        timelineFeed = eventsData;
      }
    }

    return NextResponse.json({
      success: true,
      referralCode: cleanRef,
      partnerName: partnerDbRecord?.full_name || 'Partner Account',
      profileType: partnerDbRecord?.profile_type || 'CREATOR',
      status: (partnerDbRecord || cleanRef === 'CNTSJN' || cleanRef === 'JANMOHAMMAD') ? (partnerDbRecord?.status || 'APPROVED') : 'UNREGISTERED',
      honorariumRate,
      ruleResult,
      multiScores,
      achievements,
      timelineFeed,
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
