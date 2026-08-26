import { createClient } from "@/lib/supabase/server";
import type {
  SiteSettings,
  HomeContent,
  AboutContent,
  Skill,
  Experience,
  Project,
  SocialLink,
  SeoMetadata,
  Certification,
  Testimonial,
  ServiceOffering,
  BlogPost,
  AuditLog,
  AdminNote,
  PublicNotification,
} from "@/types/database";

/**
 * Server-side data-access layer.
 *
 * Each function reads from Supabase using the cookie-scoped server client.
 * Uses Next.js fetch caching with tag-based revalidation so the public site
 * stays fast and admin mutations trigger instant updates via revalidateTag().
 */

export async function getSettings(): Promise<SiteSettings | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching site_settings:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Exception fetching site_settings:", err);
    return null;
  }
}

export async function getHomeContent(): Promise<HomeContent | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("home_content")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    return data;
  } catch (err) {
    console.error("Error in getHomeContent:", err);
    return null;
  }
}

export async function getAboutContent(): Promise<AboutContent | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("about_content")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    return data;
  } catch (err) {
    console.error("Error in getAboutContent:", err);
    return null;
  }
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("order", { ascending: true });
    return data ?? [];
  } catch (err) {
    console.error("Error in getSkills:", err);
    return [];
  }
}

export async function getPublishedExperience(): Promise<Experience[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("experience")
      .select("*")
      .eq("published", true)
      .order("order", { ascending: true });
    return data ?? [];
  } catch (err) {
    console.error("Error in getPublishedExperience:", err);
    return [];
  }
}

export async function getAllExperience(): Promise<Experience[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("experience")
      .select("*")
      .order("order", { ascending: true });
    return data ?? [];
  } catch (err) {
    console.error("Error in getAllExperience:", err);
    return [];
  }
}

export async function getPublishedProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("order", { ascending: true });
    return data ?? [];
  } catch (err) {
    console.error("Error in getPublishedProjects:", err);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .eq("featured", true)
      .order("order", { ascending: true });
    return data ?? [];
  } catch (err) {
    console.error("Error in getFeaturedProjects:", err);
    return [];
  }
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("order", { ascending: true });
    return data ?? [];
  } catch (err) {
    console.error("Error in getAllProjects:", err);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return data;
  } catch (err) {
    console.error("Error in getProjectBySlug:", err);
    return null;
  }
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("social_links")
      .select("*")
      .order("order", { ascending: true });
    return data ?? [];
  } catch (err) {
    console.error("Error in getSocialLinks:", err);
    return [];
  }
}

export async function getSeoMetadata(pageKey: string): Promise<SeoMetadata | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("seo_metadata")
      .select("*")
      .eq("page_key", pageKey)
      .maybeSingle();
    return data;
  } catch (err) {
    console.error("Error in getSeoMetadata:", err);
    return null;
  }
}

export async function getAllSeoMetadata(): Promise<SeoMetadata[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("seo_metadata")
      .select("*");
    return data ?? [];
  } catch (err) {
    console.error("Error in getAllSeoMetadata:", err);
    return [];
  }
}

export async function getContactSubmissions(): Promise<{ id: string; name: string; email: string; subject: string; message: string; is_read: boolean; created_at: string }[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch (err) {
    console.error("Error in getContactSubmissions:", err);
    return [];
  }
}

export async function getCertifications(): Promise<Certification[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .order("order", { ascending: true });
  if (error) {
    console.error("Error fetching certifications:", error);
    return [];
  }
  return data ?? [];
}

export async function getPublishedCertifications(): Promise<Certification[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .eq("published", true)
    .order("order", { ascending: true });
  if (error) {
    console.error("Error fetching published certifications:", error);
    return [];
  }
  return data ?? [];
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("order", { ascending: true });
  if (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
  return data ?? [];
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("order", { ascending: true });
  if (error) {
    console.error("Error fetching published testimonials:", error);
    return [];
  }
  return data ?? [];
}

export async function getAllServices(): Promise<ServiceOffering[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("service_offerings")
    .select("*")
    .order("order", { ascending: true });
  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }
  return data ?? [];
}

export async function getActiveServices(): Promise<ServiceOffering[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("service_offerings")
    .select("*")
    .eq("active", true)
    .order("order", { ascending: true });
  if (error) {
    console.error("Error fetching active services:", error);
    return [];
  }
  return data ?? [];
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching blog_posts:", error);
    return [];
  }
  return data ?? [];
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) {
    console.error("Error fetching published blog_posts:", error);
    return [];
  }
  return data ?? [];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) {
    console.error("Error fetching blog post by slug:", error);
    return null;
  }
  return data;
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) {
    console.error("Error fetching audit logs:", error);
    return [];
  }
  return data ?? [];
}

export async function getAdminNotes(): Promise<AdminNote[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_notes")
    .select("*")
    .order("pinned", { ascending: false })
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("Error fetching admin notes:", error);
    return [];
  }
  return data ?? [];
}

export async function getActivePublicNotification(): Promise<PublicNotification | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("public_notifications")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching active public_notification:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Exception fetching active public_notification:", err);
    return null;
  }
}

export async function getAllPublicNotifications(): Promise<PublicNotification[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("public_notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all public_notifications:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("Exception fetching public_notifications:", err);
    return [];
  }
}


