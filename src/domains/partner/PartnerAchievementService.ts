import { PartnerAchievementInfo } from '@/types/partnerTypes';

export class PartnerAchievementService {
  /**
   * Evaluates unlocked achievements based on partner metrics
   */
  public static evaluateAchievements(input: {
    verifiedRegistrations: number;
    trustScore: number;
    profileType: string;
  }): PartnerAchievementInfo[] {
    const achievements: PartnerAchievementInfo[] = [];
    const now = new Date().toISOString();

    if (input.verifiedRegistrations >= 1) {
      achievements.push({
        badgeCode: 'FIRST_SPARK',
        badgeTitle: 'First Spark',
        badgeCategory: 'MILESTONE',
        unlockedAt: now,
        iconName: 'Zap'
      });
    }

    if (input.verifiedRegistrations >= 10) {
      achievements.push({
        badgeCode: 'BRONZE_MOBILIZER',
        badgeTitle: 'Bronze Mobilizer',
        badgeCategory: 'MILESTONE',
        unlockedAt: now,
        iconName: 'Award'
      });
    }

    if (input.verifiedRegistrations >= 25) {
      achievements.push({
        badgeCode: 'SILVER_MOBILIZER',
        badgeTitle: 'Silver Mobilizer',
        badgeCategory: 'MILESTONE',
        unlockedAt: now,
        iconName: 'Shield'
      });
    }

    if (input.verifiedRegistrations >= 100) {
      achievements.push({
        badgeCode: 'CENTURION_100',
        badgeTitle: 'Centurion 100',
        badgeCategory: 'EXCELLENCE',
        unlockedAt: now,
        iconName: 'Crown'
      });
    }

    if (input.verifiedRegistrations >= 250) {
      achievements.push({
        badgeCode: 'FOUNDING_HERO',
        badgeTitle: 'Founding Hero',
        badgeCategory: 'EXCELLENCE',
        unlockedAt: now,
        iconName: 'Sparkles'
      });
    }

    if (input.trustScore >= 95 && input.verifiedRegistrations >= 20) {
      achievements.push({
        badgeCode: 'TRUSTED_PARTNER',
        badgeTitle: 'Trusted Partner',
        badgeCategory: 'REPUTATION',
        unlockedAt: now,
        iconName: 'ShieldCheck'
      });
    }

    return achievements;
  }
}
