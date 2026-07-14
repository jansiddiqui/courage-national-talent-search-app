/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * AdminAuthService
 * Server-side RBAC permission checking for admin API routes.
 * All access to admin_user_roles and admin_role_permissions tables
 * goes through the service-role client (supabaseAdmin) — never browser clients.
 */

async function resolveAdminId(supabaseAdmin: any, adminId: string): Promise<string | null> {
  if (!adminId) return null;

  // Check if already a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(adminId)) {
    return adminId;
  }

  // If it is not an email and not a phone number, treat it as already resolved (e.g. mock test ids)
  const isPhoneNumber = /^\+?\d+$/.test(adminId);
  if (!adminId.includes('@') && !isPhoneNumber) {
    return adminId;
  }

  // Look up admin by email or phone number fallback
  let query = supabaseAdmin.from('admin_users').select('id');
  if (adminId.includes('@')) {
    query = query.eq('email', adminId);
  } else {
    query = query.eq('phone_number', adminId);
  }

  let adminUser = null;
  if (typeof query.maybeSingle === 'function') {
    const { data } = await query.maybeSingle();
    adminUser = data;
  } else {
    const res = await query;
    adminUser = Array.isArray(res?.data) ? res.data[0] : res?.data;
  }
  return adminUser?.id || null;
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

