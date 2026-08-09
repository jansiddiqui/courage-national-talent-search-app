import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/sessionHelper';
import { PartnerReferralEngine } from '@/domains/partner-referral/PartnerReferralEngine';
import { PartnerScoreService } from '@/domains/partner/PartnerScoreService';
import { PartnerAchievementService } from '@/domains/partner/PartnerAchievementService';

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let referralCode = searchParams.get('referralCode');

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cnts_partner_session');

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

    // Fetch partner DB record via direct REST API
    const partners = await dbFetch(`partners?referral_code=eq.${encodeURIComponent(cleanRef)}&limit=1`);
    const partnerDbRecord = Array.isArray(partners) ? partners[0] : null;

    // Fetch candidate registrations directly from PostgreSQL
    const regs = await dbFetch(`registrations?referral_code=eq.${encodeURIComponent(cleanRef)}&order=created_at.desc`);
    const verifiedRegistrationsCount = Array.isArray(regs) ? regs.length : 0;

    const conversionsRoster = Array.isArray(regs) ? regs.map((r: any) => ({
      refId: r.registration_id || r.cnts_id || `CNTS-2026-${String(r.id).substring(0, 4)}`,
      region: r.district ? `${r.district}, ${r.state || 'India'}` : 'Region Unspecified',
      fee: `₹${r.registration_fee || 99} Paid`,
      date: new Date(r.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: r.payment_status === 'PAID' ? 'Verified & Credited' : 'Pending Payment Verification',
    })) : [];

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
      profileType: 'CREATOR'
    });

    // 4. Fetch Timeline Events Feed from partner_events if available
    let timelineFeed: any[] = [];
    if (partnerDbRecord?.id) {
      timelineFeed = await dbFetch(`partner_events?partner_id=eq.${encodeURIComponent(partnerDbRecord.id)}&order=created_at.desc&limit=20`);
    }

    return NextResponse.json({
      success: true,
      referralCode: cleanRef,
      partnerName: partnerDbRecord?.full_name || (cleanRef === 'JANMOHAMMAD' || cleanRef === 'CNTSJN' ? 'Jan Mohammad' : 'Partner Account'),
      primaryRole: partnerDbRecord?.primary_role || 'Content Creator & Educator',
      city: partnerDbRecord?.city || null,
      state: partnerDbRecord?.state || null,
      bio: partnerDbRecord?.bio || null,
      profileImageUrl: partnerDbRecord?.profile_image_url || null,
      partnerId: partnerDbRecord?.partner_id || `CP-2026-000412`,
      createdDate: partnerDbRecord?.created_at ? new Date(partnerDbRecord.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'August 2026',
      status: (partnerDbRecord || cleanRef === 'CNTSJN' || cleanRef === 'JANMOHAMMAD') ? (partnerDbRecord?.status || 'APPROVED') : 'UNREGISTERED',
      honorariumRate,
      ruleResult,
      multiScores,
      achievements,
      timelineFeed: Array.isArray(timelineFeed) ? timelineFeed : [],
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
