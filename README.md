# dheerajcarpenter.vercel.app

Personal portfolio and blog — live at **[dheerajcarpenter.vercel.app](https://dheerajcarpenter.vercel.app)**

---

## What this is

A personal website I built to showcase my work, writing, and experience. The whole thing is driven by a private admin dashboard — I can update every piece of content (projects, blog posts, skills, services, testimonials, experience) without ever touching the code.

**Public pages:** Home · About · Projects · Blog · Experience · Skills · Services · Certifications · Testimonials · Contact

**Admin dashboard** (private, `/admin`): Full CMS for every section above — plus media uploads, SEO metadata per page, contact message inbox, audit logs, announcements, and site settings.

---

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router + React Server Components) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion / `motion` |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth — cookie-based sessions via `@supabase/ssr` |
| Storage | Supabase Storage (images, resume) |
| Deployment | Vercel |

---

## Running locally

```bash
git clone https://github.com/ddheerajccarpenter/dheerajcarpenter-portfolio.git
cd dheerajcarpenter-portfolio
npm install
```

Create a `.env.local` file with your own Supabase project credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Then:

```bash
npm run dev
```

Opens at `http://localhost:3000`.

> The database schema is in `supabase/schema.sql`. Run that against your Supabase project first, then optionally seed with `supabase/seed.sql`.

---

## Project layout

```
app/
  (public)/     Public-facing pages
  admin/        Admin dashboard (protected)
components/
  ui/           Base UI components (Button, Card, Badge, Input …)
  layout/       Nav, shell, containers, theme toggle
  admin/        All admin panel components
  public/       Public-specific components (e.g. contact form)
lib/
  data/         All Supabase data-fetching (public + admin)
  supabase/     Client, server, admin, and middleware helpers
  auth.ts       requireAdmin() — used in every admin Server Component
  constants.ts  Nav items, cache tags, bucket names — one source of truth
supabase/
  schema.sql    Full database schema
  seed.sql      Sample seed data
  storage.sql   Storage bucket and policy setup
types/          TypeScript types for all DB tables
proxy.ts        Middleware — session refresh + /admin/* route guard
```

---

## Security notes

- The `SUPABASE_SERVICE_ROLE_KEY` is server-only. No `NEXT_PUBLIC_` prefix, never goes to the browser.
- All admin pages call `requireAdmin()` which checks both the session and `profiles.role = 'admin'` in the database.
- The middleware (`proxy.ts`) redirects unauthenticated requests to `/admin/login` before the page even renders.
- Supabase RLS policies enforce read/write access at the database level regardless of what the client sends.

---

## License

This is my personal site. Feel free to look at the code for reference, but please don't deploy it as your own.
