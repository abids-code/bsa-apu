create table public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 180),
  description text not null default '' check (length(trim(description)) <= 2000),
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.gallery_items
add column album_id uuid references public.gallery_albums (id) on delete set null;

create index gallery_albums_created_idx on public.gallery_albums (created_at desc);
create index gallery_items_album_idx on public.gallery_items (album_id);

alter table public.gallery_albums enable row level security;

create policy "Published albums are public"
on public.gallery_albums for select to anon, authenticated
using (published);

create policy "Admins manage albums"
on public.gallery_albums for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

grant select on public.gallery_albums to anon, authenticated;
grant insert, update, delete on public.gallery_albums to authenticated;
