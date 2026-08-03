-- Migration: Courage Partner Referral Infrastructure, Dynamic Rates & Supabase Storage Buckets
-- File: supabase_migration_sprint18_courage_partner.sql

-- 1. Create base courage_partners table if missing
CREATE TABLE IF NOT EXISTS public.courage_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  partner_code text NOT NULL UNIQUE,
  custom_slug text NOT NULL UNIQUE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Safely add missing columns to courage_partners (Handles pre-existing table)
ALTER TABLE public.courage_partners
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS profile_image_url text DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  ADD COLUMN IF NOT EXISTS organization text,
  ADD COLUMN IF NOT EXISTS primary_role text DEFAULT 'School Coordinator & Teacher',
  ADD COLUMN IF NOT EXISTS target_communities text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS platforms text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS audience_scale text DEFAULT '1k - 10k',
  ADD COLUMN IF NOT EXISTS assigned_tier_level integer DEFAULT 2,
  ADD COLUMN IF NOT EXISTS revenue_share_percent numeric(5,2) DEFAULT 15.00,
  ADD COLUMN IF NOT EXISTS per_student_amount numeric(10,2) DEFAULT 15.00,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS partner_level text DEFAULT 'Founding Partner',
  ADD COLUMN IF NOT EXISTS is_founding_partner boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS founding_slot_number integer DEFAULT 384,
  ADD COLUMN IF NOT EXISTS reputation_score numeric(4,1) DEFAULT 98.0,
  ADD COLUMN IF NOT EXISTS communication_rating numeric(3,1) DEFAULT 5.0,
  ADD COLUMN IF NOT EXISTS authenticity_rating numeric(3,1) DEFAULT 5.0,
  ADD COLUMN IF NOT EXISTS mission_completion_rating numeric(3,1) DEFAULT 4.9,
  ADD COLUMN IF NOT EXISTS community_rating numeric(3,1) DEFAULT 4.8,
  ADD COLUMN IF NOT EXISTS students_mobilized_count integer DEFAULT 1240,
  ADD COLUMN IF NOT EXISTS schools_connected_count integer DEFAULT 14,
  ADD COLUMN IF NOT EXISTS communities_reached_count integer DEFAULT 18450,
  ADD COLUMN IF NOT EXISTS available_balance numeric(10,2) DEFAULT 42500.00,
  ADD COLUMN IF NOT EXISTS pending_balance numeric(10,2) DEFAULT 12000.00,
  ADD COLUMN IF NOT EXISTS lifetime_earned numeric(10,2) DEFAULT 184500.00,
  ADD COLUMN IF NOT EXISTS upi_id text DEFAULT 'rahul@okicici',
  ADD COLUMN IF NOT EXISTS pan_number text DEFAULT 'ABCDE1234F',
  ADD COLUMN IF NOT EXISTS tds_status text DEFAULT 'verified',
  ADD COLUMN IF NOT EXISTS bio text DEFAULT 'Dedicated to expanding 100% merit scholarship awareness across secondary schools.',
  ADD COLUMN IF NOT EXISTS location text DEFAULT 'Lucknow, Uttar Pradesh',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 3. Create partner_referral_conversions table
CREATE TABLE IF NOT EXISTS public.partner_referral_conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.courage_partners(id) ON DELETE CASCADE,
  referral_code text NOT NULL,
  student_name text NOT NULL,
  student_grade text NOT NULL,
  school_name text,
  verification_status text NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  credited_honorarium numeric(10,2) DEFAULT 15.00,
  registered_at timestamptz DEFAULT now() NOT NULL
);

-- 4. Create partner_child_registrations table (Dual-Role Child Waiver)
CREATE TABLE IF NOT EXISTS public.partner_child_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.courage_partners(id) ON DELETE CASCADE,
  child_name text NOT NULL,
  class_grade text NOT NULL,
  school_name text NOT NULL,
  city text NOT NULL,
  candidate_id text NOT NULL UNIQUE,
  waiver_status text NOT NULL DEFAULT '100% Partner Fee Waived',
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 5. Create partner_missions table
CREATE TABLE IF NOT EXISTS public.partner_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL CHECK (category IN ('CNTS', 'Teacher', 'Scholarship', 'Career', 'NGO')),
  mission_text text NOT NULL,
  target_audience text NOT NULL,
  duration_text text NOT NULL,
  reward_text text NOT NULL,
  badge_unlocked text NOT NULL,
  students_targeted integer DEFAULT 100,
  students_achieved integer DEFAULT 0,
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Featured', 'Upcoming', 'Archived')),
  sample_copy text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 6. Create partner_payouts table
CREATE TABLE IF NOT EXISTS public.partner_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_code text NOT NULL UNIQUE,
  partner_id uuid NOT NULL REFERENCES public.courage_partners(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  payout_method text NOT NULL DEFAULT 'UPI' CHECK (payout_method IN ('UPI', 'Bank Transfer')),
  destination_account text NOT NULL,
  status text NOT NULL DEFAULT 'Settled' CHECK (status IN ('Requested', 'Processing', 'Settled', 'Failed')),
  invoice_ref text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 7. SUPABASE STORAGE BUCKET FOR PARTNER PROFILE PHOTOS & PROOF SCREENSHOTS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('partner-avatars', 'partner-avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('partner-proofs', 'partner-proofs', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Policies for Avatars & Channel Proof Screenshots
DROP POLICY IF EXISTS "Public read access for partner avatars" ON storage.objects;
CREATE POLICY "Public read access for partner avatars" ON storage.objects
  FOR SELECT USING (bucket_id IN ('partner-avatars', 'partner-proofs'));

DROP POLICY IF EXISTS "Partner upload access for avatars" ON storage.objects;
CREATE POLICY "Partner upload access for avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('partner-avatars', 'partner-proofs'));

-- 8. Indexes (Safely created)
CREATE INDEX IF NOT EXISTS idx_courage_partners_referral ON public.courage_partners(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_conversions_partner ON public.partner_referral_conversions(partner_id, registered_at DESC);
CREATE INDEX IF NOT EXISTS idx_child_registrations_partner ON public.partner_child_registrations(partner_id);

-- 9. Enable RLS
ALTER TABLE public.courage_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_referral_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_child_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_payouts ENABLE ROW LEVEL SECURITY;

-- 10. Public & Authenticated RLS Policies
DROP POLICY IF EXISTS "Public read access to partner profile by slug" ON public.courage_partners;
CREATE POLICY "Public read access to partner profile by slug" ON public.courage_partners
  FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Partner access to own record" ON public.courage_partners;
CREATE POLICY "Partner access to own record" ON public.courage_partners
  FOR ALL USING (auth.uid() = user_id OR email = auth.jwt()->>'email');
