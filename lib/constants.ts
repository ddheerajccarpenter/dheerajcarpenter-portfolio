/**
 * Application-wide constants.
 * Centralised so navigation, SEO, and admin references stay in sync.
 */

/** Public-facing navigation destinations. */
export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/notes", label: "Notes" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

/** Public route keys — used as stable references for SEO metadata rows. */
export const PAGE_KEYS = {
  HOME: "home",
  ABOUT: "about",
  SKILLS: "skills",
  SERVICES: "services",
  PROJECTS: "projects",
  EXPERIENCE: "experience",
  CERTIFICATIONS: "certifications",
  NOTES: "notes",
  TESTIMONIALS: "testimonials",
  BLOG: "blog",
  CONTACT: "contact",
} as const;

/**
 * Admin section navigation (sidebar).
 * Mirrors the admin route map.
 */
export const ADMIN_NAV = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/notifications", label: "Announcements" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/posts", label: "Blog CMS" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/notes", label: "Quick Notes" },
  { href: "/admin/audit-logs", label: "Audit Logs" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/users", label: "Users" },
] as const;

/** Recognised social platforms — drives icon selection and URL validation. */
export const SOCIAL_PLATFORMS = [
  "github",
  "linkedin",
  "twitter",
  "instagram",
  "youtube",
  "dribbble",
  "behance",
  "website",
  "email",
] as const;

/** Pages that contain editable SEO metadata. */
export const SEO_PAGE_KEYS = [
  "home",
  "about",
  "skills",
  "services",
  "projects",
  "experience",
  "certifications",
  "blog",
  "contact",
] as const;

/** Cache tags used for on-demand revalidation after admin mutations. */
export const CACHE_TAGS = {
  SETTINGS: "site-settings",
  HOME: "home-content",
  ABOUT: "about-content",
  PROJECTS: "projects",
  EXPERIENCE: "experience",
  SKILLS: "skills",
  SOCIAL: "social-links",
  SEO: "seo-metadata",
  SUBMISSIONS: "contact-submissions",
  CERTIFICATIONS: "certifications",
  TESTIMONIALS: "testimonials",
  SERVICES: "services",
  POSTS: "blog-posts",
  AUDIT_LOGS: "audit-logs",
  NOTES: "admin-notes",
  NOTIFICATIONS: "public-notifications",
} as const;

/** Supabase Storage bucket identifiers. */
export const STORAGE_BUCKETS = {
  RESUME: "resume",
  IMAGES: "images",
} as const;
