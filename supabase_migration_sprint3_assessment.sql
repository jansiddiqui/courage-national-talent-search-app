-- 1. Create assessments table
create table if not exists public.assessments (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text not null, -- 'MOCK_EXAM', 'PRACTICE_TEST', 'DAILY_CHALLENGE', 'WORKSHEET', 'OFFICIAL_EXAM'
  duration_minutes integer not null,
  sections jsonb default '[]'::jsonb not null,
  is_published boolean default false not null,
  created_at timestamptz default now() not null
);

-- 2. Create questions table
create table if not exists public.questions (
  id uuid default gen_random_uuid() primary key,
  assessment_id uuid references public.assessments(id) on delete cascade,
  type text not null, -- 'SINGLE_CHOICE', 'MULTI_CHOICE', 'TRUE_FALSE', 'MATCHING', 'ASSERTION_REASON', 'IMAGE_DIAGRAM', 'CASE_STUDY'
  content jsonb default '{}'::jsonb not null,
  difficulty integer default 1 not null,
  created_at timestamptz default now() not null
);

-- 3. Create candidate_sessions table
create table if not exists public.candidate_sessions (
  id uuid default gen_random_uuid() primary key,
  candidate_id text not null references public.registrations(cnts_id) on delete cascade,
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  secure_token text not null unique,
  seed integer not null,
  status text default 'CREATED' not null, -- 'CREATED', 'IN_PROGRESS', 'SUBMITTING', 'SUBMITTED', 'RESULT_GENERATED', 'LOCKED'
  started_at timestamptz,
  last_heartbeat_at timestamptz,
  expires_at timestamptz,
  device_fingerprint text,
  browser_fingerprint text,
  ip_snapshot text,
  last_resume_token text,
  tab_switch_count integer default 0 not null,
  created_at timestamptz default now() not null
);

-- 4. Create question_attempts table
create table if not exists public.question_attempts (
  id uuid default gen_random_uuid() primary key,
  session_id uuid not null references public.candidate_sessions(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_answers jsonb default '[]'::jsonb not null,
  time_taken_seconds integer default 0 not null,
  is_bookmarked boolean default false not null,
  palette_state text default 'UNVISITED' not null, -- 'UNVISITED', 'VISITED', 'ANSWERED', 'REVIEW', 'ANSWERED_REVIEW'
  updated_at timestamptz default now() not null,
  constraint unique_session_question unique(session_id, question_id)
);

-- 5. Create auto_save_checkpoints table (rotating versions slots)
create table if not exists public.auto_save_checkpoints (
  session_id uuid references public.candidate_sessions(id) on delete cascade,
  version_slot integer not null, -- 1, 2, or 3
  answers_snapshot jsonb not null,
  palette_snapshot jsonb not null,
  updated_at timestamptz default now() not null,
  primary key (session_id, version_slot)
);

-- 6. Create assessment_events table (Append-only Event Ledger)
create table if not exists public.assessment_events (
  id uuid default gen_random_uuid() primary key,
  session_id uuid not null references public.candidate_sessions(id) on delete cascade,
  event_type text not null, -- 'SESSION_STARTED', 'SESSION_RESUMED', 'HEARTBEAT', etc.
  details jsonb default '{}'::jsonb not null,
  client_timestamp bigint not null,
  server_timestamp timestamptz default now() not null
);

-- 7. Create assessment_results table
create table if not exists public.assessment_results (
  id uuid default gen_random_uuid() primary key,
  session_id uuid unique not null references public.candidate_sessions(id) on delete cascade,
  candidate_id text not null references public.registrations(cnts_id) on delete cascade,
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  score float default 0.0 not null,
  analytics jsonb default '{}'::jsonb not null,
  receipt_id text unique not null,
  submitted_at timestamptz default now() not null
);

-- Enable RLS and add policies
alter table public.assessments enable row level security;
alter table public.questions enable row level security;
alter table public.candidate_sessions enable row level security;
alter table public.question_attempts enable row level security;
alter table public.auto_save_checkpoints enable row level security;
alter table public.assessment_events enable row level security;
alter table public.assessment_results enable row level security;

-- Drop existing policies if any
drop policy if exists "Read assessments" on public.assessments;
drop policy if exists "Read questions" on public.questions;
drop policy if exists "Candidates session ownership" on public.candidate_sessions;
drop policy if exists "Candidates attempts ownership" on public.question_attempts;
drop policy if exists "Candidates checkpoints ownership" on public.auto_save_checkpoints;
drop policy if exists "Candidates events ownership" on public.assessment_events;
drop policy if exists "Candidates results ownership" on public.assessment_results;

-- Create policies
create policy "Read assessments" on public.assessments for select using (is_published = true);
create policy "Read questions" on public.questions for select using (true);

create policy "Candidates session ownership" on public.candidate_sessions for all
  using (public.is_candidate_owner(candidate_id));

create policy "Candidates attempts ownership" on public.question_attempts for all
  using (exists (select 1 from public.candidate_sessions where id = session_id and public.is_candidate_owner(candidate_id)));

create policy "Candidates checkpoints ownership" on public.auto_save_checkpoints for all
  using (exists (select 1 from public.candidate_sessions where id = session_id and public.is_candidate_owner(candidate_id)));

create policy "Candidates events ownership" on public.assessment_events for all
  using (exists (select 1 from public.candidate_sessions where id = session_id and public.is_candidate_owner(candidate_id)));

create policy "Candidates results ownership" on public.assessment_results for select
  using (public.is_candidate_owner(candidate_id));

-- Admin policies
drop policy if exists "Admins have full access to assessments" on public.assessments;
drop policy if exists "Admins have full access to questions" on public.questions;
drop policy if exists "Admins have full access to candidate_sessions" on public.candidate_sessions;
drop policy if exists "Admins have full access to question_attempts" on public.question_attempts;
drop policy if exists "Admins have full access to auto_save_checkpoints" on public.auto_save_checkpoints;
drop policy if exists "Admins have full access to assessment_events" on public.assessment_events;
drop policy if exists "Admins have full access to assessment_results" on public.assessment_results;

create policy "Admins have full access to assessments" on public.assessments for all using (public.is_admin_user());
create policy "Admins have full access to questions" on public.questions for all using (public.is_admin_user());
create policy "Admins have full access to candidate_sessions" on public.candidate_sessions for all using (public.is_admin_user());
create policy "Admins have full access to question_attempts" on public.question_attempts for all using (public.is_admin_user());
create policy "Admins have full access to auto_save_checkpoints" on public.auto_save_checkpoints for all using (public.is_admin_user());
create policy "Admins have full access to assessment_events" on public.assessment_events for all using (public.is_admin_user());
create policy "Admins have full access to assessment_results" on public.assessment_results for all using (public.is_admin_user());
