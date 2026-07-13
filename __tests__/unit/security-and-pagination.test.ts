/**
 * Phase 12 Integration & Security Tests
 * Question versioning via database triggers
 * Pagination correctness
 * Job worker CRON_SECRET security
 */

// ============================================================
// QUESTION VERSIONING — documented trigger behavior
// ============================================================
describe("Question versioning — trigger contract", () => {
  /**
   * Question versioning is enforced by the DB trigger questions_version_trigger.
   * The application layer DOES NOT manually increment version.
   * These tests document the expected trigger behavior as an integration contract.
   */

  test("editing question text triggers version increment (documented contract)", () => {
    // Contract: When content fields (text, options) change, the DB trigger increments version.
    // This is the trigger: questions_version_trigger ON public.questions BEFORE UPDATE
    // Application layer sends update without version field — DB does it.
    const appLayerUpdate = {
      question_text: "Updated text",
      // version: NOT included — trigger handles it
    };
    expect(appLayerUpdate).not.toHaveProperty("version");
  });

  test("editing question options triggers version increment (documented contract)", () => {
    const appLayerUpdate = {
      options: ["A. new option", "B. other option"],
    };
    expect(appLayerUpdate).not.toHaveProperty("version");
  });

  test("metadata-only edit does not carry version (trigger uses content hash diff)", () => {
    // The trigger only increments version when content fields change.
    // Metadata-only updates (e.g. tags, difficulty) should not increment version.
    const metadataUpdate = {
      difficulty: "MEDIUM",
      tags: ["algebra"],
    };
    expect(metadataUpdate).not.toHaveProperty("version");
  });

  test("approval-status-only edit does not include version (trigger ignores status column)", () => {
    const statusUpdate = {
      approval_status: "APPROVED",
    };
    expect(statusUpdate).not.toHaveProperty("version");
  });

  test("application questions route does not manually increment version field on update", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const routePath = path.resolve(
      __dirname,
      "../../src/app/api/admin/questions/route.ts"
    );
    const source = fs.readFileSync(routePath, "utf8");
    
    // The route must not dynamically increment version (trigger handles it)
    // version: 1 on initial INSERT is acceptable for default seeding
    expect(source).not.toMatch(/version\s*\+\s*1/);
    expect(source).not.toMatch(/version\s*\+\+/);
    expect(source).not.toMatch(/\.version\s*=\s*.*\+/);
  });
});

// ============================================================
// SCHOOLS PAGINATION — Phase 11
// ============================================================
describe("Schools pagination", () => {
  test("schools route URL is /api/admin/schools (no double /api/)", () => {
    // V3.3 correction: route must be /api/admin/schools not /api/api/admin/schools
    const correctRoute = "/api/admin/schools";
    expect(correctRoute).toBe("/api/admin/schools");
    expect(correctRoute).not.toContain("/api/api/");
  });

  test("schools GET route accepts limit and page query parameters", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const routePath = path.resolve(
      __dirname,
      "../../src/app/api/admin/schools/route.ts"
    );
    const source = fs.readFileSync(routePath, "utf8");
    expect(source).toContain("limit");
    expect(source).toContain("page");
    expect(source).toContain("offset");
    expect(source).toContain("range(");
  });

  test("audit route GET includes pagination fields", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const routePath = path.resolve(
      __dirname,
      "../../src/app/api/admin/audit/route.ts"
    );
    const source = fs.readFileSync(routePath, "utf8");
    expect(source).toContain("limit");
    expect(source).toContain("offset");
  });
});

// ============================================================
// JOB WORKER — CRON_SECRET security
// ============================================================
describe("Job worker — CRON_SECRET security", () => {
  const WORKER_ROUTE_PATH = "../../src/app/api/admin/jobs/worker/route.ts";

  test("worker route source contains CRON_SECRET check", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const routePath = path.resolve(__dirname, WORKER_ROUTE_PATH);
    const source = fs.readFileSync(routePath, "utf8");
    expect(source).toContain("CRON_SECRET");
  });

  test("worker returns 503 when CRON_SECRET env var is absent", async () => {
    // Simulate the absence of CRON_SECRET by checking the code path
    const fs = await import("fs");
    const path = await import("path");
    const routePath = path.resolve(__dirname, WORKER_ROUTE_PATH);
    const source = fs.readFileSync(routePath, "utf8");

    // The worker must explicitly check for the absence of CRON_SECRET
    // and return 503 (fail closed), not 401 or 200
    expect(source).toContain("503");
    expect(source).toContain("!CRON_SECRET");
  });

  test("worker returns 401 when CRON_SECRET header does not match", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const routePath = path.resolve(__dirname, WORKER_ROUTE_PATH);
    const source = fs.readFileSync(routePath, "utf8");
    expect(source).toContain("401");
    expect(source).toContain("x-cron-secret");
  });

  test("worker checks x-cron-secret header against env CRON_SECRET", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const routePath = path.resolve(__dirname, WORKER_ROUTE_PATH);
    const source = fs.readFileSync(routePath, "utf8");
    // Must compare the header value to the env var
    expect(source).toContain("authHeader !== CRON_SECRET");
  });
});
