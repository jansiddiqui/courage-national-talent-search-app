-- Migration: Seed missing schools.* permission keys and grant to SUPER_ADMIN
-- Run this in Supabase SQL editor.
-- Safe: uses ON CONFLICT DO NOTHING / DO UPDATE throughout.

-- =========================================================
-- 1. Register missing permission keys
-- =========================================================
INSERT INTO public.admin_permissions (key, description) VALUES
  ('schools.view',    'View school prospects and discovery runs'),
  ('schools.edit',    'Create, edit, enrich, and delete school prospects'),
  ('schools.discover','Start and cancel school discovery runs')
ON CONFLICT (key) DO UPDATE SET description = EXCLUDED.description;

-- =========================================================
-- 2. Grant all schools.* permissions to SUPER_ADMIN role
-- =========================================================
INSERT INTO public.admin_role_permissions (role_id, permission_key)
SELECT r.id, p.key
FROM public.admin_roles r
CROSS JOIN public.admin_permissions p
WHERE r.name = 'SUPER_ADMIN'
  AND p.key IN ('schools.view', 'schools.edit', 'schools.discover')
ON CONFLICT DO NOTHING;

-- =========================================================
-- 3. Grant schools.view and schools.edit to EXAM_MANAGER
--    (they need to see schools for registration context)
-- =========================================================
INSERT INTO public.admin_role_permissions (role_id, permission_key)
SELECT r.id, p.key
FROM public.admin_roles r
CROSS JOIN public.admin_permissions p
WHERE r.name = 'EXAM_MANAGER'
  AND p.key IN ('schools.view', 'schools.edit')
ON CONFLICT DO NOTHING;

-- =========================================================
-- 4. Verify: show what was inserted
-- =========================================================
SELECT
  ar.name AS role,
  rp.permission_key
FROM public.admin_role_permissions rp
JOIN public.admin_roles ar ON ar.id = rp.role_id
WHERE rp.permission_key LIKE 'schools.%'
ORDER BY ar.name, rp.permission_key;
