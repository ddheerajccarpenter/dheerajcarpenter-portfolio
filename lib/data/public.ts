import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { CACHE_TAGS } from "@/lib/constants";
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
 * High-performance Public Data Layer.
 *
 * Uses a lightweight anonymous Supabase client (free of cookies() overhead)
 * paired with Next.js unstable_cache and CACHE_TAGS.
 *
 * This drops page load time from ~500ms (remote DB roundtrip) down to <15ms
 * (in-memory cached read). When an admin mutates content, server actions call
 * revalidateTag(CACHE_TAGS.*) to instantly invalidate the cache on demand.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

const publicClient = createSupabaseClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/* ─── Cached Public Fetchers ───────────────────────────────────────────────── */

export const getSettings = unstable_cache(
  async (): Promise<SiteSettings | null> => {
    try {
      const { data, error } = await publicClient
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
  },
  ["public-site-settings"],
  { tags: [CACHE_TAGS.SETTINGS], revalidate: 3600 }
);

export const getHomeContent = unstable_cache(
  async (): Promise<HomeContent | null> => {
    try {
      const { data, error } = await publicClient
        .from("home_content")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) {
        console.error("Error fetching home_content:", error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.error("Error in getHomeContent:", err);
      return null;
    }
  },
  ["public-home-content"],
  { tags: [CACHE_TAGS.HOME], revalidate: 3600 }
);

export const getAboutContent = unstable_cache(
  async (): Promise<AboutContent | null> => {
    try {
      const { data, error } = await publicClient
        .from("about_content")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) {
        console.error("Error fetching about_content:", error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.error("Error in getAboutContent:", err);
      return null;
    }
  },
  ["public-about-content"],
  { tags: [CACHE_TAGS.ABOUT], revalidate: 3600 }
);

export const getSkills = unstable_cache(
  async (): Promise<Skill[]> => {
    try {
      const { data, error } = await publicClient
        .from("skills")
        .select("*")
        .order("order", { ascending: true });
      if (error) {
        console.error("Error fetching skills:", error.message);
        return [];
      }
      return data ?? [];
    } catch (err) {
      console.error("Error in getSkills:", err);
      return [];
    }
  },
  ["public-skills"],
  { tags: [CACHE_TAGS.SKILLS], revalidate: 3600 }
);

export const getPublishedExperience = unstable_cache(
  async (): Promise<Experience[]> => {
    try {
      const { data, error } = await publicClient
        .from("experience")
        .select("*")
        .eq("published", true)
        .order("order", { ascending: true });
      if (error) {
        console.error("Error fetching published experience:", error.message);
        return [];
      }
      return data ?? [];
    } catch (err) {
      console.error("Error in getPublishedExperience:", err);
      return [];
    }
  },
  ["public-experience-published"],
  { tags: [CACHE_TAGS.EXPERIENCE], revalidate: 3600 }
);

export const getPublishedProjects = unstable_cache(
  async (): Promise<Project[]> => {
    try {
      const { data, error } = await publicClient
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("order", { ascending: true });
      if (error) {
        console.error("Error fetching published projects:", error.message);
        return [];
      }
      return data ?? [];
    } catch (err) {
      console.error("Error in getPublishedProjects:", err);
      return [];
    }
  },
  ["public-projects-published"],
  { tags: [CACHE_TAGS.PROJECTS], revalidate: 3600 }
);

export const getFeaturedProjects = unstable_cache(
  async (): Promise<Project[]> => {
    try {
      const { data, error } = await publicClient
        .from("projects")
        .select("*")
        .eq("published", true)
        .eq("featured", true)
        .order("order", { ascending: true });
      if (error) {
        console.error("Error fetching featured projects:", error.message);
        return [];
      }
      return data ?? [];
    } catch (err) {
      console.error("Error in getFeaturedProjects:", err);
      return [];
    }
  },
  ["public-projects-featured"],
  { tags: [CACHE_TAGS.PROJECTS], revalidate: 3600 }
);

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return unstable_cache(
    async (): Promise<Project | null> => {
      try {
        const { data, error } = await publicClient
          .from("projects")
          .select("*")
          .eq("slug", slug)
          .eq("published", true)
          .maybeSingle();
        if (error) {
          console.error("Error fetching project by slug:", error.message);
          return null;
        }
        return data;
      } catch (err) {
        console.error("Error in getProjectBySlug:", err);
        return null;
      }
    },
    [`public-project-slug-${slug}`],
    { tags: [CACHE_TAGS.PROJECTS], revalidate: 3600 }
  )();
}

export const getSocialLinks = unstable_cache(
  async (): Promise<SocialLink[]> => {
    try {
      const { data, error } = await publicClient
        .from("social_links")
        .select("*")
        .order("order", { ascending: true });
      if (error) {
        console.error("Error fetching social links:", error.message);
        return [];
      }
      return data ?? [];
    } catch (err) {
      console.error("Error in getSocialLinks:", err);
      return [];
    }
  },
  ["public-social-links"],
  { tags: [CACHE_TAGS.SOCIAL], revalidate: 3600 }
);

export async function getSeoMetadata(pageKey: string): Promise<SeoMetadata | null> {
  return unstable_cache(
    async (): Promise<SeoMetadata | null> => {
      try {
        const { data, error } = await publicClient
          .from("seo_metadata")
          .select("*")
          .eq("page_key", pageKey)
          .maybeSingle();
        if (error) {
          console.error("Error fetching seo metadata:", error.message);
          return null;
        }
        return data;
      } catch (err) {
        console.error("Error in getSeoMetadata:", err);
        return null;
      }
    },
    [`public-seo-${pageKey}`],
    { tags: [CACHE_TAGS.SEO], revalidate: 3600 }
  )();
}

export const getPublishedCertifications = unstable_cache(
  async (): Promise<Certification[]> => {
    try {
      const { data, error } = await publicClient
        .from("certifications")
        .select("*")
        .eq("published", true)
        .order("order", { ascending: true });
      if (error) {
        console.error("Error fetching published certifications:", error);
        return [];
      }
      return data ?? [];
    } catch (err) {
      console.error("Error in getPublishedCertifications:", err);
      return [];
    }
  },
  ["public-certifications-published"],
  { tags: [CACHE_TAGS.CERTIFICATIONS], revalidate: 3600 }
);

export const getAllTestimonials = unstable_cache(
  async (): Promise<Testimonial[]> => {
    try {
      const { data, error } = await publicClient
        .from("testimonials")
        .select("*")
        .order("order", { ascending: true });
      if (error) {
        console.error("Error fetching testimonials:", error);
        return [];
      }
      return data ?? [];
    } catch (err) {
      console.error("Error in getAllTestimonials:", err);
      return [];
    }
  },
  ["public-testimonials-all"],
  { tags: [CACHE_TAGS.TESTIMONIALS], revalidate: 3600 }
);

export const getFeaturedTestimonials = unstable_cache(
  async (): Promise<Testimonial[]> => {
    try {
      const { data, error } = await publicClient
        .from("testimonials")
        .select("*")
        .eq("featured", true)
        .order("order", { ascending: true });
      if (error) {
        console.error("Error fetching published testimonials:", error);
        return [];
      }
      return data ?? [];
    } catch (err) {
      console.error("Error in getFeaturedTestimonials:", err);
      return [];
    }
  },
  ["public-testimonials-featured"],
  { tags: [CACHE_TAGS.TESTIMONIALS], revalidate: 3600 }
);

export const getActiveServices = unstable_cache(
  async (): Promise<ServiceOffering[]> => {
    try {
      const { data, error } = await publicClient
        .from("service_offerings")
        .select("*")
        .eq("active", true)
        .order("order", { ascending: true });
      if (error) {
        console.error("Error fetching active services:", error);
        return [];
      }
      return data ?? [];
    } catch (err) {
      console.error("Error in getActiveServices:", err);
      return [];
    }
  },
  ["public-services-active"],
  { tags: [CACHE_TAGS.SERVICES], revalidate: 3600 }
);

export const getPublishedPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    try {
      const { data, error } = await publicClient
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (error) {
        console.error("Error fetching published blog_posts:", error);
        return [];
      }
      return data ?? [];
    } catch (err) {
      console.error("Error in getPublishedPosts:", err);
      return [];
    }
  },
  ["public-posts-published"],
  { tags: [CACHE_TAGS.POSTS], revalidate: 3600 }
);

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return unstable_cache(
    async (): Promise<BlogPost | null> => {
      try {
        const { data, error } = await publicClient
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
      } catch (err) {
        console.error("Error in getPostBySlug:", err);
        return null;
      }
    },
    [`public-post-slug-${slug}`],
    { tags: [CACHE_TAGS.POSTS], revalidate: 3600 }
  )();
}

export const getActivePublicNotification = unstable_cache(
  async (): Promise<PublicNotification | null> => {
    try {
      const { data, error } = await publicClient
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
  },
  ["public-notification-active"],
  { tags: [CACHE_TAGS.NOTIFICATIONS], revalidate: 3600 }
);

/* ─── Uncached Admin Data Operations (Direct Server Client) ────────────────── */

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

export interface AdminDashboardData {
  projects: { id: string; title: string; published: boolean; slug: string; cover_url?: string | null; live_url?: string | null }[];
  experiences: { id: string; role: string; company: string; published: boolean }[];
  submissions: { id: string; name: string; email: string; subject: string; message: string; is_read: boolean; created_at: string }[];
  posts: { id: string; title: string; published: boolean; slug: string; cover_url?: string | null; created_at: string }[];
  services: { id: string; title: string; active?: boolean }[];
  testimonials: { id: string; author_name: string; featured: boolean; avatar_url?: string | null }[];
  notes: AdminNote[];
}

export async function getAdminDashboardSummary(): Promise<AdminDashboardData> {
  try {
    const supabase = await createClient();
    const [
      { data: projects },
      { data: experiences },
      { data: submissions },
      { data: posts },
      { data: services },
      { data: testimonials },
      { data: notes },
    ] = await Promise.all([
      supabase
        .from("projects")
        .select("id, title, published, slug, cover_url, live_url")
        .order("order", { ascending: true }),
      supabase
        .from("experience")
        .select("id, role, company, published")
        .order("order", { ascending: true }),
      supabase
        .from("contact_submissions")
        .select("id, name, email, subject, message, is_read, created_at")
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("blog_posts")
        .select("id, title, published, slug, cover_url, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("service_offerings")
        .select("id, title, active")
        .order("order", { ascending: true }),
      supabase
        .from("testimonials")
        .select("id, author_name, featured, avatar_url")
        .order("order", { ascending: true }),
      supabase
        .from("admin_notes")
        .select("*")
        .order("pinned", { ascending: false })
        .order("updated_at", { ascending: false }),
    ]);

    return {
      projects: projects ?? [],
      experiences: experiences ?? [],
      submissions: submissions ?? [],
      posts: posts ?? [],
      services: services ?? [],
      testimonials: testimonials ?? [],
      notes: notes ?? [],
    };
  } catch (err) {
    console.error("Error in getAdminDashboardSummary:", err);
    return {
      projects: [],
      experiences: [],
      submissions: [],
      posts: [],
      services: [],
      testimonials: [],
      notes: [],
    };
  }
}

