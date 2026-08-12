# Dheeraj Carpenter — Portfolio + Admin Platform

A content-first, black-and-white personal portfolio with a Supabase-backed
admin dashboard. Built for long-term maintainability: content changes never
require editing source code.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, RSC) + TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| Motion | Framer Motion (`motion/react`) — state/navigation only |
| Backend | Supabase (Postgres + Auth + Storage), `@supabase/ssr` |
| Theming | `next-themes` (`class` strategy, no flash) |
| Deploy | Vercel (`vercel --prod`) |

## Project structure

```
app/            # Routes — public site + /admin dashboard
components/     # Reusable UI (ui/, layout/, public/, admin/, providers/)
features/       # Business logic grouped by domain
hooks/          # Custom React hooks
lib/            # Utilities, Supabase clients, auth, data-access
services/       # Server communication layer
types/          # Central TypeScript domain definitions
public/         # Static assets
styles/         # Supplementary global styles
supabase/       # SQL schema, storage, seed (Phase 2)
proxy.ts        # Request proxy — session refresh + admin route guard
```

See the Phase 1 architecture doc for the full directory responsibilities.

## Design system

Strict black & white — no hues, no gradients, no decorative effects.

- **Light:** white background, black text. **Dark:** black background, white text.
- Borders/dividers use black/white with alpha only.
- Typography, whitespace, and content hierarchy do all the work.
- Motion is reserved for navigation and state changes; no parallax, infinite
  loops, or magnetic cursors. `prefers-reduced-motion` is respected.

## Security architecture

- **Credentials never in client code.** The service-role key
  (`SUPABASE_SERVICE_ROLE_KEY`) has no `NEXT_PUBLIC_` prefix and is never
  shipped to the browser.
- **Cookie-based auth.** Sessions live in HTTP cookies via `@supabase/ssr`,
  never `localStorage`.
- **Defense in depth for `/admin/*`:**
  1. `proxy.ts` redirects unauthenticated visitors to `/admin/login`.
  2. `requireAdmin()` (Server Components) verifies the session and the
     `profiles.role = 'admin'` row.
  3. Row Level Security on every content table enforces admin-only writes at
     the database — the last word regardless of client.
- Sensitive mutations run server-side only.

## Environment variables

Copy `.env.example` to `.env.local` (and to your Vercel project settings):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only, never expose
NEXT_PUBLIC_SITE_URL=
```

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build verification
npm run lint
```

## Deployment

```bash
vercel --prod
```

Set the four environment variables in the Vercel project settings before the
first deploy.

---

**Phase status:** Phase 1 (foundation) complete. Phase 2 will define the full
database architecture, content schema, RLS policies, and storage structure.
