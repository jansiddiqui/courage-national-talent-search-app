-- 1. Add verification token to assessment_results if not present
alter table public.assessment_results 
add column if not exists verification_token text unique;

-- 2. Create candidate_growth_timeline table
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

-- 3. Create result_report_versions table
create table if not exists public.result_report_versions (
  id uuid default gen_random_uuid() primary key,
  session_id uuid not null references public.candidate_sessions(id) on delete cascade,
  version_number integer not null,
  pdf_url text not null,
  secure_hash text not null unique,
  created_at timestamptz default now() not null,
  constraint unique_session_version unique(session_id, version_number)
);

-- 4. Create scholarship_awards table with CHECK constraints
create table if not exists public.scholarship_awards (
  id uuid default gen_random_uuid() primary key,
  candidate_id text not null references public.registrations(cnts_id) on delete cascade,
  award_type text not null,
  status text default 'ELIGIBLE' not null,
  applied_at timestamptz,
  created_at timestamptz default now() not null,
  constraint check_scholarship_status check (status in ('ELIGIBLE', 'INVITED', 'APPLIED', 'DOCUMENTS_PENDING', 'VERIFIED', 'REVIEW', 'AWARDED', 'DECLINED', 'EXPIRED'))
);

-- 5. Create result processing jobs table
create table if not exists public.result_processing_jobs (
  id uuid default gen_random_uuid() primary key,
  session_id uuid not null unique references public.candidate_sessions(id) on delete cascade,
  status text not null default 'PENDING',
  retry_count integer default 0 not null,
  last_error text,
  locked_at timestamptz,
  locked_by uuid,
  next_retry_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint check_job_status check (status in ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'RETRY_PENDING'))
);

-- 6. Create or align ranking snapshots table
create table if not exists public.ranking_snapshots (
  id uuid default gen_random_uuid() primary key,
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  cohort_definition text not null default '',
  candidate_count integer not null default 0,
  generated_at timestamptz default now() not null,
  algorithm_version text not null default 'v1',
  status text not null default 'PENDING'
);

-- Ensure all new sprint4 columns exist on ranking_snapshots in case it was created by an older script
alter table public.ranking_snapshots add column if not exists cohort_definition text not null default '';
alter table public.ranking_snapshots add column if not exists algorithm_version text not null default 'v1';
alter table public.ranking_snapshots add column if not exists status text not null default 'PENDING';
alter table public.ranking_snapshots add column if not exists generated_at timestamptz default now() not null;

-- Drop and recreate the check_snapshot_status constraint to support the new lifecycle states
alter table public.ranking_snapshots drop constraint if exists check_snapshot_status;
alter table public.ranking_snapshots add constraint check_snapshot_status check (status in ('PENDING', 'PROCESSING', 'READY', 'FAILED'));

-- 7. Create ranking entries table with exact decimal percentile
create table if not exists public.ranking_entries (
  id uuid default gen_random_uuid() primary key,
  snapshot_id uuid not null references public.ranking_snapshots(id) on delete cascade,
  result_id uuid not null references public.assessment_results(id) on delete cascade,
  candidate_id text not null,
  national_rank integer,
  state_rank integer,
  district_rank integer,
  percentile numeric(6,3),
  generated_at timestamptz default now() not null,
  constraint unique_snapshot_candidate unique (snapshot_id, candidate_id)
);

-- 8. Enable Row Level Security (No public/client policies -> accessible via service-role only)
alter table public.candidate_growth_timeline enable row level security;
alter table public.result_report_versions enable row level security;
alter table public.scholarship_awards enable row level security;
alter table public.result_processing_jobs enable row level security;
alter table public.ranking_snapshots enable row level security;
alter table public.ranking_entries enable row level security;

-- 9. Add indexes to accelerate worker job claims and cohort ranking checks
create index if not exists idx_processing_jobs_claim 
on public.result_processing_jobs (status, next_retry_at, locked_at) 
where status in ('PENDING', 'PROCESSING', 'RETRY_PENDING');

create index if not exists idx_ranking_snapshots_lookup
on public.ranking_snapshots (assessment_id, status, generated_at desc);

create index if not exists idx_ranking_entries_candidate_lookup 
on public.ranking_entries (candidate_id);

create index if not exists idx_growth_candidate
on public.candidate_growth_timeline (candidate_id);

-- 10. Atomic PL/pgSQL claim RPC Function
create or replace function public.claim_next_processing_job(
  p_worker_id uuid,
  p_lease_seconds integer
)
returns setof public.result_processing_jobs as $$
begin
  -- Validate lease seconds limits (10 seconds to 1 hour)
  if p_lease_seconds < 10 or p_lease_seconds > 3600 then
    raise exception 'Lease seconds must be between 10 and 3600';
  end if;

  return query
  update public.result_processing_jobs
  set status = 'PROCESSING',
      locked_at = now(),
      locked_by = p_worker_id,
      updated_at = now()
  where id = (
    select id
    from public.result_processing_jobs
    where 
      status = 'PENDING'
      or (status = 'RETRY_PENDING' and (next_retry_at is null or next_retry_at <= now()))
      or (status = 'PROCESSING' and locked_at <= now() - (p_lease_seconds || ' seconds')::interval)
    order by created_at asc
    for update skip locked
    limit 1
  )
  returning *;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

-- Revoke execute permissions from public/anon/authenticated roles
revoke execute on function public.claim_next_processing_job(uuid, integer) from public, anon, authenticated;
grant execute on function public.claim_next_processing_job(uuid, integer) to service_role;
