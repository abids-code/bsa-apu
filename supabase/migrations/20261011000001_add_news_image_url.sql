alter table public.news
add column image_url text;

alter table public.news
add constraint news_image_url_length_check
check (image_url is null or length(trim(image_url)) between 1 and 2048);
