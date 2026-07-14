/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AdminAuthService
 * Server-side RBAC permission checking for admin API routes.
 * All access to admin_user_roles and admin_role_permissions tables
 * goes through the service-role client (supabaseAdmin) — never browser clients.
 */

async function resolveAdminId(supabaseAdmin: any, adminId: string): Promise<string | null> {
  if (!adminId) return null;
  if (adminId.includes('@')) {
    const { data: adminUser } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('email', adminId)
      .maybeSingle();
    return adminUser?.id || null;
  }
  return adminId;
}

export async function checkAdminPermission(
  supabaseAdmin: any,
  adminId: string,
  permission: string
): Promise<boolean> {
  const resolvedId = await resolveAdminId(supabaseAdmin, adminId);
  if (!resolvedId) return false;

  const { data, error } = await supabaseAdmin
    .from('admin_user_roles')
    .select('role_id, admin_roles!inner(name, admin_role_permissions(permission_key))')
    .eq('admin_id', resolvedId);

  if (error || !data) return false;

  for (const ur of data) {
    const role = ur.admin_roles;
    if (!role) continue;
    
    // SUPER_ADMIN has full platform bypass
    if (role.name === 'SUPER_ADMIN') return true;

    const perms = role.admin_role_permissions || [];
    if (perms.some((p: any) => p.permission_key === permission)) return true;
  }
  return false;
}

export async function getAdminRoles(
  supabaseAdmin: any,
  adminId: string
): Promise<string[]> {
  const resolvedId = await resolveAdminId(supabaseAdmin, adminId);
  if (!resolvedId) return [];

  const { data, error } = await supabaseAdmin
    .from('admin_user_roles')
    .select('role_id, admin_roles!inner(name)')
    .eq('admin_id', resolvedId);

  if (error || !data) return [];
  return data.map((ur: any) => ur.admin_roles?.name).filter(Boolean);
}

export async function getAdminPermissions(
  supabaseAdmin: any,
  adminId: string
): Promise<string[]> {
  const resolvedId = await resolveAdminId(supabaseAdmin, adminId);
  if (!resolvedId) return [];

  const { data, error } = await supabaseAdmin
    .from('admin_user_roles')
    .select('role_id, admin_roles!inner(name, admin_role_permissions(permission_key))')
    .eq('admin_id', resolvedId);

  if (error || !data) return [];
  const perms = new Set<string>();
  for (const ur of data) {
    const role = ur.admin_roles;
    if (!role) continue;
    
    // If SUPER_ADMIN, they have all permissions, but for this function we return whatever is registered
    for (const p of role.admin_role_permissions || []) {
      if (p.permission_key) perms.add(p.permission_key);
    }
  }
  return Array.from(perms);
}

