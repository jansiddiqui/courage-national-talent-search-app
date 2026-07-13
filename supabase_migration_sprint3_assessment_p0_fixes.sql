-- 1. Create secure question_keys table (Server-only answer keys)
create table if not exists public.question_keys (
  question_id uuid primary key references public.questions(id) on delete cascade,
  correct_options jsonb not null, -- Array of canonical Option IDs
  created_at timestamptz default now() not null
);

-- 2. Add sequence number tracking column to question_attempts
alter table public.question_attempts 
add column if not exists last_sequence_number bigint default 0 not null;

-- 3. Add idempotency tracking columns to candidate_sessions
alter table public.candidate_sessions
add column if not exists submission_idempotency_key text,
add column if not exists submission_receipt_id text,
add column if not exists frozen_answers_snapshot jsonb;

-- 4. Enable RLS on question_keys
alter table public.question_keys enable row level security;

-- 5. Drop existing policies to prevent conflicts
drop policy if exists "Admins have full access to question_keys" on public.question_keys;
drop policy if exists "Read questions candidate" on public.questions;
drop policy if exists "Read questions" on public.questions;

-- 6. Create strict admin-only policies for answer keys
create policy "Admins have full access to question_keys" 
on public.question_keys for all using (public.is_admin_user());

-- 7. Restrict questions read access so candidates can only see questions for active sessions they own
create policy "Read questions candidate" 
on public.questions for select using (
  exists (
    select 1 from public.candidate_sessions cs
    where cs.assessment_id = questions.assessment_id
    and public.is_candidate_owner(cs.candidate_id)
    and cs.status in ('CREATED', 'IN_PROGRESS', 'SUBMITTING')
  )
);
