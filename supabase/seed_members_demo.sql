insert into public.members (
  name, email, semester, student_id, nationality, degree_level, department,
  instagram_url, image_url, approval_status
)
select
  demo.name,
  lower(replace(demo.name, ' ', '.')) || '@demo.bsa-apu.org',
  demo.semester,
  'DEMO-' || lpad(demo.position::text, 3, '0'),
  'Bangladeshi',
  demo.degree_level,
  demo.department,
  'https://www.instagram.com/',
  'https://i.pravatar.cc/400?img=' || demo.avatar,
  'approved'
from (values
  ('Rahim Ahmed', '12th semester', 'Masters', 'MBA', 1, 12),
  ('Nusrat Jahan', '11th semester', 'Masters', 'APS', 2, 32),
  ('Sabbir Hossain', '10th semester', 'Bachelor', 'APM', 3, 11),
  ('Maliha Rahman', '9th semester', 'Bachelor', 'ST', 4, 44),
  ('Tanvir Hasan', '8th semester', 'Bachelor', 'APS', 5, 12),
  ('Farzana Islam', '8th semester', 'Bachelor', 'APM', 6, 47),
  ('Mehedi Hasan', '7th semester', 'Bachelor', 'ST', 7, 13),
  ('Tanjim Chowdhury', '7th semester', 'Bachelor', 'APS', 8, 49),
  ('Sadia Afrin', '6th semester', 'Bachelor', 'APM', 9, 5),
  ('Arif Hossain', '6th semester', 'Bachelor', 'ST', 10, 52),
  ('Jannatul Ferdous', '5th semester', 'Bachelor', 'APS', 11, 9),
  ('Rafiul Karim', '5th semester', 'Bachelor', 'APM', 12, 15),
  ('Samia Sultana', '4th semester', 'Bachelor', 'ST', 13, 20),
  ('Nayeem Islam', '4th semester', 'Bachelor', 'APS', 14, 33),
  ('Mim Akter', '3rd semester', 'Bachelor', 'APM', 15, 25),
  ('Shakib Al Mamun', '3rd semester', 'Bachelor', 'ST', 16, 60),
  ('Ayesha Siddika', '2nd semester', 'Bachelor', 'APS', 17, 36),
  ('Imran Kabir', '2nd semester', 'Bachelor', 'APM', 18, 61),
  ('Lamia Nawar', '1st semester', 'Bachelor', 'ST', 19, 26),
  ('Fahim Rahman', '1st semester', 'Bachelor', 'APS', 20, 68),
  ('Raisa Tasnim', '1st semester', 'Bachelor', 'APM', 21, 43),
  ('Adnan Hossain', '1st semester', 'Bachelor', 'ST', 22, 70),
  ('Sohana Akter', 'Alumni', 'Alumni', 'MBA', 23, 48),
  ('Mahin Ahmed', 'Alumni', 'Alumni', 'APS', 24, 51)
) as demo(name, semester, degree_level, department, position, avatar);
