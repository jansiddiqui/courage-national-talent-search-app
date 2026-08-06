// ============================================================================
// COURAGE UNIVERSAL PARTNER PLATFORM — DOMAIN TYPES & CONTRACTS
// ============================================================================

export type PartnerProfileType = 
  | 'CREATOR' 
  | 'TEACHER' 
  | 'SCHOOL' 
  | 'NGO' 
  | 'INSTITUTE' 
  | 'CAMPUS_AMBASSADOR' 
  | 'COMMUNITY';

export type PartnerStatus = 
  | 'APPLIED' 
  | 'PENDING_REVIEW' 
  | 'APPROVED' 
  | 'ACTIVE' 
  | 'PAUSED' 
  | 'SUSPENDED' 
  | 'REJECTED' 
  | 'ARCHIVED';

export type DomainEventType = 
  | 'PARTNER_APPLIED'
  | 'PARTNER_APPROVED'
  | 'STUDENT_REGISTERED'
  | 'REGISTRATION_VERIFIED'
  | 'REGISTRATION_REFUNDED'
  | 'EXAM_ATTEMPTED'
  | 'EXAM_COMPLETED'
  | 'CERTIFICATE_ISSUED'
  | 'CAMPAIGN_STARTED'
  | 'CAMPAIGN_ENDED'
  | 'BONUS_UNLOCKED'
  | 'ACHIEVEMENT_EARNED'
  | 'PAYOUT_REQUESTED'
  | 'PAYOUT_COMPLETED';

export type LedgerReferenceType = 
  | 'COMMISSION'
  | 'BONUS'
  | 'CAMPAIGN'
  | 'MANUAL'
  | 'ADJUSTMENT'
  | 'PENALTY'
  | 'REFUND';

export type LedgerEntryStatus = 'PENDING_MATURITY' | 'MATURED' | 'PAID' | 'CANCELLED';

export interface DomainEventPayload {
  eventId: string;
  idempotencyKey: string;
  eventType: DomainEventType;
  partnerId: string;
  timestamp: string;
  metadata: Record<string, any>;
}

export type RuleActionType = 
  | 'CREDIT_LEDGER'
  | 'UPDATE_SCORES'
  | 'ISSUE_BADGE'
  | 'EMIT_NOTIFICATION'
  | 'TRIGGER_WORKFLOW'
  | 'FLAG_RISK';

export interface RuleActionInstruction {
  actionType: RuleActionType;
  partnerId: string;
  payload: Record<string, any>;
}

export interface PartnerMultiScores {
  trustScore: number;       // 0–100 (Identity, Fraud flags, clean registrations)
  performanceScore: number; // 0–100 (Candidate Volume, Velocity)
  growthScore: number;      // 0–100 (MoM Registration Growth, Exam Completion Rate)
  complianceScore: number;  // 0–100 (Code of Conduct, Zero Policy Violations)
}

export interface PartnerAchievementInfo {
  badgeCode: string;
  badgeTitle: string;
  badgeCategory: 'MILESTONE' | 'REPUTATION' | 'EXCELLENCE' | 'SPECIAL';
  unlockedAt: string;
  iconName: string;
}

export interface PartnerGrowthTierConfig {
  tierCode: string;
  tierName: string;
  minStudents: number;
  maxStudents: number;
  ratePerRegistration: number;
}

export interface CreatorStartingLevelConfig {
  levelCode: string;
  levelName: string;
  minReach: number;
  maxReach: number;
  startingRate: number;
}

export interface CommissionRuleResult {
  effectiveRate: number;
  startingRate: number;
  tierRate: number;
  campaignBonus: number;
  appliedRuleSource: string;
}
