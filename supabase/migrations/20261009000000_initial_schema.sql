create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 180),
  slug text not null unique check (length(trim(slug)) between 1 and 180),
  event_date date not null,
  location text not null check (length(trim(location)) between 1 and 240),
  tag text not null check (length(trim(tag)) between 1 and 80),
  description text not null check (length(trim(description)) between 1 and 2000),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 180),
  slug text not null unique check (length(trim(slug)) between 1 and 180),
  published_at date not null default current_date,
  excerpt text not null check (length(trim(excerpt)) between 1 and 1000),
  body text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null check (length(trim(image_url)) between 1 and 2048),
  caption text not null check (length(trim(caption)) between 1 and 240),
  alt_text text not null check (length(trim(alt_text)) between 1 and 500),
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 120),
  email text not null check (length(trim(email)) between 3 and 320),
  topic text not null check (topic in ('join', 'arrival', 'event', 'other')),
  message text not null check (length(trim(message)) between 1 and 5000),
  send_updates boolean not null default false,
  notifications_enabled boolean not null default false,
  created_at timestamptz not null default now()
);

create index events_public_date_idx on public.events (event_date) where published;
create index news_public_date_idx on public.news (published_at desc) where published;
create index gallery_public_created_idx on public.gallery_items (created_at desc) where published;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

create trigger news_set_updated_at
before update on public.news
for each row execute function public.set_updated_at();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.news enable row level security;
alter table public.gallery_items enable row level security;
alter table public.contact_messages enable row level security;

create policy "Users can read their own profile and admins can read all profiles"
on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select public.is_admin()));

create policy "Published events are publicly readable"
on public.events for select to anon, authenticated
using (published or (select public.is_admin()));

create policy "Admins can manage events"
on public.events for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Published news is publicly readable"
on public.news for select to anon, authenticated
using (published or (select public.is_admin()));

create policy "Admins can manage news"
on public.news for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Published gallery items are publicly readable"
on public.gallery_items for select to anon, authenticated
using (published or (select public.is_admin()));

create policy "Admins can manage gallery items"
on public.gallery_items for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Visitors can submit contact messages"
on public.contact_messages for insert to anon, authenticated
with check (true);

create policy "Admins can read contact messages"
on public.contact_messages for select to authenticated
using ((select public.is_admin()));

grant select on public.events, public.news, public.gallery_items to anon, authenticated;
grant insert, update, delete on public.events, public.news, public.gallery_items to authenticated;
grant insert on public.contact_messages to anon, authenticated;
grant select on public.contact_messages to authenticated;
grant select on public.profiles to authenticated;
grant execute on function public.is_admin() to anon, authenticated;

insert into public.events (title, slug, event_date, location, tag, description, published)
values
  (
    'Pohela Boishakh 1434',
    'pohela-boishakh-1434',
    '2027-04-14',
    'APU Millennium Hall',
    'Culture',
    'Bengali New Year with panta-ilish, music, alpana art and a mangal shobhajatra across campus.',
    true
  ),
  (
    'Welcome Night for New Students',
    'welcome-night-new-students-2026',
    '2026-10-24',
    'AP House 2 Lounge',
    'Community',
    'Meet seniors, get settling-in tips for Beppu, and enjoy a home-cooked Bangladeshi dinner.',
    true
  ),
  (
    'Victory Day Celebration',
    'victory-day-celebration-2026',
    '2026-12-16',
    'APU Campus Plaza',
    'Heritage',
    'Commemorating 16 December with a flag ceremony, poetry and a cultural programme.',
    true
  ),
  (
    'Bangladesh Night at APU Multicultural Week',
    'bangladesh-night-multicultural-week-2026',
    '2026-11-20',
    'Millennium Hall',
    'Showcase',
    'Our flagship stage show: dance, drama, songs and a food stall for the whole APU community.',
    true
  )
on conflict (slug) do nothing;

insert into public.news (title, slug, published_at, excerpt, published)
values
  (
    'New executive committee announced for 2026–27',
    'executive-committee-2026-27',
    '2026-09-15',
    'BSA welcomes its new leadership team, who will guide the association through the upcoming academic year.',
    true
  ),
  (
    'Record turnout at Eid reunion in Beppu',
    'eid-reunion-beppu',
    '2026-06-08',
    'Over 120 students, alumni and families gathered for an Eid celebration at Beppu Beach Park.',
    true
  ),
  (
    'Arrival guide for spring intake now available',
    'arrival-guide-spring-intake',
    '2026-02-20',
    'Our updated guide covers residence card, bank account, phone SIM and halal food in Beppu.',
    true
  )
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public)
values ('bsa-gallery', 'bsa-gallery', true)
on conflict (id) do update set public = excluded.public;

create policy "Gallery images are publicly readable"
on storage.objects for select to anon, authenticated
using (bucket_id = 'bsa-gallery');

create policy "Admins can upload gallery images"
on storage.objects for insert to authenticated
with check (bucket_id = 'bsa-gallery' and (select public.is_admin()));

create policy "Admins can update gallery images"
on storage.objects for update to authenticated
using (bucket_id = 'bsa-gallery' and (select public.is_admin()))
with check (bucket_id = 'bsa-gallery' and (select public.is_admin()));

create policy "Admins can delete gallery images"
on storage.objects for delete to authenticated
using (bucket_id = 'bsa-gallery' and (select public.is_admin()));
