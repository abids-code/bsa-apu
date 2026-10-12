create table public.committee_members (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 180),
  role text not null check (length(trim(role)) between 1 and 180),
  instagram_handle text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.committee_members enable row level security;

create policy "Committee members are public"
on public.committee_members for select to anon, authenticated
using (true);

create policy "Admins manage committee members"
on public.committee_members for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

grant select on public.committee_members to anon, authenticated;
grant insert, update, delete on public.committee_members to authenticated;
