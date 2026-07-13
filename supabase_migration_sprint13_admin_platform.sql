-- =============================================================================
-- Migration: Sprint 13 — CNTS Enterprise Admin Platform V2.0
-- File: supabase_migration_sprint13_admin_platform.sql
-- =============================================================================
-- PREFLIGHT RESULTS (verified 2026-07-13):
--   admin_users ...................... EXISTS ✓
--   admin_question_bank .............. EXISTS ✓
--   questions ........................ EXISTS ✓
--   assessments ...................... EXISTS ✓
--   admin_background_jobs ............ EXISTS ✓
--   school_background_jobs ........... EXISTS ✓
--   admin_operations_audit_trail ..... EXISTS ✓
--   admin_question_versions .......... MISSING (will be created) ✓
--   admin_permissions ................ MISSING (will be created) ✓
--   admin_roles ...................... MISSING (will be created) ✓
--   approval_requests ................ MISSING (will be created) ✓
-- =============================================================================

-- PHASE 0: Enum migration (run standalone if PG < 12 disallows in transaction)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_run_status' AND typnamespace = 'public'::regnamespace) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum
      WHERE enumtypid = 'public.job_run_status'::regtype
        AND enumlabel = 'RETRY_PENDING'
    ) THEN
      ALTER TYPE public.job_run_status ADD VALUE 'RETRY_PENDING';
    END IF;
  END IF;
END
$$;

-- PHASE 1: Create RBAC tables
CREATE TABLE IF NOT EXISTS public.admin_permissions (
  key         text NOT NULL,
  description text NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT admin_permissions_pkey PRIMARY KEY (key)
);

CREATE TABLE IF NOT EXISTS public.admin_roles (
  id          uuid DEFAULT gen_random_uuid() NOT NULL,
  name        text NOT NULL,
  description text,
  created_at  timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT admin_roles_pkey PRIMARY KEY (id),
  CONSTRAINT admin_roles_name_uk UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS public.admin_role_permissions (
  role_id        uuid NOT NULL REFERENCES public.admin_roles(id)       ON DELETE CASCADE,
  permission_key text NOT NULL REFERENCES public.admin_permissions(key) ON DELETE CASCADE,
  CONSTRAINT admin_role_permissions_pkey PRIMARY KEY (role_id, permission_key)
);

CREATE TABLE IF NOT EXISTS public.admin_user_roles (
  admin_id uuid NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  role_id  uuid NOT NULL REFERENCES public.admin_roles(id) ON DELETE CASCADE,
  CONSTRAINT admin_user_roles_pkey PRIMARY KEY (admin_id, role_id)
);

-- Maker-checker staging table
CREATE TABLE IF NOT EXISTS public.approval_requests (
  id                   uuid    DEFAULT gen_random_uuid() NOT NULL,
  requester_id         uuid    NOT NULL REFERENCES public.admin_users(id),
  action_type          text    NOT NULL,
  target_resource_type text    NOT NULL,
  target_resource_id   text    NOT NULL,
  payload              jsonb   NOT NULL,
  reason               text    NOT NULL,
  required_permission  text    NOT NULL,
  status               text    NOT NULL DEFAULT 'PENDING',
  correlation_id       uuid    NOT NULL DEFAULT gen_random_uuid(),
  idempotency_key      text    NOT NULL,
  expires_at           timestamptz NOT NULL,
  reviewed_by          uuid    REFERENCES public.admin_users(id),
  reviewed_at          timestamptz,
  rejection_reason     text,
  created_at           timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT approval_requests_pkey    PRIMARY KEY (id),
  CONSTRAINT approval_requests_idem_uk UNIQUE (idempotency_key),
  CONSTRAINT check_maker_not_checker   CHECK (requester_id <> reviewed_by),
  CONSTRAINT check_approval_status     CHECK (status IN ('PENDING','APPROVED','REJECTED','EXPIRED'))
);

-- Question version archive (immutable)
CREATE TABLE IF NOT EXISTS public.admin_question_versions (
  id                   uuid DEFAULT gen_random_uuid() NOT NULL,
  question_id          uuid NOT NULL REFERENCES public.admin_question_bank(id) ON DELETE CASCADE,
  version              integer NOT NULL,
  question_text        text    NOT NULL,
  options              jsonb   NOT NULL,
  explanation          text,
  difficulty_index     numeric(3,2) NOT NULL,
  bloom_taxonomy       text    NOT NULL,
  subject              text    NOT NULL,
  chapter              text    NOT NULL,
  topic                text    NOT NULL,
  subtopic             text,
  estimated_solve_time integer NOT NULL,
  marks                numeric(4,2) NOT NULL,
  negative_marks       numeric(4,2) NOT NULL,
  created_at           timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT admin_question_versions_pkey PRIMARY KEY (id),
  CONSTRAINT unique_question_version      UNIQUE (question_id, version)
);

-- PHASE 2: Extend existing tables
ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS status                     text DEFAULT 'APPROVED' NOT NULL,
  ADD COLUMN IF NOT EXISTS version                    integer DEFAULT 1 NOT NULL,
  ADD COLUMN IF NOT EXISTS source_question_version_id uuid
    REFERENCES public.admin_question_versions(id) ON DELETE SET NULL;

ALTER TABLE public.admin_background_jobs
  ADD COLUMN IF NOT EXISTS idempotency_key           text,
  ADD COLUMN IF NOT EXISTS next_retry_at             timestamptz,
  ADD COLUMN IF NOT EXISTS locked_at                 timestamptz,
  ADD COLUMN IF NOT EXISTS locked_by                 uuid,
  ADD COLUMN IF NOT EXISTS progress_current          integer DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS progress_total            integer DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS cancellation_requested_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at                timestamptz DEFAULT now() NOT NULL;

DO $$
DECLARE
  v_has_unique boolean;
  v_dup_count  integer;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM pg_index i
    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
    WHERE i.indrelid = 'public.admin_background_jobs'::regclass
      AND i.indisunique = true
      AND a.attname = 'idempotency_key'
  ) INTO v_has_unique;

  IF v_has_unique THEN
    RAISE NOTICE 'Unique constraint on admin_background_jobs.idempotency_key already exists — preserving';
  ELSE
    SELECT COUNT(*) INTO v_dup_count
    FROM (
      SELECT idempotency_key
      FROM public.admin_background_jobs
      WHERE idempotency_key IS NOT NULL
      GROUP BY idempotency_key
      HAVING COUNT(*) > 1
    ) dup;

    IF v_dup_count > 0 THEN
      RAISE EXCEPTION 'MIGRATION BLOCKED: % duplicate idempotency_key values in admin_background_jobs', v_dup_count;
    END IF;

    ALTER TABLE public.admin_background_jobs
      ADD CONSTRAINT unique_admin_job_idempotency UNIQUE (idempotency_key);
  END IF;
END
$$;

ALTER TABLE public.admin_operations_audit_trail
  ADD COLUMN IF NOT EXISTS reason         text,
  ADD COLUMN IF NOT EXISTS correlation_id uuid,
  ADD COLUMN IF NOT EXISTS request_id     text,
  ADD COLUMN IF NOT EXISTS user_agent     text;

-- PHASE 3: RLS and grants
ALTER TABLE public.admin_permissions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_role_permissions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_user_roles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_question_versions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.admin_permissions       FROM anon, authenticated;
REVOKE ALL ON TABLE public.admin_roles             FROM anon, authenticated;
REVOKE ALL ON TABLE public.admin_role_permissions  FROM anon, authenticated;
REVOKE ALL ON TABLE public.admin_user_roles        FROM anon, authenticated;
REVOKE ALL ON TABLE public.approval_requests       FROM anon, authenticated;
REVOKE ALL ON TABLE public.admin_question_versions FROM anon, authenticated;

-- PHASE 4: Audit immutability
CREATE OR REPLACE FUNCTION public.prevent_audit_modification()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  RAISE EXCEPTION 'Audit trail is immutable. UPDATE and DELETE are forbidden.';
END;
$$;
REVOKE EXECUTE ON FUNCTION public.prevent_audit_modification() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trigger_immutable_audit ON public.admin_operations_audit_trail;
CREATE TRIGGER trigger_immutable_audit
  BEFORE UPDATE OR DELETE ON public.admin_operations_audit_trail
  FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_modification();

-- PHASE 5a: Question version increment (BEFORE UPDATE)
CREATE OR REPLACE FUNCTION public.check_question_content_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  IF (
    NEW.question_text        IS DISTINCT FROM OLD.question_text        OR
    NEW.options              IS DISTINCT FROM OLD.options              OR
    NEW.explanation          IS DISTINCT FROM OLD.explanation          OR
    NEW.difficulty_index     IS DISTINCT FROM OLD.difficulty_index     OR
    NEW.bloom_taxonomy       IS DISTINCT FROM OLD.bloom_taxonomy       OR
    NEW.subject              IS DISTINCT FROM OLD.subject              OR
    NEW.chapter              IS DISTINCT FROM OLD.chapter              OR
    NEW.topic                IS DISTINCT FROM OLD.topic                OR
    NEW.subtopic             IS DISTINCT FROM OLD.subtopic             OR
    NEW.estimated_solve_time IS DISTINCT FROM OLD.estimated_solve_time OR
    NEW.marks                IS DISTINCT FROM OLD.marks                OR
    NEW.negative_marks       IS DISTINCT FROM OLD.negative_marks
  ) THEN
    NEW.version := OLD.version + 1;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.check_question_content_change() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trigger_check_question_content ON public.admin_question_bank;
CREATE TRIGGER trigger_check_question_content
  BEFORE UPDATE ON public.admin_question_bank
  FOR EACH ROW EXECUTE FUNCTION public.check_question_content_change();

-- PHASE 5b: Question version snapshot (AFTER INSERT OR UPDATE)
CREATE OR REPLACE FUNCTION public.sync_admin_question_version()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  IF (TG_OP = 'INSERT' OR OLD.version IS DISTINCT FROM NEW.version) THEN
    INSERT INTO public.admin_question_versions (
      question_id, version, question_text, options, explanation,
      difficulty_index, bloom_taxonomy, subject, chapter, topic, subtopic,
      estimated_solve_time, marks, negative_marks
    ) VALUES (
      NEW.id, NEW.version, NEW.question_text, NEW.options, NEW.explanation,
      NEW.difficulty_index, NEW.bloom_taxonomy, NEW.subject, NEW.chapter,
      NEW.topic, NEW.subtopic, NEW.estimated_solve_time, NEW.marks, NEW.negative_marks
    );
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.sync_admin_question_version() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trigger_sync_question_version ON public.admin_question_bank;
CREATE TRIGGER trigger_sync_question_version
  AFTER INSERT OR UPDATE ON public.admin_question_bank
  FOR EACH ROW EXECUTE FUNCTION public.sync_admin_question_version();

-- PHASE 6: Job queue RPCs
CREATE OR REPLACE FUNCTION public.claim_next_admin_job(p_worker_id uuid, p_lease_seconds integer)
RETURNS SETOF public.admin_background_jobs LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE v_job_id uuid;
BEGIN
  SELECT id INTO v_job_id
  FROM public.admin_background_jobs
  WHERE status IN ('PENDING', 'RETRY_PENDING')
    AND (next_retry_at IS NULL OR next_retry_at <= now())
    AND (locked_at IS NULL OR locked_at <= now() - (interval '1 second' * p_lease_seconds))
  ORDER BY created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF v_job_id IS NOT NULL THEN
    RETURN QUERY
    UPDATE public.admin_background_jobs
    SET status = 'PROCESSING', locked_at = now(), locked_by = p_worker_id, updated_at = now()
    WHERE id = v_job_id
    RETURNING *;
  END IF;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.claim_next_admin_job(uuid, integer) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.recover_stale_admin_jobs(p_lease_seconds integer)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE v_recovered integer;
BEGIN
  UPDATE public.admin_background_jobs
  SET status = 'RETRY_PENDING', locked_at = NULL, locked_by = NULL, updated_at = now()
  WHERE status = 'PROCESSING'
    AND locked_at <= now() - (interval '1 second' * p_lease_seconds)
    AND attempts < max_attempts;
  GET DIAGNOSTICS v_recovered = ROW_COUNT;

  UPDATE public.admin_background_jobs
  SET status = 'FAILED', updated_at = now()
  WHERE status = 'PROCESSING'
    AND locked_at <= now() - (interval '1 second' * p_lease_seconds)
    AND attempts >= max_attempts;
  RETURN v_recovered;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.recover_stale_admin_jobs(integer) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.check_admin_permission(p_admin_id uuid, p_permission text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.admin_user_roles ur
    JOIN public.admin_role_permissions rp ON ur.role_id = rp.role_id
    WHERE ur.admin_id = p_admin_id AND rp.permission_key = p_permission
  );
END;
$$;
REVOKE EXECUTE ON FUNCTION public.check_admin_permission(uuid, text) FROM PUBLIC, anon, authenticated;

-- PHASE 7: Legacy question backfill
INSERT INTO public.admin_question_versions (
  question_id, version, question_text, options, explanation,
  difficulty_index, bloom_taxonomy, subject, chapter, topic, subtopic,
  estimated_solve_time, marks, negative_marks
)
SELECT
  id, version, question_text, options, explanation,
  difficulty_index, bloom_taxonomy, subject, chapter, topic, subtopic,
  estimated_solve_time, marks, negative_marks
FROM public.admin_question_bank
ON CONFLICT (question_id, version) DO NOTHING;

-- PHASE 8: Seed RBAC
INSERT INTO public.admin_permissions (key, description) VALUES
  ('assessment.update',   'Update exam content'),
  ('assessment.approve',  'Approve exam for scheduling'),
  ('assessment.schedule', 'Schedule a published exam'),
  ('assessment.publish',  'Publish an approved exam'),
  ('assessment.archive',  'Archive a completed exam'),
  ('result.compile',      'Start result compilation'),
  ('result.release',      'Release compiled results'),
  ('question.approve',    'Approve questions in review'),
  ('refund.large',        'Authorise large refunds'),
  ('quota.adjust',        'Adjust school quota allocations'),
  ('rbac.manage',         'Manage roles and permissions')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.admin_roles (name, description) VALUES
  ('SUPER_ADMIN',     'Full platform access'),
  ('EXAM_MANAGER',    'Manages assessment lifecycle'),
  ('RESULT_MANAGER',  'Manages result compilation and release'),
  ('SUPPORT_AGENT',   'Handles support tickets'),
  ('FINANCE_MANAGER', 'Authorises refunds and financial actions')
ON CONFLICT (name) DO NOTHING;
