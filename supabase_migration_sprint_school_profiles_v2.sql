-- Migration: CNTS School Public Profiles Version 2
-- Adds logo_url and website fields for official school identity & verification.

ALTER TABLE public.schools
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS website text;
