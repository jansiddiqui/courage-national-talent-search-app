-- =============================================================================
-- Migration Addendum: Sprint 13 Remediation Additions
-- File: supabase_migration_sprint13_admin_remediation_additions.sql
-- =============================================================================

-- 1. Alter approval_requests to add execution telemetry columns
ALTER TABLE public.approval_requests ADD COLUMN IF NOT EXISTS execution_started_at timestamptz;
ALTER TABLE public.approval_requests ADD COLUMN IF NOT EXISTS executed_at timestamptz;
ALTER TABLE public.approval_requests ADD COLUMN IF NOT EXISTS execution_receipt text;
ALTER TABLE public.approval_requests ADD COLUMN IF NOT EXISTS execution_error text;
ALTER TABLE public.approval_requests ADD COLUMN IF NOT EXISTS execution_worker_id uuid;

-- 2. Add Unique constraint on execution_receipt
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'approval_requests_execution_receipt_uk'
  ) THEN
    ALTER TABLE public.approval_requests ADD CONSTRAINT approval_requests_execution_receipt_uk UNIQUE (execution_receipt);
  END IF;
END
$$;

-- 3. Modify check_approval_status constraint
ALTER TABLE public.approval_requests DROP CONSTRAINT IF EXISTS check_approval_status;
ALTER TABLE public.approval_requests ADD CONSTRAINT check_approval_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'EXECUTING', 'EXECUTED', 'EXECUTION_FAILED'));

-- 4. Create claim_approval_for_execution RPC function
CREATE OR REPLACE FUNCTION public.claim_approval_for_execution(p_approval_id uuid, p_worker_id uuid)
RETURNS SETOF public.approval_requests LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  RETURN QUERY
  UPDATE public.approval_requests
  SET
    status = 'EXECUTING',
    execution_started_at = now(),
    execution_worker_id = p_worker_id
  WHERE id = p_approval_id
    AND status = 'APPROVED'
  RETURNING *;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.claim_approval_for_execution(uuid, uuid) FROM PUBLIC, anon, authenticated;

-- 5. Add status column to assessments table
ALTER TABLE public.assessments ADD COLUMN IF NOT EXISTS status text DEFAULT 'DRAFT' NOT NULL;

-- 6. Add check_assessment_status constraint to assessments table
ALTER TABLE public.assessments DROP CONSTRAINT IF EXISTS check_assessment_status;
ALTER TABLE public.assessments ADD CONSTRAINT check_assessment_status CHECK (status IN ('DRAFT', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'LIVE', 'RESULTS_PROCESSING', 'RESULTS_PUBLISHED', 'ARCHIVED'));

-- 7. Create trigger function to sync is_published
CREATE OR REPLACE FUNCTION public.sync_exam_is_published_func()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  -- is_published is true for RESULTS_PROCESSING, RESULTS_PUBLISHED, ARCHIVED, and LIVE.
  IF NEW.status IN ('LIVE', 'RESULTS_PROCESSING', 'RESULTS_PUBLISHED', 'ARCHIVED') THEN
    NEW.is_published := true;
  END IF;
  RETURN NEW;
END;
$$;

-- 8. Create trigger for syncing exam is_published
DROP TRIGGER IF EXISTS trigger_sync_exam_is_published ON public.assessments;
CREATE TRIGGER trigger_sync_exam_is_published
  BEFORE INSERT OR UPDATE OF status, is_published ON public.assessments
  FOR EACH ROW EXECUTE FUNCTION public.sync_exam_is_published_func();
