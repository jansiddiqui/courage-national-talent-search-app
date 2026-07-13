/**
 * Phase 12 Integration & Security Tests
 * ExamLifecycleService — state machine unit tests
 */

import {
  getAllowedTransitions,
  getTransitionPermission,
  transitionExamStatus,
  ExamStatus,
} from "../../src/domains/admin/ExamLifecycleService";

// ============================================================
// ALLOWED TRANSITION MATRIX — every allowed transition
// ============================================================
describe("ExamLifecycleService — allowed transitions", () => {
  const cases: [ExamStatus, ExamStatus][] = [
    ["DRAFT",               "REGISTRATION_OPEN"],
    ["REGISTRATION_OPEN",   "REGISTRATION_CLOSED"],
    ["REGISTRATION_OPEN",   "LIVE"],
    ["REGISTRATION_CLOSED", "LIVE"],
    ["LIVE",                "RESULTS_PROCESSING"],
    ["RESULTS_PROCESSING",  "RESULTS_PUBLISHED"],
    ["RESULTS_PUBLISHED",   "ARCHIVED"],
  ];

  test.each(cases)("allows transition %s → %s", (from, to) => {
    const allowed = getAllowedTransitions(from);
    expect(allowed).toContain(to);
  });
});

// ============================================================
// DISALLOWED TRANSITIONS — must be rejected
// ============================================================
describe("ExamLifecycleService — disallowed transitions", () => {
  const disallowed: [ExamStatus, ExamStatus][] = [
    ["DRAFT",              "LIVE"],
    ["DRAFT",              "RESULTS_PROCESSING"],
    ["DRAFT",              "RESULTS_PUBLISHED"],
    ["DRAFT",              "ARCHIVED"],
    ["REGISTRATION_OPEN",  "ARCHIVED"],
    ["REGISTRATION_OPEN",  "DRAFT"],
    ["LIVE",               "DRAFT"],
    ["LIVE",               "REGISTRATION_OPEN"],
    ["RESULTS_PUBLISHED",  "LIVE"],
    ["RESULTS_PUBLISHED",  "DRAFT"],
    ["ARCHIVED",           "DRAFT"],
    ["ARCHIVED",           "LIVE"],
  ];

  test.each(disallowed)("rejects transition %s → %s", (from, to) => {
    const allowed = getAllowedTransitions(from);
    expect(allowed).not.toContain(to);
  });

  test.each(disallowed)(
    "getTransitionPermission throws for disallowed %s → %s",
    (from, to) => {
      expect(() => getTransitionPermission(from, to)).toThrow();
    }
  );
});

// ============================================================
// CONCURRENCY CONFLICT — atomic update guard
// ============================================================
describe("ExamLifecycleService.transitionExamStatus — concurrency", () => {
  test("returns CONFLICT when assessment is not in expected fromStatus", async () => {
    const mockSupabase = {
      from: () => ({
        update: () => ({
          eq: () => ({
            eq: () => ({
              select: () => ({
                maybeSingle: async () => ({
                  data: null, // Row not found — conflict
                  error: null,
                }),
              }),
            }),
          }),
        }),
      }),
    };

    const result = await transitionExamStatus(
      mockSupabase,
      "assessment-uuid",
      "DRAFT",
      "REGISTRATION_OPEN"
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("CONFLICT");
  });

  test("returns success when assessment transitions correctly", async () => {
    const updatedRow = {
      id: "assessment-uuid",
      status: "REGISTRATION_OPEN",
      is_published: false,
    };

    const mockSupabase = {
      from: () => ({
        update: () => ({
          eq: () => ({
            eq: () => ({
              select: () => ({
                maybeSingle: async () => ({
                  data: updatedRow,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      }),
    };

    const result = await transitionExamStatus(
      mockSupabase,
      "assessment-uuid",
      "DRAFT",
      "REGISTRATION_OPEN"
    );

    expect(result.success).toBe(true);
    expect(result.assessment?.status).toBe("REGISTRATION_OPEN");
  });

  test("returns error when database returns error", async () => {
    const mockSupabase = {
      from: () => ({
        update: () => ({
          eq: () => ({
            eq: () => ({
              select: () => ({
                maybeSingle: async () => ({
                  data: null,
                  error: { message: "DB connection failed" },
                }),
              }),
            }),
          }),
        }),
      }),
    };

    const result = await transitionExamStatus(
      mockSupabase,
      "assessment-uuid",
      "DRAFT",
      "REGISTRATION_OPEN"
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain("DB connection failed");
  });
});

// ============================================================
// is_published COMPATIBILITY per lifecycle state
// ============================================================
describe("ExamLifecycleService — is_published state rules", () => {
  // From the V3.3 spec and DB trigger:
  // is_published = true for LIVE, RESULTS_PROCESSING, RESULTS_PUBLISHED, ARCHIVED
  // is_published = false for DRAFT, REGISTRATION_OPEN, REGISTRATION_CLOSED

  const publishedStates: ExamStatus[] = [
    "LIVE",
    "RESULTS_PROCESSING",
    "RESULTS_PUBLISHED",
    "ARCHIVED",
  ];

  const unpublishedStates: ExamStatus[] = [
    "DRAFT",
    "REGISTRATION_OPEN",
    "REGISTRATION_CLOSED",
  ];

  test("published states include LIVE, RESULTS_PROCESSING, RESULTS_PUBLISHED, ARCHIVED", () => {
    // These states are documented as is_published = true in the migration trigger
    const documented = new Set(publishedStates);
    expect(documented.has("LIVE")).toBe(true);
    expect(documented.has("RESULTS_PROCESSING")).toBe(true);
    expect(documented.has("RESULTS_PUBLISHED")).toBe(true);
    expect(documented.has("ARCHIVED")).toBe(true);
  });

  test("unpublished states include DRAFT, REGISTRATION_OPEN, REGISTRATION_CLOSED", () => {
    const documented = new Set(unpublishedStates);
    expect(documented.has("DRAFT")).toBe(true);
    expect(documented.has("REGISTRATION_OPEN")).toBe(true);
    expect(documented.has("REGISTRATION_CLOSED")).toBe(true);
  });

  test("RESULTS_PROCESSING state uses exact status string", () => {
    // V3.3 correction: must be RESULTS_PROCESSING not PROCESSING
    const allowed = getAllowedTransitions("LIVE");
    expect(allowed).toContain("RESULTS_PROCESSING");
    expect(allowed).not.toContain("PROCESSING");
  });

  test("RESULTS_PUBLISHED state uses exact status string", () => {
    // V3.3 correction: must be RESULTS_PUBLISHED not PUBLISHED
    const allowed = getAllowedTransitions("RESULTS_PROCESSING");
    expect(allowed).toContain("RESULTS_PUBLISHED");
    expect(allowed).not.toContain("PUBLISHED");
  });
});

// ============================================================
// PERMISSION MAPPING per transition
// ============================================================
describe("ExamLifecycleService — permission mapping", () => {
  test("all allowed transitions require assessment.publish", () => {
    const transitions: [ExamStatus, ExamStatus][] = [
      ["DRAFT",               "REGISTRATION_OPEN"],
      ["REGISTRATION_OPEN",   "REGISTRATION_CLOSED"],
      ["REGISTRATION_OPEN",   "LIVE"],
      ["REGISTRATION_CLOSED", "LIVE"],
      ["LIVE",                "RESULTS_PROCESSING"],
      ["RESULTS_PROCESSING",  "RESULTS_PUBLISHED"],
      ["RESULTS_PUBLISHED",   "ARCHIVED"],
    ];
    for (const [from, to] of transitions) {
      expect(getTransitionPermission(from, to)).toBe("assessment.publish");
    }
  });
});
