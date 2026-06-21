-- Migration to track Courage Points and Referrals

-- 1. Add new columns to registrations table
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS total_referrals int DEFAULT 0 NOT NULL;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS courage_points int DEFAULT 0 NOT NULL;

-- 2. Create the function to calculate points based on referral count
CREATE OR REPLACE FUNCTION public.calculate_courage_points(ref_count int)
RETURNS int AS $$
DECLARE
    points int := 0;
    i int;
BEGIN
    FOR i IN 1..ref_count LOOP
        IF i = 1 THEN points := points + 500;
        ELSIF i = 2 THEN points := points + 700;
        ELSIF i = 3 THEN points := points + 1000;
        ELSIF i = 4 THEN points := points + 1500;
        ELSIF i = 5 THEN points := points + 2000;
        ELSE points := points + 2500;
        END IF;
    END LOOP;
    RETURN points;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. Create the trigger function that updates the referrer
CREATE OR REPLACE FUNCTION public.handle_new_referral()
RETURNS trigger AS $$
DECLARE
    current_refs int;
    v_is_paid_now boolean;
BEGIN
    -- Check if registration is paid or sponsored now
    IF TG_OP = 'INSERT' THEN
        v_is_paid_now := (NEW.payment_status = 'PAID' OR NEW.payment_status = 'SPONSORED');
    ELSIF TG_OP = 'UPDATE' THEN
        v_is_paid_now := (
            (OLD.payment_status IS NULL OR (OLD.payment_status != 'PAID' AND OLD.payment_status != 'SPONSORED'))
            AND (NEW.payment_status = 'PAID' OR NEW.payment_status = 'SPONSORED')
        );
    ELSE
        v_is_paid_now := false;
    END IF;

    IF v_is_paid_now AND NEW.referral_code IS NOT NULL THEN
        -- Check if the referral code belongs to a valid registration
        SELECT total_referrals INTO current_refs
        FROM public.registrations
        WHERE registration_id = NEW.referral_code;

        IF FOUND THEN
            -- Increment referral count and update courage points
            UPDATE public.registrations
            SET 
                total_referrals = total_referrals + 1,
                courage_points = public.calculate_courage_points(total_referrals + 1)
            WHERE registration_id = NEW.referral_code;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create the triggers on the registrations table
DROP TRIGGER IF EXISTS trigger_new_registration_referral ON public.registrations;

DROP TRIGGER IF EXISTS trigger_new_registration_referral_insert ON public.registrations;
CREATE TRIGGER trigger_new_registration_referral_insert
AFTER INSERT ON public.registrations
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_referral();

DROP TRIGGER IF EXISTS trigger_new_registration_referral_update ON public.registrations;
CREATE TRIGGER trigger_new_registration_referral_update
AFTER UPDATE ON public.registrations
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_referral();
