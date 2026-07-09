-- Add SLA tracking columns to support_tickets
alter table public.support_tickets add column if not exists first_response_due_at timestamptz;
alter table public.support_tickets add column if not exists resolution_due_at timestamptz;
alter table public.support_tickets add column if not exists first_responded_at timestamptz;
alter table public.support_tickets add column if not exists resolved_at timestamptz;
alter table public.support_tickets add column if not exists escalation_level integer default 0 not null;
alter table public.support_tickets add column if not exists sla_state text default 'ON_TRACK' not null;

-- Create support_sla_policies table
create table if not exists public.support_sla_policies (
  id uuid default gen_random_uuid() primary key,
  category text not null,
  priority text not null,
  response_time_hours integer not null,
  resolution_time_hours integer not null,
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  constraint unique_cat_priority unique(category, priority)
);

-- Create support_escalations table
create table if not exists public.support_escalations (
  id uuid default gen_random_uuid() primary key,
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  escalation_level integer not null,
  breach_type text not null, -- 'FIRST_RESPONSE', 'RESOLUTION'
  reason text not null,
  created_at timestamptz default now() not null,
  constraint unique_ticket_breach_level unique(ticket_id, breach_type, escalation_level)
);

-- Enable RLS and add policies
alter table public.support_sla_policies enable row level security;
alter table public.support_escalations enable row level security;

drop policy if exists "Admin support sla policies access" on public.support_sla_policies;
drop policy if exists "Admin support escalations access" on public.support_escalations;

create policy "Admin support sla policies access" on public.support_sla_policies for all using (public.is_admin_user());
create policy "Admin support escalations access" on public.support_escalations for all using (public.is_admin_user());
