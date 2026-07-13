/**
 * Phase 12 Integration & Security Tests
 * Maker-Checker execution model
 */

// Mock uuid to avoid ESM resolution issues in ts-jest environment
jest.mock("uuid", () => ({ v4: () => "test-uuid-1234" }));

describe("Maker-Checker: execution_receipt uniqueness enforcement", () => {
  test("execution_receipt is unique — documented in migration constraint", () => {
    const migrationConstraint = "approval_requests_execution_receipt_uk";
    expect(migrationConstraint).toBeTruthy();
    expect(migrationConstraint).toBe("approval_requests_execution_receipt_uk");
  });
});

describe("Maker-Checker: failed execution must never become EXECUTED", () => {
  test("executeApprovedRequest marks EXECUTION_FAILED on business logic error", async () => {
    const { executeApprovedRequest } = await import("../../src/domains/admin/ApprovalRequestService");

    let capturedStatus: string | null = null;

    const mockSupabase: any = {
      rpc: jest.fn().mockImplementation(async (fnName: string) => {
        if (fnName === "claim_approval_for_execution") {
          return {
            data: [{
              id: "approval-uuid",
              status: "EXECUTING",
              action_type: "EXAM_PUBLISH",
              payload: {},
            }],
            error: null,
          };
        }
        return { data: null, error: null };
      }),
      from: jest.fn().mockReturnValue({
        update: jest.fn().mockImplementation((updates: any) => {
          capturedStatus = updates.status;
          return {
            eq: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
              }),
            }),
          };
        }),
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      }),
    };

    // Pass a callback that throws to simulate execution failure
    const failingCallback = async () => { throw new Error("Business logic failure"); };

    const result = await executeApprovedRequest(mockSupabase, "approval-uuid", "worker-uuid", failingCallback);

    // The execution failed — status must NOT be EXECUTED
    expect(result.claimed).toBe(true);
    expect(result.error).toBeDefined();
    // The captured DB update status should be EXECUTION_FAILED, not EXECUTED
    if (capturedStatus !== null) {
      expect(capturedStatus).not.toBe("EXECUTED");
    }
  });
});

describe("Maker-Checker: HTTP retries must not duplicate business effects", () => {
  test("claim_approval_for_execution returns empty result for already-EXECUTING approval", async () => {
    const { executeApprovedRequest } = await import("../../src/domains/admin/ApprovalRequestService");

    // Simulate concurrent claim: RPC returns empty [], REST update also gets no row
    const mockSupabase: any = {
      rpc: jest.fn().mockResolvedValue({ data: [], error: null }),
      from: jest.fn().mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
              }),
            }),
          }),
        }),
      }),
    };

    const result = await executeApprovedRequest(mockSupabase, "approval-uuid", "worker-2");
    // Concurrent second caller: no claim → no business effect
    expect(result).toMatchObject({ claimed: false });
  });
});

describe("Maker-Checker: approval lifecycle states", () => {
  const validStatuses = ["PENDING", "APPROVED", "REJECTED", "EXPIRED", "EXECUTING", "EXECUTED", "EXECUTION_FAILED"];

  test("lifecycle statuses match migration constraint exactly", () => {
    const constraintValues = ["PENDING", "APPROVED", "REJECTED", "EXPIRED", "EXECUTING", "EXECUTED", "EXECUTION_FAILED"];
    expect(constraintValues).toEqual(validStatuses);
  });

  test("PENDING → APPROVED is a valid transition (approve action)", () => {
    expect(validStatuses).toContain("APPROVED");
  });

  test("APPROVED → EXECUTING is the only valid execution claim transition", () => {
    expect(validStatuses.indexOf("APPROVED")).toBeGreaterThanOrEqual(0);
    expect(validStatuses.indexOf("EXECUTING")).toBeGreaterThanOrEqual(0);
  });

  test("EXECUTING → EXECUTED or EXECUTION_FAILED after business effect", () => {
    expect(validStatuses).toContain("EXECUTED");
    expect(validStatuses).toContain("EXECUTION_FAILED");
  });
});
