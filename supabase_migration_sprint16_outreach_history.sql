-- Migration: Sprint 16 Outreach History & Discovery Idempotency
-- File: supabase_migration_sprint16_outreach_history.sql

-- 1. Create school_prospect_outreach_events table
CREATE TABLE IF NOT EXISTS public.school_prospect_outreach_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid NOT NULL REFERENCES public.school_prospects(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- 'STATUS_CHANGE', 'NOTE_ADDED', 'FOLLOW_UP_SCHEDULED'
  previous_status text,
  new_status text,
  note text,
  actor_id uuid REFERENCES public.admin_users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Create school_discovery_run_units table for query idempotency
CREATE TABLE IF NOT EXISTS public.school_discovery_run_units (
  id text PRIMARY KEY, -- deterministic format: {run_id}_{geo_idx}_{template_idx}_{page}
  run_id uuid NOT NULL REFERENCES public.school_discovery_runs(id) ON DELETE CASCADE,
  geography text NOT NULL,
  query_template text NOT NULL,
  page_number integer NOT NULL,
  results_count integer DEFAULT 0 NOT NULL,
  candidates_saved_count integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_outreach_events_prospect ON public.school_prospect_outreach_events(prospect_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discovery_run_units_run ON public.school_discovery_run_units(run_id);

-- 4. Enable RLS
ALTER TABLE public.school_prospect_outreach_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_discovery_run_units ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Admin access to outreach events" ON public.school_prospect_outreach_events;
CREATE POLICY "Admin access to outreach events" ON public.school_prospect_outreach_events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.phone_number = auth.jwt()->>'phone'
         OR admin_users.email = auth.jwt()->>'email'
    )
  );

DROP POLICY IF EXISTS "Admin access to run units" ON public.school_discovery_run_units;
CREATE POLICY "Admin access to run units" ON public.school_discovery_run_units FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.phone_number = auth.jwt()->>'phone'
         OR admin_users.email = auth.jwt()->>'email'
    )
  );
