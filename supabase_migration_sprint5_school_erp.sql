-- 1. Create school_coordinators table
create table if not exists public.school_coordinators (
  id uuid default gen_random_uuid() primary key,
  school_id uuid not null references public.schools(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null unique,
  role text default 'COORDINATOR' not null, -- 'PRINCIPAL', 'ADMIN', 'COORDINATOR', 'TEACHER'
  permissions jsonb default '[]'::jsonb not null,
  created_at timestamptz default now() not null
);

-- 2. Create school_fee_ledger table
create table if not exists public.school_fee_ledger (
  id uuid default gen_random_uuid() primary key,
  school_id uuid not null references public.schools(id) on delete cascade,
  transaction_type text not null, -- 'INVOICE', 'PAYMENT', 'REFUND', 'SPONSORED_CREDIT'
  amount numeric(10,2) not null,
  outstanding_balance numeric(10,2) not null,
  reference_id text, -- invoice_id or payment_intent_id
  created_at timestamptz default now() not null
);

-- 3. Create school_documents table
create table if not exists public.school_documents (
  id uuid default gen_random_uuid() primary key,
  school_id uuid not null references public.schools(id) on delete cascade,
  document_type text not null, -- 'MOU', 'GST', 'PRINCIPAL_AUTH', 'SPONSOR_AGREEMENT'
  storage_path text not null,
  uploaded_by uuid not null,
  created_at timestamptz default now() not null
);

-- 4. Create school_upload_batches table
create table if not exists public.school_upload_batches (
  id uuid default gen_random_uuid() primary key,
  school_id uuid not null references public.schools(id) on delete cascade,
  uploaded_by uuid not null,
  storage_path text not null,
  status text default 'PENDING' not null, -- 'PENDING', 'VALIDATING', 'PROCESSED', 'FAILED'
  total_rows integer,
  success_rows integer,
  failed_rows integer,
  error_log jsonb default '[]'::jsonb,
  created_at timestamptz default now() not null
);

-- 5. Create school_audit_logs table
create table if not exists public.school_audit_logs (
  id uuid default gen_random_uuid() primary key,
  school_id uuid not null references public.schools(id) on delete cascade,
  actor_id uuid not null,
  action text not null, -- 'COORDINATOR_LOGIN', 'CSV_UPLOADED', 'LEDGER_MODIFIED'
  ip_address text,
  details jsonb default '{}'::jsonb not null,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.school_coordinators enable row level security;
alter table public.school_fee_ledger enable row level security;
alter table public.school_documents enable row level security;
alter table public.school_upload_batches enable row level security;
alter table public.school_audit_logs enable row level security;

-- Helper check function for school coordinator access
create or replace function public.is_school_coordinator(p_school_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.school_coordinators
    where school_id = p_school_id
      and user_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- Drop policies if any
drop policy if exists "Coordinators view own school members" on public.school_coordinators;
drop policy if exists "Coordinators ledger access" on public.school_fee_ledger;
drop policy if exists "Coordinators documents access" on public.school_documents;
drop policy if exists "Coordinators upload batches access" on public.school_upload_batches;
drop policy if exists "Coordinators view own audits" on public.school_audit_logs;

-- Create policies
create policy "Coordinators view own school members" on public.school_coordinators for select
  using (public.is_school_coordinator(school_id));

create policy "Coordinators ledger access" on public.school_fee_ledger for all
  using (public.is_school_coordinator(school_id));

create policy "Coordinators documents access" on public.school_documents for all
  using (public.is_school_coordinator(school_id));

create policy "Coordinators upload batches access" on public.school_upload_batches for all
  using (public.is_school_coordinator(school_id));

create policy "Coordinators view own audits" on public.school_audit_logs for select
  using (public.is_school_coordinator(school_id));

-- Admin policies
drop policy if exists "Admins have full access to coordinators" on public.school_coordinators;
drop policy if exists "Admins have full access to school ledger" on public.school_fee_ledger;
drop policy if exists "Admins have full access to school documents" on public.school_documents;
drop policy if exists "Admins have full access to school batches" on public.school_upload_batches;
drop policy if exists "Admins have full access to school audits" on public.school_audit_logs;

create policy "Admins have full access to coordinators" on public.school_coordinators for all using (public.is_admin_user());
create policy "Admins have full access to school ledger" on public.school_fee_ledger for all using (public.is_admin_user());
create policy "Admins have full access to school documents" on public.school_documents for all using (public.is_admin_user());
create policy "Admins have full access to school batches" on public.school_upload_batches for all using (public.is_admin_user());
create policy "Admins have full access to school audits" on public.school_audit_logs for all using (public.is_admin_user());

-- Create index optimizations
create index if not exists idx_coordinators_school on public.school_coordinators(school_id);
create index if not exists idx_fee_ledger_school on public.school_fee_ledger(school_id);
create index if not exists idx_school_docs_school on public.school_documents(school_id);
create index if not exists idx_upload_batches_school on public.school_upload_batches(school_id);
create index if not exists idx_school_audit_school on public.school_audit_logs(school_id);
