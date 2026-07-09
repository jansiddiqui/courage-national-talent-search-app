-- 1. Create analytics_telemetry_events table
create table if not exists public.analytics_telemetry_events (
  id uuid default gen_random_uuid() primary key,
  event_type text not null, -- 'REGISTRATION_STARTED', 'PAYMENT_SUCCESS', 'EXAM_AUTOSAVED'
  actor_id text,           -- candidate_id, coordinator_id, or admin email
  metadata jsonb default '{}'::jsonb not null, -- context parameters (browser, state, district)
  ip_address text,
  user_agent text,
  created_at timestamptz default now() not null
);

-- 2. Create analytics_subject_summary table
create table if not exists public.analytics_subject_summary (
  id uuid default gen_random_uuid() primary key,
  subject text not null,
  total_attempts integer default 0 not null,
  average_score numeric(5,2) not null,
  weak_topics text[] not null,
  updated_at timestamptz default now() not null
);

-- 3. Create analytics_geography_summary table
create table if not exists public.analytics_geography_summary (
  id uuid default gen_random_uuid() primary key,
  state text not null,
  district text not null,
  total_candidates integer default 0 not null,
  average_score numeric(5,2) not null,
  conversion_rate numeric(5,2) not null,
  updated_at timestamptz default now() not null
);

-- 4. Create analytics_alerts table
create table if not exists public.analytics_alerts (
  id uuid default gen_random_uuid() primary key,
  alert_rule text not null, -- 'PAYMENT_FAILURES_SPIKE', 'AUTOSAVE_FAILURE'
  severity text default 'WARNING' not null, -- 'WARNING', 'CRITICAL'
  description text not null,
  resolved boolean default false not null,
  created_at timestamptz default now() not null
);

-- 5. Create analytics_daily_registrations table
create table if not exists public.analytics_daily_registrations (
  date date primary key,
  total_started integer default 0 not null,
  total_completed integer default 0 not null,
  conversion_rate numeric(5,2) default 0.00 not null,
  created_at timestamptz default now() not null
);

-- 6. Create analytics_daily_revenue table
create table if not exists public.analytics_daily_revenue (
  date date primary key,
  gross_amount numeric(12,2) default 0.00 not null,
  refund_amount numeric(12,2) default 0.00 not null,
  net_amount numeric(12,2) default 0.00 not null,
  created_at timestamptz default now() not null
);

-- 7. Create analytics_school_summary table
create table if not exists public.analytics_school_summary (
  school_id uuid primary key references public.schools(id) on delete cascade,
  total_students integer default 0 not null,
  used_sponsored integer default 0 not null,
  average_score numeric(5,2),
  national_rank_median integer,
  last_activity_at timestamptz,
  updated_at timestamptz default now() not null
);

-- 8. Create analytics_question_statistics table
create table if not exists public.analytics_question_statistics (
  question_id uuid primary key, -- References the question bank
  total_attempts integer default 0 not null,
  correct_attempts integer default 0 not null,
  average_solve_time_seconds integer default 0 not null,
  difficulty_index numeric(3,2) default 0.50 not null,
  discrimination_index numeric(3,2),
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.analytics_telemetry_events enable row level security;
alter table public.analytics_subject_summary enable row level security;
alter table public.analytics_geography_summary enable row level security;
alter table public.analytics_alerts enable row level security;
alter table public.analytics_daily_registrations enable row level security;
alter table public.analytics_daily_revenue enable row level security;
alter table public.analytics_school_summary enable row level security;
alter table public.analytics_question_statistics enable row level security;

-- Drop existing policies if any
drop policy if exists "Admin telemetry access" on public.analytics_telemetry_events;
drop policy if exists "Admin subject summary access" on public.analytics_subject_summary;
drop policy if exists "Admin geography summary access" on public.analytics_geography_summary;
drop policy if exists "Admin alerts access" on public.analytics_alerts;
drop policy if exists "Admin daily registrations access" on public.analytics_daily_registrations;
drop policy if exists "Admin daily revenue access" on public.analytics_daily_revenue;
drop policy if exists "Admin school summary access" on public.analytics_school_summary;
drop policy if exists "Admin question statistics access" on public.analytics_question_statistics;

-- Create policies (only verified admins can access analytics tables)
create policy "Admin telemetry access" on public.analytics_telemetry_events for all using (public.is_admin_user());
create policy "Admin subject summary access" on public.analytics_subject_summary for all using (public.is_admin_user());
create policy "Admin geography summary access" on public.analytics_geography_summary for all using (public.is_admin_user());
create policy "Admin alerts access" on public.analytics_alerts for all using (public.is_admin_user());
create policy "Admin daily registrations access" on public.analytics_daily_registrations for all using (public.is_admin_user());
create policy "Admin daily revenue access" on public.analytics_daily_revenue for all using (public.is_admin_user());
create policy "Admin school summary access" on public.analytics_school_summary for all using (public.is_admin_user());
create policy "Admin question statistics access" on public.analytics_question_statistics for all using (public.is_admin_user());

-- Create performance indexes
create index if not exists idx_telemetry_event_type_time on public.analytics_telemetry_events(event_type, created_at desc);
create index if not exists idx_geo_summary_district on public.analytics_geography_summary(state, district);
create index if not exists idx_school_summary_rank on public.analytics_school_summary(national_rank_median desc);
create index if not exists idx_question_stats_diff on public.analytics_question_statistics(difficulty_index);
