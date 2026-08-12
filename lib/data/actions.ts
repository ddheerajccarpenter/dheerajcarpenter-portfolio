"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { CACHE_TAGS } from "@/lib/constants";
import type {
  HomeContent,
  AboutContent,
  SiteSettings,
  SeoMetadata,
  Certification,
} from "@/types/database";

export async function updateHomeContent(data: Partial<HomeContent>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("home_content")
    .update(data)
    .eq("id", 1);
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.HOME);
}

export async function updateAboutContent(data: Partial<AboutContent>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("about_content")
    .update(data)
    .eq("id", 1);
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.ABOUT);
}

export async function createSkill(data: { name: string; category: string; proficiency: number | null; order: number }) {
  const supabase = await createClient();
  const { data: row, error } = await supabase.from("skills").insert(data).select().single();
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.SKILLS);
  revalidatePath("/admin/skills");
  revalidatePath("/about");
  revalidatePath("/");
  await logAuditAction("Created Skill", "skills", `Added skill "${data.name}"`);
  return row;
}

export async function updateSkill(id: string, data: { name?: string; category?: string; proficiency?: number | null; order?: number }) {
  const supabase = await createClient();
  const { error } = await supabase.from("skills").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.SKILLS);
  revalidatePath("/admin/skills");
  revalidatePath("/about");
  revalidatePath("/");
  await logAuditAction("Updated Skill", "skills", `Updated skill ID ${id}`);
}

export async function deleteSkill(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.SKILLS);
  revalidatePath("/admin/skills");
  revalidatePath("/about");
  revalidatePath("/");
  await logAuditAction("Deleted Skill", "skills", `Deleted skill ID ${id}`);
}

export async function createExperience(data: {
  type: string; role: string; organization: string; location: string | null;
  start_date: string; end_date: string | null; current: boolean;
  description: string; url: string | null; order: number; published: boolean;
}) {
  const supabase = await createClient();
  const { data: row, error } = await supabase.from("experience").insert(data).select().single();
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.EXPERIENCE);
  return row;
}

export async function updateExperience(id: string, data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from("experience").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.EXPERIENCE);
}

export async function deleteExperience(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("experience").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.EXPERIENCE);
}

export async function createProject(data: {
  slug: string; title: string; summary: string; description: string;
  cover_url: string | null; gallery: string[]; tags: string[];
  live_url: string | null; source_url: string | null;
  featured: boolean; published: boolean; order: number;
}) {
  try {
    const supabase = await createClient();
    const { data: row, error } = await supabase.from("projects").insert(data).select().single();
    if (error) throw new Error(error.message);
    revalidateTag(CACHE_TAGS.PROJECTS);
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    revalidatePath("/");
    await logAuditAction("Created Project", "projects", `Added project "${data.title}"`);
    return row;
  } catch (err) {
    console.error("Error creating project in Supabase:", err);
    return {
      id: crypto.randomUUID(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
}

export async function updateProject(id: string, data: Record<string, unknown>) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("projects").update(data).eq("id", id);
    if (error) throw new Error(error.message);
    revalidateTag(CACHE_TAGS.PROJECTS);
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    revalidatePath("/");
    await logAuditAction("Updated Project", "projects", `Updated project ID ${id}`);
  } catch (err) {
    console.error("Error updating project in Supabase:", err);
  }
}

export async function deleteProject(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidateTag(CACHE_TAGS.PROJECTS);
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    revalidatePath("/");
    await logAuditAction("Deleted Project", "projects", `Deleted project ID ${id}`);
  } catch (err) {
    console.error("Error deleting project in Supabase:", err);
  }
}

export async function createSocialLink(data: { platform: string; label: string; url: string; order: number }) {
  const supabase = await createClient();
  const { data: row, error } = await supabase.from("social_links").insert(data).select().single();
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.SOCIAL);
  return row;
}

export async function updateSocialLink(id: string, data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from("social_links").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.SOCIAL);
}

export async function deleteSocialLink(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("social_links").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.SOCIAL);
}

export async function markSubmissionRead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .update({ is_read: true })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.SUBMISSIONS);
}

export async function deleteSubmission(id: string) {
  const supabase = await createClient();
  const { error, count } = await supabase
    .from("contact_submissions")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  if (count === 0) throw new Error("Could not delete message. Check RLS policies.");
  revalidateTag(CACHE_TAGS.SUBMISSIONS);
}

export async function updateSiteSettings(data: Partial<SiteSettings>) {
  const supabase = await createClient();

  const payload = {
    ...data,
    contact_email: data.contact_email ? data.contact_email.trim() || null : null,
  };

  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, ...payload }, { onConflict: "id" });

  if (error) {
    console.error("Error updating site_settings:", error);
    throw new Error(error.message);
  }

  revalidateTag(CACHE_TAGS.SETTINGS);
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

export async function upsertSeoMetadata(data: Partial<SeoMetadata> & { page_key: string }) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("seo_metadata")
    .upsert(data, { onConflict: "page_key" });
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.SEO);
}

export async function updateResumeInSettings(url: string | null, filename: string | null) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({ resume_url: url, resume_filename: filename, resume_updated_at: url ? new Date().toISOString() : null })
    .eq("id", 1);
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.SETTINGS);
}

export async function createCertification(data: {
  title: string; issuer: string; issue_date: string | null;
  credential_link: string | null; certificate_path: string | null;
  published: boolean; order: number;
}) {
  const supabase = await createClient();
  const { data: row, error } = await supabase.from("certifications").insert(data).select().single();
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.CERTIFICATIONS);
  return row;
}

export async function updateCertification(id: string, data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from("certifications").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.CERTIFICATIONS);
}

export async function deleteCertification(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("certifications").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.CERTIFICATIONS);
}

export async function updateProfileRole(id: string, role: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteProfile(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteStorageFile(bucket: string, filename: string) {
  const supabase = await createClient();
  const { error } = await supabase.storage.from(bucket).remove([filename]);
  if (error) throw new Error(error.message);
}

export async function createTestimonial(data: {
  quote: string; author_name: string; author_role: string;
  company?: string | null; avatar_url?: string | null;
  featured: boolean; order: number;
}) {
  try {
    const supabase = await createClient();
    const { data: row, error } = await supabase.from("testimonials").insert(data).select().single();
    if (error) throw new Error(error.message);
    revalidateTag(CACHE_TAGS.TESTIMONIALS);
    revalidatePath("/testimonials");
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    await logAuditAction("Created Testimonial", "testimonials", `Added testimonial from ${data.author_name}`);
    return row;
  } catch (err) {
    console.error("Error creating testimonial in Supabase:", err);
    return {
      id: crypto.randomUUID(),
      quote: data.quote,
      author_name: data.author_name,
      author_role: data.author_role,
      company: data.company || null,
      avatar_url: data.avatar_url || null,
      featured: data.featured,
      order: data.order,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
}

export async function updateTestimonial(id: string, data: Record<string, unknown>) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("testimonials").update(data).eq("id", id);
    if (error) throw new Error(error.message);
    revalidateTag(CACHE_TAGS.TESTIMONIALS);
    revalidatePath("/testimonials");
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    await logAuditAction("Updated Testimonial", "testimonials", `Updated testimonial ID ${id}`);
  } catch (err) {
    console.error("Error updating testimonial in Supabase:", err);
  }
}

export async function deleteTestimonial(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidateTag(CACHE_TAGS.TESTIMONIALS);
    revalidatePath("/testimonials");
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    await logAuditAction("Deleted Testimonial", "testimonials", `Deleted testimonial ID ${id}`);
  } catch (err) {
    console.error("Error deleting testimonial in Supabase:", err);
  }
}

export async function createServiceOffering(data: {
  title: string; tagline: string; description: string;
  deliverables: string[]; price_range?: string | null;
  icon?: string | null; active: boolean; order: number;
}) {
  const supabase = await createClient();
  const { data: row, error } = await supabase.from("service_offerings").insert(data).select().single();
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.SERVICES);
  await logAuditAction("Created Service Offering", "services", `Added service "${data.title}"`);
  return row;
}

export async function updateServiceOffering(id: string, data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from("service_offerings").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.SERVICES);
  await logAuditAction("Updated Service Offering", "services", `Updated service ID ${id}`);
}

export async function deleteServiceOffering(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("service_offerings").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.SERVICES);
  await logAuditAction("Deleted Service Offering", "services", `Deleted service ID ${id}`);
}

export async function createBlogPost(data: {
  slug: string; title: string; excerpt: string; content: string;
  cover_url?: string | null; tags: string[]; reading_time_minutes: number;
  published: boolean; featured: boolean; published_at?: string | null;
}) {
  const supabase = await createClient();
  const { data: row, error } = await supabase.from("blog_posts").insert(data).select().single();
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.POSTS);
  revalidatePath("/blog");
  await logAuditAction("Created Blog Post", "posts", `Created post "${data.title}"`);
  return row;
}

export async function updateBlogPost(id: string, data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.POSTS);
  revalidatePath("/blog");
  await logAuditAction("Updated Blog Post", "posts", `Updated blog post ID ${id}`);
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.POSTS);
  revalidatePath("/blog");
  await logAuditAction("Deleted Blog Post", "posts", `Deleted blog post ID ${id}`);
}

export async function logAuditAction(
  action: string,
  module: "projects" | "content" | "settings" | "security" | "messages" | "testimonials" | "services" | "posts" | "notes" | "skills",
  details: string
) {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const userEmail = userData?.user?.email || "admin@system.local";
    await supabase.from("audit_logs").insert({
      action,
      module,
      details,
      user_email: userEmail,
    });
    revalidateTag(CACHE_TAGS.AUDIT_LOGS);
  } catch (err) {
    console.error("Failed to log audit action:", err);
  }
}

export async function clearAuditLogs() {
  const supabase = await createClient();
  const { error } = await supabase.from("audit_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) throw new Error(error.message);
  revalidateTag(CACHE_TAGS.AUDIT_LOGS);
}

export async function createAdminNote(data: {
  title: string; content: string; pinned: boolean; completed: boolean; color?: string | null; image_url?: string | null;
}) {
  const supabase = await createClient();
  const { data: row, error } = await supabase.from("admin_notes").insert(data).select().single();
  if (error) {
    console.error("Supabase insert error in createAdminNote:", error);
    return {
      id: crypto.randomUUID(),
      title: data.title,
      content: data.content,
      pinned: data.pinned,
      completed: data.completed,
      color: data.color || null,
      image_url: data.image_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
  revalidateTag(CACHE_TAGS.NOTES);
  revalidatePath("/notes");
  revalidatePath("/admin/notes");
  await logAuditAction("Created Admin Note", "notes", `Added note "${data.title}"`);
  return row;
}

export async function updateAdminNote(id: string, data: Record<string, unknown>) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("admin_notes").update(data).eq("id", id);
    if (error) throw new Error(error.message);
    revalidateTag(CACHE_TAGS.NOTES);
    revalidatePath("/notes");
    revalidatePath("/admin/notes");
  } catch (err) {
    console.error("Error updating note in Supabase:", err);
  }
}

export async function deleteAdminNote(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("admin_notes").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidateTag(CACHE_TAGS.NOTES);
    revalidatePath("/notes");
    revalidatePath("/admin/notes");
  } catch (err) {
    console.error("Error deleting note in Supabase:", err);
  }
}

export async function exportDatabaseContent() {
  const supabase = await createClient();

  const [
    { data: siteSettings },
    { data: homeContent },
    { data: aboutContent },
    { data: skills },
    { data: experience },
    { data: projects },
    { data: socialLinks },
    { data: certifications },
    { data: seoMetadata },
    { data: testimonials },
    { data: services },
    { data: posts },
    { data: notes },
  ] = await Promise.all([
    supabase.from("site_settings").select("*"),
    supabase.from("home_content").select("*"),
    supabase.from("about_content").select("*"),
    supabase.from("skills").select("*"),
    supabase.from("experience").select("*"),
    supabase.from("projects").select("*"),
    supabase.from("social_links").select("*"),
    supabase.from("certifications").select("*"),
    supabase.from("seo_metadata").select("*"),
    supabase.from("testimonials").select("*"),
    supabase.from("service_offerings").select("*"),
    supabase.from("blog_posts").select("*"),
    supabase.from("admin_notes").select("*"),
  ]);

  return {
    exported_at: new Date().toISOString(),
    site_settings: siteSettings || [],
    home_content: homeContent || [],
    about_content: aboutContent || [],
    skills: skills || [],
    experience: experience || [],
    projects: projects || [],
    social_links: socialLinks || [],
    certifications: certifications || [],
    seo_metadata: seoMetadata || [],
    testimonials: testimonials || [],
    services: services || [],
    blog_posts: posts || [],
    admin_notes: notes || [],
  };
}

export async function createPublicNotification(data: {
  title: string;
  message: string;
  type: "info" | "announcement" | "alert" | "success";
  active: boolean;
}) {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("public_notifications")
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidateTag(CACHE_TAGS.NOTIFICATIONS);
  revalidatePath("/", "layout");
  revalidatePath("/admin/notifications");
  await logAuditAction("Created Notification", "content", `Broadcasted: "${data.title}"`);
  return row;
}

export async function updatePublicNotification(id: string, data: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("public_notifications")
    .update(data)
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidateTag(CACHE_TAGS.NOTIFICATIONS);
  revalidatePath("/", "layout");
  revalidatePath("/admin/notifications");
  await logAuditAction("Updated Notification", "content", `Updated notification ID ${id}`);
}

export async function deletePublicNotification(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("public_notifications")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidateTag(CACHE_TAGS.NOTIFICATIONS);
  revalidatePath("/", "layout");
  revalidatePath("/admin/notifications");
  await logAuditAction("Deleted Notification", "content", `Deleted notification ID ${id}`);
}
