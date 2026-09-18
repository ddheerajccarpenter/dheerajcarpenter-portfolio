import Link from "next/link";
import {
  getHomeContent,
  getFeaturedProjects,
  getPublishedProjects,
  getSkills,
  getPublishedExperience,
  getActiveServices,
  getFeaturedTestimonials,
  getPublishedPosts,
} from "@/lib/data/public";
import { Button, Card, Badge } from "@/components/ui";
import { Container } from "@/components/layout/container";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";
import { EdgeLight } from "@/components/ui/edge-light";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { ArrowRight, ArrowUpRight, ExternalLink, CheckCircle2, Star, Briefcase, Calendar } from "lucide-react";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    homeContent,
    featuredProjects,
    allProjects,
    allSkills,
    experience,
    services,
    testimonials,
    publishedPosts,
  ] = await Promise.all([
    getHomeContent(),
    getFeaturedProjects(),
    getPublishedProjects(),
    getSkills(),
    getPublishedExperience(),
    getActiveServices(),
    getFeaturedTestimonials(),
    getPublishedPosts(),
  ]);

  const name = homeContent?.hero_name || "Dheeraj Carpenter";
  const role = homeContent?.hero_role || "Software Engineer & Designer";
  const intro = homeContent?.hero_intro || "I build high-performance, accessible digital experiences with a sharp focus on typography and usability.";
  const aboutPreview = homeContent?.about_preview || "Designer and developer focused on clean code and functional design. I prioritize accessibility, performance, and simplicity.";
  const contactCta = homeContent?.contact_cta || "Have a project in mind? Get in touch.";

  const topSkills = allSkills.slice(0, 8);
  const latestExperience = experience.slice(0, 2);
  const latestPosts = publishedPosts.slice(0, 2);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : allProjects.slice(0, 4);
  const spotlightProject = featuredProjects[0] || allProjects[0];

  // Compute years of experience
  const workEntries = experience.filter((e) => e.type === "work");
  const earliestWork = workEntries.length > 0
    ? Math.min(...workEntries.map((e) => new Date(e.start_date).getFullYear()))
    : new Date().getFullYear();
  const yearsExp = new Date().getFullYear() - earliestWork;

  let sectionIndex = 0;
  const nextIndex = () => String(++sectionIndex).padStart(2, "0");

  return (
    <SkeletonWrapper pageType="home">
      <div className="flex flex-col space-y-24 py-8 md:py-16">

        {/* ─── Hero ──────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-4 pb-8 md:py-14" aria-label="Introduction">
          <div className="hero-glow" aria-hidden="true" />

          <Container className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

              {/* Left Column: Bio, Headline, CTAs, Stats */}
              <div className="lg:col-span-7 space-y-6">
                <AnimateIn from="up" distance={8} duration={0.3} delay={0} viewport={false}>
                  <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border/80 bg-surface/80 backdrop-blur-md text-caption font-medium tracking-wide text-foreground shadow-xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="font-semibold text-foreground">Available for opportunities</span>
                    <span className="text-muted/60">•</span>
                    <span className="text-muted">{role}</span>
                  </div>
                </AnimateIn>

                <AnimateIn variant="mask" duration={0.4} delay={0.06} viewport={false}>
                  <HeroParallax speed={0.04}>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-hero-name tracking-tight text-editorial-gradient leading-[1.08]">
                      {name}
                    </h1>
                  </HeroParallax>
                </AnimateIn>

                <AnimateIn from="up" distance={10} duration={0.35} delay={0.12} viewport={false}>
                  <p className="text-base sm:text-lg text-foreground/90 font-medium leading-snug">
                    Engineering modern web platforms, intelligent AI tools, and refined digital experiences.
                  </p>
                </AnimateIn>

                <AnimateIn from="up" distance={10} duration={0.35} delay={0.18} viewport={false}>
                  <p className="prose-readable text-small sm:text-body text-muted leading-relaxed max-w-[580px]">
                    {intro}
                  </p>
                </AnimateIn>

                <AnimateIn from="up" distance={8} duration={0.35} delay={0.24} viewport={false}>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button asChild variant="primary" size="lg" className="shadow-xs group">
                      <Link href={homeContent?.primary_cta_href || "/projects"}>
                        {homeContent?.primary_cta_label || "View Projects"}
                        <ArrowRight className="h-4 w-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" size="lg" className="bg-surface/70 backdrop-blur-xs border-border/80">
                      <Link href={homeContent?.secondary_cta_href || "/contact"}>
                        {homeContent?.secondary_cta_label || "Contact"}
                      </Link>
                    </Button>
                  </div>
                </AnimateIn>

                {/* Stat row */}
                {(yearsExp > 0 || allProjects.length > 0 || allSkills.length > 0) && (
                  <AnimateIn from="up" distance={8} duration={0.35} delay={0.3} viewport={false}>
                    <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/80 mt-2 max-w-[460px]">
                      {yearsExp > 0 && (
                        <div className="space-y-0.5">
                          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums">
                            {yearsExp}+
                          </p>
                          <p className="text-[11px] text-muted uppercase tracking-wider font-semibold">Years Exp.</p>
                        </div>
                      )}
                      {allProjects.length > 0 && (
                        <div className="space-y-0.5">
                          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums">
                            {allProjects.length}+
                          </p>
                          <p className="text-[11px] text-muted uppercase tracking-wider font-semibold">Projects</p>
                        </div>
                      )}
                      {allSkills.length > 0 && (
                        <div className="space-y-0.5">
                          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums">
                            {allSkills.length}
                          </p>
                          <p className="text-[11px] text-muted uppercase tracking-wider font-semibold">Skills</p>
                        </div>
                      )}
                    </div>
                  </AnimateIn>
                )}
              </div>

              {/* Right Column: Interactive Bento Spotlight Card */}
              {spotlightProject && (
                <div className="lg:col-span-5">
                  <AnimateIn from="up" distance={16} duration={0.45} delay={0.15} viewport={false}>
                    <div className="bento-card rounded-2xl overflow-hidden group relative">
                      {/* Top Header pill */}
                      <div className="px-5 py-3 border-b border-border/70 flex items-center justify-between bg-surface/50">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-[11px] font-semibold tracking-wide text-foreground uppercase">
                            Spotlight Project
                          </span>
                        </div>
                        {spotlightProject.live_url && (
                          <a
                            href={spotlightProject.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-muted hover:text-foreground transition-colors"
                          >
                            <span>Live App</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>

                      {/* Image preview */}
                      {spotlightProject.cover_url && (
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-overlay border-b border-border/70">
                          <img
                            src={spotlightProject.cover_url}
                            alt={spotlightProject.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}

                      {/* Content details */}
                      <div className="p-5 sm:p-6 space-y-4">
                        <div className="space-y-1.5">
                          <h2 className="text-lg font-bold tracking-tight text-foreground group-hover:text-foreground/90 transition-colors">
                            {spotlightProject.title}
                          </h2>
                          <p className="text-small text-muted line-clamp-2 leading-relaxed">
                            {spotlightProject.summary}
                          </p>
                        </div>

                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(spotlightProject.tags && spotlightProject.tags.length > 0
                            ? spotlightProject.tags.slice(0, 4)
                            : ["Next.js", "AI Discovery", "Supabase", "Tailwind"]
                          ).map((tag) => (
                            <Badge key={tag} variant="pill" className="text-caption font-mono">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div className="pt-3 border-t border-border/70 flex items-center gap-3">
                          <Button asChild variant="secondary" size="sm" className="flex-1 justify-center">
                            <Link href={`/projects/${spotlightProject.slug}`}>
                              Case Study
                              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                            </Link>
                          </Button>
                          {spotlightProject.live_url && (
                            <Button asChild variant="primary" size="sm" className="flex-1 justify-center">
                              <a href={spotlightProject.live_url} target="_blank" rel="noopener noreferrer">
                                Try Demo
                                <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </AnimateIn>
                </div>
              )}

            </div>
          </Container>
        </section>

        {/* ─── Services ──────────────────────────────────────────────────────── */}
        {services.length > 0 && (
          <section className="border-t border-border/80 pt-20" aria-labelledby="services-title">
            <Container className="space-y-10">
              <AnimateIn from="up" distance={12} viewport>
                <div className="space-y-1">
                  <p className="text-caption font-bold uppercase tracking-[0.14em] text-muted flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
                    {nextIndex()} — Services
                  </p>
                  <h2 id="services-title" className="text-h2 font-bold tracking-tight">
                    What I offer
                  </h2>
                </div>
              </AnimateIn>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service, index) => (
                  <AnimateIn key={service.id} from="up" distance={16} staggerIndex={index} viewport>
                    <Card className="flex flex-col justify-between h-full space-y-6 card-accent-bar">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="text-h3 font-bold">{service.title}</h3>
                            {service.tagline && (
                              <p className="text-small font-medium text-muted mt-1">{service.tagline}</p>
                            )}
                          </div>
                          {service.price_range && (
                            <Badge variant="pill" className="shrink-0 font-mono">
                              {service.price_range}
                            </Badge>
                          )}
                        </div>

                        <p className="text-body text-muted line-clamp-3 leading-relaxed">{service.description}</p>

                        {service.deliverables && service.deliverables.length > 0 && (
                          <ul className="space-y-2 pt-2 border-t border-border">
                            {service.deliverables.slice(0, 3).map((d, i) => (
                              <li key={i} className="flex items-start text-small text-foreground gap-2.5">
                                <CheckCircle2 className="h-4 w-4 text-foreground shrink-0 mt-0.5 opacity-80" />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                        <span className="text-small font-semibold text-foreground">
                          {service.price_range || "Custom Scope"}
                        </span>
                        <Button asChild variant="secondary" size="sm">
                          <Link href="/contact">Inquire</Link>
                        </Button>
                      </div>
                    </Card>
                  </AnimateIn>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* ─── About ─────────────────────────────────────────────────────────── */}
        <section className="border-t border-border/80 pt-20" aria-labelledby="about-preview-title">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
              <AnimateIn from="up" distance={12} className="md:col-span-4" viewport>
                <div className="space-y-1 md:sticky md:top-28">
                  <p className="text-caption font-bold uppercase tracking-[0.14em] text-muted flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
                    {nextIndex()} — About
                  </p>
                  <h2 id="about-preview-title" className="text-h2 font-bold tracking-tight">
                    About me
                  </h2>
                </div>
              </AnimateIn>

              <div className="md:col-span-8 space-y-6">
                <AnimateIn from="up" distance={12} delay={0.08} viewport>
                  <p className="text-body-lg text-muted leading-relaxed max-w-[65ch]">
                    {aboutPreview}
                  </p>
                </AnimateIn>
                <AnimateIn from="up" distance={8} delay={0.15} viewport>
                  <Link
                    href="/about"
                    className="inline-flex items-center text-small font-semibold hover:underline underline-offset-4 animate-arrow-slide text-foreground gap-1.5"
                  >
                    Read more about my background
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </AnimateIn>
              </div>
            </div>
          </Container>
        </section>

        {/* ─── Featured Work ─────────────────────────────────────────────────── */}
        <section className="border-t border-border/80 pt-20" aria-labelledby="featured-projects-title">
          <Container className="space-y-10">
            <AnimateIn from="up" distance={12} viewport>
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-caption font-bold uppercase tracking-[0.14em] text-muted flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
                    {nextIndex()} — Work
                  </p>
                  <h2 id="featured-projects-title" className="text-h2 font-bold tracking-tight">
                    Featured projects
                  </h2>
                </div>
                <Link
                  href="/projects"
                  className="hidden sm:inline-flex items-center text-small font-semibold hover:underline underline-offset-4 animate-arrow-slide text-foreground gap-1.5"
                >
                  All projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </AnimateIn>

            {displayProjects.length === 0 ? (
              <AnimateIn from="up" distance={12} viewport>
                <div className="border border-dashed border-border p-12 text-center text-muted rounded-2xl bg-surface/30">
                  No projects published yet.
                </div>
              </AnimateIn>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {displayProjects.map((project, index) => (
                  <AnimateIn key={project.id} from="up" distance={16} staggerIndex={index} viewport>
                    <Card className="flex flex-col justify-between h-full bento-card !p-0 overflow-hidden group">
                      {/* Project Cover Image */}
                      {project.cover_url ? (
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-overlay border-b border-border/70">
                          <img
                            src={project.cover_url}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {project.live_url && (
                            <div className="absolute top-3 right-3">
                              <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white flex items-center gap-1.5 hover:bg-black transition-colors"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                                Live Demo
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

                      {/* Content details */}
                      <div className="flex flex-col flex-1 justify-between p-6 md:p-7 space-y-5">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start gap-3">
                            <h3 className="text-xl font-bold tracking-tight group-hover:text-foreground/90 transition-colors">
                              <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                            </h3>
                            <span className="p-1 rounded-md bg-surface-overlay text-foreground shrink-0 border border-border/60">
                              <Star className="h-3.5 w-3.5 fill-current opacity-80" />
                            </span>
                          </div>

                          <p className="text-body text-muted line-clamp-3 leading-relaxed">
                            {project.summary}
                          </p>

                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {project.tags.map((tag) => (
                                <Badge key={tag} variant="pill" className="text-caption font-mono">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-border/70 flex items-center gap-3 mt-auto">
                          <Button asChild variant="secondary" size="sm" className="flex-1 justify-center group-hover:border-border-strong">
                            <Link href={`/projects/${project.slug}`}>
                              View Case Study
                              <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>
                          </Button>
                          {project.live_url && (
                            <Button asChild variant="primary" size="sm" className="shrink-0">
                              <a href={project.live_url} target="_blank" rel="noopener noreferrer" aria-label="Visit Live Demo">
                                <ArrowUpRight className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </AnimateIn>
                ))}
              </div>
            )}
          </Container>
        </section>

        {/* ─── Skills ────────────────────────────────────────────────────────── */}
        {topSkills.length > 0 && (
          <section className="border-t border-border/80 pt-20" aria-labelledby="skills-preview-title">
            <Container>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                <AnimateIn from="up" distance={12} className="md:col-span-4" viewport>
                  <div className="space-y-1 md:sticky md:top-28">
                    <p className="text-caption font-bold uppercase tracking-[0.14em] text-muted flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
                      Skills
                    </p>
                    <h2 id="skills-preview-title" className="text-h2 font-bold tracking-tight">
                      Expertise
                    </h2>
                  </div>
                </AnimateIn>
                <div className="md:col-span-8 space-y-6">
                  <div className="flex flex-wrap gap-2.5">
                    {topSkills.map((skill, index) => (
                      <AnimateIn key={skill.id} from="up" distance={8} staggerIndex={index} viewportAmount={0.05} viewport>
                        <Badge variant="pill" className="text-small py-1.5 px-4 animate-badge-glow">
                          {skill.name}
                        </Badge>
                      </AnimateIn>
                    ))}
                  </div>
                  <AnimateIn from="up" distance={8} delay={0.2} viewport>
                    <Link
                      href="/about#skills"
                      className="inline-flex items-center text-small font-semibold hover:underline underline-offset-4 animate-arrow-slide text-foreground gap-1.5"
                    >
                      View all skills
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </AnimateIn>
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* ─── Experience ────────────────────────────────────────────────────── */}
        {latestExperience.length > 0 && (
          <section className="border-t border-border/80 pt-20" aria-labelledby="experience-preview-title">
            <Container>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                <AnimateIn from="up" distance={12} className="md:col-span-4" viewport>
                  <div className="space-y-1 md:sticky md:top-28">
                    <p className="text-caption font-bold uppercase tracking-[0.14em] text-muted flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
                      Experience
                    </p>
                    <h2 id="experience-preview-title" className="text-h2 font-bold tracking-tight">
                      Where I&apos;ve worked
                    </h2>
                  </div>
                </AnimateIn>

                <div className="md:col-span-8 space-y-8">
                  <div className="relative border-l border-border/80 pl-7 space-y-8">
                    {latestExperience.map((exp, index) => (
                      <AnimateIn key={exp.id} from="up" distance={14} staggerIndex={index} viewport>
                        <div className="relative">
                          <span className="absolute -left-[35px] top-1 bg-surface p-1.5 border border-border rounded-full shadow-xs">
                            <Briefcase className="h-3.5 w-3.5 text-foreground opacity-80" />
                          </span>
                          <div className="space-y-1.5">
                            <span className="text-caption font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 font-mono">
                              <Calendar className="h-3 w-3" />
                              {new Date(exp.start_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                              {" – "}
                              {exp.current
                                ? "Present"
                                : exp.end_date
                                ? new Date(exp.end_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })
                                : ""}
                            </span>
                            <h3 className="text-h3 font-bold tracking-tight">{exp.role}</h3>
                            <p className="text-body font-medium text-foreground">{exp.organization}</p>
                            {exp.description && (
                              <p className="text-small text-muted prose-readable line-clamp-2 pt-0.5">{exp.description}</p>
                            )}
                          </div>
                        </div>
                      </AnimateIn>
                    ))}
                  </div>
                  <AnimateIn from="up" distance={8} viewport>
                    <Link
                      href="/experience"
                      className="inline-flex items-center text-small font-semibold hover:underline underline-offset-4 animate-arrow-slide text-foreground gap-1.5"
                    >
                      Full professional timeline
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </AnimateIn>
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* ─── Testimonials ──────────────────────────────────────────────────── */}
        {testimonials.length > 0 && (
          <section className="border-t border-border/80 pt-20" aria-labelledby="testimonials-title">
            <Container className="space-y-10">
              <AnimateIn from="up" distance={12} viewport>
                <div className="space-y-1">
                  <p className="text-caption font-bold uppercase tracking-[0.14em] text-muted flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
                    Endorsements
                  </p>
                  <h2 id="testimonials-title" className="text-h2 font-bold tracking-tight">
                    What people say
                  </h2>
                </div>
              </AnimateIn>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((t, index) => (
                  <AnimateIn key={t.id} from="up" distance={16} staggerIndex={index} viewport>
                    <Card className="p-7 flex flex-col justify-between h-full space-y-6">
                      <p className="text-body-lg italic text-muted prose-readable leading-relaxed">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="flex items-center gap-3.5 pt-4 border-t border-border">
                        {t.avatar_url ? (
                          <img
                            src={t.avatar_url}
                            alt={t.author_name}
                            className="h-10 w-10 rounded-full object-cover border border-border shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-surface-overlay border border-border flex items-center justify-center font-bold text-small text-foreground shrink-0">
                            {t.author_name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-small font-bold text-foreground">{t.author_name}</p>
                          <p className="text-caption text-muted">{t.company ? `${t.author_role} @ ${t.company}` : t.author_role}</p>
                        </div>
                      </div>
                    </Card>
                  </AnimateIn>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* ─── Latest Writing ─────────────────────────────────────────────────── */}
        {latestPosts.length > 0 && (
          <section className="border-t border-border/80 pt-20" aria-labelledby="articles-preview-title">
            <Container className="space-y-10">
              <AnimateIn from="up" distance={12} viewport>
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-caption font-bold uppercase tracking-[0.14em] text-muted flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
                      Writing
                    </p>
                    <h2 id="articles-preview-title" className="text-h2 font-bold tracking-tight">
                      Latest posts
                    </h2>
                  </div>
                  <Link
                    href="/blog"
                    className="hidden sm:inline-flex items-center text-small font-semibold hover:underline underline-offset-4 animate-arrow-slide text-foreground gap-1.5"
                  >
                    All articles
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </AnimateIn>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestPosts.map((post, index) => (
                  <AnimateIn key={post.id} from="up" distance={16} staggerIndex={index} viewport>
                    <Card className="p-7 flex flex-col justify-between h-full space-y-4">
                      <div className="space-y-3">
                        <h3 className="text-h3 font-bold tracking-tight hover:underline">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="text-body text-muted line-clamp-3 leading-relaxed">{post.excerpt || post.content}</p>
                      </div>
                      <div className="pt-4 mt-auto border-t border-border">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center text-small font-semibold hover:underline underline-offset-4 animate-arrow-slide text-foreground gap-1.5"
                        >
                          Read article
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </Card>
                  </AnimateIn>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* ─── Contact CTA ───────────────────────────────────────────────────── */}
        <section className="border-t border-border/80 pt-20" aria-labelledby="contact-cta-title">
          <Container>
            <AnimateIn from="up" distance={16} viewport>
              <div className="rounded-3xl bento-card px-8 py-12 md:px-14 md:py-16 space-y-6 relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-foreground/[0.03] blur-2xl pointer-events-none" />
                <div className="max-w-[620px] space-y-5 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-caption font-medium text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                    <span>Let&apos;s build together</span>
                  </div>
                  <h2 id="contact-cta-title" className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                    {contactCta}
                  </h2>
                  <p className="text-body text-muted leading-relaxed">
                    Whether you have an upcoming project, want to collaborate on open-source, or just want to chat tech, my inbox is always open.
                  </p>
                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <Button asChild variant="primary" size="lg" className="shadow-xs group">
                      <Link href="/contact">
                        Send a message
                        <ArrowRight className="h-4 w-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" size="lg">
                      <Link href="/projects">Explore all work</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </Container>
        </section>

      </div>
    </SkeletonWrapper>
  );
}
