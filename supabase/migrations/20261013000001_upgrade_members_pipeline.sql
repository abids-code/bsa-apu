alter table public.members
add column decline_reason text;

create index members_seniority_idx
on public.members (approval_status, created_at desc);

alter table public.committee_members
add column linkedin_url text;
