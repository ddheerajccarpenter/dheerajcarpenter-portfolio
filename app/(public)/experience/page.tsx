import { getPublishedExperience } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Briefcase, GraduationCap, Award, Calendar, MapPin, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Experience & Education — Dheeraj Carpenter",
  description:
    "Engineering education, developer roles, milestones, and technical background of Dheeraj Carpenter.",
  alternates: {
    canonical: "/experience",
  },
  openGraph: {
    title: "Experience & Education — Dheeraj Carpenter",
    description:
      "Engineering education, developer roles, milestones, and technical background of Dheeraj Carpenter.",
    url: "/experience",
    type: "profile",
  },
};

const TYPE_ICONS = {
  work: Briefcase,
  education: GraduationCap,
  certification: Award,
} as const;

const TYPE_LABELS = {
  work: "Work Experience",
  education: "Education",
  certification: "Certification",
} as const;

export default async function ExperiencePage() {
  const experiences = await getPublishedExperience();

  const displayExperiences =
    experiences.length > 0
      ? experiences
      : [
          {
            id: "edu-1",
            type: "education" as const,
            role: "Bachelor of Technology (B.Tech)",
            organization: "Engineering College",
            location: "India",
            start_date: "2023-08-01",
            end_date: null,
            current: true,
            description:
              "Undergraduate coursework in computer systems, full-stack software development, object-oriented design, algorithms, and web architectures.",
            url: null,
            order: 1,
            published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "work-1",
            type: "work" as const,
            role: "Web Application Developer & Creator",
            organization: "Open Source & Freelance Projects",
            location: "India",
            start_date: "2024-01-01",
            end_date: null,
            current: true,
            description:
              "Building modern web apps using Next.js, React, TypeScript, and Supabase. Designing responsive user interfaces and creative digital media.",
            url: null,
            order: 2,
            published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];

  return (
    <SkeletonWrapper pageType="experience">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Experience", url: "/experience" },
        ]}
      />
      <div className="py-16 md:py-24 space-y-12">
        <Container className="space-y-4">
          <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
            <p className="mono-eyebrow text-muted mb-2">
              Journey &amp; Education
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Experience
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
            <p className="prose-readable text-body sm:text-body-lg text-muted max-w-[640px] leading-relaxed">
              Education, technical roles, projects, and milestones in my development journey.
            </p>
          </AnimateIn>
        </Container>

        <Container>
          <div className="max-w-3xl space-y-8 border-l border-border/80 pl-6 sm:pl-8 relative ml-2 sm:ml-4">
            {displayExperiences.map((exp, index) => {
              const Icon = TYPE_ICONS[exp.type as keyof typeof TYPE_ICONS] || Briefcase;
              const typeLabel = TYPE_LABELS[exp.type as keyof typeof TYPE_LABELS] || "Role";

              return (
                <AnimateIn key={exp.id} variant="fade-rise" distance={16} duration={0.35} staggerIndex={index} viewport viewportAmount={0.05}>
                  <div className="relative group">
                    {/* Timeline Node */}
                    <span className="absolute -left-[37px] sm:-left-[45px] top-1.5 bg-background p-1.5 sm:p-2 border border-border rounded-full shadow-xs transition-colors duration-200 group-hover:border-foreground/40">
                      <Icon className="h-3.5 w-3.5 text-foreground/80" />
                    </span>

                    <div className="space-y-2 p-5 sm:p-6 rounded-2xl border border-border bg-surface/40 hover:bg-surface/70 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-caption font-semibold uppercase tracking-wider text-muted font-mono flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {exp.start_date ? new Date(exp.start_date).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : ""}
                          {" — "}
                          {exp.current
                            ? "Present"
                            : exp.end_date
                            ? new Date(exp.end_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })
                            : ""}
                        </span>
                        <Badge variant="pill" className="text-caption font-mono uppercase">
                          {typeLabel}
                        </Badge>
                      </div>

                      <div>
                        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                          {exp.role}
                        </h2>
                        <p className="text-small font-medium text-foreground/80">
                          {exp.organization}
                        </p>
                      </div>

                      {exp.location && (
                        <p className="text-caption text-muted flex items-center gap-1 font-mono">
                          <MapPin className="h-3 w-3" />
                          {exp.location}
                        </p>
                      )}

                      {exp.description && (
                        <p className="text-small text-muted prose-readable leading-relaxed pt-1">
                          {exp.description}
                        </p>
                      )}

                      {exp.url && (
                        <div className="pt-2">
                          <a
                            href={exp.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-foreground inline-flex items-center gap-1 hover:underline underline-offset-4"
                          >
                            <span>Learn more</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </Container>
      </div>
    </SkeletonWrapper>
  );
}
