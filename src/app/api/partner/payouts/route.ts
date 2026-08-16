import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/sessionHelper';
import { PartnerReferralEngine } from '@/domains/partner-referral/PartnerReferralEngine';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pfoxwfnfecxypbsftrrk.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const JWT_SECRET = SERVICE_KEY || 'partner-session-secret-key';

async function dbFetch(method: string, path: string, body?: any): Promise<{ data: any; ok: boolean; status: number }> {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : 'return=representation'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch { data = text; }
  return { data, ok: res.ok, status: res.status };
}

// Helper to calculate partner balance from verified candidate registrations
async function getPartnerHonorariumBalance(partnerId: string, referralCode: string) {
  const cleanRef = (referralCode || 'CNTSJN').toUpperCase().trim();

  // 1. Fetch partner record for rate/tier
  const { data: partners } = await dbFetch('GET', `partners?id=eq.${encodeURIComponent(partnerId)}&limit=1`);
  const partnerDbRecord = Array.isArray(partners) ? partners[0] : null;

  // 2. Fetch verified candidate registrations
  const { data: regs } = await dbFetch('GET', `registrations?referral_code=eq.${encodeURIComponent(cleanRef)}&order=created_at.desc`);
  const verifiedCount = Array.isArray(regs) ? regs.length : 0;

  // 3. Compute effective commission rate
  const totalReach = Number(partnerDbRecord?.total_reach || 12500);
  const adminOverrideRate = partnerDbRecord?.honorarium_rate ? Number(partnerDbRecord.honorarium_rate) : null;
  const ruleResult = PartnerReferralEngine.calculateEffectiveCommission({
    totalReach,
    verifiedRegistrations: verifiedCount,
    adminOverrideRate,
  });
  const honorariumRate = ruleResult.effectiveRate;
  const totalEarned = verifiedCount * honorariumRate;

  // 4. Fetch all active payout requests (exclude REJECTED or CANCELLED)
  const { data: requests } = await dbFetch(
    'GET',
    `partner_payout_requests?partner_id=eq.${encodeURIComponent(partnerId)}&order=requested_at.desc`
  );
  const allRequests = Array.isArray(requests) ? requests : [];
  const activeRequests = allRequests.filter((r: any) => r.status !== 'REJECTED' && r.status !== 'CANCELLED');
  const totalWithdrawnOrPending = activeRequests.reduce((sum: number, r: any) => sum + (Number(r.amount) || 0), 0);

  const availableBalance = Math.max(0, totalEarned - totalWithdrawnOrPending);
  const minThreshold = 500;
  const canWithdraw = availableBalance >= minThreshold;
  const shortfall = Math.max(0, minThreshold - availableBalance);

  return {
    partnerDbRecord,
    verifiedCount,
    honorariumRate,
    totalEarned,
    totalWithdrawn: totalWithdrawnOrPending,
    availableBalance,
    minThreshold,
    canWithdraw,
    shortfall,
    allRequests,
    cleanRef,
  };
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cnts_partner_session');

    let partnerId: string | null = null;
    let referralCode: string = 'CNTSJN';

    if (sessionCookie && sessionCookie.value) {
      const payload = await verifySession(sessionCookie.value, JWT_SECRET);
      if (payload) {
        partnerId = payload.partnerDbId;
        if (payload.referralCode) referralCode = payload.referralCode;
      }
    }

    if (!partnerId) {
      return NextResponse.json({
        success: true,
        requests: [],
        availableBalance: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
        canWithdraw: false,
        minThreshold: 500,
        shortfall: 500,
      });
    }

    const balanceData = await getPartnerHonorariumBalance(partnerId, referralCode);

    const payoutRequests = balanceData.allRequests.map((r: any) => ({
      id: r.id,
      reqId: `REQ-${String(r.id).substring(0, 4).toUpperCase()}`,
      amount: `₹${Number(r.amount).toLocaleString('en-IN')}`,
      rawAmount: Number(r.amount),
      date: new Date(r.requested_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      batchDate: r.batch_date ? new Date(r.batch_date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }) : 'Monday Batch',
      status: r.status === 'PENDING' ? 'Pending Weekly Batch' : r.status,
      method: 'Registered Payout Account',
    }));

    return NextResponse.json({
      success: true,
      requests: payoutRequests,
      availableBalance: balanceData.availableBalance,
      availableBalanceFormatted: `₹${balanceData.availableBalance.toLocaleString('en-IN')}`,
      totalEarned: balanceData.totalEarned,
      totalEarnedFormatted: `₹${balanceData.totalEarned.toLocaleString('en-IN')}`,
      totalWithdrawn: balanceData.totalWithdrawn,
      totalWithdrawnFormatted: `₹${balanceData.totalWithdrawn.toLocaleString('en-IN')}`,
      canWithdraw: balanceData.canWithdraw,
      minThreshold: balanceData.minThreshold,
      shortfall: balanceData.shortfall,
      verifiedRegistrations: balanceData.verifiedCount,
      honorariumRate: balanceData.honorariumRate,
      referralCode: balanceData.cleanRef,
    });
  } catch (error) {
    console.error('[Payouts GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch payout requests.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('cnts_partner_session');

    let partnerId: string | null = null;
    let referralCode: string | null = null;

    if (sessionCookie && sessionCookie.value) {
      const payload = await verifySession(sessionCookie.value, JWT_SECRET);
      if (payload) {
        partnerId = payload.partnerDbId;
        referralCode = payload.referralCode;
      }
    }

    if (!partnerId) {
      return NextResponse.json({ error: 'Unauthorized partner session.' }, { status: 401 });
    }

    // Check if partner account is approved (block PENDING or SUSPENDED partners)
    const { data: partnerCheck } = await dbFetch('GET', `partners?id=eq.${encodeURIComponent(partnerId)}&select=status&limit=1`);
    if (Array.isArray(partnerCheck) && partnerCheck[0]?.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Your partner account is under review or restricted. Operations disabled.' }, { status: 403 });
    }

    const { amount } = await request.json();
    const numericAmount = Number(amount);

    if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: 'Valid withdrawal amount is required.' }, { status: 400 });
    }

    // Strict minimum withdrawal threshold check (₹500)
    if (numericAmount < 500) {
      return NextResponse.json({
        error: 'Minimum withdrawal amount is ₹500. Please enter ₹500 or more.',
        code: 'BELOW_MINIMUM_THRESHOLD',
        minThreshold: 500,
      }, { status: 400 });
    }

    // Calculate actual live honorarium balance earned from referrals
    const balanceData = await getPartnerHonorariumBalance(partnerId, referralCode || 'CNTSJN');

    if (balanceData.availableBalance < 500) {
      return NextResponse.json({
        error: `Insufficient available balance to withdraw. Minimum threshold is ₹500, but your current available balance is ₹${balanceData.availableBalance.toLocaleString('en-IN')}. Mobilize candidates with your referral code ${balanceData.cleanRef} to earn honorarium.`,
        code: 'INSUFFICIENT_BALANCE',
        availableBalance: balanceData.availableBalance,
        shortfall: balanceData.shortfall,
        minThreshold: 500,
        referralCode: balanceData.cleanRef,
        verifiedRegistrations: balanceData.verifiedCount,
      }, { status: 400 });
    }

    if (numericAmount > balanceData.availableBalance) {
      return NextResponse.json({
        error: `Requested withdrawal amount of ₹${numericAmount.toLocaleString('en-IN')} exceeds your available balance of ₹${balanceData.availableBalance.toLocaleString('en-IN')}.`,
        code: 'EXCEEDS_BALANCE',
        availableBalance: balanceData.availableBalance,
        maxWithdrawable: balanceData.availableBalance,
      }, { status: 400 });
    }

    const nextMonday = new Date();
    nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7 || 7));
    const batchDateStr = nextMonday.toISOString().split('T')[0];

    const { data: inserted, ok: insertOk } = await dbFetch('POST', 'partner_payout_requests', {
      partner_id: partnerId,
      referral_code: balanceData.cleanRef,
      amount: numericAmount,
      status: 'PENDING',
      batch_date: batchDateStr,
    });

    const insertedObj = Array.isArray(inserted) ? inserted[0] : inserted;
    const newReqId = (insertOk && insertedObj?.id) ? `REQ-${String(insertedObj.id).substring(0, 4).toUpperCase()}` : `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted successfully.',
      request: {
        id: newReqId,
        amount: `₹${numericAmount.toLocaleString('en-IN')}`,
        rawAmount: numericAmount,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        batchDate: nextMonday.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Pending Weekly Batch',
        method: 'Registered Payout Account',
      },
      newAvailableBalance: Math.max(0, balanceData.availableBalance - numericAmount),
    });
  } catch (error) {
    console.error('[Payout POST Error]:', error);
    return NextResponse.json({ error: 'Failed to submit withdrawal request.' }, { status: 500 });
  }
}

