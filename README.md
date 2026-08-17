# Dheeraj Carpenter — Personal Portfolio & Blog

**Live Website:** [dheerajcarpenter.vercel.app](https://dheerajcarpenter.vercel.app)

## Overview

Dheeraj Carpenter is a personal portfolio and blog platform designed to showcase professional work, creative projects, technical skills, experience, services, certifications, testimonials, and written content in one centralized website.

The platform combines a public-facing portfolio with a private content management system, allowing the entire website to be managed dynamically without modifying the application's source code.

## Website Sections

The public website includes:

* **Home** — Introduction, featured content, highlights, and key information.
* **About** — Personal background, interests, and professional profile.
* **Projects** — Showcase of completed and ongoing projects.
* **Blog** — Articles, technical writing, and personal posts.
* **Experience** — Professional, academic, and project experience.
* **Skills** — Technical and professional skill set.
* **Services** — Services and capabilities offered.
* **Certifications** — Professional certifications and achievements.
* **Testimonials** — Feedback and recommendations.
* **Contact** — Contact and inquiry interface.

## Admin Dashboard

The private administration system provides centralized management for the website's content and configuration.

It includes management for:

* Projects
* Blog posts
* Skills
* Services
* Testimonials
* Experience
* Certifications
* Media
* SEO metadata
* Contact messages
* Announcements
* Site settings
* Audit logs

The dashboard is designed as the central content management layer of the platform, keeping the public website fully dynamic and maintainable.

## Technology Stack

| Technology                 | Purpose                                   |
| -------------------------- | ----------------------------------------- |
| **Next.js 15**             | Application framework and routing         |
| **React**                  | User interface and component architecture |
| **TypeScript**             | Type-safe application development         |
| **Tailwind CSS v4**        | Styling and responsive design             |
| **Motion / Framer Motion** | UI animations and transitions             |
| **Supabase**               | Database, authentication, and storage     |
| **PostgreSQL**             | Relational data management                |
| **Supabase Auth**          | Authentication and session management     |
| **Supabase Storage**       | Media and document storage                |
| **Vercel**                 | Production deployment and hosting         |

## Architecture

The project follows a structured Next.js App Router architecture with separate public and administrative areas.

```text
app/
├── (public)/          Public website
└── admin/             Protected administration system

components/
├── ui/                Reusable interface components
├── layout/            Shared layout components
├── admin/             Administration components
└── public/            Public-facing components

lib/
├── data/              Application data layer
├── supabase/          Supabase integration
├── auth.ts            Authentication and authorization
└── constants.ts       Shared application configuration

supabase/
├── schema.sql         Database structure
├── seed.sql           Initial data
└── storage.sql        Storage configuration

types/                 Database and application types
proxy.ts               Authentication and route protection
```

## Content Management

The website is built around a database-driven content architecture. Portfolio sections are not hard-coded into individual pages; instead, content is organized into structured data and presented through reusable components.

This makes the platform suitable for continuously evolving content while maintaining a consistent design and application structure.

## Security

The administrative system uses multiple layers of protection:

* Supabase authentication for account management and sessions.
* Role-based authorization for administrative access.
* Protected administrative routes.
* Server-side handling of privileged database operations.
* Row Level Security policies at the database level.
* Server-only handling of sensitive Supabase credentials.
* Audit logging for administrative activity.

The architecture separates public content access from privileged administrative operations to reduce unnecessary exposure of sensitive functionality.

## Project Purpose

Dheeraj Carpenter is more than a static portfolio. It is a full-stack personal publishing and content management platform built to serve as a central digital presence for projects, technical work, professional experience, creative work, and long-form writing.

The project demonstrates the integration of modern web development, database-driven content management, authentication, secure administration, responsive UI design, animation, and production deployment within a single personal platform.

## License

This project is a personal portfolio and is intended for reference and demonstration purposes. The design, content, branding, and implementation should not be presented or deployed as another person's portfolio.
