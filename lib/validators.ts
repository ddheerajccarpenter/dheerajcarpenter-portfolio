import { z } from "zod";
import { normalizeUrl, normalizeUrlOrNull } from "./utils";

/**
 * Flexible URL schema that auto-normalizes missing protocols like "google.com" -> "https://google.com".
 * Also accepts relative URLs (/path), anchors (#), mailto:, tel:, and fixes backslashes.
 */
export const urlSchema = z
  .string()
  .transform((val) => normalizeUrl(val))
  .refine(
    (val) => {
      if (!val) return true;
      if (val.startsWith("/") || val.startsWith("#") || val.startsWith("mailto:") || val.startsWith("tel:")) return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Invalid URL format" }
  );

/**
 * Flexible optional URL schema that returns normalized string or null if empty.
 */
export const optionalUrlSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((val) => normalizeUrlOrNull(val))
  .refine(
    (val) => {
      if (!val) return true;
      if (val.startsWith("/") || val.startsWith("#") || val.startsWith("mailto:") || val.startsWith("tel:")) return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Invalid URL format" }
  );

/** Contact form submission. */
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email address"),
  subject: z.string().max(200).default(""),
  message: z.string().min(1, "Message is required").max(5000),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;

/** Login form. */
export const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginFormValues = z.infer<typeof loginFormSchema>;

/** Forgot password form. */
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

/** Home content editor. */
export const homeContentSchema = z.object({
  hero_name: z.string().default(""),
  hero_role: z.string().default(""),
  hero_intro: z.string().default(""),
  hero_image_url: optionalUrlSchema.default(null),
  primary_cta_label: z.string().default("View Projects"),
  primary_cta_href: z.string().default("/projects").transform((val) => normalizeUrl(val)),
  secondary_cta_label: z.string().default("Contact"),
  secondary_cta_href: z.string().default("/contact").transform((val) => normalizeUrl(val)),
  about_preview: z.string().default(""),
  contact_cta: z.string().default(""),
});
export type HomeContentValues = z.infer<typeof homeContentSchema>;

/** About content editor. */
export const aboutContentSchema = z.object({
  headline: z.string().default(""),
  bio: z.string().default(""),
  overview: z.string().default(""),
  photo_url: optionalUrlSchema.default(null),
});
export type AboutContentValues = z.infer<typeof aboutContentSchema>;

/** Skill editor. */
export const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().default("General"),
  proficiency: z.number().min(0).max(100).nullable().default(null),
  order: z.number().default(0),
});
export type SkillValues = z.infer<typeof skillSchema>;

/** Experience editor. */
export const experienceSchema = z.object({
  type: z.enum(["work", "education", "certification"]).default("work"),
  role: z.string().min(1, "Role is required"),
  organization: z.string().min(1, "Organization is required"),
  location: z.string().nullable().default(null),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().nullable().default(null),
  current: z.boolean().default(false),
  description: z.string().default(""),
  url: optionalUrlSchema.default(null),
  order: z.number().default(0),
  published: z.boolean().default(true),
});
export type ExperienceValues = z.infer<typeof experienceSchema>;

/** Project editor. */
export const projectSchema = z.object({
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase, letters, numbers, hyphens"),
  title: z.string().min(1, "Title is required"),
  summary: z.string().default(""),
  description: z.string().default(""),
  cover_url: optionalUrlSchema.default(null),
  gallery: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  live_url: optionalUrlSchema.default(null),
  source_url: optionalUrlSchema.default(null),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.number().default(0),
});
export type ProjectValues = z.infer<typeof projectSchema>;

/** Social link editor. */
export const socialLinkSchema = z.object({
  platform: z.enum(["github", "linkedin", "twitter", "instagram", "youtube", "dribbble", "behance", "website", "email"]),
  label: z.string().min(1, "Label is required"),
  url: urlSchema,
  order: z.number().default(0),
});
export type SocialLinkValues = z.infer<typeof socialLinkSchema>;

/** Site settings editor. */
export const siteSettingsSchema = z.object({
  site_title: z.string().min(1, "Site title is required"),
  site_description: z.string().default(""),
  contact_email: z.union([z.string().email("Invalid email address"), z.literal(""), z.null()]).transform((val) => (val && val.trim() !== "" ? val.trim() : null)),
  default_theme: z.enum(["light", "dark", "system"]).default("system"),
  animation_style: z.enum(["new", "classic", "minimal", "fluid", "magnetic"]).default("new"),
  ui_design: z.enum(["minimalist", "obsidian", "nordic", "tokyo", "monolith", "aurora"]).default("minimalist"),
});
export type SiteSettingsValues = z.infer<typeof siteSettingsSchema>;

/** SEO metadata editor. */
export const seoMetadataSchema = z.object({
  page_key: z.string().min(1),
  title: z.string().default(""),
  description: z.string().default(""),
  keywords: z.array(z.string()).default([]),
  og_image_url: optionalUrlSchema.default(null),
  canonical_url: optionalUrlSchema.default(null),
});
export type SeoMetadataValues = z.infer<typeof seoMetadataSchema>;

/** Certification editor. */
export const certificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issue_date: z.string().nullable().default(null),
  credential_link: optionalUrlSchema.default(null),
  certificate_path: optionalUrlSchema.default(null),
  published: z.boolean().default(true),
  order: z.number().default(0),
});
export type CertificationValues = z.infer<typeof certificationSchema>;
