-- 1. Create candidate_growth_timeline table
create table if not exists public.candidate_growth_timeline (
  id uuid default gen_random_uuid() primary key,
  candidate_id text not null references public.registrations(cnts_id) on delete cascade,
  year integer not null,
  logical_reasoning_score numeric(5,2) not null,
  mathematics_score numeric(5,2) not null,
  language_score numeric(5,2) not null,
  general_awareness_score numeric(5,2) not null,
  created_at timestamptz default now() not null,
  constraint unique_candidate_year unique(candidate_id, year)
);

-- 2. Create result_report_versions table
create table if not exists public.result_report_versions (
  id uuid default gen_random_uuid() primary key,
  session_id uuid not null references public.candidate_sessions(id) on delete cascade,
  version_number integer not null, -- 1, 2, 3
  pdf_url text not null,
  secure_hash text not null unique,
  created_at timestamptz default now() not null,
  constraint unique_session_version unique(session_id, version_number)
);

-- 3. Create scholarship_awards table
create table if not exists public.scholarship_awards (
  id uuid default gen_random_uuid() primary key,
  candidate_id text not null references public.registrations(cnts_id) on delete cascade,
  award_type text not null, -- 'GOLD_MEDALIST', 'NATIONAL_TOP_100'
  status text default 'ELIGIBLE' not null, -- 'ELIGIBLE', 'APPLIED', 'AWARDED'
  applied_at timestamptz,
  created_at timestamptz default now() not null
);

-- 4. Create result_audit_trail table
create table if not exists public.result_audit_trail (
  id uuid default gen_random_uuid() primary key,
  session_id uuid not null references public.candidate_sessions(id) on delete cascade,
  actor_id text not null, -- candidate ID or admin email
  action text not null, -- 'GENERATED', 'VERIFIED', 'PUBLISHED', 'VIEWED', 'DOWNLOADED'
  details jsonb default '{}'::jsonb not null,
  created_at timestamptz default now() not null
);

-- 5. Create ranking_snapshots table
create table if not exists public.ranking_snapshots (
  id uuid default gen_random_uuid() primary key,
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  candidate_count integer not null,
  average_score numeric(5,2) not null,
  std_dev numeric(5,2) not null,
  created_at timestamptz default now() not null
);

-- Enable RLS and add policies
alter table public.candidate_growth_timeline enable row level security;
alter table public.result_report_versions enable row level security;
alter table public.scholarship_awards enable row level security;
alter table public.result_audit_trail enable row level security;
alter table public.ranking_snapshots enable row level security;

-- Drop existing policies if any
drop policy if exists "Candidates growth ownership" on public.candidate_growth_timeline;
drop policy if exists "Candidates report versions ownership" on public.result_report_versions;
drop policy if exists "Candidates scholarship ownership" on public.scholarship_awards;
drop policy if exists "Candidates audit ownership" on public.result_audit_trail;
drop policy if exists "Read ranking snapshots" on public.ranking_snapshots;

-- Create policies
create policy "Candidates growth ownership" on public.candidate_growth_timeline for select
  using (public.is_candidate_owner(candidate_id));

create policy "Candidates report versions ownership" on public.result_report_versions for select
  using (exists (select 1 from public.candidate_sessions where id = session_id and public.is_candidate_owner(candidate_id)));

create policy "Candidates scholarship ownership" on public.scholarship_awards for all
  using (public.is_candidate_owner(candidate_id));

create policy "Candidates audit ownership" on public.result_audit_trail for select
  using (exists (select 1 from public.candidate_sessions where id = session_id and public.is_candidate_owner(candidate_id)));

create policy "Read ranking snapshots" on public.ranking_snapshots for select using (true);

-- Admin policies
drop policy if exists "Admins have full access to growth timeline" on public.candidate_growth_timeline;
drop policy if exists "Admins have full access to report versions" on public.result_report_versions;
drop policy if exists "Admins have full access to scholarship awards" on public.scholarship_awards;
drop policy if exists "Admins have full access to result audits" on public.result_audit_trail;
drop policy if exists "Admins have full access to ranking snapshots" on public.ranking_snapshots;

create policy "Admins have full access to growth timeline" on public.candidate_growth_timeline for all using (public.is_admin_user());
create policy "Admins have full access to report versions" on public.result_report_versions for all using (public.is_admin_user());
create policy "Admins have full access to scholarship awards" on public.scholarship_awards for all using (public.is_admin_user());
create policy "Admins have full access to result audits" on public.result_audit_trail for all using (public.is_admin_user());
create policy "Admins have full access to ranking snapshots" on public.ranking_snapshots for all using (public.is_admin_user());

-- Create composite indexes for query optimization
create index if not exists idx_growth_candidate on public.candidate_growth_timeline(candidate_id);
create index if not exists idx_report_versions_session on public.result_report_versions(session_id);
create index if not exists idx_scholarship_candidate on public.scholarship_awards(candidate_id);
create index if not exists idx_result_audit_session on public.result_audit_trail(session_id);
create index if not exists idx_ranking_snapshots_assessment on public.ranking_snapshots(assessment_id);
