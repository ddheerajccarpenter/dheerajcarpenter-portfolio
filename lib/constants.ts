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
  { href: "/dc", label: "Overview", exact: true },
  { href: "/dc/content", label: "Content" },
  { href: "/dc/notifications", label: "Announcements" },
  { href: "/dc/projects", label: "Projects" },
  { href: "/dc/posts", label: "Blog CMS" },
  { href: "/dc/services", label: "Services" },
  { href: "/dc/testimonials", label: "Testimonials" },
  { href: "/dc/experience", label: "Experience" },
  { href: "/dc/skills", label: "Skills" },
  { href: "/dc/media", label: "Media" },
  { href: "/dc/messages", label: "Messages" },
  { href: "/dc/notes", label: "Quick Notes" },
  { href: "/dc/audit-logs", label: "Audit Logs" },
  { href: "/dc/seo", label: "SEO" },
  { href: "/dc/settings", label: "Settings" },
  { href: "/dc/analytics", label: "Analytics" },
  { href: "/dc/users", label: "Users" },
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
