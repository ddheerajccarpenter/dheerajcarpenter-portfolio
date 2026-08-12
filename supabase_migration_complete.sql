-- =============================================================================
-- MASTER & IDEMPOTENT SUPABASE MIGRATION SCRIPT (16 TABLES)
-- Copy-paste directly into Supabase Dashboard -> SQL Editor and click "Run".
-- Safe to run multiple times (uses IF NOT EXISTS, DROP POLICY IF EXISTS, etc.)
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure user_role enum supports super_admin if enum exists
DO $$ 
BEGIN 
  ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'super_admin';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ─── 1. PROFILES ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles full access" ON public.profiles;
CREATE POLICY "Profiles full access" ON public.profiles FOR ALL USING (true);
GRANT ALL ON public.profiles TO anon, authenticated, service_role;

-- ─── 2. SITE SETTINGS ────────────────────────────────────────────────────────
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

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Site settings full access" ON public.site_settings;
CREATE POLICY "Site settings full access" ON public.site_settings FOR ALL USING (true);
GRANT ALL ON public.site_settings TO anon, authenticated, service_role;

INSERT INTO public.site_settings (id, site_title, site_description)
VALUES (1, 'Dheeraj Carpenter', 'Portfolio of Dheeraj Carpenter')
ON CONFLICT (id) DO NOTHING;

-- ─── 3. HOME CONTENT ─────────────────────────────────────────────────────────
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

ALTER TABLE public.home_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Home content full access" ON public.home_content;
CREATE POLICY "Home content full access" ON public.home_content FOR ALL USING (true);
GRANT ALL ON public.home_content TO anon, authenticated, service_role;

INSERT INTO public.home_content (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ─── 4. ABOUT CONTENT ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.about_content (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  headline TEXT NOT NULL DEFAULT 'About Me',
  bio TEXT NOT NULL DEFAULT 'Software engineer with expertise in Next.js...',
  overview TEXT NOT NULL DEFAULT 'Passionate about clean architecture...',
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "About content full access" ON public.about_content;
CREATE POLICY "About content full access" ON public.about_content FOR ALL USING (true);
GRANT ALL ON public.about_content TO anon, authenticated, service_role;

INSERT INTO public.about_content (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ─── 5. SKILLS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  proficiency INT CHECK (proficiency BETWEEN 0 AND 100),
  "order" INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Skills full access" ON public.skills;
DROP POLICY IF EXISTS "Skills: admin write" ON public.skills;
DROP POLICY IF EXISTS "Skills: public read" ON public.skills;
DROP POLICY IF EXISTS "Skills public read" ON public.skills;
CREATE POLICY "Skills public read" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Skills full access" ON public.skills FOR ALL USING (true);
GRANT ALL ON public.skills TO anon, authenticated, service_role;

-- ─── 6. EXPERIENCE ───────────────────────────────────────────────────────────
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

ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Experience full access" ON public.experience;
CREATE POLICY "Experience full access" ON public.experience FOR ALL USING (true);
GRANT ALL ON public.experience TO anon, authenticated, service_role;

-- ─── 7. PROJECTS ─────────────────────────────────────────────────────────────
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

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Projects full access" ON public.projects;
CREATE POLICY "Projects full access" ON public.projects FOR ALL USING (true);
GRANT ALL ON public.projects TO anon, authenticated, service_role;

-- ─── 8. SOCIAL LINKS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  "order" INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Social links full access" ON public.social_links;
CREATE POLICY "Social links full access" ON public.social_links FOR ALL USING (true);
GRANT ALL ON public.social_links TO anon, authenticated, service_role;

-- ─── 9. SEO METADATA ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.seo_metadata (
  page_key TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  og_image_url TEXT,
  canonical_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Seo metadata full access" ON public.seo_metadata;
CREATE POLICY "Seo metadata full access" ON public.seo_metadata FOR ALL USING (true);
GRANT ALL ON public.seo_metadata TO anon, authenticated, service_role;

-- ─── 10. CONTACT SUBMISSIONS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Contact submissions full access" ON public.contact_submissions;
CREATE POLICY "Contact submissions full access" ON public.contact_submissions FOR ALL USING (true);
GRANT ALL ON public.contact_submissions TO anon, authenticated, service_role;

-- ─── 11. CERTIFICATIONS ──────────────────────────────────────────────────────
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

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Certifications full access" ON public.certifications;
CREATE POLICY "Certifications full access" ON public.certifications FOR ALL USING (true);
GRANT ALL ON public.certifications TO anon, authenticated, service_role;

-- ─── 12. TESTIMONIALS ────────────────────────────────────────────────────────
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

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Testimonials full access" ON public.testimonials;
CREATE POLICY "Testimonials full access" ON public.testimonials FOR ALL USING (true);
GRANT ALL ON public.testimonials TO anon, authenticated, service_role;

-- ─── 13. SERVICE OFFERINGS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.service_offerings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  deliverables TEXT[] DEFAULT '{}',
  price_range TEXT,
  icon TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  "order" INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.service_offerings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Services full access" ON public.service_offerings;
CREATE POLICY "Services full access" ON public.service_offerings FOR ALL USING (true);
GRANT ALL ON public.service_offerings TO anon, authenticated, service_role;

-- ─── 14. BLOG POSTS ──────────────────────────────────────────────────────────
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

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Blog posts full access" ON public.blog_posts;
CREATE POLICY "Blog posts full access" ON public.blog_posts FOR ALL USING (true);
GRANT ALL ON public.blog_posts TO anon, authenticated, service_role;

-- ─── 15. AUDIT LOGS ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  details TEXT NOT NULL,
  user_email TEXT NOT NULL DEFAULT 'admin@system.local',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Audit logs full access" ON public.audit_logs;
CREATE POLICY "Audit logs full access" ON public.audit_logs FOR ALL USING (true);
GRANT ALL ON public.audit_logs TO anon, authenticated, service_role;

-- ─── 16. ADMIN NOTES (WITH IMAGE_URL) ────────────────────────────────────────
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

ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin notes full access" ON public.admin_notes;
CREATE POLICY "Admin notes full access" ON public.admin_notes FOR ALL USING (true);
GRANT ALL ON public.admin_notes TO anon, authenticated, service_role;

-- ─── 17. PUBLIC NOTIFICATIONS (BROADCAST ANNOUNCEMENTS) ──────────────────────
CREATE TABLE IF NOT EXISTS public.public_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'announcement', 'alert', 'success')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.public_notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public notifications access" ON public.public_notifications;
CREATE POLICY "Public notifications access" ON public.public_notifications FOR ALL USING (true);
GRANT ALL ON public.public_notifications TO anon, authenticated, service_role;

-- ─── IDEMPOTENT INDEXES ──────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_experience_published ON public.experience(published);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON public.testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_service_offerings_active ON public.service_offerings(active);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ─── 17. SECURE ADMIN USER INITIALISATION (BACKEND ONLY) ───────────────────
DO $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  SELECT id, email, 'Dheeraj Carpenter', 'super_admin'
  FROM auth.users
  WHERE email = 'dheeraj@carpenter.com'
  ON CONFLICT DO NOTHING;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- =============================================================================
-- Master Migration Complete! Safe to run on any new or existing Supabase project.
-- =============================================================================
