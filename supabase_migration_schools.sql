-- Migration: School Ecosystem
-- Creates schools table and updates registrations table

-- 1. Create schools table
create table public.schools (
  id uuid default gen_random_uuid() primary key,
  school_code text not null unique,
  name text not null,
  city text not null,
  board text not null,
  school_type text not null,
  coordinator_name text not null,
  coordinator_mobile text not null,
  coordinator_email text not null,
  quota integer not null default 0,
  used_quota integer not null default 0,
  sponsorship_mode text not null default 'FULL',
  pin text not null,
  status text not null default 'ACTIVE',
  notes text,
  created_by uuid references public.admin_users(id),
  is_featured boolean default false not null,
  joined_at timestamptz default now() not null
);

-- 2. Alter registrations to link school_id
alter table public.registrations add column school_id uuid references public.schools(id);

-- 3. Enable RLS for schools
alter table public.schools enable row level security;

-- 4. RLS Policies
-- Allow admins to insert and select schools
create policy "Allow admins to manage schools"
  on public.schools for all
  using (
    exists (
      select 1 from public.admin_users 
      where admin_users.phone_number = auth.jwt()->>'phone'
         or admin_users.email = auth.jwt()->>'email'
    )
  );

-- Allow public to select active schools by code for validation
create policy "Allow public to select active schools"
  on public.schools for select
  using (status = 'ACTIVE');

-- 5. Alter registrations to add registration_source
alter table public.registrations add column registration_source text default 'DIRECT' not null;

-- 6. Create RPC for atomic quota consumption and registration
create or replace function public.consume_school_quota_and_register(
  p_registration_id text,
  p_student_name text,
  p_dob date,
  p_student_class text,
  p_school_name text,
  p_school_city text,
  p_school_code text,
  p_school_id uuid,
  p_parent_name text,
  p_mobile_number text,
  p_whatsapp_number text,
  p_parent_email text,
  p_state text,
  p_district text,
  p_language text,
  p_why_participating text,
  p_how_heard text,
  p_payment_status text,
  p_registration_source text
) returns boolean as $$
declare
  v_quota int;
  v_used int;
begin
  -- Lock the school row to prevent race conditions
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

  -- Increment quota
  update public.schools
  set used_quota = used_quota + 1
  where id = p_school_id;

  -- Insert registration
  insert into public.registrations (
    registration_id, student_name, dob, student_class, school_name, school_city, school_code, school_id,
    parent_name, mobile_number, whatsapp_number, parent_email, state, district, language,
    why_participating, how_heard, payment_status, registration_source, registration_status
  ) values (
    p_registration_id, p_student_name, p_dob, p_student_class, p_school_name, p_school_city, p_school_code, p_school_id,
    p_parent_name, p_mobile_number, p_whatsapp_number, p_parent_email, p_state, p_district, p_language,
    p_why_participating, p_how_heard, p_payment_status, p_registration_source, 'REGISTERED'
  );

  return true;
end;
$$ language plpgsql security definer;
