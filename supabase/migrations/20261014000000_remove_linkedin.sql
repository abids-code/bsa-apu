alter table public.members
drop column if exists linkedin_url;

alter table public.committee_members
drop column if exists linkedin_url;
