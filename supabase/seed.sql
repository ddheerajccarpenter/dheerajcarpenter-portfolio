-- ============================================================================
-- Seed data — run AFTER schema.sql AND storage.sql.
--
-- Minimal seed: only the singleton rows every content table requires.
-- All real content is added through the admin dashboard after the first user
-- is created.
-- ============================================================================

-- Site settings singleton
insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

-- Home content singleton
insert into public.home_content (id) values (1)
on conflict (id) do nothing;

-- About content singleton
insert into public.about_content (id) values (1)
on conflict (id) do nothing;

-- SEO metadata stubs — one row per public page
insert into public.seo_metadata (page_key, title) values
  ('home',       'Home'),
  ('about',      'About'),
  ('projects',   'Projects'),
  ('experience', 'Experience'),
  ('contact',    'Contact')
on conflict (page_key) do nothing;
