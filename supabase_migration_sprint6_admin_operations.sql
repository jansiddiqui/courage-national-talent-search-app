-- 1. Create is_admin_user helper function if not already present
create or replace function public.is_admin_user()
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_users
    where phone_number = auth.jwt()->>'phone'
       or email = auth.jwt()->>'email'
  );
end;
$$ language plpgsql security definer;

-- 2. Create bloom_level and question_approval_state enums if not exists
do $$
begin
  if not exists (select 1 from pg_type where typname = 'bloom_level') then
    create type public.bloom_level as enum (
      'REMEMBERING', 'UNDERSTANDING', 'APPLYING', 'ANALYZING', 'EVALUATING', 'CREATING'
    );
  end if;
  
  if not exists (select 1 from pg_type where typname = 'question_approval_state') then
    create type public.question_approval_state as enum (
      'DRAFT', 'UNDER_REVIEW', 'APPROVED', 'RETIRED'
    );
  end if;
  
  if not exists (select 1 from pg_type where typname = 'job_run_status') then
    create type public.job_run_status as enum (
      'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'
    );
  end if;
end;
$$;

-- 3. Create admin_question_bank table
create table if not exists public.admin_question_bank (
  id uuid default gen_random_uuid() primary key,
  question_text text not null,
  explanation text,
  difficulty_index numeric(3,2) default 0.50 not null,
  discrimination_index numeric(3,2),
  bloom_taxonomy public.bloom_level default 'UNDERSTANDING' not null,
  subject text not null,
  chapter text not null,
  topic text not null,
  subtopic text,
  estimated_solve_time integer not null, -- in seconds
  marks numeric(4,2) not null,
  negative_marks numeric(4,2) default 0.00 not null,
  options jsonb not null, -- array of options
  approval_status public.question_approval_state default 'DRAFT' not null,
  version integer default 1 not null,
  author_id uuid references public.admin_users(id) on delete set null,
  reviewer_id uuid references public.admin_users(id) on delete set null,
  created_at timestamptz default now() not null
);

-- 4. Create admin_background_jobs table
create table if not exists public.admin_background_jobs (
  id uuid default gen_random_uuid() primary key,
  job_type text not null, -- 'BULK_IMPORT', 'CERTIFICATE_ZIP', 'BROADCAST_NOTIF', 'AI_RECOMMENDATION'
  status public.job_run_status default 'PENDING' not null,
  payload jsonb not null,
  error_logs text,
  attempts integer default 0 not null,
  max_attempts integer default 3 not null,
  execution_time_ms integer,
  created_at timestamptz default now() not null
);

-- 5. Create admin_operations_audit_trail table
create table if not exists public.admin_operations_audit_trail (
  id uuid default gen_random_uuid() primary key,
  actor_id uuid references public.admin_users(id) on delete set null,
  actor_role text not null,
  action text not null, -- 'PUBLISHED_EXAM', 'REFUNDED_PAYMENT', 'MODIFIED_CMS'
  module text not null, -- 'EXAMS', 'PAYMENTS', 'CMS', 'QUESTIONS'
  previous_value jsonb default '{}'::jsonb not null,
  new_value jsonb default '{}'::jsonb not null,
  ip_address text,
  browser text,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.admin_question_bank enable row level security;
alter table public.admin_background_jobs enable row level security;
alter table public.admin_operations_audit_trail enable row level security;

-- Drop existing policies if any
drop policy if exists "Admin access to question bank" on public.admin_question_bank;
drop policy if exists "Admin access to background jobs" on public.admin_background_jobs;
drop policy if exists "Admin access to operations audits" on public.admin_operations_audit_trail;

-- Create policies (only verified admins have access)
create policy "Admin access to question bank" on public.admin_question_bank for all
  using (public.is_admin_user());

create policy "Admin access to background jobs" on public.admin_background_jobs for all
  using (public.is_admin_user());

create policy "Admin access to operations audits" on public.admin_operations_audit_trail for all
  using (public.is_admin_user());

-- Create indexes for performance optimization
create index if not exists idx_admin_questions_subject on public.admin_question_bank(subject);
create index if not exists idx_admin_questions_topic on public.admin_question_bank(topic);
create index if not exists idx_admin_jobs_status on public.admin_background_jobs(status);
create index if not exists idx_admin_audit_module on public.admin_operations_audit_trail(module);
create index if not exists idx_admin_audit_actor on public.admin_operations_audit_trail(actor_id);
