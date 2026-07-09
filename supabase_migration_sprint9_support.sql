-- 1. Create support_tickets table
create table if not exists public.support_tickets (
  id uuid default gen_random_uuid() primary key,
  ticket_number text unique not null,
  requester_id text not null,
  requester_role text not null,
  category text not null, -- 'PAYMENTS', 'EXAM_ISSUES', 'LOGIN'
  priority text default 'MEDIUM' not null, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  status text default 'OPEN' not null, -- 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'
  subject text not null,
  description text not null,
  assigned_to uuid references public.admin_users(id) on delete set null,
  metadata jsonb default '{}'::jsonb not null, -- Browser, OS, connection logs
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Create support_ticket_messages table
create table if not exists public.support_ticket_messages (
  id uuid default gen_random_uuid() primary key,
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  sender_id text not null,
  sender_role text not null,
  message text not null,
  attachments jsonb default '[]'::jsonb not null,
  created_at timestamptz default now() not null
);

-- 3. Create support_articles table
create table if not exists public.support_articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  category text not null,
  content text not null,
  version integer default 1 not null,
  published boolean default true not null,
  created_at timestamptz default now() not null
);

-- 4. Create support_chat_sessions table
create table if not exists public.support_chat_sessions (
  id uuid default gen_random_uuid() primary key,
  requester_id text not null,
  assigned_agent uuid references public.admin_users(id) on delete set null,
  status text default 'ACTIVE' not null, -- 'ACTIVE', 'ENDED'
  started_at timestamptz default now() not null,
  ended_at timestamptz
);

-- 5. Create support_feedback table
create table if not exists public.support_feedback (
  id uuid default gen_random_uuid() primary key,
  requester_id text not null,
  ticket_id uuid references public.support_tickets(id) on delete set null,
  rating integer not null, -- 1 to 5 stars
  comments text,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.support_tickets enable row level security;
alter table public.support_ticket_messages enable row level security;
alter table public.support_articles enable row level security;
alter table public.support_chat_sessions enable row level security;
alter table public.support_feedback enable row level security;

-- Drop existing policies if any
drop policy if exists "Admin support tickets access" on public.support_tickets;
drop policy if exists "Admin ticket messages access" on public.support_ticket_messages;
drop policy if exists "Admin support articles access" on public.support_articles;
drop policy if exists "Admin support chat access" on public.support_chat_sessions;
drop policy if exists "Admin support feedback access" on public.support_feedback;

-- Create policies (only verified admins can access all support desk tables)
create policy "Admin support tickets access" on public.support_tickets for all using (public.is_admin_user());
create policy "Admin ticket messages access" on public.support_ticket_messages for all using (public.is_admin_user());
create policy "Admin support articles access" on public.support_articles for all using (public.is_admin_user());
create policy "Admin support chat access" on public.support_chat_sessions for all using (public.is_admin_user());
create policy "Admin support feedback access" on public.support_feedback for all using (public.is_admin_user());

-- Create policies for public search and articles select (Everyone can read published KB articles)
drop policy if exists "Public read articles" on public.support_articles;
create policy "Public read articles" on public.support_articles for select
  using (published = true);

-- Create performance indexes
create index if not exists idx_support_tickets_requester on public.support_tickets(requester_id);
create index if not exists idx_support_messages_ticket on public.support_ticket_messages(ticket_id);
create index if not exists idx_support_articles_slug on public.support_articles(slug);
create index if not exists idx_chat_sessions_requester on public.support_chat_sessions(requester_id);
create index if not exists idx_support_feedback_ticket on public.support_feedback(ticket_id);
