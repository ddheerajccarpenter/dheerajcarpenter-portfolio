import { getHomeContent, getAboutContent, getSettings, getCertifications, getSocialLinks } from "@/lib/data/public";
import { HomeEditor } from "@/components/admin/home-editor";
import { AboutEditor } from "@/components/admin/about-editor";
import { ResumeUploader } from "@/components/admin/resume-uploader";
import { CertificationsManager } from "@/components/admin/certifications-manager";
import { SocialManager } from "@/components/admin/social-manager";
import Link from "next/link";

export const revalidate = 0; // Dynamic rendering for admin pages

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function ContentHubPage({ searchParams }: PageProps) {
  const { tab = "hero" } = await searchParams;

  // Load all required data concurrently
  const [homeContent, aboutContent, settings, certifications, socialLinks] = await Promise.all([
    getHomeContent(),
    getAboutContent(),
    getSettings(),
    getCertifications(),
    getSocialLinks(),
  ]);

  const heroInitialData = {
    hero_name: homeContent?.hero_name || "",
    hero_role: homeContent?.hero_role || "",
    hero_intro: homeContent?.hero_intro || "",
    hero_image_url: homeContent?.hero_image_url || null,
    primary_cta_label: homeContent?.primary_cta_label || "View Projects",
    primary_cta_href: homeContent?.primary_cta_href || "/projects",
    secondary_cta_label: homeContent?.secondary_cta_label || "Contact",
    secondary_cta_href: homeContent?.secondary_cta_href || "/contact",
    about_preview: homeContent?.about_preview || "",
    contact_cta: homeContent?.contact_cta || "",
  };

  const aboutInitialData = {
    headline: aboutContent?.headline || "",
    bio: aboutContent?.bio || "",
    overview: aboutContent?.overview || "",
    photo_url: aboutContent?.photo_url || null,
  };

  const tabs = [
    { key: "hero", label: "Hero Section" },
    { key: "about", label: "About Section" },
    { key: "certifications", label: "Certifications" },
    { key: "resume", label: "Resume" },
    { key: "social", label: "Social Links" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-bold tracking-tight">Content Manager</h1>
        <p className="text-small text-muted">
          Manage all general, static, and media profile pages without modifying layout source code.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border flex items-center space-x-6 overflow-x-auto pb-px">
        {tabs.map((t) => {
          const isActive = tab === t.key;
          return (
            <Link
              key={t.key}
              href={`/admin/content?tab=${t.key}`}
              className={`pb-3 text-small font-semibold border-b-2 transition-colors shrink-0 ${
                isActive ? "border-foreground text-foreground" : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {/* Render Active Form Panel */}
      <div className="pt-2">
        {tab === "hero" && <HomeEditor initialData={heroInitialData} />}
        {tab === "about" && <AboutEditor initialData={aboutInitialData} />}
        {tab === "certifications" && <CertificationsManager initialCertifications={certifications} />}
        {tab === "resume" && (
          <ResumeUploader
            initialUrl={settings?.resume_url || null}
            initialFilename={settings?.resume_filename || null}
            initialUpdatedAt={settings?.resume_updated_at || null}
          />
        )}
        {tab === "social" && <SocialManager initialLinks={socialLinks} />}
      </div>
    </div>
  );
}
