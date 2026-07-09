-- Create delivery_state enum if it does not exist
do $$
begin
  if not exists (select 1 from pg_type where typname = 'delivery_state') then
    create type public.delivery_state as enum (
      'PENDING', 'PROCESSING', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'RETRYING', 'EXPIRED'
    );
  end if;
end;
$$;

-- 1. Create communication_templates table
create table if not exists public.communication_templates (
  id uuid default gen_random_uuid() primary key,
  template_name text not null unique,
  category text not null, -- 'REGISTRATION', 'PAYMENTS', 'EXAMS', 'RESULTS'
  subject_template text, -- email subject line template
  body_template text not null, -- raw text template with placeholders
  channel text not null, -- 'EMAIL', 'WHATSAPP', 'SMS'
  version integer default 1 not null,
  approved boolean default false not null,
  created_at timestamptz default now() not null
);

-- 2. Create communication_delivery_logs table
create table if not exists public.communication_delivery_logs (
  id uuid default gen_random_uuid() primary key,
  recipient_id text not null,
  channel text not null,
  template_name text references public.communication_templates(template_name) on delete set null,
  status public.delivery_state default 'PENDING' not null,
  payload jsonb default '{}'::jsonb not null,
  attempts integer default 0 not null,
  error_message text,
  sent_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz default now() not null
);

-- 3. Create communication_preferences table
create table if not exists public.communication_preferences (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null unique,
  email_opt_in boolean default true not null,
  whatsapp_opt_in boolean default true not null,
  sms_opt_in boolean default true not null,
  marketing_opt_in boolean default true not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.communication_templates enable row level security;
alter table public.communication_delivery_logs enable row level security;
alter table public.communication_preferences enable row level security;

-- Drop existing policies if any
drop policy if exists "Admin communication templates access" on public.communication_templates;
drop policy if exists "Admin delivery logs access" on public.communication_delivery_logs;
drop policy if exists "Admin communication preferences access" on public.communication_preferences;

-- Create policies (only verified admins can access communication metadata tables)
create policy "Admin communication templates access" on public.communication_templates for all using (public.is_admin_user());
create policy "Admin delivery logs access" on public.communication_delivery_logs for all using (public.is_admin_user());
create policy "Admin communication preferences access" on public.communication_preferences for all using (public.is_admin_user());

-- Allow users to read/update their own preferences
drop policy if exists "Users check own preferences" on public.communication_preferences;
create policy "Users check own preferences" on public.communication_preferences for select
  using (auth.uid() = user_id);

create policy "Users update own preferences" on public.communication_preferences for update
  using (auth.uid() = user_id);

-- Create performance indexes
create index if not exists idx_comm_templates_name on public.communication_templates(template_name);
create index if not exists idx_comm_logs_recipient on public.communication_delivery_logs(recipient_id);
create index if not exists idx_comm_logs_status on public.communication_delivery_logs(status);
create index if not exists idx_comm_prefs_user on public.communication_preferences(user_id);
