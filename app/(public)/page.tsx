import Link from "next/link";
import {
  getHomeContent,
  getFeaturedProjects,
  getPublishedProjects,
  getSkills,
  getPublishedExperience,
} from "@/lib/data/public";
import { Button, Card } from "@/components/ui";
import { Container } from "@/components/layout/container";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
} from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Dheeraj Carpenter | Engineering Student & Full-Stack Developer",
  description:
    "Official portfolio of Dheeraj Carpenter — engineering student passionate about software engineering, modern web applications, video editing, and creative design based in India.",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const [
    homeContent,
    featuredProjects,
    allProjects,
    allSkills,
    experience,
  ] = await Promise.all([
    getHomeContent(),
    getFeaturedProjects(),
    getPublishedProjects(),
    getSkills(),
    getPublishedExperience(),
  ]);

  const name = homeContent?.hero_name || "Dheeraj Carpenter";
  const role = homeContent?.hero_role || "Engineering Student";
  const intro =
    homeContent?.hero_intro ||
    "Hi, I'm Dheeraj, an engineering student with a passion for technology, coding, video editing, and creative design.";
  const aboutPreview =
    homeContent?.about_preview ||
    "Focused on clean code, modern web technologies, and functional design. I prioritize simplicity, performance, and continuous learning.";

  const displayProjects =
    featuredProjects.length > 0 ? featuredProjects.slice(0, 3) : allProjects.slice(0, 3);

  // Compute years of experience safely
  const workEntries = experience.filter((e) => e.type === "work");
  const workYears = workEntries
    .map((e) => new Date(e.start_date).getFullYear())
    .filter((y) => !isNaN(y) && y > 1970 && y <= new Date().getFullYear());
  const earliestWork = workYears.length > 0 ? Math.min(...workYears) : new Date().getFullYear();
  const yearsExp = Math.max(0, new Date().getFullYear() - earliestWork);

  return (
    <SkeletonWrapper pageType="home">
      <div className="flex flex-col space-y-16 md:space-y-24 py-8 md:py-16">
        {/* ─── Hero Section ─────────────────────────────────────────────────── */}
        <section className="pt-4 pb-8 md:py-12" aria-label="Introduction">
          <Container>
            <div className="max-w-[760px] space-y-6 md:space-y-8">

              {/* Clean Eyebrow */}
              <AnimateIn variant="fade-rise" distance={14} duration={0.28} delay={0.05} viewport={false}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted">
                    {role}
                  </span>
                </div>
              </AnimateIn>

              {/* Display Headline — Anak Manja brand typography */}
              <AnimateIn variant="fade-rise" distance={16} duration={0.35} delay={0.08} viewport={false}>
                <h1 className="text-4xl sm:text-6xl md:text-8xl font-normal tracking-normal font-anak-manja text-foreground leading-[1.08] md:leading-[1.05]">
                  {name}
                </h1>
              </AnimateIn>

              {/* Intro Statement */}
              <AnimateIn variant="fade-rise" distance={20} duration={0.32} delay={0.16} viewport={false}>
                <p className="prose-readable text-body sm:text-body-lg text-muted max-w-[620px] leading-relaxed">
                  {intro}
                </p>
              </AnimateIn>

              {/* Action CTAs */}
              <AnimateIn variant="fade-rise" distance={16} duration={0.3} delay={0.24} viewport={false}>
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                  <Button
                    asChild
                    variant="primary"
                    size="lg"
                    className="rounded-full px-5 sm:px-7 text-xs sm:text-sm font-medium icon-nudge"
                  >
                    <Link href="/projects">
                      View Projects
                      <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    size="lg"
                    className="rounded-full px-5 sm:px-7 text-xs sm:text-sm font-medium border border-border"
                  >
                    <Link href="/contact">Get in Touch</Link>
                  </Button>
                </div>
              </AnimateIn>

              {/* Metric Row */}
              {(() => {
                const metrics = [
                  ...(yearsExp > 0 ? [{ value: `${yearsExp}+`, label: "Years Exp." }] : []),
                  ...(allProjects.length > 0 ? [{ value: `${allProjects.length}+`, label: "Projects" }] : []),
                  ...(allSkills.length > 0 ? [{ value: `${allSkills.length}`, label: "Skills" }] : []),
                ];
                if (metrics.length === 0) return null;
                return (
                  <div className="pt-5 sm:pt-8 border-t border-border mt-4 sm:mt-6">
                    <div className="flex flex-wrap items-center gap-6 sm:gap-12">
                      {metrics.map((m, idx) => (
                        <AnimateIn key={m.label} variant="fade-rise" distance={14} duration={0.3} delay={0.3 + idx * 0.04} viewport={false}>
                          <div className="space-y-0.5">
                            <p className="text-xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums">
                              {m.value}
                            </p>
                            <p className="font-mono text-[10px] sm:text-[11px] text-muted uppercase tracking-wider">
                              {m.label}
                            </p>
                          </div>
                        </AnimateIn>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </Container>
        </section>

        {/* ─── Featured Projects Highlights ──────────────────────────────────── */}
        {displayProjects.length > 0 && (
          <section className="border-t border-border/80 pt-12 md:pt-16" aria-labelledby="featured-title">
            <Container className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <AnimateIn variant="fade-rise" distance={20} duration={0.35} viewport viewportAmount={0.1}>
                  <div className="space-y-1">
                    <p className="mono-eyebrow text-muted">01 — Selected Work</p>
                    <h2 id="featured-title" className="text-2xl sm:text-3xl font-bold tracking-tight">
                      Featured Projects
                    </h2>
                  </div>
                </AnimateIn>
                <AnimateIn variant="fade-rise" distance={16} duration={0.3} delay={0.06} viewport viewportAmount={0.1}>
                  <Link
                    href="/projects"
                    className="text-xs font-mono text-muted hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Explore full catalog ({allProjects.length})</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </AnimateIn>
              </div>

              {/* Clean responsive card grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {displayProjects.map((project, index) => (
                  <AnimateIn
                    key={project.id}
                    variant="fade-rise"
                    distance={20}
                    duration={0.38}
                    staggerIndex={index}
                    delay={0.04}
                    viewport
                    viewportAmount={0.05}
                  >
                    <Card className="flex flex-col h-full geist-card !p-0 overflow-hidden group">
                      {project.cover_url ? (
                        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border/70 bg-surface-overlay image-pan-hover">
                          <img
                            src={project.cover_url}
                            alt={project.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                          {project.live_url && (
                            <div className="absolute top-3 right-3">
                              <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-0.5 rounded-full bg-black/80 border border-white/20 text-[10px] font-mono text-white flex items-center gap-1"
                              >
                                Live
                                <ArrowUpRight className="h-3 w-3 opacity-80" />
                              </a>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="relative aspect-[16/10] w-full bg-surface-overlay border-b border-border/70 flex items-center justify-center text-caption text-muted font-mono">
                          Project
                        </div>
                      )}

                      <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
                        <div className="space-y-1.5">
                          <h3 className="text-lg font-bold tracking-tight">
                            <Link href={`/projects/${project.slug}`} className="hover:underline">
                              {project.title}
                            </Link>
                          </h3>
                          <p className="text-small text-muted line-clamp-2 leading-relaxed">
                            {project.summary}
                          </p>
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-border/50">
                          {project.tags && project.tags.length > 0 ? (
                            <span className="text-[11px] font-mono text-muted">
                              {project.tags[0]}
                              {project.tags.length > 1 && ` +${project.tags.length - 1}`}
                            </span>
                          ) : (
                            <span />
                          )}
                          <Link
                            href={`/projects/${project.slug}`}
                            className="text-xs font-semibold text-foreground inline-flex items-center gap-1 hover:underline"
                          >
                            Case Study
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </AnimateIn>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* ─── About Snapshot ────────────────────────────────────────────────── */}
        <section className="border-t border-border/80 pt-12 md:pt-16" aria-labelledby="about-preview-title">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
              <AnimateIn variant="fade-rise" distance={20} duration={0.35} className="md:col-span-4" viewport viewportAmount={0.1}>
                <div className="space-y-1">
                  <p className="mono-eyebrow text-muted">02 — Background</p>
                  <h2 id="about-preview-title" className="text-2xl sm:text-3xl font-bold tracking-tight">
                    About Me
                  </h2>
                </div>
              </AnimateIn>

              <div className="md:col-span-8 space-y-5">
                <AnimateIn variant="fade-rise" distance={20} duration={0.35} delay={0.06} viewport viewportAmount={0.1}>
                  <p className="text-body sm:text-body-lg text-muted leading-relaxed max-w-[65ch]">
                    {aboutPreview}
                  </p>
                </AnimateIn>
                <AnimateIn variant="fade-rise" distance={16} duration={0.3} delay={0.12} viewport viewportAmount={0.1}>
                  <Link
                    href="/about"
                    className="inline-flex items-center text-small font-semibold hover:underline underline-offset-4 text-foreground gap-1.5"
                  >
                    Read full background &amp; skills
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </AnimateIn>
              </div>
            </div>
          </Container>
        </section>

        {/* ─── Contact Banner ─────────────────────────────────────────────────── */}
        <section className="border-t border-border/80 pt-12 md:pt-16" aria-label="Get in Touch">
          <Container>
            <AnimateIn variant="fade-rise" distance={20} duration={0.35} viewport viewportAmount={0.1}>
              <div className="p-8 sm:p-10 rounded-2xl border border-border bg-surface/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <p className="mono-eyebrow text-muted">03 — Get In Touch</p>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Let&apos;s connect
                  </h2>
                  <p className="text-small text-muted leading-relaxed">
                    Have an idea, project inquiry, or just want to chat about technology? Feel free to reach out anytime.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Button asChild variant="primary" size="lg" className="rounded-full px-6 text-sm font-semibold icon-nudge">
                    <Link href="/contact">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Me
                    </Link>
                  </Button>
                </div>
              </div>
            </AnimateIn>
          </Container>
        </section>
      </div>
    </SkeletonWrapper>
  );
}
