/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ExamLifecycleService
 * Implements the V3.3 approved exam lifecycle state machine with
 * concurrency-safe atomic transitions using database-level locks.
 *
 * Allowed transitions:
 *   DRAFT               → REGISTRATION_OPEN
 *   REGISTRATION_OPEN   → REGISTRATION_CLOSED | LIVE
 *   REGISTRATION_CLOSED → LIVE
 *   LIVE                → RESULTS_PROCESSING
 *   RESULTS_PROCESSING  → RESULTS_PUBLISHED
 *   RESULTS_PUBLISHED   → ARCHIVED
 *
 * is_published is true for: LIVE, RESULTS_PROCESSING, RESULTS_PUBLISHED, ARCHIVED
 * (maintained by DB trigger sync_exam_is_published_func)
 */

export type ExamStatus =
  | "DRAFT"
  | "REGISTRATION_OPEN"
  | "REGISTRATION_CLOSED"
  | "LIVE"
  | "RESULTS_PROCESSING"
  | "RESULTS_PUBLISHED"
  | "ARCHIVED";

interface TransitionRule {
  from: ExamStatus;
  to: ExamStatus;
  requiredPermission: string;
}

const TRANSITION_RULES: TransitionRule[] = [
  { from: "DRAFT",               to: "REGISTRATION_OPEN",   requiredPermission: "assessment.publish" },
  { from: "REGISTRATION_OPEN",   to: "REGISTRATION_CLOSED", requiredPermission: "assessment.publish" },
  { from: "REGISTRATION_OPEN",   to: "LIVE",                requiredPermission: "assessment.publish" },
  { from: "REGISTRATION_CLOSED", to: "LIVE",                requiredPermission: "assessment.publish" },
  { from: "LIVE",                to: "RESULTS_PROCESSING",  requiredPermission: "assessment.publish" },
  { from: "RESULTS_PROCESSING",  to: "RESULTS_PUBLISHED",   requiredPermission: "assessment.publish" },
  { from: "RESULTS_PUBLISHED",   to: "ARCHIVED",            requiredPermission: "assessment.publish" },
];

/**
 * Returns the allowed target states for a given source state.
 */
export function getAllowedTransitions(from: ExamStatus): ExamStatus[] {
  return TRANSITION_RULES.filter(r => r.from === from).map(r => r.to);
}

/**
 * Returns the required permission for a given transition.
 * Throws if the transition is not in the allowed list.
 */
export function getTransitionPermission(from: ExamStatus, to: ExamStatus): string {
  const rule = TRANSITION_RULES.find(r => r.from === from && r.to === to);
  if (!rule) {
    throw new Error(`Transition from ${from} to ${to} is not allowed in the exam lifecycle state machine.`);
  }
  return rule.requiredPermission;
}

export interface TransitionResult {
  success: boolean;
  assessment?: any;
  error?: string;
}

/**
 * Atomically transitions an assessment from `fromStatus` to `toStatus`.
 * Uses a WHERE status = fromStatus guard so that concurrent callers can
 * only succeed once (the second update matches 0 rows).
 *
 * Returns { success: false, error: "CONFLICT" } if the row was already
 * transitioned by another caller.
 */
export async function transitionExamStatus(
  supabaseAdmin: any,
  assessmentId: string,
  fromStatus: ExamStatus,
  toStatus: ExamStatus
): Promise<TransitionResult> {
  // Validate transition is allowed
  const allowed = getAllowedTransitions(fromStatus);
  if (!allowed.includes(toStatus)) {
    return {
      success: false,
      error: `Transition from ${fromStatus} to ${toStatus} is not permitted. Allowed: ${allowed.join(", ")}`
    };
  }

  // Atomic update — only succeeds if current status is exactly `fromStatus`
  const { data: updated, error } = await (supabaseAdmin as any)
    .from("assessments")
    .update({ status: toStatus })
    .eq("id", assessmentId)
    .eq("status", fromStatus) // concurrency guard
    .select()
    .maybeSingle();

  if (error) {
    return { success: false, error: error.message };
  }

  if (!updated) {
    // Row did not match — either assessment not found or already transitioned
    return {
      success: false,
      error: `CONFLICT: assessment ${assessmentId} was not in status ${fromStatus}. Transition rejected.`
    };
  }

  return { success: true, assessment: updated };
}
