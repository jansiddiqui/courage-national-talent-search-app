-- =============================================================================
-- Migration: Sprint 15c — RBAC Remediation & Seeding missing admin permissions
-- File: supabase_migration_sprint15c_remediation_rbac.sql
-- =============================================================================
-- Run this in your Supabase SQL Editor.
-- Safe to execute: uses ON CONFLICT DO NOTHING/UPDATE throughout.

-- 1. Register missing permission keys
INSERT INTO public.admin_permissions (key, description) VALUES
  ('support.view',           'View support tickets and contact messages'),
  ('support.edit',           'Modify support tickets'),
  ('support.reply',          'Reply to support tickets'),
  ('analytics.view',         'View platform analytics dashboards'),
  ('audit.view',             'View admin operations audit trail'),
  ('notification.broadcast', 'Send system-wide broadcast notifications'),
  ('cms.view',               'View CMS pages and content'),
  ('cms.edit',               'Create and modify CMS content'),
  ('finance.view',           'View financial summaries and transactions'),
  ('developer.execute',      'Execute developer/system monitoring commands'),
  ('reports.export',         'Export data reports')
ON CONFLICT (key) DO UPDATE SET description = EXCLUDED.description;

-- 2. Grant all permissions to SUPER_ADMIN role
INSERT INTO public.admin_role_permissions (role_id, permission_key)
SELECT r.id, p.key
FROM public.admin_roles r
CROSS JOIN public.admin_permissions p
WHERE r.name = 'SUPER_ADMIN'
ON CONFLICT DO NOTHING;

-- 3. Grant support permissions to SUPPORT_AGENT role
INSERT INTO public.admin_role_permissions (role_id, permission_key)
SELECT r.id, p.key
FROM public.admin_roles r
CROSS JOIN public.admin_permissions p
WHERE r.name = 'SUPPORT_AGENT'
  AND p.key IN ('support.view', 'support.edit', 'support.reply')
ON CONFLICT DO NOTHING;

-- 4. Grant finance permissions to FINANCE_MANAGER role
INSERT INTO public.admin_role_permissions (role_id, permission_key)
SELECT r.id, p.key
FROM public.admin_roles r
CROSS JOIN public.admin_permissions p
WHERE r.name = 'FINANCE_MANAGER'
  AND p.key IN ('finance.view', 'refund.large')
ON CONFLICT DO NOTHING;

-- 5. Grant schools permissions to EXAM_MANAGER role (safety check)
INSERT INTO public.admin_role_permissions (role_id, permission_key)
SELECT r.id, p.key
FROM public.admin_roles r
CROSS JOIN public.admin_permissions p
WHERE r.name = 'EXAM_MANAGER'
  AND p.key IN ('schools.view', 'schools.edit')
ON CONFLICT DO NOTHING;
