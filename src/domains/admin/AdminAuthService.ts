/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AdminAuthService
 * Server-side RBAC permission checking for admin API routes.
 * All access to admin_user_roles and admin_role_permissions tables
 * goes through the service-role client (supabaseAdmin) — never browser clients.
 */

export async function checkAdminPermission(
  supabaseAdmin: any,
  adminId: string,
  permission: string
): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('admin_user_roles')
    .select('role_id, admin_roles!inner(admin_role_permissions!inner(permission_key))')
    .eq('admin_id', adminId);

  if (error || !data) return false;

  for (const ur of data) {
    const role = ur.admin_roles;
    if (!role) continue;
    const perms = role.admin_role_permissions || [];
    if (perms.some((p: any) => p.permission_key === permission)) return true;
  }
  return false;
}

export async function getAdminRoles(
  supabaseAdmin: any,
  adminId: string
): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from('admin_user_roles')
    .select('role_id, admin_roles!inner(name)')
    .eq('admin_id', adminId);

  if (error || !data) return [];
  return data.map((ur: any) => ur.admin_roles?.name).filter(Boolean);
}

export async function getAdminPermissions(
  supabaseAdmin: any,
  adminId: string
): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from('admin_user_roles')
    .select('role_id, admin_roles!inner(admin_role_permissions!inner(permission_key))')
    .eq('admin_id', adminId);

  if (error || !data) return [];
  const perms = new Set<string>();
  for (const ur of data) {
    const role = ur.admin_roles;
    if (!role) continue;
    for (const p of role.admin_role_permissions || []) {
      if (p.permission_key) perms.add(p.permission_key);
    }
  }
  return Array.from(perms);
}
