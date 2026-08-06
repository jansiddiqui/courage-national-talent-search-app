import { DomainEventPayload, RuleActionInstruction } from '@/types/partnerTypes';
import { PartnerEventService } from '@/domains/partner/PartnerEventService';
import { PartnerRiskEngine } from '@/domains/partner/PartnerRiskEngine';
import { PartnerScoreService } from '@/domains/partner/PartnerScoreService';
import { PartnerAchievementService } from '@/domains/partner/PartnerAchievementService';
import { supabaseAdmin, hasSupabaseAdminConfig } from '@/lib/supabaseAdmin';

export class EventDispatcher {
  /**
   * Main entrypoint: Accepts a Domain Event, checks idempotency, evaluates actions, and dispatches to services independently.
   */
  public static async dispatch(event: DomainEventPayload): Promise<{ success: boolean; actionsExecuted: number }> {
    // 1. Enforce Idempotency Check
    const alreadyProcessed = await PartnerEventService.isEventProcessed(event.idempotencyKey);
    if (alreadyProcessed) {
      console.log(`[EventDispatcher] Idempotency Hit — Event ${event.idempotencyKey} already processed. Skipping.`);
      return { success: true, actionsExecuted: 0 };
    }

    // 2. Record event in immutable timeline and processed_events table
    await PartnerEventService.recordEvent(event);

    // 3. Evaluate Rule Actions based on Event Type
    const actions = this.evaluateRulesForEvent(event);

    // 4. Dispatch Actions to Independent Services
    let actionsExecuted = 0;
    for (const action of actions) {
      try {
        await this.executeAction(action, event);
        actionsExecuted++;
      } catch (err) {
        console.error(`[EventDispatcher] Action execution error (${action.actionType}):`, err);
      }
    }

    return { success: true, actionsExecuted };
  }

  /**
   * Rule Evaluator: Maps Event to Action Instructions
   */
  private static evaluateRulesForEvent(event: DomainEventPayload): RuleActionInstruction[] {
    const actions: RuleActionInstruction[] = [];

    switch (event.eventType) {
      case 'PARTNER_APPLIED': {
        actions.push({
          actionType: 'EMIT_NOTIFICATION',
          partnerId: event.partnerId,
          payload: { template: 'PARTNER_APPLICATION_CONFIRMATION' }
        });
        break;
      }
      case 'STUDENT_REGISTERED': {
        actions.push({
          actionType: 'FLAG_RISK',
          partnerId: event.partnerId,
          payload: event.metadata
        });
        actions.push({
          actionType: 'CREDIT_LEDGER',
          partnerId: event.partnerId,
          payload: { ...event.metadata, referenceType: 'COMMISSION', status: 'PENDING_MATURITY' }
        });
        actions.push({
          actionType: 'UPDATE_SCORES',
          partnerId: event.partnerId,
          payload: event.metadata
        });
        actions.push({
          actionType: 'ISSUE_BADGE',
          partnerId: event.partnerId,
          payload: event.metadata
        });
        break;
      }
      case 'PAYOUT_REQUESTED': {
        actions.push({
          actionType: 'TRIGGER_WORKFLOW',
          partnerId: event.partnerId,
          payload: { workflowType: 'PAYOUT_APPROVAL_WORKFLOW' }
        });
        break;
      }
      default:
        break;
    }

    return actions;
  }

  /**
   * Action Executor: Dispatches instructions to individual domain services
   */
  private static async executeAction(action: RuleActionInstruction, event: DomainEventPayload): Promise<void> {
    switch (action.actionType) {
      case 'FLAG_RISK': {
        const risk = PartnerRiskEngine.evaluateRegistrationRisk(action.payload as any);
        if (risk.isFlagged && hasSupabaseAdminConfig) {
          await (supabaseAdmin as any)
            .from('partners')
            .update({ status: 'SUSPENDED' })
            .eq('id', action.partnerId);
        }
        break;
      }
      case 'CREDIT_LEDGER': {
        if (hasSupabaseAdminConfig) {
          const maturityDate = new Date();
          maturityDate.setDate(maturityDate.getDate() + 7); // 7-day maturity hold

          await (supabaseAdmin as any)
            .from('partner_ledger_entries')
            .insert({
              partner_id: action.partnerId,
              student_registration_id: action.payload.registrationId || null,
              reference_type: action.payload.referenceType || 'COMMISSION',
              amount: action.payload.amount || 25,
              applied_tier_rate: action.payload.appliedTierRate || 25,
              applied_starting_rate: action.payload.appliedStartingRate || 18,
              applied_campaign_bonus: action.payload.campaignBonus || 0,
              status: 'PENDING_MATURITY',
              mature_at: maturityDate.toISOString(),
              created_at: new Date().toISOString()
            });
        }
        break;
      }
      case 'UPDATE_SCORES': {
        const scores = PartnerScoreService.calculateScores({
          verifiedRegistrations: action.payload.verifiedRegistrations || 1,
          flaggedRegistrations: action.payload.flaggedRegistrations || 0
        });

        if (hasSupabaseAdminConfig) {
          await (supabaseAdmin as any)
            .from('partners')
            .update({
              trust_score: scores.trustScore,
              performance_score: scores.performanceScore,
              growth_score: scores.growthScore,
              compliance_score: scores.complianceScore
            })
            .eq('id', action.partnerId);
        }
        break;
      }
      case 'ISSUE_BADGE': {
        const badges = PartnerAchievementService.evaluateAchievements({
          verifiedRegistrations: action.payload.verifiedRegistrations || 1,
          trustScore: 100,
          profileType: action.payload.profileType || 'CREATOR'
        });

        if (badges.length > 0 && hasSupabaseAdminConfig) {
          for (const b of badges) {
            await (supabaseAdmin as any)
              .from('partner_achievements')
              .insert({
                partner_id: action.partnerId,
                badge_code: b.badgeCode,
                badge_title: b.badgeTitle,
                unlocked_at: b.unlockedAt
              });
          }
        }
        break;
      }
      default:
        break;
    }
  }
}
