/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ApprovalRequestService
 * Handles maker-checker staged approval for sensitive admin actions.
 * Enforces: requester_id !== reviewer_id (also enforced by DB constraint).
 */
import { v4 as uuidv4 } from "uuid";

export interface CreateApprovalParams {
  requesterId:        string;
  actionType:         string;
  targetResourceType: string;
  targetResourceId:   string;
  payload:            Record<string, any>;
  reason:             string;
  requiredPermission: string;
  ttlMinutes?:        number;
}

export async function createApprovalRequest(
  supabaseAdmin: any,
  params: CreateApprovalParams
): Promise<{ id: string; idempotencyKey: string }> {
  const idempotencyKey = uuidv4();
  const expiresAt = new Date(
    Date.now() + (params.ttlMinutes ?? 1440) * 60 * 1000
  ).toISOString();

  const { data, error } = await supabaseAdmin
    .from("approval_requests")
    .insert({
      requester_id:          params.requesterId,
      action_type:           params.actionType,
      target_resource_type:  params.targetResourceType,
      target_resource_id:    params.targetResourceId,
      payload:               params.payload,
      reason:                params.reason,
      required_permission:   params.requiredPermission,
      idempotency_key:       idempotencyKey,
      expires_at:            expiresAt,
      status:                "PENDING",
    })
    .select("id, idempotency_key")
    .single();

  if (error) throw new Error(`Failed to create approval request: ${error.message}`);
  return { id: data.id, idempotencyKey: data.idempotency_key };
}

export async function approveRequest(
  supabaseAdmin: any,
  approvalId: string,
  reviewerId: string
): Promise<void> {
  const { data: existing, error: fetchErr } = await supabaseAdmin
    .from("approval_requests")
    .select("*")
    .eq("id", approvalId)
    .single();

  if (fetchErr || !existing) throw new Error("Approval request not found");
  if (existing.requester_id === reviewerId)
    throw new Error("Maker-checker violation: requester cannot approve their own request");
  if (existing.status !== "PENDING")
    throw new Error(`Cannot approve request in status: ${existing.status}`);
  if (new Date(existing.expires_at) < new Date())
    throw new Error("Approval request has expired");

  const { error } = await supabaseAdmin
    .from("approval_requests")
    .update({ status: "APPROVED", reviewed_by: reviewerId, reviewed_at: new Date().toISOString() })
    .eq("id", approvalId);

  if (error) throw new Error(`Failed to approve request: ${error.message}`);
}

export async function rejectRequest(
  supabaseAdmin: any,
  approvalId: string,
  reviewerId: string,
  rejectionReason: string
): Promise<void> {
  const { data: existing, error: fetchErr } = await supabaseAdmin
    .from("approval_requests")
    .select("*")
    .eq("id", approvalId)
    .single();

  if (fetchErr || !existing) throw new Error("Approval request not found");
  if (existing.requester_id === reviewerId)
    throw new Error("Maker-checker violation: requester cannot reject their own request");
  if (existing.status !== "PENDING")
    throw new Error(`Cannot reject request in status: ${existing.status}`);

  const { error } = await supabaseAdmin
    .from("approval_requests")
    .update({
      status: "REJECTED",
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
      rejection_reason: rejectionReason
    })
    .eq("id", approvalId);

  if (error) throw new Error(`Failed to reject request: ${error.message}`);
}

/**
 * executeApprovedRequest
 * Atomically claims approval request for execution (APPROVED -> EXECUTING)
 * then executes callback mutation and registers output status.
 *
 * Returns { claimed: false } when the approval row was not in APPROVED state
 * (concurrent conflict — safe to retry from caller, no business effect occurred).
 * Returns { claimed: true, receipt } on successful execution.
 * Returns { claimed: true, error } when execution itself failed (status set to EXECUTION_FAILED).
 */
export async function executeApprovedRequest(
  supabaseAdmin: any,
  approvalId: string,
  workerId: string,
  executeCallback?: (payload: any) => Promise<string>
): Promise<{ claimed: boolean; receipt?: string; error?: string }> {
  let claimedRequest: any = null;
  try {
    const { data, error } = await supabaseAdmin.rpc("claim_approval_for_execution", {
      p_approval_id: approvalId,
      p_worker_id: workerId
    });
    if (!error && data) {
      claimedRequest = Array.isArray(data) ? data[0] : data;
    }
  } catch {
    // RPC unavailable — fallback to REST atomic update
  }

  if (!claimedRequest) {
    const { data, error } = await supabaseAdmin
      .from("approval_requests")
      .update({
        status: "EXECUTING",
        execution_started_at: new Date().toISOString(),
        execution_worker_id: workerId
      })
      .eq("id", approvalId)
      .eq("status", "APPROVED")
      .select()
      .maybeSingle();

    if (error) return { claimed: false, error: `Failed to claim approval for execution: ${error.message}` };
    claimedRequest = data;
  }

  // If claim returned empty — approval was already claimed by another concurrent caller
  if (!claimedRequest) {
    return { claimed: false };
  }

  if (!executeCallback) {
    // No callback provided: claim only, return success without executing side effects
    return { claimed: true };
  }

  try {
    const receipt = await executeCallback(claimedRequest.payload);
    if (!receipt) {
      throw new Error("Execution callback failed to return a valid receipt");
    }

    const { error: successErr } = await supabaseAdmin
      .from("approval_requests")
      .update({
        status: "EXECUTED",
        executed_at: new Date().toISOString(),
        execution_receipt: receipt
      })
      .eq("id", approvalId);

    if (successErr) throw new Error(`Failed to save success state: ${successErr.message}`);
    return { claimed: true, receipt };
  } catch (err: any) {
    // Execution failed — mark as EXECUTION_FAILED, NOT EXECUTED
    await supabaseAdmin
      .from("approval_requests")
      .update({
        status: "EXECUTION_FAILED",
        execution_error: err.message || "Unknown execution error"
      })
      .eq("id", approvalId);

    return { claimed: true, error: err.message || "Execution failed" };
  }
}
