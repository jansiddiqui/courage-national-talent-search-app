-- Migration: CNTS School Public Profiles Version 1
-- Adds public profile fields and guarantees unique slug backfill without collisions.

-- 1. Add new columns to public.schools if they do not exist
ALTER TABLE public.schools
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS profile_status text NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN IF NOT EXISTS is_founding_school boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS public_description text;

-- Add check constraint for profile_status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_school_profile_status'
  ) THEN
    ALTER TABLE public.schools 
      ADD CONSTRAINT check_school_profile_status 
      CHECK (profile_status IN ('DRAFT', 'VERIFIED', 'PUBLISHED', 'ARCHIVED'));
  END IF;
END $$;

-- 2. Robust PL/pgSQL loop to backfill unique slugs for existing schools without collision errors
DO $$
DECLARE
  r RECORD;
  v_base_slug text;
  v_candidate_slug text;
  v_counter integer;
  v_exists boolean;
BEGIN
  FOR r IN SELECT id, name, city, state FROM public.schools WHERE slug IS NULL OR trim(slug) = '' LOOP
    -- Compute base slug from name, city, state
    v_base_slug := lower(
      regexp_replace(
        regexp_replace(
          coalesce(r.name, 'school') || '-' || coalesce(r.city, 'city') || '-' || coalesce(r.state, 'india'),
          '[^a-zA-Z0-9\s-]', '', 'g'
        ),
        '\s+', '-', 'g'
      )
    );
    -- Strip duplicate or trailing hyphens
    v_base_slug := regexp_replace(v_base_slug, '-+', '-', 'g');
    v_base_slug := trim(both '-' from v_base_slug);
    
    IF v_base_slug = '' OR v_base_slug IS NULL THEN
      v_base_slug := 'school-' || substring(r.id::text, 1, 8);
    END IF;

    v_candidate_slug := v_base_slug;
    v_counter := 1;

    -- Ensure uniqueness by appending integer suffix if collision occurs
    LOOP
      SELECT EXISTS (
        SELECT 1 FROM public.schools WHERE slug = v_candidate_slug AND id <> r.id
      ) INTO v_exists;

      IF NOT v_exists THEN
        EXIT;
      END IF;

      v_counter := v_counter + 1;
      v_candidate_slug := v_base_slug || '-' || v_counter;
    END LOOP;

    -- Update row with non-colliding slug
    UPDATE public.schools
    SET slug = v_candidate_slug
    WHERE id = r.id;
  END LOOP;
END $$;

-- 3. Create unique index for slug lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_schools_slug_unique ON public.schools(slug) WHERE (slug IS NOT NULL AND slug <> '');
CREATE INDEX IF NOT EXISTS idx_schools_profile_status ON public.schools(profile_status);
