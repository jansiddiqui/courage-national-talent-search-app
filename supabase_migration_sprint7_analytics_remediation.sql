-- =============================================================================
-- Migration: Sprint 7 Analytics Platform Remediation
-- File: supabase_migration_sprint7_analytics_remediation.sql
-- =============================================================================

-- 1. Add active parents track to registration daily logs
ALTER TABLE public.analytics_daily_registrations 
ADD COLUMN IF NOT EXISTS total_active_parents integer DEFAULT 0 NOT NULL;

-- 2. Create cohort retention aggregation table
CREATE TABLE IF NOT EXISTS public.analytics_cohort_retention (
  cohort_date date NOT NULL,
  day_offset integer NOT NULL, -- 1, 7, 30
  cohort_size integer NOT NULL,
  returned_count integer NOT NULL,
  retention_rate numeric(5,2) NOT NULL,
  PRIMARY KEY (cohort_date, day_offset)
);

-- Ensure Row Level Security (RLS) is enabled
ALTER TABLE public.analytics_cohort_retention ENABLE ROW LEVEL SECURITY;

-- 3. Create Admin policies for analytics_cohort_retention
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'analytics_cohort_retention' AND policyname = 'Admin cohort access'
  ) THEN
    CREATE POLICY "Admin cohort access" ON public.analytics_cohort_retention 
    FOR ALL USING (public.is_admin_user());
  END IF;
END
$$;

-- 4. Alter analytics_question_statistics to support sample sizes and status
ALTER TABLE public.analytics_question_statistics 
ADD COLUMN IF NOT EXISTS sample_size integer DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'INSUFFICIENT_SAMPLE' NOT NULL;

-- 5. Add performance indexes for telemetry and aggregation
CREATE INDEX IF NOT EXISTS idx_telemetry_actor_type_time 
ON public.analytics_telemetry_events(actor_id, event_type, created_at);

CREATE INDEX IF NOT EXISTS idx_registrations_school_id 
ON public.registrations(school_id);
