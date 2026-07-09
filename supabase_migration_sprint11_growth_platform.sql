-- 1. Create growth_referrals table
create table if not exists public.growth_referrals (
  id uuid default gen_random_uuid() primary key,
  referrer_id text not null, -- candidate_id or coordinator_id
  referrer_role text not null, -- 'PARENT', 'STUDENT', 'SCHOOL', 'AMBASSADOR'
  referral_code text not null unique,
  total_clicks integer default 0 not null,
  total_registrations integer default 0 not null,
  created_at timestamptz default now() not null
);

-- 2. Create growth_sponsors table
create table if not exists public.growth_sponsors (
  id uuid default gen_random_uuid() primary key,
  company_name text not null,
  contact_person text not null,
  package_type text not null, -- 'PLATINUM', 'GOLD', 'SILVER'
  total_seats_funded integer not null,
  allocated_seats integer default 0 not null,
  status text default 'ACTIVE' not null, -- 'LEAD', 'APPROVED', 'ACTIVE', 'COMPLETED'
  contract_url text,
  created_at timestamptz default now() not null
);

-- 3. Create growth_coupons table
create table if not exists public.growth_coupons (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  discount_type text not null, -- 'PERCENTAGE', 'FIXED', 'FREE'
  value numeric(10,2) not null,
  max_uses integer,
  current_uses integer default 0 not null,
  restrictions jsonb default '{}'::jsonb not null, -- school_id, class, or state bounds
  expires_at timestamptz,
  created_at timestamptz default now() not null
);

-- 4. Create growth_rewards table
create table if not exists public.growth_rewards (
  id uuid default gen_random_uuid() primary key,
  referrer_id text not null,
  reward_type text not null, -- 'WALLET_CREDIT', 'MERCHANDISE', 'COUPON'
  amount numeric(10,2) default 0.00,
  details jsonb default '{}'::jsonb not null,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.growth_referrals enable row level security;
alter table public.growth_sponsors enable row level security;
alter table public.growth_coupons enable row level security;
alter table public.growth_rewards enable row level security;

-- Drop existing policies if any
drop policy if exists "Admin growth referrals access" on public.growth_referrals;
drop policy if exists "Admin growth sponsors access" on public.growth_sponsors;
drop policy if exists "Admin growth coupons access" on public.growth_coupons;
drop policy if exists "Admin growth rewards access" on public.growth_rewards;

-- Create policies (only verified admins can access growth control tables)
create policy "Admin growth referrals access" on public.growth_referrals for all using (public.is_admin_user());
create policy "Admin growth sponsors access" on public.growth_sponsors for all using (public.is_admin_user());
create policy "Admin growth coupons access" on public.growth_coupons for all using (public.is_admin_user());
create policy "Admin growth rewards access" on public.growth_rewards for all using (public.is_admin_user());

-- Create performance indexes
create index if not exists idx_growth_referrals_code on public.growth_referrals(referral_code);
create index if not exists idx_growth_sponsors_status on public.growth_sponsors(status);
create index if not exists idx_growth_coupons_code on public.growth_coupons(code);
create index if not exists idx_growth_rewards_referrer on public.growth_rewards(referrer_id);
