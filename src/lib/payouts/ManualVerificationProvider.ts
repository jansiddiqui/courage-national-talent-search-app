import { VerificationProvider, VerifyVpaParams, VerifyBankParams, VerificationResult } from './VerificationProvider';

// Directory of Recognized Indian Banking Handles for Syntax Detection
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

export class ManualVerificationProvider implements VerificationProvider {
  name = 'MANUAL_VERIFICATION_PROVIDER';

  async verifyVpa(params: VerifyVpaParams): Promise<VerificationResult> {
    const { upiId, partnerName = 'Registered Partner' } = params;
    const cleanUpi = upiId.trim().toLowerCase();

    const upiRegex = /^[a-zA-Z0-9.\-_]{3,100}@[a-zA-Z0-9]{2,30}$/;
    if (!upiRegex.test(cleanUpi)) {
      throw new Error('Invalid UPI address syntax. Enter a full VPA with bank handle (e.g. 8318744873@axl, name@okicici).');
    }

    const handleParts = cleanUpi.split('@');
    const handleSuffix = handleParts[1];
    const detectedBank = RECOGNIZED_UPI_HANDLES[handleSuffix] || `${handleSuffix.toUpperCase()} PSP Bank`;

    return {
      verified: false,
      upiId: cleanUpi,
      receiverName: partnerName,
      bankName: detectedBank,
      status: 'PENDING',
      source: 'MANUAL_SYNTAX_CHECK',
      verificationBadge: 'PENDING_VERIFICATION',
      message: 'Verification will be completed after RazorpayX activation. Destination saved securely.',
      verifiedAt: new Date().toISOString()
    };
  }

  async verifyBankAccount(params: VerifyBankParams): Promise<VerificationResult> {
    const { accountNumber, ifsc, accountHolderName, partnerName = 'Registered Partner' } = params;
    const cleanAccount = accountNumber.trim();
    const cleanIfsc = ifsc.trim().toUpperCase();

    if (!/^\d{9,18}$/.test(cleanAccount)) {
      throw new Error('Invalid account number. Must be between 9 and 18 digits.');
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
      throw new Error('Invalid IFSC code syntax. Must be 11 characters (e.g. SBIN0001234).');
    }

    const bankPrefix = cleanIfsc.substring(0, 4);
    const bankNames: Record<string, string> = {
      SBIN: 'State Bank of India',
      HDFC: 'HDFC Bank',
      ICIC: 'ICICI Bank',
      UTIB: 'Axis Bank',
      KKBK: 'Kotak Mahindra Bank',
      PUNB: 'Punjab National Bank',
      BARB: 'Bank of Baroda',
      CNRB: 'Canara Bank'
    };

    const detectedBank = bankNames[bankPrefix] || `${bankPrefix} Commercial Bank`;

    return {
      verified: false,
      accountNumber: cleanAccount,
      ifsc: cleanIfsc,
      receiverName: accountHolderName || partnerName,
      bankName: detectedBank,
      status: 'PENDING',
      source: 'MANUAL_IFSC_CHECK',
      verificationBadge: 'PENDING_VERIFICATION',
      message: 'Verification will be completed after RazorpayX activation. Bank details saved securely.',
      verifiedAt: new Date().toISOString()
    };
  }
}
