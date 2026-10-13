create table public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 180),
  email text not null check (length(trim(email)) between 3 and 320),
  semester text not null check (length(trim(semester)) between 1 and 80),
  student_id text not null check (length(trim(student_id)) between 1 and 80),
  nationality text not null default 'Bangladeshi',
  degree_level text not null check (degree_level in ('Bachelor', 'Masters', 'Alumni')),
  department text not null check (department in ('APM', 'APS', 'ST', 'MBA')),
  instagram_url text,
  facebook_url text,
  linkedin_url text,
  image_url text,
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index members_approved_created_idx on public.members (created_at desc)
where approval_status = 'approved';

create index members_pending_created_idx on public.members (created_at desc)
where approval_status = 'pending';

create trigger members_set_updated_at
before update on public.members
for each row execute function public.set_updated_at();

alter table public.members enable row level security;

create policy "Approved members are public"
on public.members for select to anon, authenticated
using (approval_status = 'approved' or (select public.is_admin()));

create policy "Visitors can submit member applications"
on public.members for insert to anon, authenticated
with check (approval_status = 'pending' and nationality = 'Bangladeshi');

create policy "Admins manage member applications"
on public.members for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

grant select, insert on public.members to anon, authenticated;
grant update on public.members to authenticated;

create policy "Member application images are publicly readable"
on storage.objects for select to anon, authenticated
using (bucket_id = 'bsa-gallery' and (storage.foldername(name))[1] = 'members');

create policy "Visitors can upload member application images"
on storage.objects for insert to anon, authenticated
with check (bucket_id = 'bsa-gallery' and (storage.foldername(name))[1] = 'members');

DROP POLICY IF EXISTS "Member application images are publicly readable" ON storage.objects;

create policy "Member application images are publicly readable"
on storage.objects for select to anon, authenticated