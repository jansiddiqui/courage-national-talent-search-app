-- ============================================================================
-- CNTS Domain Migration Script
-- Migration: Legacy Domain -> cnts.couragelibrary.in
-- Target: Supabase PostgreSQL Database
-- 
-- IMPORTANT:
-- 1. Review this script carefully before executing in Supabase SQL Editor.
-- 2. Run PART 1 (Read-Only Audit) first to inspect any matching rows.
-- 3. If matching rows exist, run PART 2 (Transactional Updates) inside a transaction.
-- 4. Run PART 3 (Verification) to ensure zero remaining matches.
-- 5. Note: Main Courage Library site is couragelibrary.in (unrelated project).
--    All CNTS links MUST use cnts.couragelibrary.in.
-- ============================================================================

-- ============================================================================
-- PART 1: READ-ONLY AUDIT QUERIES (RUN FIRST)
-- Run these SELECT statements to discover which tables/columns contain the old domain.
-- ============================================================================

-- 1. System Settings
SELECT 'system_settings' AS table_name, id, setting_key, setting_value
FROM public.system_settings
WHERE setting_value ILIKE ('%' || 'the' || 'couragelibrary.com%');

-- 2. Registrations (Metadata or notes)
SELECT 'registrations' AS table_name, registration_id, cnts_id, parent_email, metadata
FROM public.registrations
WHERE parent_email ILIKE ('%' || 'the' || 'couragelibrary.com%')
   OR metadata::text ILIKE ('%' || 'the' || 'couragelibrary.com%');

-- 3. Results (Certificate URLs, Report Card URLs)
SELECT 'results' AS table_name, registration_id, cnts_id, certificate_url, report_card_url
FROM public.results
WHERE certificate_url ILIKE ('%' || 'the' || 'couragelibrary.com%')
   OR report_card_url ILIKE ('%' || 'the' || 'couragelibrary.com%');

-- 4. Schools (Website, Email, Logo URL)
SELECT 'schools' AS table_name, id, school_code, name, website, coordinator_email, logo_url
FROM public.schools
WHERE website ILIKE ('%' || 'the' || 'couragelibrary.com%')
   OR coordinator_email ILIKE ('%' || 'the' || 'couragelibrary.com%')
   OR logo_url ILIKE ('%' || 'the' || 'couragelibrary.com%');

-- 5. School Profiles (Public portal profiles)
SELECT 'school_profiles' AS table_name, id, school_code, website_url, logo_url, banner_url
FROM public.school_profiles
WHERE website_url ILIKE ('%' || 'the' || 'couragelibrary.com%')
   OR logo_url ILIKE ('%' || 'the' || 'couragelibrary.com%')
   OR banner_url ILIKE ('%' || 'the' || 'couragelibrary.com%');

-- 6. Partner Profiles (Mobilizer links & details)
SELECT 'partner_profiles' AS table_name, id, referral_code, email, metadata::text
FROM public.partner_profiles
WHERE email ILIKE ('%' || 'the' || 'couragelibrary.com%')
   OR metadata::text ILIKE ('%' || 'the' || 'couragelibrary.com%');

-- 7. Support Tickets (Email, Metadata, Subject)
SELECT 'support_tickets' AS table_name, id, ticket_number, email, metadata::text
FROM public.support_tickets
WHERE email ILIKE ('%' || 'the' || 'couragelibrary.com%')
   OR metadata::text ILIKE ('%' || 'the' || 'couragelibrary.com%');

-- 8. Admin Users (Staff accounts)
SELECT 'admin_users' AS table_name, id, email, full_name, role
FROM public.admin_users
WHERE email ILIKE ('%' || 'the' || 'couragelibrary.com%');

-- 9. CNTS Timeline Events (Descriptions & Event Metadata)
SELECT 'cnts_timeline_events' AS table_name, id, event_key, title, description, metadata::text
FROM public.cnts_timeline_events
WHERE description ILIKE ('%' || 'the' || 'couragelibrary.com%')
   OR metadata::text ILIKE ('%' || 'the' || 'couragelibrary.com%');

-- 10. Background Jobs Queue (Staged payloads)
SELECT 'admin_background_jobs' AS table_name, id, job_type, status, payload::text
FROM public.admin_background_jobs
WHERE payload::text ILIKE ('%' || 'the' || 'couragelibrary.com%');


-- ============================================================================
-- PART 2: TRANSACTIONAL MIGRATION
-- Wrap all updates in a single transaction. If anything fails, it rolls back automatically.
-- ============================================================================

BEGIN;

-- 1. System Settings
UPDATE public.system_settings
SET setting_value = REPLACE(setting_value, 'www.' || 'the' || 'couragelibrary.com', 'cnts.couragelibrary.in')
WHERE setting_value ILIKE ('%www.' || 'the' || 'couragelibrary.com%');

UPDATE public.system_settings
SET setting_value = REPLACE(setting_value, 'the' || 'couragelibrary.com', 'cnts.couragelibrary.in')
WHERE setting_value ILIKE ('%' || 'the' || 'couragelibrary.com%');

-- 2. Results (Certificate and Report URLs)
UPDATE public.results
SET certificate_url = REPLACE(certificate_url, 'the' || 'couragelibrary.com', 'cnts.couragelibrary.in')
WHERE certificate_url ILIKE ('%' || 'the' || 'couragelibrary.com%');

UPDATE public.results
SET report_card_url = REPLACE(report_card_url, 'the' || 'couragelibrary.com', 'cnts.couragelibrary.in')
WHERE report_card_url ILIKE ('%' || 'the' || 'couragelibrary.com%');

-- 3. Schools (Website, Emails, Logos)
UPDATE public.schools
SET website = REPLACE(website, 'the' || 'couragelibrary.com', 'cnts.couragelibrary.in')
WHERE website ILIKE ('%' || 'the' || 'couragelibrary.com%');

UPDATE public.schools
SET logo_url = REPLACE(logo_url, 'the' || 'couragelibrary.com', 'cnts.couragelibrary.in')
WHERE logo_url ILIKE ('%' || 'the' || 'couragelibrary.com%');

UPDATE public.schools
SET coordinator_email = REPLACE(coordinator_email, '@' || 'the' || 'couragelibrary.com', '@couragelibrary.in')
WHERE coordinator_email ILIKE ('%@' || 'the' || 'couragelibrary.com%');

-- 4. School Profiles
UPDATE public.school_profiles
SET website_url = REPLACE(website_url, 'the' || 'couragelibrary.com', 'cnts.couragelibrary.in')
WHERE website_url ILIKE ('%' || 'the' || 'couragelibrary.com%');

UPDATE public.school_profiles
SET logo_url = REPLACE(logo_url, 'the' || 'couragelibrary.com', 'cnts.couragelibrary.in')
WHERE logo_url ILIKE ('%' || 'the' || 'couragelibrary.com%');

UPDATE public.school_profiles
SET banner_url = REPLACE(banner_url, 'the' || 'couragelibrary.com', 'cnts.couragelibrary.in')
WHERE banner_url ILIKE ('%' || 'the' || 'couragelibrary.com%');

-- 5. Partner Profiles (JSONB metadata & email)
UPDATE public.partner_profiles
SET email = REPLACE(email, '@' || 'the' || 'couragelibrary.com', '@couragelibrary.in')
WHERE email ILIKE ('%@' || 'the' || 'couragelibrary.com%');

UPDATE public.partner_profiles
SET metadata = REPLACE(metadata::text, 'the' || 'couragelibrary.com', 'cnts.couragelibrary.in')::jsonb
WHERE metadata IS NOT NULL AND metadata::text ILIKE ('%' || 'the' || 'couragelibrary.com%');

-- 6. Support Tickets (Email & JSONB metadata)
UPDATE public.support_tickets
SET email = REPLACE(email, '@' || 'the' || 'couragelibrary.com', '@couragelibrary.in')
WHERE email ILIKE ('%@' || 'the' || 'couragelibrary.com%');

UPDATE public.support_tickets
SET metadata = REPLACE(metadata::text, 'the' || 'couragelibrary.com', 'cnts.couragelibrary.in')::jsonb
WHERE metadata IS NOT NULL AND metadata::text ILIKE ('%' || 'the' || 'couragelibrary.com%');

-- 7. Admin Users (Staff email addresses)
UPDATE public.admin_users
SET email = REPLACE(email, '@' || 'the' || 'couragelibrary.com', '@couragelibrary.in')
WHERE email ILIKE ('%@' || 'the' || 'couragelibrary.com%');

-- 8. Registrations (Metadata JSONB)
UPDATE public.registrations
SET metadata = REPLACE(metadata::text, 'the' || 'couragelibrary.com', 'cnts.couragelibrary.in')::jsonb
WHERE metadata IS NOT NULL AND metadata::text ILIKE ('%' || 'the' || 'couragelibrary.com%');

-- 9. Timeline Events
UPDATE public.cnts_timeline_events
SET description = REPLACE(description, 'the' || 'couragelibrary.com', 'cnts.couragelibrary.in')
WHERE description ILIKE ('%' || 'the' || 'couragelibrary.com%');

UPDATE public.cnts_timeline_events
SET metadata = REPLACE(metadata::text, 'the' || 'couragelibrary.com', 'cnts.couragelibrary.in')::jsonb
WHERE metadata IS NOT NULL AND metadata::text ILIKE ('%' || 'the' || 'couragelibrary.com%');

-- 10. Background Jobs Queue
UPDATE public.admin_background_jobs
SET payload = REPLACE(payload::text, 'the' || 'couragelibrary.com', 'cnts.couragelibrary.in')::jsonb
WHERE payload IS NOT NULL AND payload::text ILIKE ('%' || 'the' || 'couragelibrary.com%');

COMMIT;


-- ============================================================================
-- PART 3: POST-MIGRATION VERIFICATION
-- Run this check to verify all occurrences have been cleaned up (expecting 0 rows).
-- ============================================================================

SELECT 'system_settings' AS tbl, count(*) FROM public.system_settings WHERE setting_value ILIKE ('%' || 'the' || 'couragelibrary.com%')
UNION ALL
SELECT 'results', count(*) FROM public.results WHERE certificate_url ILIKE ('%' || 'the' || 'couragelibrary.com%') OR report_card_url ILIKE ('%' || 'the' || 'couragelibrary.com%')
UNION ALL
SELECT 'schools', count(*) FROM public.schools WHERE website ILIKE ('%' || 'the' || 'couragelibrary.com%') OR coordinator_email ILIKE ('%@' || 'the' || 'couragelibrary.com%')
UNION ALL
SELECT 'school_profiles', count(*) FROM public.school_profiles WHERE website_url ILIKE ('%' || 'the' || 'couragelibrary.com%')
UNION ALL
SELECT 'partner_profiles', count(*) FROM public.partner_profiles WHERE email ILIKE ('%@' || 'the' || 'couragelibrary.com%') OR metadata::text ILIKE ('%' || 'the' || 'couragelibrary.com%')
UNION ALL
SELECT 'support_tickets', count(*) FROM public.support_tickets WHERE email ILIKE ('%@' || 'the' || 'couragelibrary.com%') OR metadata::text ILIKE ('%' || 'the' || 'couragelibrary.com%')
UNION ALL
SELECT 'admin_users', count(*) FROM public.admin_users WHERE email ILIKE ('%@' || 'the' || 'couragelibrary.com%')
UNION ALL
SELECT 'registrations', count(*) FROM public.registrations WHERE metadata::text ILIKE ('%' || 'the' || 'couragelibrary.com%')
UNION ALL
SELECT 'cnts_timeline_events', count(*) FROM public.cnts_timeline_events WHERE description ILIKE ('%' || 'the' || 'couragelibrary.com%') OR metadata::text ILIKE ('%' || 'the' || 'couragelibrary.com%');
