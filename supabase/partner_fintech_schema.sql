-- =============================================================================
-- CNTS 2026 RAZORPAYX PAYOUT & INTERNAL WALLET LEDGER SCHEMA
-- Copy and paste this entire block directly into Supabase Dashboard -> SQL Editor -> Run
-- =============================================================================

-- 1. PARTNER PAYMENT METHODS (Active & Historical Beneficiary Destinations)
CREATE TABLE IF NOT EXISTS public.partner_payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID NOT NULL,
    method_type VARCHAR(20) NOT NULL CHECK (method_type IN ('UPI', 'BANK')),
    
    -- UPI Fields
    upi_id VARCHAR(100),
    
    -- Bank Fields
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),
    bank_name VARCHAR(100),
    bank_branch VARCHAR(150),
    bank_holder_name VARCHAR(150),
    
    -- RazorpayX Identifiers
    razorpayx_contact_id VARCHAR(100),
    razorpayx_fund_account_id VARCHAR(100),
    
    -- Verification & Security States
    is_active BOOLEAN DEFAULT TRUE,
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    cooling_ends_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BENEFICIARY VERIFICATIONS (Real-time VPA / Bank Penny-Drop Log)
CREATE TABLE IF NOT EXISTS public.beneficiary_verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID NOT NULL,
    verification_type VARCHAR(20) NOT NULL CHECK (verification_type IN ('UPI_VPA', 'PENNY_DROP')),
    target_identifier VARCHAR(150) NOT NULL,
    provider VARCHAR(50) DEFAULT 'RAZORPAYX',
    
    verified_name VARCHAR(150),
    verified_bank VARCHAR(100),
    verified_ifsc VARCHAR(20),
    name_match_score DECIMAL(5,2),
    
    status VARCHAR(30) NOT NULL DEFAULT 'VERIFIED',
    raw_provider_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INTERNAL WALLET / PAYOUT LEDGERS (Single Source of Truth)
CREATE TABLE IF NOT EXISTS public.payout_ledgers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID NOT NULL,
    batch_id UUID,
    
    transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN ('REFERRAL_HONORARIUM', 'MISSION_BONUS', 'REFUND_ADJUSTMENT', 'WITHDRAWAL_SETTLEMENT')),
    gross_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tds_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- 5% TDS
    net_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'SETTLED', 'FAILED', 'CANCELLED')),
    utr_number VARCHAR(100), -- Bank UTR / RRN from RazorpayX
    scheduled_batch_date DATE,
    
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. VERIFICATION AUDITS (Security Audit Logs)
CREATE TABLE IF NOT EXISTS public.verification_audits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    device_fingerprint VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PAYMENT CHANGE HISTORIES (Snapshot Audit Log for Security)
CREATE TABLE IF NOT EXISTS public.payment_change_histories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_id UUID NOT NULL,
    previous_method_type VARCHAR(20),
    previous_identifier VARCHAR(150),
    new_method_type VARCHAR(20) NOT NULL,
    new_identifier VARCHAR(150) NOT NULL,
    cooling_until TIMESTAMPTZ NOT NULL,
    ip_address VARCHAR(50),
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR HIGH-PERFORMANCE DISBURSEMENT QUERYING
CREATE INDEX IF NOT EXISTS idx_partner_payment_methods_partner ON public.partner_payment_methods(partner_id, is_active);
CREATE INDEX IF NOT EXISTS idx_payout_ledgers_partner_status ON public.payout_ledgers(partner_id, status);
CREATE INDEX IF NOT EXISTS idx_payout_ledgers_batch ON public.payout_ledgers(scheduled_batch_date, status);
