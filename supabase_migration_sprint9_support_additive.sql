-- Additive migration for support ticket internal notes visibility
alter table public.support_ticket_messages add column if not exists is_internal boolean default false not null;
