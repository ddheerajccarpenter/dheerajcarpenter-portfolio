-- =============================================================================
-- SUPABASE FULL REFRESH SCRIPT (SAFE / IDEMPOTENT)
-- Run: Supabase Dashboard -> SQL Editor -> paste all -> Run
-- SAFE: Never drops tables or removes data.
--       Adds missing columns, refreshes RLS, seeds only if missing.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- ADD MISSING COLUMNS (safe, no error if already exists)
-- =============================================================================
DO $body$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='avatar_url') THEN ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='updated_at') THEN ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(); END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='site_settings' AND column_name='resume_url') THEN ALTER TABLE public.site_settings ADD COLUMN resume_url TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='site_settings' AND column_name='resume_filename') THEN ALTER TABLE public.site_settings ADD COLUMN resume_filename TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='site_settings' AND column_name='resume_updated_at') THEN ALTER TABLE public.site_settings ADD COLUMN resume_updated_at TIMESTAMPTZ; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='site_settings' AND column_name='animation_style') THEN ALTER TABLE public.site_settings ADD COLUMN animation_style TEXT DEFAULT 'new'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='site_settings' AND column_name='ui_design') THEN ALTER TABLE public.site_settings ADD COLUMN ui_design TEXT DEFAULT 'minimalist'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='site_settings' AND column_name='contact_email') THEN ALTER TABLE public.site_settings ADD COLUMN contact_email TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='site_settings' AND column_name='default_theme') THEN ALTER TABLE public.site_settings ADD COLUMN default_theme TEXT NOT NULL DEFAULT 'system'; END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='home_content' AND column_name='hero_image_url') THEN ALTER TABLE public.home_content ADD COLUMN hero_image_url TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='home_content' AND column_name='contact_cta') THEN ALTER TABLE public.home_content ADD COLUMN contact_cta TEXT NOT NULL DEFAULT 'Let us collaborate on your next project.'; END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='about_content' AND column_name='overview') THEN ALTER TABLE public.about_content ADD COLUMN overview TEXT NOT NULL DEFAULT 'Passionate about clean architecture...'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='about_content' AND column_name='photo_url') THEN ALTER TABLE public.about_content ADD COLUMN photo_url TEXT; END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='gallery') THEN ALTER TABLE public.projects ADD COLUMN gallery TEXT[] DEFAULT '{}'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='tags') THEN ALTER TABLE public.projects ADD COLUMN tags TEXT[] DEFAULT '{}'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='live_url') THEN ALTER TABLE public.projects ADD COLUMN live_url TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='source_url') THEN ALTER TABLE public.projects ADD COLUMN source_url TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='featured') THEN ALTER TABLE public.projects ADD COLUMN featured BOOLEAN NOT NULL DEFAULT FALSE; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='projects' AND column_name='published') THEN ALTER TABLE public.projects ADD COLUMN published BOOLEAN NOT NULL DEFAULT TRUE; END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='experience' AND column_name='published') THEN ALTER TABLE public.experience ADD COLUMN published BOOLEAN NOT NULL DEFAULT TRUE; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='experience' AND column_name='url') THEN ALTER TABLE public.experience ADD COLUMN url TEXT; END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='blog_posts' AND column_name='excerpt') THEN ALTER TABLE public.blog_posts ADD COLUMN excerpt TEXT NOT NULL DEFAULT ''; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='blog_posts' AND column_name='cover_url') THEN ALTER TABLE public.blog_posts ADD COLUMN cover_url TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='blog_posts' AND column_name='tags') THEN ALTER TABLE public.blog_posts ADD COLUMN tags TEXT[] DEFAULT '{}'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='blog_posts' AND column_name='reading_time_minutes') THEN ALTER TABLE public.blog_posts ADD COLUMN reading_time_minutes INT NOT NULL DEFAULT 5; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='blog_posts' AND column_name='featured') THEN ALTER TABLE public.blog_posts ADD COLUMN featured BOOLEAN NOT NULL DEFAULT FALSE; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='blog_posts' AND column_name='published_at') THEN ALTER TABLE public.blog_posts ADD COLUMN published_at TIMESTAMPTZ; END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='admin_notes' AND column_name='completed') THEN ALTER TABLE public.admin_notes ADD COLUMN completed BOOLEAN NOT NULL DEFAULT FALSE; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='admin_notes' AND column_name='color') THEN ALTER TABLE public.admin_notes ADD COLUMN color TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='admin_notes' AND column_name='image_url') THEN ALTER TABLE public.admin_notes ADD COLUMN image_url TEXT; END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='testimonials' AND column_name='avatar_url') THEN ALTER TABLE public.testimonials ADD COLUMN avatar_url TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='testimonials' AND column_name='company') THEN ALTER TABLE public.testimonials ADD COLUMN company TEXT; END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='certifications' AND column_name='certificate_path') THEN ALTER TABLE public.certifications ADD COLUMN certificate_path TEXT; END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='service_offerings' AND column_name='tagline') THEN ALTER TABLE public.service_offerings ADD COLUMN tagline TEXT NOT NULL DEFAULT ''; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='service_offerings' AND column_name='deliverables') THEN ALTER TABLE public.service_offerings ADD COLUMN deliverables TEXT[] DEFAULT '{}'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='service_offerings' AND column_name='price_range') THEN ALTER TABLE public.service_offerings ADD COLUMN price_range TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='service_offerings' AND column_name='icon') THEN ALTER TABLE public.service_offerings ADD COLUMN icon TEXT; END IF;
END $body$;

-- =============================================================================
-- ENSURE ALL 17 TABLES EXIST
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_title TEXT NOT NULL DEFAULT 'Dheeraj Carpenter',
  site_description TEXT NOT NULL DEFAULT 'Portfolio of Dheeraj Carpenter',
  contact_email TEXT,
  resume_url TEXT,
  resume_filename TEXT,
  resume_updated_at TIMESTAMPTZ,
  default_theme TEXT NOT NULL DEFAULT 'system',
  animation_style TEXT DEFAULT 'new',
  ui_design TEXT DEFAULT 'minimalist',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.home_content (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_name TEXT NOT NULL DEFAULT 'Dheeraj Carpenter',
  hero_role TEXT NOT NULL DEFAULT 'Software Engineer & Designer',
  hero_intro TEXT NOT NULL DEFAULT 'Welcome to my portfolio.',
  hero_image_url TEXT,
  primary_cta_label TEXT NOT NULL DEFAULT 'View Projects',
  primary_cta_href TEXT NOT NULL DEFAULT '/projects',
  secondary_cta_label TEXT NOT NULL DEFAULT 'Contact',
  secondary_cta_href TEXT NOT NULL DEFAULT '/contact',
  about_preview TEXT NOT NULL DEFAULT 'Full-stack software engineer...',
  contact_cta TEXT NOT NULL DEFAULT 'Let us collaborate on your next project.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.about_content (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  headline TEXT NOT NULL DEFAULT 'About Me',
  bio TEXT NOT NULL DEFAULT 'Software engineer with expertise in Next.js...',
  overview TEXT NOT NULL DEFAULT 'Passionate about clean architecture...',
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  proficiency INT CHECK (proficiency BETWEEN 0 AND 100),
  "order" INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('work', 'education', 'certification')),
  role TEXT NOT NULL,
  organization TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT NOT NULL DEFAULT '',
  url TEXT,
  "order" INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  cover_url TEXT,
  gallery TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  live_url TEXT,
  source_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  "order" INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  "order" INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.seo_metadata (
  page_key TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  og_image_url TEXT,
  canonical_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE,
  credential_link TEXT,
  certificate_path TEXT,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  "order" INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  company TEXT,
  avatar_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT TRUE,
  "order" INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.service_offerings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  deliverables TEXT[] DEFAULT '{}',
  price_range TEXT,
  icon TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  "order" INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  cover_url TEXT,
  tags TEXT[] DEFAULT '{}',
  reading_time_minutes INT NOT NULL DEFAULT 5,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  details TEXT NOT NULL,
  user_email TEXT NOT NULL DEFAULT 'admin@system.local',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admin_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  color TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.public_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'announcement', 'alert', 'success')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- RLS POLICIES (refresh all - safe, uses DROP IF EXISTS then recreates)
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles full access" ON public.profiles;
CREATE POLICY "Profiles full access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.profiles TO anon, authenticated, service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Site settings full access" ON public.site_settings;
CREATE POLICY "Site settings full access" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.site_settings TO anon, authenticated, service_role;

ALTER TABLE public.home_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Home content full access" ON public.home_content;
CREATE POLICY "Home content full access" ON public.home_content FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.home_content TO anon, authenticated, service_role;

ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "About content full access" ON public.about_content;
CREATE POLICY "About content full access" ON public.about_content FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.about_content TO anon, authenticated, service_role;

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Skills full access" ON public.skills;
DROP POLICY IF EXISTS "Skills public read" ON public.skills;
DROP POLICY IF EXISTS "Skills: public read" ON public.skills;
DROP POLICY IF EXISTS "Skills: admin write" ON public.skills;
CREATE POLICY "Skills full access" ON public.skills FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.skills TO anon, authenticated, service_role;

ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Experience full access" ON public.experience;
CREATE POLICY "Experience full access" ON public.experience FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.experience TO anon, authenticated, service_role;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Projects full access" ON public.projects;
CREATE POLICY "Projects full access" ON public.projects FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.projects TO anon, authenticated, service_role;

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Social links full access" ON public.social_links;
CREATE POLICY "Social links full access" ON public.social_links FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.social_links TO anon, authenticated, service_role;

ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Seo metadata full access" ON public.seo_metadata;
CREATE POLICY "Seo metadata full access" ON public.seo_metadata FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.seo_metadata TO anon, authenticated, service_role;

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Contact submissions full access" ON public.contact_submissions;
CREATE POLICY "Contact submissions full access" ON public.contact_submissions FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.contact_submissions TO anon, authenticated, service_role;

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Certifications full access" ON public.certifications;
CREATE POLICY "Certifications full access" ON public.certifications FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.certifications TO anon, authenticated, service_role;

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Testimonials full access" ON public.testimonials;
CREATE POLICY "Testimonials full access" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.testimonials TO anon, authenticated, service_role;

ALTER TABLE public.service_offerings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Services full access" ON public.service_offerings;
CREATE POLICY "Services full access" ON public.service_offerings FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.service_offerings TO anon, authenticated, service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Blog posts full access" ON public.blog_posts;
CREATE POLICY "Blog posts full access" ON public.blog_posts FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.blog_posts TO anon, authenticated, service_role;

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Audit logs full access" ON public.audit_logs;
CREATE POLICY "Audit logs full access" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.audit_logs TO anon, authenticated, service_role;

ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin notes full access" ON public.admin_notes;
CREATE POLICY "Admin notes full access" ON public.admin_notes FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.admin_notes TO anon, authenticated, service_role;

ALTER TABLE public.public_notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public notifications access" ON public.public_notifications;
CREATE POLICY "Public notifications access" ON public.public_notifications FOR ALL USING (true) WITH CHECK (true);
GRANT ALL ON public.public_notifications TO anon, authenticated, service_role;

-- =============================================================================
-- SEED SINGLETON ROWS (only if not already present)
-- =============================================================================

INSERT INTO public.site_settings (id, site_title, site_description)
VALUES (1, 'Dheeraj Carpenter', 'Portfolio of Dheeraj Carpenter')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.home_content (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.about_content (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_projects_published    ON public.projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured     ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_slug         ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published  ON public.blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug       ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_experience_published  ON public.experience(published);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON public.testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_services_active       ON public.service_offerings(active);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_active  ON public.public_notifications(active);
CREATE INDEX IF NOT EXISTS idx_skills_order          ON public.skills("order");

DO $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  SELECT id, email, 'Dheeraj Carpenter', 'super_admin'
  FROM auth.users LIMIT 1
  ON CONFLICT DO NOTHING;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;