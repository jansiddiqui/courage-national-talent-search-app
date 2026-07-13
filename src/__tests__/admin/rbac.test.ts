/* eslint-disable @typescript-eslint/no-explicit-any */
import { checkAdminPermission, getAdminRoles } from "../../domains/admin/AdminAuthService";

declare const describe: any;
declare const it: any;
declare const expect: any;
declare const jest: any;
declare const beforeEach: any;

describe("AdminAuthService RBAC Resolution", () => {
  let mockSupabaseAdmin: any;

  beforeEach(() => {
    mockSupabaseAdmin = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn(),
    };
  });

  it("should return true if the user has the required permission", async () => {
    mockSupabaseAdmin.eq.mockResolvedValue({
      data: [
        {
          role_id: "role-1",
          admin_roles: {
            name: "SUPER_ADMIN",
            admin_role_permissions: [
              { permission_key: "rbac.manage" },
              { permission_key: "assessment.publish" }
            ]
          }
        }
      ],
      error: null
    });

    const hasPermission = await checkAdminPermission(mockSupabaseAdmin, "admin-1", "rbac.manage");
    expect(hasPermission).toBe(true);
  });

  it("should return false if the user does not have the required permission", async () => {
    mockSupabaseAdmin.eq.mockResolvedValue({
      data: [
        {
          role_id: "role-2",
          admin_roles: {
            name: "SUPPORT_AGENT",
            admin_role_permissions: [
              { permission_key: "support.reply" }
            ]
          }
        }
      ],
      error: null
    });

    const hasPermission = await checkAdminPermission(mockSupabaseAdmin, "admin-1", "rbac.manage");
    expect(hasPermission).toBe(false);
  });

  it("should return correct admin roles list", async () => {
    mockSupabaseAdmin.eq.mockResolvedValue({
      data: [
        { role_id: "role-1", admin_roles: { name: "SUPER_ADMIN" } },
        { role_id: "role-2", admin_roles: { name: "EXAM_MANAGER" } }
      ],
      error: null
    });

    const roles = await getAdminRoles(mockSupabaseAdmin, "admin-1");
    expect(roles).toEqual(["SUPER_ADMIN", "EXAM_MANAGER"]);
  });
});
