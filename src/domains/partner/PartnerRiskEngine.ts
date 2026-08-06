export interface RiskEvaluationResult {
  riskScore: number;
  isFlagged: boolean;
  riskSignals: string[];
}

export class PartnerRiskEngine {
  private static DISPOSABLE_EMAIL_DOMAINS = new Set([
    'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'trashmail.com'
  ]);

  /**
   * Evaluates a candidate registration event and returns a numerical risk score (0-100)
   */
  public static evaluateRegistrationRisk(input: {
    studentEmail: string;
    studentPhone?: string;
    partnerEmail?: string;
    partnerPhone?: string;
    ipAddress?: string;
    deviceHash?: string;
    partnerDeviceHash?: string;
    upiId?: string;
    partnerUpiId?: string;
  }): RiskEvaluationResult {
    let riskScore = 0;
    const riskSignals: string[] = [];

    // 1. Self-referral check (Same email or phone as partner)
    if (input.studentEmail && input.partnerEmail && input.studentEmail.toLowerCase() === input.partnerEmail.toLowerCase()) {
      riskScore += 100;
      riskSignals.push('CRITICAL: Student email matches partner email (Self-Referral)');
    }

    if (input.studentPhone && input.partnerPhone && input.studentPhone === input.partnerPhone) {
      riskScore += 100;
      riskSignals.push('CRITICAL: Student phone matches partner phone (Self-Referral)');
    }

    // 2. UPI match check
    if (input.upiId && input.partnerUpiId && input.upiId.toLowerCase() === input.partnerUpiId.toLowerCase()) {
      riskScore += 50;
      riskSignals.push('HIGH: Candidate UPI ID matches partner payout UPI');
    }

    // 3. Device Fingerprint Match
    if (input.deviceHash && input.partnerDeviceHash && input.deviceHash === input.partnerDeviceHash) {
      riskScore += 30;
      riskSignals.push('MEDIUM: Candidate device fingerprint matches partner device');
    }

    // 4. Disposable Email Check
    const emailDomain = input.studentEmail ? input.studentEmail.split('@')[1]?.toLowerCase() : '';
    if (emailDomain && this.DISPOSABLE_EMAIL_DOMAINS.has(emailDomain)) {
      riskScore += 15;
      riskSignals.push('LOW: Candidate uses known disposable email domain');
    }

    return {
      riskScore,
      isFlagged: riskScore >= 40,
      riskSignals
    };
  }
}
