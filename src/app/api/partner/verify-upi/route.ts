import { NextResponse } from 'next/server';

// Comprehensive Indian UPI PSP Handles Directory for Bank Name Mapping
const RECOGNIZED_UPI_HANDLES: Record<string, string> = {
  'upi': 'BHIM / Unified Payments Interface (NPCI)',
  'okicici': 'ICICI Bank (Google Pay)',
  'oksbi': 'State Bank of India (Google Pay)',
  'okhdfcbank': 'HDFC Bank (Google Pay)',
  'okaxis': 'Axis Bank (Google Pay)',
  'paytm': 'Paytm Payments Bank',
  'ybl': 'YES Bank (PhonePe)',
  'ibl': 'IndusInd Bank (PhonePe)',
  'axl': 'Axis Bank (PhonePe)',
  'ptaxis': 'Axis Bank (PhonePe Mobile VPA)',
  'postbank': 'India Post Payments Bank',
  'barodampay': 'Bank of Baroda',
  'dlb': 'Dhanlaxmi Bank',
  'indus': 'IndusInd Bank',
  'kvb': 'Karur Vysya Bank',
  'ptsbi': 'State Bank of India',
  'sbi': 'State Bank of India',
  'icici': 'ICICI Bank',
  'hdfcbank': 'HDFC Bank',
  'kotak': 'Kotak Mahindra Bank',
  'axisbank': 'Axis Bank',
  'apl': 'Amazon Pay (Axis Bank)',
  'cnrb': 'Canara Bank',
  'idfcbank': 'IDFC FIRST Bank',
  'federal': 'Federal Bank',
  'rbl': 'RBL Bank',
  'aubank': 'AU Small Finance Bank',
  'unionbank': 'Union Bank of India',
  'slice': 'Slice Card / North East Small Finance Bank',
  'jupiteraxis': 'Jupiter (Axis Bank)',
  'navi': 'Navi (Axis Bank)',
  'mobikwik': 'MobiKwik (HDFC Bank)',
};

export async function POST(request: Request) {
  try {
    const { upiId } = await request.json();

    if (!upiId || typeof upiId !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'UPI ID is required.'
      }, { status: 400 });
    }

    const cleanUpi = upiId.trim().toLowerCase();

    // 1. STRICT VPA REGEX SYNTAX CHECK
    const upiRegex = /^[a-zA-Z0-9.\-_]{3,100}@[a-zA-Z0-9]{2,30}$/;
    if (!upiRegex.test(cleanUpi)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid UPI address syntax. Enter a full VPA with bank handle (e.g. 8318744873@axl, user@okicici, mobile@ybl).'
      }, { status: 400 });
    }

    const handleParts = cleanUpi.split('@');
    const handleSuffix = handleParts[1];

    if (!handleSuffix || handleSuffix.length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Incomplete UPI handle after "@". Please enter a valid bank handle.'
      }, { status: 400 });
    }

    const detectedBank = RECOGNIZED_UPI_HANDLES[handleSuffix] || `${handleSuffix.toUpperCase()} PSP Bank`;

    // 2. CHECK ENVIRONMENT & RAZORPAYX CREDENTIALS
    const razorpayxKeyId = process.env.RAZORPAYX_KEY_ID;
    const razorpayxKeySecret = process.env.RAZORPAYX_KEY_SECRET;

    const isProductionMode = process.env.NODE_ENV === 'production' || (
      razorpayxKeyId && razorpayxKeySecret && 
      !razorpayxKeyId.includes('your_key') && 
      !razorpayxKeySecret.includes('your_key') && 
      !razorpayxKeyId.includes('mock')
    );

    // 3. PRODUCTION MODE: LIVE RAZORPAYX NPCI BENFICIARY LOOKUP
    if (isProductionMode && razorpayxKeyId && razorpayxKeySecret) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${razorpayxKeyId}:${razorpayxKeySecret}`).toString('base64');
        const rzpRes = await fetch('https://api.razorpay.com/v1/payments/validate/vpa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify({ vpa: cleanUpi })
        });

        const rzpData = await rzpRes.json();

        if (!rzpRes.ok || !rzpData.vpa || rzpData.success === false || !rzpData.customer_name) {
          return NextResponse.json({
            success: false,
            error: 'UPI ID could not be verified on bank servers. Please verify the address.'
          }, { status: 400 });
        }

        return NextResponse.json({
          success: true,
          verified: true,
          upiId: cleanUpi,
          receiverName: rzpData.customer_name,
          bankName: detectedBank,
          source: 'RAZORPAYX_LIVE_NPCI',
          verificationBadge: 'RAZORPAYX_LIVE_VERIFIED',
          verifiedAt: new Date().toISOString()
        });
      } catch (apiErr) {
        console.error('[RazorpayX Live Verification Error]:', apiErr);
        return NextResponse.json({
          success: false,
          error: 'RazorpayX live verification service unavailable. Please try again shortly.'
        }, { status: 502 });
      }
    }

    // 4. DEVELOPMENT MODE: DEDICATED EXPLICIT MOCK VERIFICATION SERVICE
    // Never infers or guesses names locally from partner session or VPA string.
    return NextResponse.json({
      success: true,
      verified: true,
      upiId: cleanUpi,
      receiverName: 'Mock Account Holder (Dev Mode)',
      bankName: `${detectedBank} [Mock]`,
      source: 'MOCK_DEV_SERVICE',
      verificationBadge: 'MOCK_DEVELOPMENT_MODE',
      verifiedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Verify UPI POST Error]:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process UPI verification request.'
    }, { status: 500 });
  }
}
