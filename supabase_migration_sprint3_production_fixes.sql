-- Migration: Sprint 3 Production Blocker Fixes
-- Target: Supabase database schema additions for CNTS

-- 1. Create student_progress table for server-side single source of truth
create table if not exists public.student_progress (
  id uuid default gen_random_uuid() primary key,
  cnts_id text not null unique references public.registrations(cnts_id) on delete cascade,
  progress_data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now() not null
);

-- Enable RLS on student_progress
alter table public.student_progress enable row level security;

-- Create policies for student_progress
drop policy if exists "Allow users to read their own progress" on public.student_progress;
create policy "Allow users to read their own progress"
  on public.student_progress for select
  using (
    exists (
      select 1 from public.registrations
      where registrations.cnts_id = student_progress.cnts_id
        and (registrations.user_id = auth.uid()
             or registrations.mobile_number = auth.jwt()->>'phone'
             or registrations.parent_email = auth.jwt()->>'email')
    )
  );

drop policy if exists "Allow users to insert/update their own progress" on public.student_progress;
create policy "Allow users to insert/update their own progress"
  on public.student_progress for all
  using (
    exists (
      select 1 from public.registrations
      where registrations.cnts_id = student_progress.cnts_id
        and (registrations.user_id = auth.uid()
             or registrations.mobile_number = auth.jwt()->>'phone'
             or registrations.parent_email = auth.jwt()->>'email')
    )
  );

-- Allow admins full access
create policy "Allow admins to manage progress"
  on public.student_progress for all
  using (
    exists (
      select 1 from public.admin_users 
      where admin_users.phone_number = auth.jwt()->>'phone'
         or admin_users.email = auth.jwt()->>'email'
    )
  );


-- 2. Create notification_jobs outbox table
create table if not exists public.notification_jobs (
  id uuid default gen_random_uuid() primary key,
  recipient text not null,
  channel text not null, -- 'WHATSAPP', 'EMAIL'
  template_name text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'PENDING', -- 'PENDING', 'SENT', 'FAILED'
  error_message text,
  attempts integer default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS on notification_jobs (admins only)
alter table public.notification_jobs enable row level security;

create policy "Allow admins to manage notification_jobs"
  on public.notification_jobs for all
  using (
    exists (
      select 1 from public.admin_users 
      where admin_users.phone_number = auth.jwt()->>'phone'
         or admin_users.email = auth.jwt()->>'email'
    )
  );


-- 3. Create activate_school_sponsored_registration transaction RPC
create or replace function public.activate_school_sponsored_registration(
  p_draft_reg_id text,
  p_school_id uuid,
  p_cnts_id text,
  p_payment_id text,
  p_photo_url text
) returns boolean as $$
declare
  v_quota int;
  v_used int;
begin
  -- 1. Lock school row for update
  select quota, used_quota into v_quota, v_used
  from public.schools
  where id = p_school_id and status = 'ACTIVE'
  for update;

  if not found then
    raise exception 'School not found or not active';
  end if;

  if v_used >= v_quota then
    raise exception 'School quota exceeded';
  end if;

  -- 2. Increment school's used quota
  update public.schools
  set used_quota = used_quota + 1
  where id = p_school_id;

  -- 3. Update registration draft row
  update public.registrations
  set 
    payment_status = 'SPONSORED',
    registration_status = 'REGISTERED',
    payment_id = p_payment_id,
    mobile_verified = true,
    cnts_id = p_cnts_id,
    school_id = p_school_id,
    photo_url = coalesce(p_photo_url, photo_url)
  where registration_id = p_draft_reg_id;

  if not found then
    raise exception 'Draft registration not found';
  end if;

  -- 4. Log milestone event
  insert into public.registration_events (
    registration_id,
    event_type,
    metadata
  ) values (
    p_draft_reg_id,
    'REGISTERED',
    jsonb_build_object(
      'timestamp', now(),
      'payment_id', p_payment_id,
      'payment_status', 'SPONSORED',
      'cnts_id', p_cnts_id,
      'school_id', p_school_id
    )
  );

  return true;
end;
$$ language plpgsql security definer;
