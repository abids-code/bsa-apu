insert into public.events (
  title,
  slug,
  event_date,
  location,
  tag,
  description,
  published
)
values
  (
    'Nobinboron Fall 2026',
    'nobinboron-fall-2026',
    '2026-10-14',
    'J102, APU',
    'Freshers Welcome',
    'APU BANGLADESHI FRESHERS, THIS IS NOT A DRILL! You survived admission, visa stress, and the ''so what’s your major?'' conversations. NOW IT’S TIME FOR THE MAIN EVENT. 17:30 - 21:00. One night. One community. Unlimited stories to tell.',
    true
  ),
  (
    'Nobinboron Spring 2026',
    'nobinboron-spring-2026',
    '2026-05-16',
    'J204, APU',
    'Freshers Welcome',
    'As a new semester begins, we are delighted to welcome the newest members of the Bangladeshi community at APU through Nobinboron 2026. Freshers today, legends tomorrow.',
    true
  ),
  (
    'BFL Season IX',
    'bfl-season-ix',
    '2026-08-03',
    'APU Field',
    'Sports',
    '8 teams. One trophy. Endless passion. From breathtaking goals to unforgettable moments, BFL IX is ready to bring the heat.',
    true
  ),
  (
    'Happy Pohela Boishakh (শুভ নববর্ষ)',
    'happy-pohela-boishakh-2026',
    '2026-04-13',
    'APU Campus',
    'Cultural',
    'শুভ নববর্ষ | Happy Pohela Boishakh | ハッピー・ポヘラ・ボイシャク. Let the new year bring joy, success, and prosperity to our community.',
    true
  ),
  (
    '21st February - Mother Language Day',
    '21st-february-mother-language-day-2026',
    '2026-02-21',
    'APU',
    'National',
    '২১শে ফেব্রুয়ারি — ভাষার জন্য আত্মত্যাগের ইতিহাস, গৌরবের দিন। A day of sacrifice, pride, and love for our mother language.',
    true
  ),
  (
    'BSA BBQ Party & Winter Gathering',
    'bsa-bbq-party-winter-gathering-2025',
    '2025-12-23',
    'Saganoseki Beach',
    'Community',
    'Good food, ocean breeze, and golden sunsets. BBQ by the sea with good people. BSA hosted a warm winter gathering at Saganoseki Beach.',
    true
  ),
  (
    'Winter Pitha Festival',
    'winter-pitha-festival-2025',
    '2025-12-29',
    'APU',
    'Cultural Food',
    'Winter in Bangladesh is incomplete without deshi pitha! The warmth of the kitchen, the aroma of chal er gura and jaggery, and the joy of sharing food with loved ones.',
    true
  )
on conflict (slug) do update set
  title = excluded.title,
  event_date = excluded.event_date,
  location = excluded.location,
  tag = excluded.tag,
  description = excluded.description,
  published = excluded.published,
  updated_at = now();
