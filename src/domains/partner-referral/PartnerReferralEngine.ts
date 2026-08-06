import { 
  PartnerProfileType, 
  CommissionRuleResult, 
  CreatorStartingLevelConfig, 
  PartnerGrowthTierConfig 
} from '@/types/partnerTypes';

export class PartnerReferralEngine {
  private static TAKEN_CODES = new Set(['CNTS01', 'CNTS99', 'CNTS10', 'CNTS00']);

  /**
   * Configured Onboarding Starting Rate Levels (Floor)
   */
  public static CREATOR_STARTING_LEVELS: CreatorStartingLevelConfig[] = [
    { levelCode: 'LEGEND', levelName: 'Legend Level', minReach: 250000, maxReach: Infinity, startingRate: 22 },
    { levelCode: 'PLATINUM', levelName: 'Platinum Level', minReach: 50000, maxReach: 250000, startingRate: 20 },
    { levelCode: 'GOLD', levelName: 'Gold Level', minReach: 10000, maxReach: 50000, startingRate: 18 },
    { levelCode: 'SILVER', levelName: 'Silver Level', minReach: 1000, maxReach: 10000, startingRate: 15 },
    { levelCode: 'RISING', levelName: 'Rising Level', minReach: 0, maxReach: 1000, startingRate: 10 },
  ];

  /**
   * Configured Volume Performance Growth Tiers
   */
  public static GROWTH_TIERS: PartnerGrowthTierConfig[] = [
    { tierCode: 'FOUNDING', tierName: 'Founding Partner', minStudents: 251, maxStudents: Infinity, ratePerRegistration: 60 },
    { tierCode: 'PLATINUM', tierName: 'Platinum Partner', minStudents: 101, maxStudents: 250, ratePerRegistration: 50 },
    { tierCode: 'GOLD', tierName: 'Gold Mobilizer', minStudents: 51, maxStudents: 100, ratePerRegistration: 40 },
    { tierCode: 'SILVER', tierName: 'Silver Mobilizer', minStudents: 26, maxStudents: 50, ratePerRegistration: 30 },
    { tierCode: 'BRONZE', tierName: 'Bronze Mobilizer', minStudents: 1, maxStudents: 25, ratePerRegistration: 25 },
  ];

  /**
   * Calculates starting onboarding rate from reach
   */
  public static calculateStartingRate(reach: number): CreatorStartingLevelConfig {
    const level = this.CREATOR_STARTING_LEVELS.find(l => reach >= l.minReach) || this.CREATOR_STARTING_LEVELS[this.CREATOR_STARTING_LEVELS.length - 1];
    return level;
  }

  /**
   * Calculates dynamic performance tier from verified student registrations
   */
  public static calculateGrowthTier(studentsCount: number): PartnerGrowthTierConfig {
    const tier = this.GROWTH_TIERS.find(t => studentsCount >= t.minStudents) || this.GROWTH_TIERS[this.GROWTH_TIERS.length - 1];
    return tier;
  }

  /**
   * PRIORITY RULE ENGINE: Calculates live effective commission rate
   * Stack: Admin Override > MAX(Starting Onboarding Floor, Growth Tier Rate) + Campaign Bonus
   */
  public static calculateEffectiveCommission(params: {
    totalReach: number;
    verifiedRegistrations: number;
    adminOverrideRate?: number | null;
    campaignBonusAmount?: number;
  }): CommissionRuleResult {
    const { totalReach, verifiedRegistrations, adminOverrideRate, campaignBonusAmount = 0 } = params;

    const startingLevel = this.calculateStartingRate(totalReach);
    const growthTier = this.calculateGrowthTier(verifiedRegistrations);

    // Admin Override takes absolute top priority
    if (typeof adminOverrideRate === 'number' && adminOverrideRate > 0) {
      return {
        effectiveRate: adminOverrideRate,
        startingRate: startingLevel.startingRate,
        tierRate: growthTier.ratePerRegistration,
        campaignBonus: campaignBonusAmount,
        appliedRuleSource: 'ADMIN_OVERRIDE'
      };
    }

    // Dynamic Rule: MAX(Starting Floor, Growth Tier Rate) + Campaign Bonus
    const baseRate = Math.max(startingLevel.startingRate, growthTier.ratePerRegistration);
    const effectiveRate = baseRate + campaignBonusAmount;

    return {
      effectiveRate,
      startingRate: startingLevel.startingRate,
      tierRate: growthTier.ratePerRegistration,
      campaignBonus: campaignBonusAmount,
      appliedRuleSource: growthTier.ratePerRegistration >= startingLevel.startingRate ? 'GROWTH_TIER' : 'ONBOARDING_FLOOR'
    };
  }

  /**
   * Generates collision-proof 7-8 character referral code (e.g. CNTSJAN786, CNTSA1B7X)
   */
  public static generateReferralCode(name: string): string {
    const cleanName = name ? name.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '') : 'P';
    const prefix = cleanName.slice(0, 3).padEnd(3, 'X');
    const randomHash = Math.floor(100 + Math.random() * 900);
    const code = `CNTS${prefix}${randomHash}`.slice(0, 8);
    return this.TAKEN_CODES.has(code) ? `CNTS${prefix}${Math.floor(10 + Math.random() * 89)}` : code;
  }

  /**
   * Generates 4 smart referral code suggestions
   */
  public static generateCodeSuggestions(name: string): string[] {
    const cleanName = name ? name.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '') : 'PARTNER';
    const p1 = cleanName.slice(0, 3) || 'JAN';
    const p2 = cleanName.slice(0, 2) || 'JN';

    const candidates = [
      `CNTS${p1}786`.slice(0, 8),
      `CNTS${p1}100`.slice(0, 8),
      `CNTS${p2}2026`.slice(0, 8),
      `CNTS${p2}999`.slice(0, 8)
    ];

    return Array.from(new Set(candidates)).filter(c => !this.TAKEN_CODES.has(c));
  }

  public static calculateCreatorTier(scale: string): {
    tierLevel: number;
    tierName: string;
    sharePercent: number;
    perRegistrationAmount: number;
    milestoneBonus: number;
    perks: string[];
  } {
    const reachMap: Record<string, number> = {
      '250k+': 300000,
      '50k - 250k': 100000,
      '10k - 50k': 25000,
      '1k - 10k': 5000,
      '< 1k': 500
    };
    const reach = reachMap[scale] || 15000;
    const level = this.calculateStartingRate(reach);

    return {
      tierLevel: level.startingRate >= 22 ? 5 : level.startingRate >= 20 ? 4 : level.startingRate >= 18 ? 3 : level.startingRate >= 15 ? 2 : 1,
      tierName: level.levelName,
      sharePercent: level.startingRate,
      perRegistrationAmount: level.startingRate,
      milestoneBonus: level.startingRate * 50,
      perks: [`${level.startingRate}% Revenue Share Floor`, `₹${level.startingRate} per Verified Registration`]
    };
  }

  public static checkCodeAvailability(code: string): boolean {
    if (!code) return false;
    const clean = code.toUpperCase().trim();
    return !this.TAKEN_CODES.has(clean);
  }
}
