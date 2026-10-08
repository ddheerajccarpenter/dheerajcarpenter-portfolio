import Link from "next/link";
import {
  getHomeContent,
  getFeaturedProjects,
  getPublishedProjects,
  getSkills,
  getPublishedExperience,
} from "@/lib/data/public";
import { Button, Card, Badge } from "@/components/ui";
import { Container } from "@/components/layout/container";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Briefcase,
} from "lucide-react";

export const revalidate = 3600;

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
  const role = homeContent?.hero_role || "Software Engineer & Designer";
  const intro =
    homeContent?.hero_intro ||
    "I build high-performance, accessible digital experiences with a sharp focus on typography and usability.";
  const aboutPreview =
    homeContent?.about_preview ||
    "Designer and developer focused on clean code and functional design. I prioritize accessibility, performance, and simplicity.";

  const displayProjects =
    featuredProjects.length > 0 ? featuredProjects.slice(0, 3) : allProjects.slice(0, 3);

  // Compute years of experience
  const workEntries = experience.filter((e) => e.type === "work");
  const earliestWork =
    workEntries.length > 0
      ? Math.min(...workEntries.map((e) => new Date(e.start_date).getFullYear()))
      : new Date().getFullYear();
  const yearsExp = new Date().getFullYear() - earliestWork;

  return (
    <SkeletonWrapper pageType="home">
      <div className="flex flex-col space-y-16 md:space-y-24 py-8 md:py-16">
        {/* ─── Hero Section ─────────────────────────────────────────────────── */}
        <section className="pt-4 pb-8 md:py-12" aria-label="Introduction">
          <Container>
            <div className="max-w-[760px] space-y-6 md:space-y-8">

              {/* MagicUI-style icon zoom-out + eyebrow */}
              <AnimateIn from="none" distance={0} duration={0.25} delay={0} viewport={false}>
                <div className="flex items-center gap-3 mb-2">
                  {/* Icon that starts scaled-up and snaps down — MagicUI hero logo */}
                  <AnimateIn variant="scale-zoom" initialScale={3} duration={0.06} delay={0} viewport={false}>
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-foreground text-background shadow-sm">
                      <Briefcase className="h-4 w-4" />
                    </div>
                  </AnimateIn>
                  <AnimateIn variant="fade-rise" distance={20} duration={0.28} delay={0.3} viewport={false}>
                    <span className="font-mono text-xs uppercase tracking-widest text-muted">
                      {role}
                    </span>
                  </AnimateIn>
                </div>
              </AnimateIn>

              {/* Display Headline — Anak Manja brand typography */}
              <AnimateIn variant="mask" duration={0.38} delay={0.08} viewport={false}>
                <h1 className="text-4xl sm:text-6xl md:text-8xl font-normal tracking-normal font-anak-manja text-foreground leading-[1.08] md:leading-[1.05]">
                  {name}
                </h1>
              </AnimateIn>

              {/* Intro Statement — fade-rise like MagicUI subtitle */}
              <AnimateIn variant="fade-rise" distance={24} duration={0.32} delay={0.18} viewport={false}>
                <p className="prose-readable text-body sm:text-body-lg text-muted max-w-[620px] leading-relaxed">
                  {intro}
                </p>
              </AnimateIn>

              {/* Action CTAs — slide up with slight delay */}
              <AnimateIn variant="fade-rise" distance={18} duration={0.3} delay={0.28} viewport={false}>
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

              {/* Metric Row — stagger fan-spread like MagicUI stats */}
              {(yearsExp > 0 || allProjects.length > 0 || allSkills.length > 0) && (
                <div className="pt-5 sm:pt-8 border-t border-border mt-4 sm:mt-6 max-w-[440px]">
                  <div className="grid grid-cols-3 gap-3 sm:gap-6">
                    {yearsExp > 0 && (
                      <AnimateIn variant="fade-rise" distance={20} duration={0.3} delay={0.38} viewport={false}>
                        <div className="space-y-0.5">
                          <p className="text-xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums">
                            {yearsExp}+
                          </p>
                          <p className="font-mono text-[10px] sm:text-[11px] text-muted uppercase tracking-wider">
                            Years Exp.
                          </p>
                        </div>
                      </AnimateIn>
                    )}
                    {allProjects.length > 0 && (
                      <AnimateIn variant="fade-rise" distance={20} duration={0.3} delay={0.44} viewport={false}>
                        <div className="space-y-0.5">
                          <p className="text-xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums">
                            {allProjects.length}+
                          </p>
                          <p className="font-mono text-[10px] sm:text-[11px] text-muted uppercase tracking-wider">
                            Projects
                          </p>
                        </div>
                      </AnimateIn>
                    )}
                    {allSkills.length > 0 && (
                      <AnimateIn variant="fade-rise" distance={20} duration={0.3} delay={0.5} viewport={false}>
                        <div className="space-y-0.5">
                          <p className="text-xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums">
                            {allSkills.length}
                          </p>
                          <p className="font-mono text-[10px] sm:text-[11px] text-muted uppercase tracking-wider">
                            Skills
                          </p>
                        </div>
                      </AnimateIn>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Container>
        </section>

        {/* ─── Featured Projects Highlights ──────────────────────────────────── */}
        {displayProjects.length > 0 && (
          <section className="border-t border-border/80 pt-12 md:pt-16" aria-labelledby="featured-title">
            <Container className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                {/* Section heading — Jitter UI isometric entrance */}
                <AnimateIn variant="iso" distance={30} duration={0.38} viewport viewportAmount={0.1}>
                  <div className="space-y-1">
                    <p className="mono-eyebrow text-muted">01 — Selected Work</p>
                    <h2 id="featured-title" className="text-2xl sm:text-3xl font-bold tracking-tight">
                      Featured Projects
                    </h2>
                  </div>
                </AnimateIn>
                <AnimateIn variant="fade-rise" distance={20} duration={0.3} delay={0.08} viewport viewportAmount={0.1}>
                  <Link
                    href="/projects"
                    className="text-xs font-mono text-muted hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Explore full catalog ({allProjects.length})</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </AnimateIn>
              </div>

              {/* Jitter UI Isometric cards with 3D spring tilt & lift */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {displayProjects.map((project, index) => (
                  <AnimateIn
                    key={project.id}
                    variant="iso-card"
                    duration={0.42}
                    staggerIndex={index}
                    delay={0.05}
                    viewport
                    viewportAmount={0.05}
                  >
                    <Card className="flex flex-col h-full geist-card jitter-iso-card !p-0 overflow-hidden group">
                      {project.cover_url ? (
                        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border/70 bg-surface-overlay image-pan-hover">
                          <img
                            src={project.cover_url}
                            alt={project.title}
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
                          Interactive Project
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

        {/* ─── Engineering Philosophy / About Snapshot ───────────────────────── */}
        <section className="border-t border-border/80 pt-12 md:pt-16" aria-labelledby="about-preview-title">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
              {/* MagicUI slide-right: label/heading enters from the left */}
              <AnimateIn variant="slide-right" distance={30} duration={0.45} className="md:col-span-4" viewport viewportAmount={0.1}>
                <div className="space-y-1">
                  <p className="mono-eyebrow text-muted">02 — Background</p>
                  <h2 id="about-preview-title" className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Engineering Approach
                  </h2>
                </div>
              </AnimateIn>

              {/* MagicUI slide-left: body content enters from the right */}
              <div className="md:col-span-8 space-y-5">
                <AnimateIn variant="slide-left" distance={30} duration={0.45} delay={0.06} viewport viewportAmount={0.1}>
                  <p className="text-body sm:text-body-lg text-muted leading-relaxed max-w-[65ch]">
                    {aboutPreview}
                  </p>
                </AnimateIn>
                <AnimateIn variant="fade-rise" distance={16} duration={0.3} delay={0.14} viewport viewportAmount={0.1}>
                  <Link
                    href="/about"
                    className="inline-flex items-center text-small font-semibold hover:underline underline-offset-4 text-foreground gap-1.5"
                  >
                    Read complete background &amp; philosophy
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </AnimateIn>
              </div>
            </div>
          </Container>
        </section>

        {/* ─── Contact CTA Banner ────────────────────────────────────────────── */}
        <section className="border-t border-border/80 pt-12 md:pt-16" aria-label="Collaboration Inquiry">
          <Container>
            <AnimateIn variant="fade-rise" distance={24} duration={0.4} viewport viewportAmount={0.1}>
              <div className="p-8 sm:p-10 rounded-2xl border border-border bg-surface/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <AnimateIn variant="slide-right" distance={20} duration={0.4} viewport viewportAmount={0.15}>
                    <p className="mono-eyebrow text-muted">03 — Get In Touch</p>
                  </AnimateIn>
                  <AnimateIn variant="slide-right" distance={20} duration={0.4} delay={0.06} viewport viewportAmount={0.15}>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                      Ready to collaborate on your next project?
                    </h2>
                  </AnimateIn>
                  <AnimateIn variant="fade-rise" distance={16} duration={0.3} delay={0.12} viewport viewportAmount={0.15}>
                    <p className="text-small text-muted leading-relaxed">
                      Available for select freelance contracts, engineering architecture consulting, and product design.
                    </p>
                  </AnimateIn>
                </div>
                <AnimateIn variant="slide-left" distance={24} duration={0.4} delay={0.1} viewport viewportAmount={0.15}>
                  <div className="flex items-center gap-3 shrink-0">
                    <Button asChild variant="primary" size="lg" className="rounded-full px-6 text-sm font-semibold icon-nudge">
                      <Link href="/contact">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Me
                      </Link>
                    </Button>
                  </div>
                </AnimateIn>
              </div>
            </AnimateIn>
          </Container>
        </section>
      </div>
    </SkeletonWrapper>
  );
}
