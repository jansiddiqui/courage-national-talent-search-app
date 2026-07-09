-- Migration: Sprint 3 Academy V2 Learning Engine Schema
-- Target: Supabase database additions for CNTS V2

-- 1. Create learning_sessions table
create table if not exists public.learning_sessions (
  id uuid default gen_random_uuid() primary key,
  candidate_id text not null references public.registrations(cnts_id) on delete cascade,
  subject text not null,
  topic_slug text not null,
  started_at timestamptz default now() not null,
  ended_at timestamptz,
  duration_seconds integer,
  device text,
  source text,
  completion_rate numeric default 0.0 not null
);

alter table public.learning_sessions enable row level security;

-- 2. Create topic_mastery table
create table if not exists public.topic_mastery (
  id uuid default gen_random_uuid() primary key,
  candidate_id text not null references public.registrations(cnts_id) on delete cascade,
  topic_slug text not null,
  accuracy numeric default 0.0 not null,
  confidence_score numeric default 0.0 not null,
  time_spent_seconds integer default 0 not null,
  completed_questions jsonb default '[]'::jsonb not null,
  bookmarked_topics jsonb default '[]'::jsonb not null,
  updated_at timestamptz default now() not null,
  constraint unique_candidate_topic unique(candidate_id, topic_slug)
);

alter table public.topic_mastery enable row level security;

-- 3. Create attempts table
create table if not exists public.attempts (
  id uuid default gen_random_uuid() primary key,
  candidate_id text not null references public.registrations(cnts_id) on delete cascade,
  session_id text,
  topic_slug text not null,
  question_id text not null,
  selected_index integer,
  is_correct boolean not null,
  time_taken_ms integer,
  hints_used integer default 0 not null,
  created_at timestamptz default now() not null
);

alter table public.attempts enable row level security;

-- 4. Create revision_tasks table (Mistake Lab - Spaced Repetition)
create table if not exists public.revision_tasks (
  id uuid default gen_random_uuid() primary key,
  candidate_id text not null references public.registrations(cnts_id) on delete cascade,
  topic_slug text not null,
  question_id text not null,
  consecutive_correct_count integer default 0 not null,
  next_scheduled_time timestamptz default now() not null,
  status text default 'PENDING' not null, -- 'PENDING', 'RESOLVED'
  updated_at timestamptz default now() not null,
  constraint unique_candidate_question unique(candidate_id, question_id)
);

alter table public.revision_tasks enable row level security;

-- 5. Create learning_goals table
create table if not exists public.learning_goals (
  id uuid default gen_random_uuid() primary key,
  candidate_id text not null references public.registrations(cnts_id) on delete cascade,
  description text not null,
  goal_type text not null, -- 'LESSONS', 'REVISIONS', 'TIME', 'DAILY_CHALLENGE'
  target_value integer not null,
  current_value integer default 0 not null,
  is_completed boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.learning_goals enable row level security;

-- 6. Create timeline_events table
create table if not exists public.timeline_events (
  id uuid default gen_random_uuid() primary key,
  candidate_id text not null references public.registrations(cnts_id) on delete cascade,
  event_type text not null,
  payload jsonb default '{}'::jsonb not null,
  timestamp timestamptz default now() not null
);

alter table public.timeline_events enable row level security;


-- ─── ROW LEVEL SECURITY (RLS) POLICIES ───────────────────────────────────────

-- Helper function to check if caller has registration access
create or replace function public.is_candidate_owner(p_candidate_id text)
returns boolean as $$
begin
  return exists (
    select 1 from public.registrations
    where registrations.cnts_id = p_candidate_id
      and (registrations.user_id = auth.uid()
           or registrations.mobile_number = auth.jwt()->>'phone'
           or registrations.parent_email = auth.jwt()->>'email')
  );
end;
$$ language plpgsql security definer;

-- 1. Policies for learning_sessions
create policy "Users can manage their own learning sessions"
  on public.learning_sessions for all
  using (public.is_candidate_owner(candidate_id));

-- 2. Policies for topic_mastery
create policy "Users can manage their own topic mastery"
  on public.topic_mastery for all
  using (public.is_candidate_owner(candidate_id));

-- 3. Policies for attempts
create policy "Users can manage their own attempts"
  on public.attempts for all
  using (public.is_candidate_owner(candidate_id));

-- 4. Policies for revision_tasks
create policy "Users can manage their own revision tasks"
  on public.revision_tasks for all
  using (public.is_candidate_owner(candidate_id));

-- 5. Policies for learning_goals
create policy "Users can manage their own learning goals"
  on public.learning_goals for all
  using (public.is_candidate_owner(candidate_id));

-- 6. Policies for timeline_events
create policy "Users can manage their own timeline events"
  on public.timeline_events for all
  using (public.is_candidate_owner(candidate_id));


-- ─── ADMIN POLICIES ─────────────────────────────────────────────────────────

-- Helper function to check if caller is an admin
create or replace function public.is_admin_user()
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_users
    where admin_users.phone_number = auth.jwt()->>'phone'
       or admin_users.email = auth.jwt()->>'email'
  );
end;
$$ language plpgsql security definer;

create policy "Admins have full access to learning_sessions"
  on public.learning_sessions for all using (public.is_admin_user());

create policy "Admins have full access to topic_mastery"
  on public.topic_mastery for all using (public.is_admin_user());

create policy "Admins have full access to attempts"
  on public.attempts for all using (public.is_admin_user());

create policy "Admins have full access to revision_tasks"
  on public.revision_tasks for all using (public.is_admin_user());

create policy "Admins have full access to learning_goals"
  on public.learning_goals for all using (public.is_admin_user());

create policy "Admins have full access to timeline_events"
  on public.timeline_events for all using (public.is_admin_user());
