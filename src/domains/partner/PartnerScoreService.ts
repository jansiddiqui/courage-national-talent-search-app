import { PartnerMultiScores } from '@/types/partnerTypes';

export class PartnerScoreService {
  /**
   * Calculates live multi-dimensional sub-scores for a partner
   */
  public static calculateScores(input: {
    verifiedRegistrations: number;
    flaggedRegistrations: number;
    attendanceRatePercent?: number;
    policyViolationsCount?: number;
    accountAgeDays?: number;
  }): PartnerMultiScores {
    const totalRegs = Math.max(0, input.verifiedRegistrations);
    const flaggedRegs = Math.max(0, input.flaggedRegistrations);
    const violations = Math.max(0, input.policyViolationsCount || 0);

    // 1. Trust Score: Base 100, penalized by fraud flags and violations
    let trustScore = 100 - (flaggedRegs * 10) - (violations * 25);
    trustScore = Math.min(100, Math.max(0, trustScore));

    // 2. Performance Score: Based on volume thresholds
    let performanceScore = 0;
    if (totalRegs >= 250) performanceScore = 100;
    else if (totalRegs >= 100) performanceScore = 85;
    else if (totalRegs >= 50) performanceScore = 70;
    else if (totalRegs >= 25) performanceScore = 50;
    else if (totalRegs >= 10) performanceScore = 30;
    else performanceScore = Math.min(25, totalRegs * 2.5);

    // 3. Growth Score: Combines exam attendance rate and registration velocity
    const attendanceRate = input.attendanceRatePercent ?? 85;
    let growthScore = Math.min(100, Math.round((performanceScore * 0.6) + (attendanceRate * 0.4)));

    // 4. Compliance Score: 100 minus policy violations
    let complianceScore = Math.max(0, 100 - (violations * 30));

    return {
      trustScore,
      performanceScore,
      growthScore,
      complianceScore
    };
  }
}
