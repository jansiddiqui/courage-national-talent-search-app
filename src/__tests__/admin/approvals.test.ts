/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock uuid to avoid ESM resolution issues in ts-jest environment
jest.mock("uuid", () => ({ v4: () => "test-uuid-mock" }));
import { createApprovalRequest, approveRequest } from "../../domains/admin/ApprovalRequestService";

describe("ApprovalRequestService Maker-Checker Flow", () => {
  it("should create an approval request staging record", async () => {
    const singleFn = jest.fn().mockResolvedValue({
      data: { id: "req-1", idempotency_key: "idem-1" },
      error: null
    });

    const mockSupabaseAdmin: any = {
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: singleFn,
          }),
        }),
      }),
    };

    const res = await createApprovalRequest(mockSupabaseAdmin, {
      requesterId: "admin-1",
      actionType: "EXAM_PUBLISH",
      targetResourceType: "ASSESSMENT",
      targetResourceId: "asm-1",
      payload: { publish: true },
      reason: "Launch mock test 1",
      requiredPermission: "assessment.publish"
    });

    expect(res.id).toBe("req-1");
    expect(res.idempotencyKey).toBe("idem-1");
  });

  it("should reject approval if the requester attempts to approve their own request", async () => {
    // approveRequest does: from("approval_requests").select("*").eq("id", ...).single()
    const mockSupabaseAdmin: any = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                requester_id: "admin-1",
                status: "PENDING",
                expires_at: new Date(Date.now() + 100000).toISOString()
              },
              error: null
            }),
          }),
        }),
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      }),
    };

    await expect(approveRequest(mockSupabaseAdmin, "req-1", "admin-1")).rejects.toThrow(
      "Maker-checker violation: requester cannot approve their own request"
    );
  });

  it("should reject approval when request is already APPROVED (not PENDING)", async () => {
    const mockSupabaseAdmin: any = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                requester_id: "admin-2",
                status: "APPROVED",
                expires_at: new Date(Date.now() + 100000).toISOString()
              },
              error: null
            }),
          }),
        }),
      }),
    };

    await expect(approveRequest(mockSupabaseAdmin, "req-1", "admin-1")).rejects.toThrow(
      "Cannot approve request in status: APPROVED"
    );
  });

  it("should reject expired approval requests", async () => {
    const mockSupabaseAdmin: any = {
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                requester_id: "admin-2",
                status: "PENDING",
                expires_at: new Date(Date.now() - 100000).toISOString() // already expired
              },
              error: null
            }),
          }),
        }),
      }),
    };

    await expect(approveRequest(mockSupabaseAdmin, "req-1", "admin-1")).rejects.toThrow(
      "Approval request has expired"
    );
  });
});
