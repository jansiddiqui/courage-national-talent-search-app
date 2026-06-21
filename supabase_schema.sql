-- Supabase Database Schema for Courage National Talent Search (CNTS)
-- Consolidated Sprint 2 Launch-Ready Specification

-- 1. Create registrations table
create table public.registrations (
  id uuid default gen_random_uuid() primary key,
  registration_id text not null unique,
  student_name text not null,
  dob date not null,
  student_class text not null,
  school_name text not null,
  school_city text not null,
  school_code text,
  parent_name text not null,
  whatsapp_number text not null,
  parent_email text not null,
  state text not null,
  district text not null,
  language text not null,
  why_participating text not null,
  how_heard text not null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referral_code text,
  payment_id text,
  payment_status text default 'PENDING' not null,
  admin_notes text,
  created_at timestamptz default now() not null
);

-- 2. Create registration_events table for tracking student/admin milestones
create table public.registration_events (
  id uuid default gen_random_uuid() primary key,
  registration_id text not null references public.registrations(registration_id) on delete cascade,
  event_type text not null,
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamptz default now() not null
);

-- 3. Create contact_messages table for user support/inquiries
create table public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  created_at timestamptz default now() not null
);

-- 4. Create system_settings table for platform gate status toggles
create table public.system_settings (
  id uuid default gen_random_uuid() primary key,
  setting_key text not null unique,
  setting_value text not null,
  updated_at timestamptz default now() not null
);

-- 5. Seed default system settings
insert into public.system_settings (setting_key, setting_value) values
  ('registration_status', 'OPEN'),
  ('payment_status', 'ENABLED'),
  ('admit_card_status', 'PENDING'),
  ('result_status', 'HIDDEN'),
  ('certificate_status', 'PENDING'),
  ('announcement_status', 'ACTIVE')
on conflict (setting_key) do nothing;

-- 5b. Create admin_users registry table
create table public.admin_users (
  id uuid default gen_random_uuid() primary key,
  email text unique,
  phone_number text unique,
  role text default 'VOLUNTEER' not null, -- 'SUPER_ADMIN', 'ADMIN', 'VOLUNTEER'
  created_at timestamptz default now() not null
);

-- Seed initial admin credentials
insert into public.admin_users (email, phone_number, role) values 
  (null, '918707884735', 'SUPER_ADMIN'),
  ('admin@example.com', null, 'SUPER_ADMIN')
on conflict do nothing;

-- 6. Enable Row Level Security (RLS)
alter table public.registrations enable row level security;
alter table public.registration_events enable row level security;
alter table public.contact_messages enable row level security;
alter table public.system_settings enable row level security;

-- 7. Create RLS Policies for secure admin-gated access
-- (Client direct access is restricted; public inserts are allowed where necessary)

-- registrations Policies
drop policy if exists "Allow inserts to registrations" on public.registrations;
create policy "Allow inserts to registrations"
  on public.registrations for insert
  with check (true);

-- registration_events Policies
drop policy if exists "Allow inserts to registration_events" on public.registration_events;
create policy "Allow inserts to registration_events"
  on public.registration_events for insert
  with check (true);

drop policy if exists "Allow admins to select registration_events" on public.registration_events;
create policy "Allow admins to select registration_events"
  on public.registration_events for select
  using (
    exists (
      select 1 from public.admin_users 
      where admin_users.phone_number = auth.jwt()->>'phone'
         or admin_users.email = auth.jwt()->>'email'
    )
  );

-- contact_messages Policies
drop policy if exists "Allow public inserts to contact_messages" on public.contact_messages;
create policy "Allow public inserts to contact_messages"
  on public.contact_messages for insert
  with check (true);

drop policy if exists "Allow admins to select contact_messages" on public.contact_messages;
create policy "Allow admins to select contact_messages"
  on public.contact_messages for select
  using (
    exists (
      select 1 from public.admin_users 
      where admin_users.phone_number = auth.jwt()->>'phone'
         or admin_users.email = auth.jwt()->>'email'
    )
  );

-- system_settings Policies
drop policy if exists "Allow admins to select system_settings" on public.system_settings;
create policy "Allow admins to select system_settings"
  on public.system_settings for select
  using (
    exists (
      select 1 from public.admin_users 
      where admin_users.phone_number = auth.jwt()->>'phone'
         or admin_users.email = auth.jwt()->>'email'
    )
  );

drop policy if exists "Allow admins to insert system_settings" on public.system_settings;
create policy "Allow admins to insert system_settings"
  on public.system_settings for insert
  with check (
    exists (
      select 1 from public.admin_users 
      where admin_users.phone_number = auth.jwt()->>'phone'
         or admin_users.email = auth.jwt()->>'email'
    )
  );

drop policy if exists "Allow admins to update system_settings" on public.system_settings;
create policy "Allow admins to update system_settings"
  on public.system_settings for update
  using (
    exists (
      select 1 from public.admin_users 
      where admin_users.phone_number = auth.jwt()->>'phone'
         or admin_users.email = auth.jwt()->>'email'
    )
  );


-- 8. Create otp_logs table
create table public.otp_logs (
  id uuid default gen_random_uuid() primary key,
  phone_number text not null,
  status text not null,
  created_at timestamptz default now() not null
);

-- 9. Create otp_locks table for brute-force protection
create table public.otp_locks (
  id uuid default gen_random_uuid() primary key,
  phone_number text not null unique,
  failed_attempts integer default 0 not null,
  locked_until timestamptz,
  updated_at timestamptz default now() not null
);

-- 10. Create whatsapp_logs table
create table public.whatsapp_logs (
  id uuid default gen_random_uuid() primary key,
  phone_number_masked text not null,
  message_type text not null,
  status text not null,
  meta_message_id text,
  created_at timestamptz default now() not null
);

-- 11. (Placeholder - Moved to section 5b above)

-- 12. Update registrations table to support separate mobile number, payment, and status details
alter table public.registrations add column if not exists mobile_number text;
alter table public.registrations add column if not exists payment_status text default 'PENDING' not null;
alter table public.registrations add column if not exists payment_id text;
alter table public.registrations add column if not exists registration_status text default 'DRAFT' not null;
alter table public.registrations add column if not exists mobile_verified boolean default false not null;

-- Enable RLS on all logging and auth tables
alter table public.otp_logs enable row level security;
alter table public.otp_locks enable row level security;
alter table public.whatsapp_logs enable row level security;
alter table public.admin_users enable row level security;

-- 13. Add user_id column to registrations referencing auth.users
alter table public.registrations 
  add column if not exists user_id uuid references auth.users(id) on delete set null;

-- 14. Drop legacy anonymous and phone-based policies on registrations table
drop policy if exists "Allow anonymous selects to registrations" on public.registrations;
drop policy if exists "Allow anonymous updates to registrations" on public.registrations;
drop policy if exists "Allow parents to select their own registrations" on public.registrations;
drop policy if exists "Allow parents to update their own registrations" on public.registrations;

-- 15. Create secure policies checking auth.uid() or admin status
create policy "Allow parents to select their own registrations"
  on public.registrations for select
  using (
    (auth.role() = 'authenticated' and user_id = auth.uid())
    or
    exists (
      select 1 from public.admin_users 
      where admin_users.phone_number = auth.jwt()->>'phone'
         or admin_users.email = auth.jwt()->>'email'
    )
  );

create policy "Allow parents to update their own registrations"
  on public.registrations for update
  using (
    (auth.role() = 'authenticated' and user_id = auth.uid())
    or
    exists (
      select 1 from public.admin_users 
      where admin_users.phone_number = auth.jwt()->>'phone'
         or admin_users.email = auth.jwt()->>'email'
    )
  );

-- 16. Enable inserts for everyone (draft registrations creation)
drop policy if exists "Allow inserts to registrations" on public.registrations;
create policy "Allow inserts to registrations"
  on public.registrations for insert
  with check (true);

-- 17. Secure admin_users table (users read their own admin role details)
drop policy if exists "Allow authenticated users to read admin roles" on public.admin_users;
drop policy if exists "Allow users to read their own admin role" on public.admin_users;
create policy "Allow users to read their own admin role"
  on public.admin_users for select
  using (
    phone_number = auth.jwt()->>'phone'
    or email = auth.jwt()->>'email'
  );

-- 18. Secure whatsapp_logs table (gated to admin roles only)
drop policy if exists "Allow admins to select whatsapp_logs" on public.whatsapp_logs;
create policy "Allow admins to select whatsapp_logs"
  on public.whatsapp_logs for select
  using (
    exists (
      select 1 from public.admin_users 
      where admin_users.phone_number = auth.jwt()->>'phone'
         or admin_users.email = auth.jwt()->>'email'
    )
  );

-- 19. Add cnts_id unique column to registrations table & deprecate old OTP tables
alter table public.registrations add column if not exists cnts_id text unique;
alter table public.registrations add column if not exists coupon_code text;

-- Note: Table public.otp_logs and public.otp_locks are retained for historical backward compatibility but marked as DEPRECATED.

-- 20. Create coupons table for promotional discount codes
create table if not exists public.coupons (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  discount_percent integer not null check (discount_percent >= 0 and discount_percent <= 100),
  is_active boolean default true not null,
  created_at timestamptz default now() not null
);

-- Enable RLS for coupons
alter table public.coupons enable row level security;

-- Seed default coupons
insert into public.coupons (code, discount_percent) values
  ('FOUNDER50', 50),
  ('SCHOOL25', 25)
on conflict (code) do nothing;

-- 21. Create results table
create table if not exists public.results (
  id uuid default gen_random_uuid() primary key,
  cnts_id text not null unique references public.registrations(cnts_id) on delete cascade,
  overall_score numeric(5,2) not null,
  percentile numeric(5,2) not null,
  national_rank integer not null,
  state_rank integer not null,
  logical_reasoning_score numeric(5,2) not null,
  mathematics_score numeric(5,2) not null,
  language_score numeric(5,2) not null,
  general_awareness_score numeric(5,2) not null,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.results enable row level security;

-- Admin Policy: Admins can view results
drop policy if exists "Allow admins to select results" on public.results;
create policy "Allow admins to select results"
  on public.results for select
  using (
    exists (
      select 1 from public.admin_users 
      where admin_users.phone_number = auth.jwt()->>'phone'
         or admin_users.email = auth.jwt()->>'email'
    )
  );

-- Parent Policy: Parents can view their child's results
drop policy if exists "Allow parents to select their own results" on public.results;
create policy "Allow parents to select their own results"
  on public.results for select
  using (
    exists (
      select 1 from public.registrations
      where registrations.cnts_id = results.cnts_id
        and (registrations.user_id = auth.uid()
             or registrations.mobile_number = auth.jwt()->>'phone'
             or registrations.parent_email = auth.jwt()->>'email')
    )
  );

-- 8. Create schools table
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

-- Alter registrations to link school_id
alter table public.registrations add column school_id uuid references public.schools(id);

-- Enable RLS for schools
alter table public.schools enable row level security;

-- 22. Create rate_limit_attempts table
create table if not exists public.rate_limit_attempts (
  id uuid default gen_random_uuid() primary key,
  ip_hash text not null,
  endpoint text not null,
  attempted_at timestamptz default now() not null
);

-- Create index for faster rate limit validation
create index if not exists rate_limit_attempts_ip_hash_endpoint_idx 
  on public.rate_limit_attempts(ip_hash, endpoint);

