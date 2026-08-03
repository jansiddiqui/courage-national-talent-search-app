export interface CreatorTierInfo {
  tierLevel: number;
  tierName: string;
  sharePercent: number;
  perRegistrationAmount: number;
  milestoneBonus: number;
  perks: string[];
}

export class PartnerReferralEngine {
  // Mock pre-existing taken codes for live uniqueness testing
  private static TAKEN_CODES = new Set(['CNTS01', 'CNTS99', 'CNTS10', 'CNTS00']);

  /**
   * Calculates dynamic creator tier & revenue share rate based on reach scale
   * Based on CNTS ₹99 Registration Fee: Max revenue share is 25% (₹25 max per student registration)
   */
  public static calculateCreatorTier(scale: string): CreatorTierInfo {
    switch (scale) {
      case '250k+':
        return {
          tierLevel: 5,
          tierName: 'Tier 5: Courage Legend Creator',
          sharePercent: 25,
          perRegistrationAmount: 25,
          milestoneBonus: 5000,
          perks: ['25% Revenue Share (Max)', '₹25 per ₹99 CNTS Registration', '₹5,000 Milestone Bonus', 'Dedicated Partner Manager', 'Custom Co-branded Page']
        };
      case '50k - 250k':
        return {
          tierLevel: 4,
          tierName: 'Tier 4: Platinum Creator',
          sharePercent: 20,
          perRegistrationAmount: 20,
          milestoneBonus: 2500,
          perks: ['20% Revenue Share', '₹20 per ₹99 CNTS Registration', '₹2,500 Milestone Bonus', 'Priority Partner Support']
        };
      case '10k - 50k':
        return {
          tierLevel: 3,
          tierName: 'Tier 3: Gold Creator',
          sharePercent: 18,
          perRegistrationAmount: 18,
          milestoneBonus: 1200,
          perks: ['18% Revenue Share', '₹18 per ₹99 CNTS Registration', '₹1,200 Milestone Bonus', 'Physical Certificate of Honor']
        };
      case '1k - 10k':
        return {
          tierLevel: 2,
          tierName: 'Tier 2: Silver Mobilizer',
          sharePercent: 15,
          perRegistrationAmount: 15,
          milestoneBonus: 500,
          perks: ['15% Revenue Share', '₹15 per ₹99 CNTS Registration', '₹500 Milestone Bonus', 'Verified Partner Badge']
        };
      default:
        return {
          tierLevel: 1,
          tierName: 'Tier 1: Rising Partner',
          sharePercent: 10,
          perRegistrationAmount: 10,
          milestoneBonus: 200,
          perks: ['10% Revenue Share', '₹10 per ₹99 CNTS Registration', 'Digital Certificate']
        };
    }
  }

  /**
   * Generates clean 6-character max referral code containing mandatory 'CNTS' (e.g. CNTSJN, CNTSRA, CNTS07)
   */
  public static generateReferralCode(name: string): string {
    const cleanName = name ? name.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '') : 'P';
    const suffix = (cleanName.slice(0, 2) || '07').padEnd(2, '7');
    const code = `CNTS${suffix}`.slice(0, 6);
    return this.TAKEN_CODES.has(code) ? `CNTS${(cleanName.slice(0, 1) || 'X')}7` : code;
  }

  /**
   * Generates a list of 4 smart 6-character referral code suggestions
   */
  public static generateCodeSuggestions(name: string): string[] {
    const cleanName = name ? name.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '') : 'PARTNER';
    const c1 = cleanName.slice(0, 2) || 'JN';
    const c2 = cleanName.slice(0, 1) || 'J';
    
    const candidates = [
      `CNTS${c1}`.slice(0, 6),
      `CNTS${c2}7`.slice(0, 6),
      `CNTS${c2}8`.slice(0, 6),
      `CNTS${c2}9`.slice(0, 6),
      `CNTS${c1}1`.slice(0, 6)
    ];

    // Filter out taken codes and duplicate items
    const uniqueCandidates = Array.from(new Set(candidates)).filter(c => !this.TAKEN_CODES.has(c) && c.length >= 4 && c.length <= 6);
    return uniqueCandidates.slice(0, 4);
  }

  /**
   * Checks uniqueness of a referral code
   */
  public static checkCodeAvailability(code: string): { available: boolean; message: string } {
    const upperCode = code.toUpperCase().trim();
    if (upperCode.length < 4 || upperCode.length > 6) {
      return { available: false, message: 'Code must be between 4 and 6 characters.' };
    }
    if (!upperCode.includes('CNTS')) {
      return { available: false, message: 'Code MUST contain "CNTS".' };
    }
    if (this.TAKEN_CODES.has(upperCode)) {
      return { available: false, message: `"${upperCode}" is already taken by another partner.` };
    }
    return { available: true, message: `"${upperCode}" is available!` };
  }
}
