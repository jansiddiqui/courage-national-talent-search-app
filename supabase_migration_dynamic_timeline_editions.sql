-- ============================================================================
-- CNTS Dynamic Annual Event Timeline Architecture Migration
-- ============================================================================

-- 1. Create CNTS Editions Table
CREATE TABLE IF NOT EXISTS public.cnts_editions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    edition_year INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    theme TEXT DEFAULT 'Founding Edition',
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'REVIEW', 'PUBLISHED', 'LOCKED', 'COMPLETED', 'ARCHIVED')),
    is_current BOOLEAN NOT NULL DEFAULT false,
    registration_status TEXT NOT NULL DEFAULT 'OPEN' CHECK (registration_status IN ('UPCOMING', 'OPEN', 'CLOSING_SOON', 'CLOSED')),
    exam_status TEXT NOT NULL DEFAULT 'SCHEDULED' CHECK (exam_status IN ('SCHEDULED', 'LOGIN_OPEN', 'IN_PROGRESS', 'COMPLETED')),
    results_status TEXT NOT NULL DEFAULT 'SCHEDULED' CHECK (results_status IN ('SCHEDULED', 'READY', 'RELEASED', 'LOCKED')),
    certificates_status TEXT NOT NULL DEFAULT 'SCHEDULED' CHECK (certificates_status IN ('SCHEDULED', 'READY', 'AVAILABLE', 'LOCKED')),
    awards_status TEXT NOT NULL DEFAULT 'SCHEDULED' CHECK (awards_status IN ('SCHEDULED', 'READY', 'RELEASED', 'COMPLETED')),
    admit_card_status TEXT NOT NULL DEFAULT 'SCHEDULED' CHECK (admit_card_status IN ('SCHEDULED', 'READY', 'AVAILABLE', 'LOCKED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique index ensuring at most ONE edition can be marked as is_current = true
CREATE UNIQUE INDEX IF NOT EXISTS cnts_editions_single_current_idx 
ON public.cnts_editions (is_current) 
WHERE (is_current = true);

-- 2. Create CNTS Timeline Events Table
CREATE TABLE IF NOT EXISTS public.cnts_timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    edition_id UUID NOT NULL REFERENCES public.cnts_editions(id) ON DELETE CASCADE,
    event_key TEXT NOT NULL,
    title TEXT NOT NULL,
    short_title TEXT,
    description TEXT,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ,
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    event_type TEXT NOT NULL DEFAULT 'PUBLIC' CHECK (event_type IN ('PUBLIC', 'ADMIN_ONLY', 'MILESTONE', 'EXAM_WINDOW', 'GATING')),
    audience TEXT NOT NULL DEFAULT 'ALL' CHECK (audience IN ('STUDENT', 'PARENT', 'SCHOOL', 'PARTNER', 'ADMIN', 'ALL')),
    status TEXT NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('UPCOMING', 'ACTIVE', 'COMPLETED', 'OVERDUE', 'DISABLED', 'READY', 'RELEASED')),
    is_public BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    icon TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (edition_id, event_key)
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_cnts_timeline_edition_key ON public.cnts_timeline_events (edition_id, event_key);
CREATE INDEX IF NOT EXISTS idx_cnts_timeline_public_active ON public.cnts_timeline_events (is_public, is_active, display_order);

-- 3. Seed CNTS 2026 Edition (if not exists)
INSERT INTO public.cnts_editions (
    edition_year,
    name,
    slug,
    theme,
    status,
    is_current,
    registration_status,
    exam_status,
    results_status,
    certificates_status,
    awards_status,
    admit_card_status
) VALUES (
    2026,
    'Courage National Talent Search 2026',
    'cnts-2026',
    'Founding National Edition',
    'PUBLISHED',
    true,
    'OPEN',
    'SCHEDULED',
    'SCHEDULED',
    'SCHEDULED',
    'SCHEDULED',
    'SCHEDULED'
) ON CONFLICT (edition_year) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    status = 'PUBLISHED',
    is_current = true,
    updated_at = NOW();

-- 4. Seed Official CNTS 2026 Timeline Events
DO $$
DECLARE
    v_edition_id UUID;
BEGIN
    SELECT id INTO v_edition_id FROM public.cnts_editions WHERE edition_year = 2026;
    
    IF v_edition_id IS NOT NULL THEN
        -- 1. Registration Open
        INSERT INTO public.cnts_timeline_events (
            edition_id, event_key, title, short_title, description, start_at, end_at, timezone, event_type, audience, status, is_public, display_order, icon
        ) VALUES (
            v_edition_id,
            'REGISTRATION_OPEN',
            'Candidate Registrations Open',
            'Registrations Open',
            'Online enrollment opens for Classes 5 to 8 across India.',
            '2026-07-15T10:00:00+05:30',
            NULL,
            'Asia/Kolkata',
            'PUBLIC',
            'ALL',
            'COMPLETED',
            true,
            1,
            'UserPlus'
        ) ON CONFLICT (edition_id, event_key) DO UPDATE SET
            start_at = EXCLUDED.start_at, title = EXCLUDED.title, short_title = EXCLUDED.short_title, display_order = EXCLUDED.display_order;

        -- 2. Registration Close
        INSERT INTO public.cnts_timeline_events (
            edition_id, event_key, title, short_title, description, start_at, end_at, timezone, event_type, audience, status, is_public, display_order, icon
        ) VALUES (
            v_edition_id,
            'REGISTRATION_CLOSE',
            'Candidate Registration Deadline',
            'Registration Closes',
            'Final deadline for online candidate registration and school roster submissions.',
            '2026-09-25T23:59:59+05:30',
            NULL,
            'Asia/Kolkata',
            'PUBLIC',
            'ALL',
            'ACTIVE',
            true,
            2,
            'CalendarX'
        ) ON CONFLICT (edition_id, event_key) DO UPDATE SET
            start_at = EXCLUDED.start_at, title = EXCLUDED.title, short_title = EXCLUDED.short_title, display_order = EXCLUDED.display_order;

        -- 3. Final Reconciliation (Admin Only)
        INSERT INTO public.cnts_timeline_events (
            edition_id, event_key, title, short_title, description, start_at, end_at, timezone, event_type, audience, status, is_public, display_order, icon
        ) VALUES (
            v_edition_id,
            'FINAL_REGISTRATION_RECONCILIATION',
            'Registration & Fee Reconciliation',
            'Final Reconciliation',
            'Administrative audit of candidate payments, school quotas, and verification.',
            '2026-09-26T00:00:00+05:30',
            '2026-09-26T09:59:59+05:30',
            'Asia/Kolkata',
            'ADMIN_ONLY',
            'ADMIN',
            'UPCOMING',
            false,
            3,
            'CheckSquare'
        ) ON CONFLICT (edition_id, event_key) DO UPDATE SET
            start_at = EXCLUDED.start_at, end_at = EXCLUDED.end_at, title = EXCLUDED.title, display_order = EXCLUDED.display_order;

        -- 4. Admit Cards Release
        INSERT INTO public.cnts_timeline_events (
            edition_id, event_key, title, short_title, description, start_at, end_at, timezone, event_type, audience, status, is_public, display_order, icon
        ) VALUES (
            v_edition_id,
            'ADMIT_CARD_RELEASE',
            'Admit Card & Hall Ticket Release',
            'Admit Cards Available',
            'Digital admit cards and testing slot passes become available for download.',
            '2026-09-26T10:00:00+05:30',
            NULL,
            'Asia/Kolkata',
            'PUBLIC',
            'ALL',
            'UPCOMING',
            true,
            4,
            'FileText'
        ) ON CONFLICT (edition_id, event_key) DO UPDATE SET
            start_at = EXCLUDED.start_at, title = EXCLUDED.title, short_title = EXCLUDED.short_title, display_order = EXCLUDED.display_order;

        -- 5. Exam Candidate Login & System Check
        INSERT INTO public.cnts_timeline_events (
            edition_id, event_key, title, short_title, description, start_at, end_at, timezone, event_type, audience, status, is_public, display_order, icon
        ) VALUES (
            v_edition_id,
            'EXAM_LOGIN_OPEN',
            'Candidate Exam Login & System Check',
            'Candidate Login Opens',
            'Assessment room opens for device checks, webcam verification, and audio tests.',
            '2026-09-27T09:30:00+05:30',
            '2026-09-27T10:00:00+05:30',
            'Asia/Kolkata',
            'PUBLIC',
            'ALL',
            'UPCOMING',
            true,
            5,
            'LogIn'
        ) ON CONFLICT (edition_id, event_key) DO UPDATE SET
            start_at = EXCLUDED.start_at, end_at = EXCLUDED.end_at, title = EXCLUDED.title, display_order = EXCLUDED.display_order;

        -- 6. Exam Start
        INSERT INTO public.cnts_timeline_events (
            edition_id, event_key, title, short_title, description, start_at, end_at, timezone, event_type, audience, status, is_public, display_order, icon
        ) VALUES (
            v_edition_id,
            'EXAM_START',
            'CNTS National Online Assessment',
            'National Exam Starts',
            'Official cognitive talent search examination commences nationwide.',
            '2026-09-27T10:00:00+05:30',
            '2026-09-27T12:00:00+05:30',
            'Asia/Kolkata',
            'PUBLIC',
            'ALL',
            'UPCOMING',
            true,
            6,
            'Award'
        ) ON CONFLICT (edition_id, event_key) DO UPDATE SET
            start_at = EXCLUDED.start_at, end_at = EXCLUDED.end_at, title = EXCLUDED.title, display_order = EXCLUDED.display_order;

        -- 7. Sub-Junior Exam End
        INSERT INTO public.cnts_timeline_events (
            edition_id, event_key, title, short_title, description, start_at, end_at, timezone, event_type, audience, status, is_public, display_order, icon
        ) VALUES (
            v_edition_id,
            'SUB_JUNIOR_EXAM_END',
            'Sub-Junior Exam Concludes (Class 5–6)',
            'Class 5–6 Exam Ends',
            '75-minute evaluation period concludes for Sub-Junior candidates (60 questions).',
            '2026-09-27T11:15:00+05:30',
            NULL,
            'Asia/Kolkata',
            'MILESTONE',
            'ALL',
            'UPCOMING',
            true,
            7,
            'Clock'
        ) ON CONFLICT (edition_id, event_key) DO UPDATE SET
            start_at = EXCLUDED.start_at, title = EXCLUDED.title, display_order = EXCLUDED.display_order;

        -- 8. Junior Exam End
        INSERT INTO public.cnts_timeline_events (
            edition_id, event_key, title, short_title, description, start_at, end_at, timezone, event_type, audience, status, is_public, display_order, icon
        ) VALUES (
            v_edition_id,
            'JUNIOR_EXAM_END',
            'Junior Exam Concludes (Class 7–8)',
            'Class 7–8 Exam Ends',
            '90-minute evaluation period concludes for Junior candidates (80 questions).',
            '2026-09-27T11:30:00+05:30',
            NULL,
            'Asia/Kolkata',
            'MILESTONE',
            'ALL',
            'UPCOMING',
            true,
            8,
            'Clock'
        ) ON CONFLICT (edition_id, event_key) DO UPDATE SET
            start_at = EXCLUDED.start_at, title = EXCLUDED.title, display_order = EXCLUDED.display_order;

        -- 9. Result Compilation (Admin Operational Window)
        INSERT INTO public.cnts_timeline_events (
            edition_id, event_key, title, short_title, description, start_at, end_at, timezone, event_type, audience, status, is_public, display_order, icon
        ) VALUES (
            v_edition_id,
            'RESULT_COMPILATION',
            'Result Compilation & Percentile Verification',
            'Result Compilation',
            'Automated ranking calculation, tie-breaking evaluation, and forensic review.',
            '2026-09-28T00:00:00+05:30',
            '2026-10-09T23:59:59+05:30',
            'Asia/Kolkata',
            'ADMIN_ONLY',
            'ADMIN',
            'UPCOMING',
            false,
            9,
            'Activity'
        ) ON CONFLICT (edition_id, event_key) DO UPDATE SET
            start_at = EXCLUDED.start_at, end_at = EXCLUDED.end_at, title = EXCLUDED.title, display_order = EXCLUDED.display_order;

        -- 10. National Results Release
        INSERT INTO public.cnts_timeline_events (
            edition_id, event_key, title, short_title, description, start_at, end_at, timezone, event_type, audience, status, is_public, display_order, icon
        ) VALUES (
            v_edition_id,
            'RESULT_RELEASE',
            'National Results & Ranks Publication',
            'Results Released',
            'Official national rankings and subject-wise percentiles published online.',
            '2026-10-10T00:00:00+05:30',
            NULL,
            'Asia/Kolkata',
            'PUBLIC',
            'ALL',
            'UPCOMING',
            true,
            10,
            'Trophy'
        ) ON CONFLICT (edition_id, event_key) DO UPDATE SET
            start_at = EXCLUDED.start_at, title = EXCLUDED.title, short_title = EXCLUDED.short_title, display_order = EXCLUDED.display_order;

        -- 11. Talent DNA Diagnostic Profile Release
        INSERT INTO public.cnts_timeline_events (
            edition_id, event_key, title, short_title, description, start_at, end_at, timezone, event_type, audience, status, is_public, display_order, icon
        ) VALUES (
            v_edition_id,
            'TALENT_PROFILE_RELEASE',
            'Comprehensive Talent DNA Diagnostic Profiles',
            'Talent DNA Profiles',
            '6-domain cognitive strength profiles and diagnostic recommendations available in portal.',
            '2026-10-16T00:00:00+05:30',
            NULL,
            'Asia/Kolkata',
            'PUBLIC',
            'ALL',
            'UPCOMING',
            true,
            11,
            'Sparkles'
        ) ON CONFLICT (edition_id, event_key) DO UPDATE SET
            start_at = EXCLUDED.start_at, title = EXCLUDED.title, short_title = EXCLUDED.short_title, display_order = EXCLUDED.display_order;

        -- 12. Digital Certificates Release
        INSERT INTO public.cnts_timeline_events (
            edition_id, event_key, title, short_title, description, start_at, end_at, timezone, event_type, audience, status, is_public, display_order, icon
        ) VALUES (
            v_edition_id,
            'CERTIFICATE_RELEASE',
            'Digital Merit & Participation Certificates',
            'Certificates Released',
            'Official QR-verifiable digital certificates available for download.',
            '2026-10-18T00:00:00+05:30',
            NULL,
            'Asia/Kolkata',
            'PUBLIC',
            'ALL',
            'UPCOMING',
            true,
            12,
            'FileCheck'
        ) ON CONFLICT (edition_id, event_key) DO UPDATE SET
            start_at = EXCLUDED.start_at, title = EXCLUDED.title, short_title = EXCLUDED.short_title, display_order = EXCLUDED.display_order;

        -- 13. Awards & Prize Distribution
        INSERT INTO public.cnts_timeline_events (
            edition_id, event_key, title, short_title, description, start_at, end_at, timezone, event_type, audience, status, is_public, display_order, icon
        ) VALUES (
            v_edition_id,
            'AWARDS_DATE',
            'National Awards & Merit Cash Prizes',
            'Awards Announcement',
            'National scholarship awards distribution and creator honorarium final settlements.',
            '2026-10-20T00:00:00+05:30',
            NULL,
            'Asia/Kolkata',
            'PUBLIC',
            'ALL',
            'UPCOMING',
            true,
            13,
            'Award'
        ) ON CONFLICT (edition_id, event_key) DO UPDATE SET
            start_at = EXCLUDED.start_at, title = EXCLUDED.title, short_title = EXCLUDED.short_title, display_order = EXCLUDED.display_order;
            
    END IF;
END $$;
