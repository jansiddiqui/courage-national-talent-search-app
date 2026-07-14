-- Migration: CNTS School Intelligence Engine — Sprint 15: Discovery Engine
-- Adds: school_discovery_runs table, canonical identity fields, outreach tracking
-- Safe: uses IF NOT EXISTS, ADD COLUMN IF NOT EXISTS, preserves existing data

-- =========================================================
-- 1. Add canonical identity + discovery provenance fields to school_prospects
-- =========================================================
ALTER TABLE public.school_prospects
  ADD COLUMN IF NOT EXISTS normalized_name text,
  ADD COLUMN IF NOT EXISTS discovery_source text DEFAULT 'MANUAL_IMPORT',
  ADD COLUMN IF NOT EXISTS source_identifier text;

-- =========================================================
-- 2. Add outreach tracking fields to school_prospects
-- =========================================================
ALTER TABLE public.school_prospects
  ADD COLUMN IF NOT EXISTS outreach_status text DEFAULT 'NEW'
    CHECK (outreach_status IN (
      'NEW','READY_FOR_OUTREACH','CONTACTED','FOLLOW_UP_DUE',
      'REPLIED','INTERESTED','MEETING_SCHEDULED','NOT_INTERESTED','PARTNERED'
    )),
  ADD COLUMN IF NOT EXISTS last_contacted_at timestamptz,
  ADD COLUMN IF NOT EXISTS next_followup_at timestamptz,
  ADD COLUMN IF NOT EXISTS outreach_channel text,
  ADD COLUMN IF NOT EXISTS outreach_notes text;

-- =========================================================
-- 3. Backfill normalized_name for any existing records
-- =========================================================
UPDATE public.school_prospects
SET normalized_name = lower(regexp_replace(name, '[^a-zA-Z0-9]', '', 'g'))
WHERE normalized_name IS NULL;

-- =========================================================
-- 4. Add indexes for new fields
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_prospects_outreach_status
  ON public.school_prospects(outreach_status);

CREATE INDEX IF NOT EXISTS idx_prospects_followup
  ON public.school_prospects(next_followup_at)
  WHERE next_followup_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_prospects_normalized_name
  ON public.school_prospects(normalized_name, city, state);

CREATE INDEX IF NOT EXISTS idx_prospects_discovery_source
  ON public.school_prospects(discovery_source);

-- =========================================================
-- 5. Create school_discovery_runs table
-- =========================================================
CREATE TABLE IF NOT EXISTS public.school_discovery_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_type text NOT NULL CHECK (scope_type IN ('ALL_INDIA', 'SELECTED_STATES', 'SELECTED_DISTRICTS')),
  selected_states text[] DEFAULT '{}',
  selected_districts text[] DEFAULT '{}',
  target_count integer NOT NULL DEFAULT 1000,
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING','RUNNING','PAUSED','COMPLETED','PARTIAL','FAILED','CANCELLED')),
  -- Progress tracking
  geographies_planned integer DEFAULT 0,
  geographies_completed integer DEFAULT 0,
  queries_planned integer DEFAULT 0,
  queries_completed integer DEFAULT 0,
  queries_failed integer DEFAULT 0,
  raw_candidates_found integer DEFAULT 0,
  unique_candidates_found integer DEFAULT 0,
  duplicates_removed integer DEFAULT 0,
  candidates_persisted integer DEFAULT 0,
  -- Metadata
  error_summary text,
  started_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz
);

-- =========================================================
-- 6. RLS for school_discovery_runs
-- =========================================================
ALTER TABLE public.school_discovery_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin access to discovery runs" ON public.school_discovery_runs;
CREATE POLICY "Admin access to discovery runs" ON public.school_discovery_runs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.phone_number = auth.jwt()->>'phone'
         OR admin_users.email = auth.jwt()->>'email'
    )
  );

-- =========================================================
-- 7. Index for discovery runs
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_discovery_runs_status
  ON public.school_discovery_runs(status);

CREATE INDEX IF NOT EXISTS idx_discovery_runs_started
  ON public.school_discovery_runs(started_at DESC);
