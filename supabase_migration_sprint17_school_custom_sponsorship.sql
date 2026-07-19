-- Add permanent columns for custom partial sponsorships
ALTER TABLE public.schools
  ADD COLUMN IF NOT EXISTS student_discount_percent integer NOT NULL DEFAULT 20,
  ADD COLUMN IF NOT EXISTS school_rebate_percent integer NOT NULL DEFAULT 10;

-- Add constraints to ensure valid percentage ranges (0% to 100%)
ALTER TABLE public.schools
  DROP CONSTRAINT IF EXISTS check_student_discount_percent,
  ADD CONSTRAINT check_student_discount_percent CHECK (student_discount_percent >= 0 AND student_discount_percent <= 100);

ALTER TABLE public.schools
  DROP CONSTRAINT IF EXISTS check_school_rebate_percent,
  ADD CONSTRAINT check_school_rebate_percent CHECK (school_rebate_percent >= 0 AND school_rebate_percent <= 100);
