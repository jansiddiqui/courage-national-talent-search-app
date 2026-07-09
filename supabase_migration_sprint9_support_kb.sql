-- Create support_article_feedback table
create table if not exists public.support_article_feedback (
  id uuid default gen_random_uuid() primary key,
  article_id uuid not null references public.support_articles(id) on delete cascade,
  helpful boolean not null,
  reason text,
  created_at timestamptz default now() not null
);

-- Enable RLS and add policies
alter table public.support_article_feedback enable row level security;

drop policy if exists "Allow public to insert article feedback" on public.support_article_feedback;
drop policy if exists "Allow admins to read feedback" on public.support_article_feedback;

create policy "Allow public to insert article feedback" on public.support_article_feedback for insert with check (true);
create policy "Allow admins to read feedback" on public.support_article_feedback for select using (public.is_admin_user());
