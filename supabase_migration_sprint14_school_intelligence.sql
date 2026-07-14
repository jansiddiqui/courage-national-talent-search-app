-- Migration: CNTS School Intelligence Engine
-- Creates school_prospects and school_prospect_claims_evidence tables

-- 1. Create school_prospects table
CREATE TABLE IF NOT EXISTS public.school_prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  alternative_name text,
  city text NOT NULL,
  district text NOT NULL,
  state text NOT NULL,
  board text DEFAULT 'CBSE',
  affiliation_number text UNIQUE,
  school_type text,
  website text,
  enrichment_status text DEFAULT 'PENDING' NOT NULL CHECK (enrichment_status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'PARTIAL', 'FAILED', 'RETRY_PENDING')),
  identity_status text DEFAULT 'DISTINCT' NOT NULL CHECK (identity_status IN ('DISTINCT', 'POSSIBLE_DUPLICATE', 'CONFIRMED_DUPLICATE', 'CONFLICTING_IDENTITY')),
  duplicate_of uuid REFERENCES public.school_prospects(id) ON DELETE SET NULL,
  outreach_score integer DEFAULT 0,
  confidence_score integer DEFAULT 0,
  scoring_breakdown jsonb DEFAULT '{}'::jsonb,
  outreach_templates jsonb DEFAULT '{}'::jsonb,
  error_logs text,
  last_enriched_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Create school_prospect_claims_evidence table for field-level provenance
CREATE TABLE IF NOT EXISTS public.school_prospect_claims_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid NOT NULL REFERENCES public.school_prospects(id) ON DELETE CASCADE,
  claim_key text NOT NULL,
  extracted_value text,
  source_url text NOT NULL,
  source_title text,
  evidence_text text NOT NULL,
  evidence_status text NOT NULL CHECK (evidence_status IN ('VERIFIED', 'INFERRED', 'UNKNOWN', 'CONFLICTING')),
  confidence integer DEFAULT 0 NOT NULL,
  extracted_at timestamptz DEFAULT now() NOT NULL
);

-- 3. Add Indexes
CREATE INDEX IF NOT EXISTS idx_prospects_status ON public.school_prospects(enrichment_status);
CREATE INDEX IF NOT EXISTS idx_prospects_score ON public.school_prospects(outreach_score DESC);
CREATE INDEX IF NOT EXISTS idx_prospect_evidence_key ON public.school_prospect_claims_evidence(prospect_id, claim_key);

-- 4. Enable RLS
ALTER TABLE public.school_prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_prospect_claims_evidence ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Admin access to prospects" ON public.school_prospects;
CREATE POLICY "Admin access to prospects" ON public.school_prospects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.phone_number = auth.jwt()->>'phone'
         OR admin_users.email = auth.jwt()->>'email'
    )
  );

DROP POLICY IF EXISTS "Admin access to prospect claims" ON public.school_prospect_claims_evidence;
CREATE POLICY "Admin access to prospect claims" ON public.school_prospect_claims_evidence FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.phone_number = auth.jwt()->>'phone'
         OR admin_users.email = auth.jwt()->>'email'
    )
  );
