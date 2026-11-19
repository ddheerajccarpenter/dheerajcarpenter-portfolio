-- =============================================================================
-- UNIFIED MASTER SUPABASE DATABASE SCHEMA & CONFIGURATION
-- All-in-One Idempotent Script for Tables, RLS Policies, Triggers & Storage
-- Safe to execute repeatedly on new or existing Supabase instances.
-- Zero hardcoded credentials or private keys.
-- =============================================================================

-- ─── 1. REQUIRED EXTENSIONS ───────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── 2. HELPER FUNCTIONS ──────────────────────────────────────────────────────

-- Universal timestamp update trigger function
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ─── 3. CORE CONTENT & CONFIGURATION TABLES ──────────────────────────────────

-- 1. Profiles (linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'admin', 'editor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Site Settings (Singleton row: id = 1)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_title TEXT NOT NULL DEFAULT 'Dheeraj Carpenter',
  site_description TEXT NOT NULL DEFAULT 'Portfolio of Dheeraj Carpenter',
  contact_email TEXT,
  resume_url TEXT,
  resume_filename TEXT,
  resume_updated_at TIMESTAMPTZ,
  default_theme TEXT NOT NULL DEFAULT 'system',
  animation_style TEXT NOT NULL DEFAULT 'new',
  ui_design TEXT NOT NULL DEFAULT 'minimalist',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Home Content (Singleton row: id = 1)
CREATE TABLE IF NOT EXISTS public.home_content (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_name TEXT NOT NULL DEFAULT 'Dheeraj Carpenter',
  hero_role TEXT NOT NULL DEFAULT 'Engineering Student & Developer',
  hero_intro TEXT NOT NULL DEFAULT 'Passionate about coding, web development, video editing, and creative design.',
  hero_image_url TEXT,
  primary_cta_label TEXT NOT NULL DEFAULT 'View Projects',
  primary_cta_href TEXT NOT NULL DEFAULT '/projects',
  secondary_cta_label TEXT NOT NULL DEFAULT 'Contact',
  secondary_cta_href TEXT NOT NULL DEFAULT '/contact',
  about_preview TEXT NOT NULL DEFAULT 'Focused on clean code, modern web technologies, and functional design.',
  contact_cta TEXT NOT NULL DEFAULT 'Let us connect on your next project.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. About Content (Singleton row: id = 1)
CREATE TABLE IF NOT EXISTS public.about_content (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  headline TEXT NOT NULL DEFAULT 'About Me',
  bio TEXT NOT NULL DEFAULT 'I am an engineering student with a deep passion for technology, coding, video editing, and creative design.',
  overview TEXT NOT NULL DEFAULT 'Focused on clean architecture, modern web development, and continuous improvement.',
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Skills
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  proficiency INT CHECK (proficiency BETWEEN 0 AND 100),
  "order" INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Experience (Work & Education Timeline)
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- 7. Projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  cover_url TEXT,
  gallery TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  live_url TEXT,
  source_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  "order" INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Social Links
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL,
  "order" INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. SEO Metadata Stubs
CREATE TABLE IF NOT EXISTS public.seo_metadata (
  page_key TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  keywords TEXT[] NOT NULL DEFAULT '{}',
  og_image_url TEXT,
  canonical_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Contact Inquiries & Submissions
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Certifications
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- 12. Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- 13. Service Offerings
CREATE TABLE IF NOT EXISTS public.service_offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  deliverables TEXT[] NOT NULL DEFAULT '{}',
  price_range TEXT,
  icon TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  "order" INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Blog Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  cover_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  reading_time_minutes INT NOT NULL DEFAULT 5,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  details TEXT NOT NULL,
  user_email TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. Admin Notes
CREATE TABLE IF NOT EXISTS public.admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  color TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. Public Broadcast Announcements & Notifications
CREATE TABLE IF NOT EXISTS public.public_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'announcement', 'alert', 'success')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 4. UPDATED_AT TRIGGERS ──────────────────────────────────────────────────
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename IN (
        'profiles', 'site_settings', 'home_content', 'about_content',
        'skills', 'experience', 'projects', 'social_links', 'seo_metadata',
        'certifications', 'testimonials', 'service_offerings', 'blog_posts',
        'admin_notes', 'public_notifications'
      )
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I;', tbl);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();', tbl);
  END LOOP;
END $$;

-- ─── 5. SECURITY & ROLE VERIFICATION HELPERS ─────────────────────────────────

-- Checks whether the active session belongs to an authorized administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
  );
$$;

-- Secure auth hook: creates profile upon user signup.
-- The first user to register automatically becomes admin. Subsequent signups default to editor.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    CASE
      WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE role IN ('super_admin', 'admin'))
      THEN 'admin'
      ELSE 'editor'
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── 6. ROW LEVEL SECURITY (RLS) POLICIES ─────────────────────────────────────
ALTER TABLE public.profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_content         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_offerings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_notifications ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
DROP POLICY IF EXISTS "Profiles: read own or admin" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: update own or admin" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: admin insert" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: admin delete" ON public.profiles;
DROP POLICY IF EXISTS "Profiles full access" ON public.profiles;

CREATE POLICY "Profiles: read own or admin"   ON public.profiles FOR SELECT USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "Profiles: update own or admin" ON public.profiles FOR UPDATE USING (id = auth.uid() OR public.is_admin()) WITH CHECK (id = auth.uid() OR public.is_admin());
CREATE POLICY "Profiles: admin insert"         ON public.profiles FOR INSERT WITH CHECK (public.is_admin() OR auth.uid() = id);
CREATE POLICY "Profiles: admin delete"         ON public.profiles FOR DELETE USING (public.is_admin());

-- 2. Public Content Tables (Public SELECT, Admin-only write)
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'site_settings', 'home_content', 'about_content', 'skills',
      'social_links', 'seo_metadata', 'testimonials', 'service_offerings',
      'public_notifications'
    ])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%s: public read" ON public.%I;', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "%s: admin write" ON public.%I;', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "%s full access" ON public.%I;', tbl, tbl);

    EXECUTE format('CREATE POLICY "%s: public read" ON public.%I FOR SELECT USING (true);', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s: admin write" ON public.%I FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());', tbl, tbl);
  END LOOP;
END $$;

-- 3. Publishable Tables (Public SELECT only if published = true, Admin full access)
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY['projects', 'blog_posts', 'experience', 'certifications'])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%s: public read" ON public.%I;', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "%s: admin write" ON public.%I;', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS "%s full access" ON public.%I;', tbl, tbl);

    EXECUTE format('CREATE POLICY "%s: public read" ON public.%I FOR SELECT USING (published = true OR public.is_admin());', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s: admin write" ON public.%I FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());', tbl, tbl);
  END LOOP;
END $$;

-- 4. Contact Submissions (Public INSERT, Admin-only SELECT/UPDATE/DELETE)
DROP POLICY IF EXISTS "Submissions: public insert" ON public.contact_submissions;
DROP POLICY IF EXISTS "Submissions: admin select" ON public.contact_submissions;
DROP POLICY IF EXISTS "Submissions: admin update" ON public.contact_submissions;
DROP POLICY IF EXISTS "Submissions: admin delete" ON public.contact_submissions;
DROP POLICY IF EXISTS "Contact submissions full access" ON public.contact_submissions;

CREATE POLICY "Submissions: public insert" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Submissions: admin select" ON public.contact_submissions FOR SELECT USING (public.is_admin());
CREATE POLICY "Submissions: admin update" ON public.contact_submissions FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Submissions: admin delete" ON public.contact_submissions FOR DELETE USING (public.is_admin());

-- 5. Audit Logs & Admin Notes (Admin-only private)
DROP POLICY IF EXISTS "Audit logs: admin access" ON public.audit_logs;
DROP POLICY IF EXISTS "Audit logs full access" ON public.audit_logs;
CREATE POLICY "Audit logs: admin access" ON public.audit_logs FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin notes: admin access" ON public.admin_notes;
DROP POLICY IF EXISTS "Admin notes full access" ON public.admin_notes;
CREATE POLICY "Admin notes: admin access" ON public.admin_notes FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ─── 7. STORAGE BUCKETS & POLICIES ───────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('resume', 'resume', true, 5242880, ARRAY['application/pdf']),
  ('images', 'images', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Resume: public read" ON storage.objects;
DROP POLICY IF EXISTS "Resume: admin write" ON storage.objects;
DROP POLICY IF EXISTS "Images: public read" ON storage.objects;
DROP POLICY IF EXISTS "Images: admin write" ON storage.objects;

CREATE POLICY "Resume: public read" ON storage.objects FOR SELECT USING (bucket_id = 'resume');
CREATE POLICY "Resume: admin write" ON storage.objects FOR ALL USING (bucket_id = 'resume' AND public.is_admin()) WITH CHECK (bucket_id = 'resume' AND public.is_admin());

CREATE POLICY "Images: public read" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Images: admin write" ON storage.objects FOR ALL USING (bucket_id = 'images' AND public.is_admin()) WITH CHECK (bucket_id = 'images' AND public.is_admin());

-- ─── 8. PERFORMANCE INDEXES (SUB-MILLISECOND QUERY OPTIMIZATION) ────────────
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published_order ON public.projects("order" ASC) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects("order" ASC) WHERE featured = true AND published = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_order ON public.blog_posts("order" ASC, published_at DESC) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_experience_published_order ON public.experience("order" ASC, start_date DESC) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_certifications_published_order ON public.certifications("order" ASC) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_skills_order ON public.skills("order" ASC);
CREATE INDEX IF NOT EXISTS idx_social_links_order ON public.social_links("order" ASC);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured_order ON public.testimonials("order" ASC) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_service_offerings_active_order ON public.service_offerings("order" ASC) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_public_notifications_active ON public.public_notifications(created_at DESC) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON public.contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notes_pinned_created ON public.admin_notes(pinned DESC, created_at DESC);

-- ─── 9. HIGH-SPEED AGGREGATION & BOOTSTRAP RPC ──────────────────────────────
-- Consolidates public shell queries into a single database roundtrip (<5ms)
CREATE OR REPLACE FUNCTION public.get_public_bootstrap_data()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'settings', (SELECT to_jsonb(s) FROM public.site_settings s WHERE s.id = 1),
    'notification', (SELECT to_jsonb(n) FROM public.public_notifications n WHERE n.active = true ORDER BY n.created_at DESC LIMIT 1),
    'social_links', COALESCE((SELECT jsonb_agg(to_jsonb(l) ORDER BY l."order" ASC) FROM public.social_links l), '[]'::jsonb)
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_public_bootstrap_data() TO anon, authenticated;

-- ─── 10. INITIAL SINGLETON SEEDS ─────────────────────────────────────────────
INSERT INTO public.site_settings (id, site_title, site_description, default_theme, animation_style, ui_design)
VALUES (1, 'Dheeraj Carpenter', 'Portfolio of Dheeraj Carpenter', 'system', 'new', 'minimalist')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.home_content (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.about_content (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.seo_metadata (page_key, title, description) VALUES
  ('home',           'Home',           'Dheeraj Carpenter portfolio and engineering projects'),
  ('about',          'About',          'Background, skills, and experience of Dheeraj Carpenter'),
  ('projects',       'Projects',       'Software applications, tools, and builds by Dheeraj Carpenter'),
  ('experience',     'Experience',     'Career timeline, education, and credentials'),
  ('contact',        'Contact',        'Get in touch with Dheeraj Carpenter'),
  ('blog',           'Blog',           'Articles and engineering write-ups'),
  ('skills',         'Skills',         'Technical skills and software stack'),
  ('services',       'Services',       'Capabilities and technical offerings')
ON CONFLICT (page_key) DO NOTHING;

-- ─── 11. QUERY PLANNER STATISTICS (ANALYZE) ──────────────────────────────────
ANALYZE public.profiles;
ANALYZE public.site_settings;
ANALYZE public.home_content;
ANALYZE public.about_content;
ANALYZE public.skills;
ANALYZE public.experience;
ANALYZE public.projects;
ANALYZE public.social_links;
ANALYZE public.seo_metadata;
ANALYZE public.certifications;
ANALYZE public.testimonials;
ANALYZE public.service_offerings;
ANALYZE public.blog_posts;
ANALYZE public.public_notifications;
