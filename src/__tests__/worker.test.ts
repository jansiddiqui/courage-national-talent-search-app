process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.CRON_SECRET = "test-cron-secret";

// Mock checkAdminPermission and writeAuditEntry before importing
jest.mock("@/domains/admin/AdminAuthService", () => ({
  checkAdminPermission: jest.fn().mockResolvedValue(true)
}));

jest.mock("@/domains/admin/AdminAuditService", () => ({
  writeAuditEntry: jest.fn().mockResolvedValue(true)
}));

import { POST as runWorker } from "../app/api/admin/jobs/worker/route";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { writeAuditEntry } from "@/domains/admin/AdminAuditService";

jest.mock("@/lib/supabaseAdmin", () => ({
  supabaseAdmin: {
    from: jest.fn(),
    storage: {
      createBucket: jest.fn().mockResolvedValue({ error: null }),
      from: jest.fn()
    }
  },
  hasSupabaseAdminConfig: true
}));

describe("Background Job Worker, Exporters & Digests (Phase 3)", () => {
  // Thenable mock chain helper
  const makeChain = (data: any[]) => {
    const chain: any = {
      then: (resolve: any) => resolve({ data, count: data.length, error: null }),
      select: jest.fn().mockImplementation(() => chain),
      eq: jest.fn().mockImplementation(() => chain),
      neq: jest.fn().mockImplementation(() => chain),
      lt: jest.fn().mockImplementation(() => chain),
      in: jest.fn().mockImplementation(() => chain),
      lte: jest.fn().mockImplementation(() => chain),
      is: jest.fn().mockImplementation(() => chain),
      maybeSingle: jest.fn().mockImplementation(() => Promise.resolve({ data: data[0] || null, error: null })),
      single: jest.fn().mockImplementation(() => Promise.resolve({ data: data[0] || null, error: null })),
      order: jest.fn().mockImplementation(() => chain),
      limit: jest.fn().mockImplementation(() => chain),
      range: jest.fn().mockImplementation(() => Promise.resolve({ data, error: null })),
      upsert: jest.fn().mockImplementation(() => Promise.resolve({ error: null })),
      update: jest.fn().mockImplementation(() => chain),
      delete: jest.fn().mockImplementation(() => chain),
      insert: jest.fn().mockImplementation(() => Promise.resolve({ error: null }))
    };
    return chain;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fail FULL_EXPORT for backward compatibility and set deprecation error", async () => {
    const mockJobs = [
      {
        id: "job-deprecated",
        job_type: "FULL_EXPORT",
        status: "PENDING",
        payload: { requested_by: "admin-user" },
        retry_count: 0,
        max_retries: 3
      }
    ];

    const tableChains: Record<string, any> = {};
    const getChain = (table: string, data: any[]) => {
      if (!tableChains[table]) {
        tableChains[table] = makeChain(data);
      }
      return tableChains[table];
    };

    (supabaseAdmin.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "admin_background_jobs") {
        // First call claims job, second mock returns deprecated job details
        return getChain(table, mockJobs);
      }
      return getChain(table, []);
    });

    const request = new Request("http://localhost/api/admin/jobs/worker", {
      method: "POST",
      headers: { "x-cron-secret": "test-cron-secret" }
    });

    const response = await runWorker(request);
    expect(response.status).toBe(200);

    const updateSpy = tableChains["admin_background_jobs"].update;
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "FAILED",
        error_message: "Job type deprecated. Admin must request exports separately (Registrations, Results, or Ledger)."
      })
    );
  });

  it("should process REGISTRATIONS_EXPORT successfully and upload generated CSV to Storage", async () => {
    const mockJobs = [
      {
        id: "job-export",
        job_type: "REGISTRATIONS_EXPORT",
        status: "PENDING",
        payload: { filters: { state: "Delhi" }, requested_by: "admin-user" },
        retry_count: 0,
        max_retries: 3
      }
    ];

    const mockRegs = [
      {
        id: "reg-1",
        cnts_id: "CNTS001",
        student_name: "=ExcelFormula", // Starts with '=' for injection check
        student_class: "5",
        parent_name: "Parent A",
        parent_email: "parent@test.com",
        whatsapp_number: "+919876543210",
        payment_status: "SUCCESS",
        created_at: "2026-07-14T00:00:00Z",
        state: "Delhi",
        district: "North"
      }
    ];

    const tableChains: Record<string, any> = {};
    const getChain = (table: string, data: any[]) => {
      if (!tableChains[table]) {
        tableChains[table] = makeChain(data);
      }
      return tableChains[table];
    };

    (supabaseAdmin.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "admin_background_jobs") return getChain(table, mockJobs);
      if (table === "registrations") return getChain(table, mockRegs);
      return getChain(table, []);
    });

    // Mock storage uploads and signed URLs
    const mockUpload = jest.fn().mockResolvedValue({ error: null });
    const mockCreateSignedUrl = jest.fn().mockResolvedValue({ data: { signedUrl: "https://storage/signed/url" }, error: null });
    (supabaseAdmin.storage.from as jest.Mock).mockReturnValue({
      upload: mockUpload,
      createSignedUrl: mockCreateSignedUrl
    });

    const request = new Request("http://localhost/api/admin/jobs/worker", {
      method: "POST",
      headers: { "x-cron-secret": "test-cron-secret" }
    });

    const response = await runWorker(request);
    expect(response.status).toBe(200);

    // Verify upload called with injection prefix single quote: '=ExcelFormula' becomes ''=ExcelFormula'
    expect(mockUpload).toHaveBeenCalledWith(
      expect.stringContaining("registrations_export"),
      expect.any(Buffer),
      expect.objectContaining({ contentType: "text/csv" })
    );

    const uploadedBuffer = mockUpload.mock.calls[0][1] as Buffer;
    const csvContent = uploadedBuffer.toString("utf-8");
    expect(csvContent).toContain("'=ExcelFormula"); // Single quote protection prefix

    // Verify audit entry logged
    expect(writeAuditEntry).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        action: "EXPORTED_REGISTRATIONS",
        newValue: expect.objectContaining({ downloadUrl: "https://storage/signed/url" })
      })
    );
  });

  it("should generate scheduled digest reports and update status", async () => {
    const mockJobs = [
      {
        id: "job-digest",
        job_type: "GENERATE_DAILY_DIGEST",
        status: "PENDING",
        payload: { requested_by: "system_cron" },
        retry_count: 0,
        max_retries: 3
      }
    ];

    const tableChains: Record<string, any> = {};
    const getChain = (table: string, data: any[]) => {
      if (!tableChains[table]) {
        tableChains[table] = makeChain(data);
      }
      return tableChains[table];
    };

    (supabaseAdmin.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "admin_background_jobs") return getChain(table, mockJobs);
      return getChain(table, []);
    });

    const mockUpload = jest.fn().mockResolvedValue({ error: null });
    const mockCreateSignedUrl = jest.fn().mockResolvedValue({ data: { signedUrl: "https://storage/signed/digest-url" }, error: null });
    (supabaseAdmin.storage.from as jest.Mock).mockReturnValue({
      upload: mockUpload,
      createSignedUrl: mockCreateSignedUrl
    });

    const request = new Request("http://localhost/api/admin/jobs/worker", {
      method: "POST",
      headers: { "x-cron-secret": "test-cron-secret" }
    });

    const response = await runWorker(request);
    expect(response.status).toBe(200);

    expect(mockUpload).toHaveBeenCalledWith(
      expect.stringContaining("generate_daily_digest"),
      expect.any(Buffer),
      expect.objectContaining({ contentType: "application/pdf" })
    );

    expect(writeAuditEntry).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        action: "DISPATCHED_DAILY_DIGEST",
        newValue: expect.objectContaining({ downloadUrl: "https://storage/signed/digest-url" })
      })
    );
  });
});
