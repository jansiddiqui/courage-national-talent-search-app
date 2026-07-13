/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPlatformHealth } from "../../domains/admin/MissionControlService";
import { getQueueSummary } from "../../domains/admin/QueueAdapterService";

describe("Platform Mission Control Integration", () => {
  it("should aggregate health telemetry metrics correctly", async () => {
    // Each supabase chain call returns { count, error } at the terminal call
    const makeChain = (count: number) => ({
      select: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnValue({ count, error: null }),
      eq: jest.fn().mockReturnValue({ count, error: null }),
      gte: jest.fn().mockReturnValue({ count, error: null }),
      // For queries that end at .select() (no further chaining)
      then: undefined,
      count,
      error: null,
    });

    const mockSupabaseAdmin = {
      from: jest.fn().mockImplementation(() => makeChain(5)),
    };

    const health = await getPlatformHealth(mockSupabaseAdmin);
    expect(health.recentAuditActions).toBe(5);
    expect(health.activeAdmins).toBe(5);
    expect(health.queueBacklog).toBe(5);
    expect(health.pendingApprovals).toBe(5);
    expect(health.openSupportTickets).toBe(5);
  });

  it("should calculate correct background job counts in adapter", async () => {
    const mockSupabaseAdmin = {
      from: jest.fn((table: string) => {
        return {
          select: jest.fn().mockResolvedValue({
            data: table === "admin_background_jobs"
              ? [{ status: "PENDING" }, { status: "PROCESSING" }]
              : [{ status: "COMPLETED" }, { status: "FAILED" }],
            error: null
          })
        };
      })
    };

    const summary = await getQueueSummary(mockSupabaseAdmin);
    const adminQueue = summary.find(q => q.queue === "admin");
    const schoolQueue = summary.find(q => q.queue === "school");

    expect(adminQueue?.pending).toBe(1);
    expect(adminQueue?.processing).toBe(1);
    expect(schoolQueue?.completed).toBe(1);
    expect(schoolQueue?.failed).toBe(1);
  });
});
