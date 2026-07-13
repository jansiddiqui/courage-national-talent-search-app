-- 1. Create Academic Sessions table
create table if not exists public.academic_sessions (
  id uuid default gen_random_uuid() primary key,
  session_name text not null unique, -- '2026-27', '2027-28', '2028-29'
  status text not null default 'INACTIVE',
  constraint check_session_status check (status in ('ACTIVE', 'INACTIVE', 'ARCHIVED'))
);

alter table public.academic_sessions alter column status set default 'INACTIVE';

-- Seed default academic session configuration
insert into public.academic_sessions (session_name, status)
values ('2026-27', 'INACTIVE')
on conflict (session_name) do nothing;

insert into public.academic_sessions (session_name, status)
values ('2027-28', 'INACTIVE'), ('2028-29', 'INACTIVE')
on conflict (session_name) do nothing;

-- 2. Normalize ACTIVE session status under global lock before unique index creation
do $$
declare
  v_canonical_id uuid;
  v_active_count integer;
begin
  -- Acquire transaction advisory lock globally
  perform pg_advisory_xact_lock(1402263884);

  select count(*) into v_active_count from public.academic_sessions where status = 'ACTIVE';

  if v_active_count > 1 then
    -- Select highest alphabetical name as canonical session (e.g. 2026-27)
    select id into v_canonical_id
    from public.academic_sessions
    where status = 'ACTIVE'
    order by session_name desc
    limit 1;

    update public.academic_sessions
    set status = 'INACTIVE'
    where id <> v_canonical_id;
  elsif v_active_count = 0 then
    -- Activate designated migration session
    update public.academic_sessions
    set status = 'ACTIVE'
    where session_name = '2026-27';
  end if;

  -- Assert exactly one ACTIVE row
  select count(*) into v_active_count from public.academic_sessions where status = 'ACTIVE';
  if v_active_count <> 1 then
    raise exception 'Academic session normalization failed: active count is %', v_active_count;
  end if;
end;
$$ language plpgsql;

-- Ensure exactly one global session is ACTIVE via partial unique index
drop index if exists public.unique_active_academic_session;
create unique index unique_active_academic_session 
on public.academic_sessions (status) 
where (status = 'ACTIVE');

-- 3. Create School Session Configurations table (Multi-Year Quota & Setting Isolation)
create table if not exists public.school_session_configs (
  id uuid default gen_random_uuid() primary key,
  school_id uuid not null references public.schools(id) on delete cascade,
  academic_session_id uuid not null references public.academic_sessions(id) on delete cascade,
  quota integer not null default 0,
  used_quota integer not null default 0,
  sponsorship_mode text not null default 'FULL',
  status text not null default 'ACTIVE',
  constraint unique_school_session unique(school_id, academic_session_id),
  constraint check_sponsorship_mode check (sponsorship_mode in ('FULL', 'PARTIAL', 'NONE')),
  constraint check_config_status check (status in ('ACTIVE', 'INACTIVE', 'ARCHIVED'))
);

-- Link registrations to academic sessions
alter table public.registrations 
add column if not exists academic_session_id uuid references public.academic_sessions(id);

-- 4. Create School Quota Allocations Table
create table if not exists public.school_quota_allocations (
  id uuid default gen_random_uuid() primary key,
  school_session_config_id uuid not null references public.school_session_configs(id) on delete cascade,
  student_id text not null references public.registrations(registration_id) on delete cascade,
  status text not null default 'ACTIVE',
  allocated_at timestamptz default now() not null,
  released_at timestamptz,
  idempotency_key text unique not null,
  constraint check_allocation_status check (status in ('ACTIVE', 'RELEASED'))
);

-- Enforce at most one ACTIVE allocation per student and configuration
drop index if exists public.unique_active_allocation_per_student;
create unique index unique_active_allocation_per_student
on public.school_quota_allocations (school_session_config_id, student_id)
where (status = 'ACTIVE');

-- 5. Create Quota Transaction Ledger table
create table if not exists public.school_quota_ledger (
  id uuid default gen_random_uuid() primary key,
  school_session_config_id uuid not null references public.school_session_configs(id) on delete cascade,
  transaction_type text not null,
  amount integer not null,
  student_id text references public.registrations(registration_id) on delete set null,
  allocation_id uuid references public.school_quota_allocations(id) on delete set null,
  reference_note text,
  idempotency_key text,
  created_at timestamptz default now() not null,
  constraint check_quota_tx_type check (transaction_type in ('CREDIT_GRANTED', 'STUDENT_ALLOCATED', 'ALLOCATION_RELEASED', 'ADJUSTMENT', 'EXPIRED'))
);

-- Safely align schema if table already exists
alter table public.school_quota_ledger add column if not exists idempotency_key text;
alter table public.school_quota_ledger add column if not exists allocation_id uuid references public.school_quota_allocations(id) on delete set null;

-- Deterministic backfill for existing rows in ledger
update public.school_quota_ledger
set idempotency_key = encode(sha256((id::text || '-' || created_at::text)::bytea), 'hex')
where idempotency_key is null;

alter table public.school_quota_ledger alter column idempotency_key set not null;

alter table public.school_quota_ledger drop constraint if exists unique_quota_ledger_idempotency;
alter table public.school_quota_ledger add constraint unique_quota_ledger_idempotency unique (idempotency_key);

-- Drop deprecated index
drop index if exists public.idx_quota_ledger_single_allocation;

-- 6. Create unified CNTS Calendar Events table
create table if not exists public.cnts_calendar_events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  event_type text not null,
  school_id uuid references public.schools(id) on delete cascade,
  assessment_id uuid references public.assessments(id) on delete cascade,
  start_date timestamptz not null,
  end_date timestamptz not null,
  created_at timestamptz default now() not null,
  constraint check_event_type check (event_type in ('GLOBAL', 'ASSESSMENT', 'SCHOOL'))
);

-- 7. Create School Announcements table
create table if not exists public.school_announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  announcement_type text not null,
  target_audience text not null default 'ALL', -- 'ALL', 'COORDINATOR', 'PRINCIPAL'
  priority text not null default 'NORMAL',
  publish_time timestamptz not null default now(),
  expiry_time timestamptz,
  attachment_urls text[],
  required_acknowledgment boolean default false not null,
  created_at timestamptz default now() not null,
  constraint check_announcement_type check (announcement_type in ('CIRCULAR', 'EXAM_UPDATE', 'MAINTENANCE', 'RULE_CHANGE', 'DEADLINE', 'EMERGENCY', 'GENERAL')),
  constraint check_announcement_priority check (priority in ('LOW', 'NORMAL', 'HIGH', 'CRITICAL'))
);

-- 8. Create School Announcement Acknowledgments table
create table if not exists public.school_announcement_acknowledgments (
  id uuid default gen_random_uuid() primary key,
  announcement_id uuid not null references public.school_announcements(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  coordinator_id uuid not null references public.school_coordinators(id) on delete cascade,
  acknowledged_at timestamptz default now() not null,
  constraint unique_acknowledgment unique(announcement_id, school_id)
);

-- 9. Create School Background Jobs table (Bulk action worker queue)
create table if not exists public.school_background_jobs (
  id uuid default gen_random_uuid() primary key,
  school_id uuid not null references public.schools(id) on delete cascade,
  job_type text not null,
  status text not null default 'PENDING',
  total_items integer not null default 0,
  processed_items integer not null default 0,
  payload jsonb default '{}'::jsonb not null,
  idempotency_key text,
  last_error text,
  retry_count integer not null default 0,
  next_retry_at timestamptz,
  locked_at timestamptz,
  locked_by uuid,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint check_job_status check (status in ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'RETRY_PENDING'))
);

-- Safe sequence for nullable / pre-existing background jobs columns
alter table public.school_background_jobs add column if not exists payload jsonb;
update public.school_background_jobs set payload = '{}'::jsonb where payload is null;
alter table public.school_background_jobs alter column payload set default '{}'::jsonb;
alter table public.school_background_jobs alter column payload set not null;

alter table public.school_background_jobs add column if not exists retry_count integer;
update public.school_background_jobs set retry_count = 0 where retry_count is null;
alter table public.school_background_jobs alter column retry_count set default 0;
alter table public.school_background_jobs alter column retry_count set not null;

alter table public.school_background_jobs add column if not exists idempotency_key text;
update public.school_background_jobs
set idempotency_key = encode(sha256((id::text || '-' || created_at::text)::bytea), 'hex')
where idempotency_key is null;
alter table public.school_background_jobs alter column idempotency_key set not null;

alter table public.school_background_jobs add column if not exists last_error text;

alter table public.school_background_jobs drop constraint if exists unique_school_job_idempotency;
alter table public.school_background_jobs add constraint unique_school_job_idempotency unique (idempotency_key);

-- 10. Create School Report Schedules table
create table if not exists public.school_report_schedules (
  id uuid default gen_random_uuid() primary key,
  school_id uuid not null references public.schools(id) on delete cascade,
  report_type text not null,
  frequency text not null, -- 'DAILY', 'WEEKLY', 'MONTHLY'
  recipient_emails text[] not null,
  active boolean default true not null,
  created_at timestamptz default now() not null,
  constraint check_report_frequency check (frequency in ('DAILY', 'WEEKLY', 'MONTHLY'))
);

-- 11. Create School Generated Reports table
create table if not exists public.school_generated_reports (
  id uuid default gen_random_uuid() primary key,
  schedule_id uuid references public.school_report_schedules(id) on delete set null,
  school_id uuid not null references public.schools(id) on delete cascade,
  report_type text not null,
  storage_path text not null,
  created_at timestamptz default now() not null
);

-- 12. Create School Performance Snapshots table (Immutable Year-Over-Year Analytics)
create table if not exists public.school_performance_snapshots (
  id uuid default gen_random_uuid() primary key,
  school_id uuid not null references public.schools(id) on delete cascade,
  academic_session_id uuid not null references public.academic_sessions(id) on delete cascade,
  student_count integer not null,
  average_score numeric(5,2) not null,
  percentile_average numeric(6,3) not null,
  school_rank integer,
  scholarship_count integer not null default 0,
  raw_metrics_json jsonb default '{}'::jsonb not null,
  generated_at timestamptz default now() not null,
  constraint unique_performance_snapshot unique(school_id, academic_session_id)
);

-- 13. Create Certificates registry table
create table if not exists public.certificates (
  id uuid default gen_random_uuid() primary key,
  candidate_id text not null references public.registrations(registration_id) on delete cascade,
  academic_session_id uuid not null references public.academic_sessions(id) on delete cascade,
  certificate_type text not null,
  verification_token text unique not null,
  storage_path text,
  issued_at timestamptz default now() not null,
  status text default 'ISSUED' not null,
  constraint check_cert_type check (certificate_type in ('MERIT', 'PARTICIPATION', 'HONOR')),
  constraint check_cert_status check (status in ('ISSUED', 'REVOKED'))
);

-- 14. Align school_coordinators permissions column
alter table public.school_coordinators add column if not exists permissions jsonb;
update public.school_coordinators set permissions = '[]'::jsonb where permissions is null;
alter table public.school_coordinators alter column permissions set default '[]'::jsonb;
alter table public.school_coordinators alter column permissions set not null;

-- 15. Align school_upload_batches table
alter table public.school_upload_batches add column if not exists success_rows integer;
alter table public.school_upload_batches add column if not exists failed_rows integer;
alter table public.school_upload_batches add column if not exists error_log jsonb;
update public.school_upload_batches set error_log = '[]'::jsonb where error_log is null;
alter table public.school_upload_batches alter column error_log set default '[]'::jsonb;
alter table public.school_upload_batches alter column error_log set not null;

-- 16. Align school_documents table to include audit, version, and verification controls
alter table public.school_documents 
add column if not exists version integer default 1 not null,
add column if not exists verification_status text default 'PENDING' not null,
add column if not exists verified_by uuid references public.admin_users(id),
add column if not exists issue_date date,
add column if not exists expiry_date date,
add column if not exists superseded_id uuid references public.school_documents(id);

alter table public.school_documents drop constraint if exists check_doc_status;
alter table public.school_documents add constraint check_doc_status check (verification_status in ('PENDING', 'APPROVED', 'REJECTED'));

-- 17. Align school_fee_ledger table check constraints and verify compatibility of legacy column
alter table public.school_fee_ledger add column if not exists reference_id text;
alter table public.school_fee_ledger drop constraint if exists check_ledger_tx_type;
alter table public.school_fee_ledger add constraint check_ledger_tx_type check (transaction_type in ('INVOICE', 'PAYMENT', 'REFUND', 'SPONSORED_CREDIT', 'CREDIT_NOTE', 'ADJUSTMENT'));

-- Executable preflight guard check for duplicate reference_ids
do $$
begin
  if exists (
    select 1
    from public.school_fee_ledger
    where reference_id is not null
    group by reference_id
    having count(*) > 1
  ) then
    raise exception
      'Cannot create unique_school_fee_ledger_reference_id: duplicate non-null reference_id values exist. Resolve duplicates manually before rerunning migration.';
  end if;
end;
$$ language plpgsql;

-- Enforce reference_id uniqueness conditionally via partial unique index
create unique index if not exists unique_school_fee_ledger_reference_id
on public.school_fee_ledger (reference_id)
where (reference_id is not null);

-- 18. Enable Row Level Security (Private, Server-Only Tables)
alter table public.academic_sessions enable row level security;
alter table public.school_session_configs enable row level security;
alter table public.school_quota_ledger enable row level security;
alter table public.cnts_calendar_events enable row level security;
alter table public.school_announcements enable row level security;
alter table public.school_announcement_acknowledgments enable row level security;
alter table public.school_background_jobs enable row level security;
alter table public.school_report_schedules enable row level security;
alter table public.school_generated_reports enable row level security;
alter table public.school_performance_snapshots enable row level security;
alter table public.certificates enable row level security;
alter table public.school_quota_allocations enable row level security;

-- 19. Revoke direct mutations and read capabilities from public roles (Strict Security boundary)
revoke select, insert, update, delete on table public.academic_sessions from public, anon, authenticated;
revoke select, insert, update, delete on table public.school_session_configs from public, anon, authenticated;
revoke select, insert, update, delete on table public.school_quota_ledger from public, anon, authenticated;
revoke select, insert, update, delete on table public.school_quota_allocations from public, anon, authenticated;
revoke select, insert, update, delete on table public.cnts_calendar_events from public, anon, authenticated;
revoke select, insert, update, delete on table public.school_announcements from public, anon, authenticated;
revoke select, insert, update, delete on table public.school_announcement_acknowledgments from public, anon, authenticated;
revoke select, insert, update, delete on table public.school_background_jobs from public, anon, authenticated;
revoke select, insert, update, delete on table public.school_report_schedules from public, anon, authenticated;
revoke select, insert, update, delete on table public.school_generated_reports from public, anon, authenticated;
revoke select, insert, update, delete on table public.school_performance_snapshots from public, anon, authenticated;
revoke select, insert, update, delete on table public.certificates from public, anon, authenticated;

-- 20. Create Indexes to optimize lookup and background worker claims
create index if not exists idx_registrations_school_session on public.registrations (school_id, academic_session_id);
create index if not exists idx_calendar_events_lookup on public.cnts_calendar_events (school_id, start_date);
create index if not exists idx_announcements_expiry on public.school_announcements (expiry_time) where expiry_time is not null;
create index if not exists idx_snapshots_lookup on public.school_performance_snapshots (school_id, academic_session_id);
create index if not exists idx_quota_ledger_config on public.school_quota_ledger (school_session_config_id);

-- Highly optimized claims worker composite index
create index if not exists idx_background_jobs_claim_worker 
on public.school_background_jobs (status, next_retry_at, locked_at, created_at);

-- 21. Switch Active Academic Session Transaction helper (Globally Serialized, hardened)
create or replace function public.switch_active_academic_session(
  p_new_session_id uuid
) returns void as $$
declare
  v_target_exists boolean;
  v_current_status text;
  v_active_count integer;
begin
  -- 1. Acquire transaction-level advisory lock to serialize switches globally
  perform pg_advisory_xact_lock(1402263884);

  -- 2. Check existence and lock targeted session for update
  select exists (
    select 1 from public.academic_sessions where id = p_new_session_id
  ) into v_target_exists;
  
  if not v_target_exists then
    raise exception 'Target academic session ID % does not exist', p_new_session_id;
  end if;

  select status into v_current_status
  from public.academic_sessions
  where id = p_new_session_id
  for update;

  -- 3. If already active, return early
  if v_current_status = 'ACTIVE' then
    return;
  end if;

  -- 4. Deactivate old session
  update public.academic_sessions
  set status = 'INACTIVE'
  where status = 'ACTIVE';

  -- 5. Activate new session
  update public.academic_sessions
  set status = 'ACTIVE'
  where id = p_new_session_id;

  -- 6. Safety assertion: Ensure exactly one session is active
  select count(*) into v_active_count from public.academic_sessions where status = 'ACTIVE';
  if v_active_count <> 1 then
    raise exception 'Transactional session switch failed: active session count is %', v_active_count;
  end if;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

revoke execute on function public.switch_active_academic_session(uuid) from public, anon, authenticated;

-- 22. Atomic PL/pgSQL claim RPC Function for school jobs (hardened)
create or replace function public.claim_next_school_job(
  p_worker_id uuid,
  p_lease_seconds integer
)
returns setof public.school_background_jobs as $$
begin
  -- Validate lease seconds limits (10 seconds to 1 hour)
  if p_lease_seconds < 10 or p_lease_seconds > 3600 then
    raise exception 'Lease seconds must be between 10 and 3600';
  end if;

  return query
  update public.school_background_jobs
  set status = 'PROCESSING',
      locked_at = now(),
      locked_by = p_worker_id,
      updated_at = now()
  where id = (
    select id
    from public.school_background_jobs
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

revoke execute on function public.claim_next_school_job(uuid, integer) from public, anon, authenticated;

-- 23. Reconcile School Used Quota Cache Function (hardened)
create or replace function public.reconcile_school_used_quota(p_config_id uuid)
returns void as $$
declare
  v_actual_used integer;
begin
  -- used_quota count matches number of ACTIVE allocations
  select coalesce(count(*), 0) into v_actual_used
  from public.school_quota_allocations
  where school_session_config_id = p_config_id and status = 'ACTIVE';

  update public.school_session_configs
  set used_quota = v_actual_used
  where id = p_config_id;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

revoke execute on function public.reconcile_school_used_quota(uuid) from public, anon, authenticated;

-- 24. Atomic PL/pgSQL allocate school quota function (hardened, reallocation and collision idempotency resolved)
create or replace function public.allocate_school_quota(
  p_config_id uuid,
  p_registration_id text,
  p_idempotency_key text
) returns boolean as $$
declare
  v_limit integer;
  v_allocated integer;
  v_alloc_id uuid;
  v_existing_status text;
  v_existing_id uuid;
  v_existing_config_id uuid;
  v_existing_student_id text;
  v_config_school_id uuid;
  v_config_session_id uuid;
  v_student_school_id uuid;
  v_student_session_id uuid;
begin
  -- 1. Pre-insertion verification of idempotency key collision
  select id, school_session_config_id, student_id, status 
  into v_existing_id, v_existing_config_id, v_existing_student_id, v_existing_status
  from public.school_quota_allocations
  where idempotency_key = p_idempotency_key;

  if v_existing_id is not null then
    if v_existing_config_id <> p_config_id or v_existing_student_id <> p_registration_id then
      raise exception 'Idempotency key already used for a different allocation request';
    end if;
    
    if v_existing_status = 'ACTIVE' then
      return true;
    else
      raise exception 'Allocation associated with this idempotency key has already been released';
    end if;
  end if;

  -- 2. Lock school config row to prevent concurrent overrides and get config details
  select school_id, academic_session_id, quota 
  into v_config_school_id, v_config_session_id, v_limit
  from public.school_session_configs
  where id = p_config_id and status = 'ACTIVE'
  for update;

  if not found then
    raise exception 'School session configuration not found or inactive';
  end if;

  -- 3. Enforce registration relationship boundaries inside the database layer
  select school_id, academic_session_id 
  into v_student_school_id, v_student_session_id
  from public.registrations
  where registration_id = p_registration_id;

  if not found then
    raise exception 'Registration ID % not found', p_registration_id;
  end if;

  if v_student_school_id is null or v_student_school_id <> v_config_school_id then
    raise exception 'Student does not belong to the requesting school';
  end if;

  if v_student_session_id is null or v_student_session_id <> v_config_session_id then
    raise exception 'Student academic session does not match configuration academic session';
  end if;

  -- 4. Calculate balance dynamically from the ledger (CREDIT_GRANTED: +Amount, STUDENT_ALLOCATED: -Amount)
  select coalesce(sum(amount), 0) into v_allocated
  from public.school_quota_ledger
  where school_session_config_id = p_config_id;

  -- Verify allocation limits (Consumption decreases balance, so remaining balance must be >= 1)
  if (v_allocated - 1) < 0 then 
    raise exception 'School quota limit exceeded';
  end if;

  -- 5. Write ACTIVE allocation using safe conflict bypass
  insert into public.school_quota_allocations (
    school_session_config_id, student_id, status, idempotency_key
  ) values (
    p_config_id,
    p_registration_id,
    'ACTIVE',
    p_idempotency_key
  )
  on conflict (idempotency_key) do nothing
  returning id into v_alloc_id;

  -- 6. Resolve concurrent conflict race conditions and confirm details
  if v_alloc_id is null then
    select id, school_session_config_id, student_id, status 
    into v_existing_id, v_existing_config_id, v_existing_student_id, v_existing_status
    from public.school_quota_allocations
    where idempotency_key = p_idempotency_key;

    if v_existing_config_id <> p_config_id or v_existing_student_id <> p_registration_id then
      raise exception 'Idempotency key already used for a different allocation request';
    end if;

    if v_existing_status = 'ACTIVE' then
      return true;
    else
      raise exception 'Allocation associated with this idempotency key has already been released';
    end if;
  end if;

  -- 7. Write allocation transaction record to the ledger
  insert into public.school_quota_ledger (
    school_session_config_id, transaction_type, amount, student_id, allocation_id, reference_note, idempotency_key
  ) values (
    p_config_id, 
    'STUDENT_ALLOCATED', 
    -1, 
    p_registration_id,
    v_alloc_id,
    'Student Registration Allocation',
    encode(sha256(('ALLOC-TX-' || v_alloc_id::text)::bytea), 'hex')
  );

  -- 8. Reconcile used_quota cache
  perform public.reconcile_school_used_quota(p_config_id);

  return true;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

revoke execute on function public.allocate_school_quota(uuid, text, text) from public, anon, authenticated;

-- 25. Atomic PL/pgSQL release school quota function (hardened)
create or replace function public.release_school_quota(
  p_allocation_id uuid
) returns boolean as $$
declare
  v_config_id uuid;
  v_student_id text;
  v_status text;
begin
  -- 1. Lock allocation record for update to prevent concurrent double-releases
  select school_session_config_id, student_id, status 
  into v_config_id, v_student_id, v_status
  from public.school_quota_allocations
  where id = p_allocation_id
  for update;

  if not found then
    raise exception 'Quota allocation record not found';
  end if;

  -- 2. If already released, return early (idempotence)
  if v_status = 'RELEASED' then
    return true;
  end if;

  -- 3. Transition status to RELEASED
  update public.school_quota_allocations
  set status = 'RELEASED',
      released_at = now()
  where id = p_allocation_id;

  -- 4. Write ALLOCATION_RELEASED (+1) to the ledger
  insert into public.school_quota_ledger (
    school_session_config_id, transaction_type, amount, student_id, allocation_id, reference_note, idempotency_key
  ) values (
    v_config_id,
    'ALLOCATION_RELEASED',
    1,
    v_student_id,
    p_allocation_id,
    'Sponsorship Allocation Released',
    encode(sha256(('RELEASE-' || p_allocation_id::text)::bytea), 'hex')
  )
  on conflict (idempotency_key) do nothing;

  -- 5. Reconcile cache
  perform public.reconcile_school_used_quota(v_config_id);

  return true;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

revoke execute on function public.release_school_quota(uuid) from public, anon, authenticated;

-- 26. Define trigger function to keep legacy columns in sync temporarily (only for active sessions)
create or replace function public.sync_legacy_school_quota()
returns trigger as $$
declare
  v_is_active boolean;
begin
  select (status = 'ACTIVE') into v_is_active
  from public.academic_sessions
  where id = new.academic_session_id;

  if v_is_active then
    update public.schools
    set quota = new.quota,
        used_quota = new.used_quota,
        sponsorship_mode = new.sponsorship_mode
    where id = new.school_id;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public, pg_temp;

drop trigger if exists trigger_sync_legacy_school_quota on public.school_session_configs;
create trigger trigger_sync_legacy_school_quota
after insert or update on public.school_session_configs
for each row execute function public.sync_legacy_school_quota();
