-- ============================================================================
-- Master Idempotent Database Schema & Migration Script for Portfolio CMS
-- Safe to run multiple times on any new or existing Supabase project.
-- ============================================================================

-- 1. Required Extensions ---------------------------------------------------
create extension if not exists "pgcrypto";

-- 2. Custom Enums ----------------------------------------------------------
do $$ begin
  create type user_role as enum ('admin', 'editor');
exception when duplicate_object then null; end $$;

do $$ begin
  create type experience_type as enum ('work', 'education', 'certification');
exception when duplicate_object then null; end $$;

do $$ begin
  create type social_platform as enum (
    'github', 'linkedin', 'twitter', 'instagram', 'youtube',
    'dribbble', 'behance', 'website', 'email'
  );
exception when duplicate_object then null; end $$;

-- 3. Core Tables -----------------------------------------------------------

-- Profiles
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  name        text,
  avatar_url  text,
  role        user_role not null default 'editor',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Site Settings (Singleton)
create table if not exists public.site_settings (
  id                integer primary key default 1 check (id = 1),
  site_title        text not null default 'Portfolio',
  site_description  text not null default '',
  contact_email     text,
  resume_url        text,
  resume_filename   text,
  resume_updated_at timestamptz,
  default_theme     text not null default 'system',
  animation_style   text not null default 'new',
  ui_design         text not null default 'minimalist',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Ensure all columns exist if table was created in earlier schema versions
alter table public.site_settings add column if not exists animation_style text not null default 'new';
alter table public.site_settings add column if not exists ui_design text not null default 'minimalist';
alter table public.site_settings add column if not exists contact_email text;
alter table public.site_settings add column if not exists resume_url text;
alter table public.site_settings add column if not exists resume_filename text;
alter table public.site_settings add column if not exists resume_updated_at timestamptz;

-- Home Content (Singleton)
create table if not exists public.home_content (
  id                  integer primary key default 1 check (id = 1),
  hero_name           text not null default '',
  hero_role           text not null default '',
  hero_intro          text not null default '',
  hero_image_url      text,
  primary_cta_label   text not null default 'View Projects',
  primary_cta_href    text not null default '/projects',
  secondary_cta_label text not null default 'Contact',
  secondary_cta_href  text not null default '/contact',
  about_preview       text not null default '',
  contact_cta         text not null default '',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- About Content (Singleton)
create table if not exists public.about_content (
  id          integer primary key default 1 check (id = 1),
  headline    text not null default '',
  bio         text not null default '',
  overview    text not null default '',
  photo_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Skills
create table if not exists public.skills (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null default 'General',
  proficiency integer check (proficiency between 0 and 100),
  "order"     integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists skills_order_idx on public.skills ("order");

-- Experience
create table if not exists public.experience (
  id           uuid primary key default gen_random_uuid(),
  type         experience_type not null default 'work',
  role         text not null,
  organization text not null,
  location     text,
  start_date   date not null,
  end_date     date,
  current      boolean not null default false,
  description  text not null default '',
  url          text,
  "order"      integer not null default 0,
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists experience_published_order_idx on public.experience (published, "order");

-- Certifications
create table if not exists public.certifications (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  issuer           text not null,
  issue_date       date,
  credential_link  text,
  certificate_path text,
  published        boolean not null default true,
  "order"          integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists certifications_published_order_idx on public.certifications (published, "order");

-- Projects
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  summary     text not null default '',
  description text not null default '',
  cover_url   text,
  gallery     jsonb not null default '[]'::jsonb,
  tags        text[] not null default '{}',
  live_url    text,
  source_url  text,
  featured    boolean not null default false,
  published   boolean not null default true,
  "order"     integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists projects_published_order_idx on public.projects (published, "order");
create index if not exists projects_featured_idx on public.projects (featured) where featured = true;

-- Social Links
create table if not exists public.social_links (
  id          uuid primary key default gen_random_uuid(),
  platform    social_platform not null,
  label       text not null default '',
  url         text not null,
  "order"     integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists social_links_order_idx on public.social_links ("order");

-- SEO Metadata
create table if not exists public.seo_metadata (
  page_key       text primary key,
  title          text not null default '',
  description    text not null default '',
  keywords       text[] not null default '{}',
  og_image_url   text,
  canonical_url  text,
  updated_at     timestamptz not null default now()
);

-- Contact Submissions
create table if not exists public.contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text not null default '',
  message    text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists contact_submissions_created_idx on public.contact_submissions (created_at desc);

-- 4. Automatic Timestamp Function & Triggers -------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at before update on public.profiles for each row execute function public.touch_updated_at();

drop trigger if exists set_updated_at on public.site_settings;
create trigger set_updated_at before update on public.site_settings for each row execute function public.touch_updated_at();

drop trigger if exists set_updated_at on public.home_content;
create trigger set_updated_at before update on public.home_content for each row execute function public.touch_updated_at();

drop trigger if exists set_updated_at on public.about_content;
create trigger set_updated_at before update on public.about_content for each row execute function public.touch_updated_at();

drop trigger if exists set_updated_at on public.skills;
create trigger set_updated_at before update on public.skills for each row execute function public.touch_updated_at();

drop trigger if exists set_updated_at on public.experience;
create trigger set_updated_at before update on public.experience for each row execute function public.touch_updated_at();

drop trigger if exists set_updated_at on public.certifications;
create trigger set_updated_at before update on public.certifications for each row execute function public.touch_updated_at();

drop trigger if exists set_updated_at on public.projects;
create trigger set_updated_at before update on public.projects for each row execute function public.touch_updated_at();

drop trigger if exists set_updated_at on public.social_links;
create trigger set_updated_at before update on public.social_links for each row execute function public.touch_updated_at();

drop trigger if exists set_updated_at on public.seo_metadata;
create trigger set_updated_at before update on public.seo_metadata for each row execute function public.touch_updated_at();

-- 5. User Signup Profile Trigger & Admin Helper ----------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'name', ''),
    case when not exists (select 1 from public.profiles) then 'admin'::user_role else 'editor'::user_role end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role::text in ('super_admin', 'admin')
  );
$$;

-- 6. Row Level Security & Explicit Policy Recreation -----------------------
alter table public.profiles             enable row level security;
alter table public.site_settings        enable row level security;
alter table public.home_content         enable row level security;
alter table public.about_content        enable row level security;
alter table public.skills               enable row level security;
alter table public.experience           enable row level security;
alter table public.certifications       enable row level security;
alter table public.projects             enable row level security;
alter table public.social_links         enable row level security;
alter table public.seo_metadata         enable row level security;
alter table public.contact_submissions  enable row level security;

-- Drop and recreate all policies
drop policy if exists "Profiles: read own or admin" on public.profiles;
drop policy if exists "Profiles: admin write" on public.profiles;
create policy "Profiles: read own or admin" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "Profiles: admin write"       on public.profiles for all    using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Settings: public read" on public.site_settings;
drop policy if exists "Settings: admin write" on public.site_settings;
create policy "Settings: public read" on public.site_settings for select using (true);
create policy "Settings: admin write" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Home: public read" on public.home_content;
drop policy if exists "Home: admin write" on public.home_content;
create policy "Home: public read" on public.home_content for select using (true);
create policy "Home: admin write" on public.home_content for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "About: public read" on public.about_content;
drop policy if exists "About: admin write" on public.about_content;
create policy "About: public read" on public.about_content for select using (true);
create policy "About: admin write" on public.about_content for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Skills: public read" on public.skills;
drop policy if exists "Skills: admin write" on public.skills;
create policy "Skills: public read" on public.skills for select using (true);
create policy "Skills: admin write" on public.skills for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Experience: public read" on public.experience;
drop policy if exists "Experience: admin write" on public.experience;
create policy "Experience: public read" on public.experience for select using (true);
create policy "Experience: admin write" on public.experience for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Certifications: public read" on public.certifications;
drop policy if exists "Certifications: admin write" on public.certifications;
create policy "Certifications: public read" on public.certifications for select using (true);
create policy "Certifications: admin write" on public.certifications for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Projects: public read" on public.projects;
drop policy if exists "Projects: admin write" on public.projects;
create policy "Projects: public read" on public.projects for select using (true);
create policy "Projects: admin write" on public.projects for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Social: public read" on public.social_links;
drop policy if exists "Social: admin write" on public.social_links;
create policy "Social: public read" on public.social_links for select using (true);
create policy "Social: admin write" on public.social_links for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "SEO: public read" on public.seo_metadata;
drop policy if exists "SEO: admin write" on public.seo_metadata;
create policy "SEO: public read" on public.seo_metadata for select using (true);
create policy "SEO: admin write" on public.seo_metadata for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Submissions: public insert" on public.contact_submissions;
drop policy if exists "Submissions: admin read"    on public.contact_submissions;
drop policy if exists "Submissions: admin update"  on public.contact_submissions;
drop policy if exists "Submissions: admin delete"  on public.contact_submissions;
create policy "Submissions: public insert" on public.contact_submissions for insert with check (true);
create policy "Submissions: admin read"    on public.contact_submissions for select using (public.is_admin());
create policy "Submissions: admin update"  on public.contact_submissions for update using (public.is_admin()) with check (public.is_admin());
create policy "Submissions: admin delete"  on public.contact_submissions for delete using (public.is_admin());

-- 7. Singleton & Initial Seed Rows ----------------------------------------
insert into public.site_settings (id, site_title, animation_style, ui_design)
values (1, 'Portfolio', 'new', 'minimalist')
on conflict (id) do nothing;

insert into public.home_content (id) values (1) on conflict (id) do nothing;
insert into public.about_content (id) values (1) on conflict (id) do nothing;

insert into public.seo_metadata (page_key, title) values
  ('home',       'Home'),
  ('about',      'About'),
  ('projects',   'Projects'),
  ('experience', 'Experience'),
  ('contact',    'Contact')
on conflict (page_key) do nothing;

-- 8. Storage Buckets & Policies --------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('resume', 'resume', true, 5242880, array['application/pdf']),
  ('images', 'images', true, 10485760, array['image/png', 'image/jpeg', 'image/gif', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "Resume: public read" on storage.objects;
drop policy if exists "Resume: admin write" on storage.objects;
drop policy if exists "Images: public read" on storage.objects;
drop policy if exists "Images: admin write" on storage.objects;

create policy "Resume: public read" on storage.objects for select using (bucket_id = 'resume');
create policy "Resume: admin write" on storage.objects for all using (bucket_id = 'resume' and public.is_admin()) with check (bucket_id = 'resume' and public.is_admin());

create policy "Images: public read" on storage.objects for select using (bucket_id = 'images');
create policy "Images: admin write" on storage.objects for all using (bucket_id = 'images' and public.is_admin()) with check (bucket_id = 'images' and public.is_admin());
