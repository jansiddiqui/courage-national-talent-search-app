-- 1. Create analytics_metrics_catalog table
create table if not exists public.analytics_metrics_catalog (
  id uuid default gen_random_uuid() primary key,
  metric_name text not null unique,
  definition text not null,
  formula text not null,
  owner_team text not null, -- 'GROWTH', 'FINANCE', 'ACADEMIC'
  refresh_frequency text not null, -- '15_MINUTES', 'HOURLY', 'DAILY'
  source_tables text[] not null,
  last_refreshed_at timestamptz default now() not null
);

-- 2. Create analytics_data_quality_issues table
create table if not exists public.analytics_data_quality_issues (
  id uuid default gen_random_uuid() primary key,
  metric_name text references public.analytics_metrics_catalog(metric_name) on delete cascade,
  rule_violated text not null, -- 'MISSING_DATA', 'IMPOSSIBLE_SCORES', 'NEGATIVE_REVENUE'
  severity text default 'WARNING' not null, -- 'WARNING', 'CRITICAL'
  details jsonb default '{}'::jsonb not null,
  resolved boolean default false not null,
  created_at timestamptz default now() not null
);

-- 3. Create analytics_experiments table
create table if not exists public.analytics_experiments (
  id uuid default gen_random_uuid() primary key,
  experiment_name text not null, -- 'REGISTRATION_CTA_V2', 'PRICING_VARIANT_A'
  variant_name text not null,      -- 'CONTROL', 'TEST_A', 'TEST_B'
  candidate_id text references public.registrations(cnts_id) on delete set null,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.analytics_metrics_catalog enable row level security;
alter table public.analytics_data_quality_issues enable row level security;
alter table public.analytics_experiments enable row level security;

-- Drop existing policies if any
drop policy if exists "Admin metrics catalog access" on public.analytics_metrics_catalog;
drop policy if exists "Admin data quality access" on public.analytics_data_quality_issues;
drop policy if exists "Admin experiments access" on public.analytics_experiments;

-- Create policies (only verified admins can access governance tables)
create policy "Admin metrics catalog access" on public.analytics_metrics_catalog for all using (public.is_admin_user());
create policy "Admin data quality access" on public.analytics_data_quality_issues for all using (public.is_admin_user());
create policy "Admin experiments access" on public.analytics_experiments for all using (public.is_admin_user());

-- Create performance indexes
create index if not exists idx_metrics_catalog_name on public.analytics_metrics_catalog(metric_name);
create index if not exists idx_quality_issues_severity on public.analytics_data_quality_issues(severity);
create index if not exists idx_experiments_name on public.analytics_experiments(experiment_name);
