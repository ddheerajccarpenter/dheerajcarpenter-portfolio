import Link from "next/link";
import {
  getHomeContent,
  getFeaturedProjects,
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

export const revalidate = 0; // Dynamic rendering for instant CMS updates

export default async function HomePage() {
  const [
    homeContent,
    featuredProjects,
    allSkills,
    experience,
    services,
    testimonials,
    publishedPosts,
  ] = await Promise.all([
    getHomeContent(),
    getFeaturedProjects(),
    getSkills(),
    getPublishedExperience(),
    getActiveServices(),
    getFeaturedTestimonials(),
    getPublishedPosts(),
  ]);

  // Fallbacks for initial empty state (Phase 16)
  const name = homeContent?.hero_name || "Dheeraj Carpenter";
  const role = homeContent?.hero_role || "Software Engineer & Designer";
  const intro = homeContent?.hero_intro || "Welcome to my portfolio. I build high-performance, accessible, and clean digital experiences with a strong focus on typography and usability.";
  const aboutPreview = homeContent?.about_preview || "I am a designer and developer specializing in clean code and functional design. I prioritize accessibility, performance, and simplicity in everything I create.";
  const contactCta = homeContent?.contact_cta || "Let's collaborate on your next project. Get in touch to discuss how we can work together.";

  // Group skills for preview
  const topSkills = allSkills.slice(0, 8);

  // Latest 2 experience entries
  const latestExperience = experience.slice(0, 2);

  // Latest 2 articles
  const latestPosts = publishedPosts.slice(0, 2);

  return (
    <SkeletonWrapper pageType="home">
      <div className="flex flex-col space-y-24 py-16 md:py-24">
        {/* ─── Hero Section ─────────────────────────────────────────────────── */}
        <section className="relative" aria-label="Introduction">
          <Container>
            <div className="max-w-[800px] space-y-6">
              <AnimateIn from="up" distance={10} duration={0.35} delay={0} viewport={false}>
                <span className="text-small font-semibold uppercase tracking-[0.2em] text-muted">
                  {role}
                </span>
              </AnimateIn>
              <AnimateIn from="up" distance={14} duration={0.4} delay={0.06} viewport={false}>
                <h1 className="text-display font-bold font-hero-name tracking-tight text-foreground sm:text-[4rem]">
                  {name}
                </h1>
              </AnimateIn>
              <AnimateIn from="up" distance={10} duration={0.35} delay={0.12} viewport={false}>
                <p className="prose-readable text-body-lg text-muted">
                  {intro}
                </p>
              </AnimateIn>
              <AnimateIn from="up" distance={8} duration={0.35} delay={0.18} viewport={false}>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button asChild variant="primary" size="lg" className="animate-btn-scale animate-pulse-ring">
                    <Link href={homeContent?.primary_cta_href || "/projects"}>
                      {homeContent?.primary_cta_label || "View Projects"}
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg" className="animate-btn-scale">
                    <Link href={homeContent?.secondary_cta_href || "/contact"}>
                      {homeContent?.secondary_cta_label || "Contact"}
                    </Link>
                  </Button>
                </div>
              </AnimateIn>
            </div>
          </Container>
        </section>

      {services.length > 0 && (
        <section className="border-t border-border pt-16" aria-labelledby="services-title">
          <Container className="space-y-12">
            <AnimateIn from="up" distance={16}>
              <div className="space-y-2">
                <h2 id="services-title" className="text-h2 font-bold tracking-tight">
                  Services & Offerings
                </h2>
                <p className="text-body text-muted prose-readable">
                  Specialized engineering and design services available for select engagements.
                </p>
              </div>
            </AnimateIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <AnimateIn key={service.id} from="up" distance={20} staggerIndex={index}>
                  <Card className="flex flex-col justify-between p-6 md:p-8 h-full space-y-6 hover:border-border-strong transition-colors animate-card-float">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-h3 font-bold">{service.title}</h3>
                        <p className="text-body-sm font-medium text-muted mt-1">{service.tagline}</p>
                      </div>
                      <p className="text-body text-muted line-clamp-3">
                        {service.description}
                      </p>
                      {service.deliverables && service.deliverables.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <span className="text-caption font-bold uppercase tracking-wider text-foreground">
                            Includes
                          </span>
                          <ul className="space-y-1">
                            {service.deliverables.slice(0, 3).map((d, i) => (
                              <li key={i} className="flex items-center text-small text-muted">
                                <i className="fi fi-br-check-circle text-xs leading-none mr-2 text-foreground shrink-0" aria-hidden="true" />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                      <span className="text-small font-bold text-foreground">
                        {service.price_range || "Custom Scope"}
                      </span>
                      <Button asChild variant="secondary" size="sm" className="animate-btn-scale">
                        <Link href="/contact">
                          Inquire
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </AnimateIn>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="border-t border-border pt-16" aria-labelledby="about-preview-title">
        <Container className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimateIn from="up" distance={16}>
            <h2 id="about-preview-title" className="text-h2 font-bold tracking-tight">
              About
            </h2>
          </AnimateIn>
          <div className="md:col-span-2 space-y-6">
            <AnimateIn from="up" distance={16} delay={0.1}>
              <p className="prose-readable text-body text-muted">
                {aboutPreview}
              </p>
            </AnimateIn>
            <AnimateIn from="up" distance={12} delay={0.2}>
              <div>
                <Link
                  href="/about"
                  className="inline-flex items-center text-small font-semibold hover:underline underline-offset-4 animate-arrow-slide"
                >
                  Read more about my background
                  <i className="fi fi-br-angle-right ml-2 text-xs leading-none" aria-hidden="true" />
                </Link>
              </div>
            </AnimateIn>
          </div>
        </Container>
      </section>

      <section className="border-t border-border pt-16" aria-labelledby="featured-projects-title">
        <Container className="space-y-12">
          <AnimateIn from="up" distance={16}>
            <div className="flex justify-between items-end">
              <h2 id="featured-projects-title" className="text-h2 font-bold tracking-tight">
                Featured Work
              </h2>
              <Link
                href="/projects"
                className="inline-flex items-center text-small font-semibold hover:underline underline-offset-4 animate-arrow-slide"
              >
                All projects
                <i className="fi fi-br-angle-right ml-2 text-xs leading-none" aria-hidden="true" />
              </Link>
            </div>
          </AnimateIn>

          {featuredProjects.length === 0 ? (
            <AnimateIn from="up" distance={12}>
              <div className="border border-dashed border-border p-12 text-center text-muted rounded-sm">
                No projects featured yet. Check back later or view all projects.
              </div>
            </AnimateIn>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredProjects.map((project, index) => (
                <AnimateIn key={project.id} from="up" distance={20} staggerIndex={index}>
                  <Card className="flex flex-col justify-between hover:border-border-strong transition-colors animate-card-float h-full">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-h3 font-bold tracking-tight hover:underline">
                          <Link href={`/projects/${project.slug}`}>
                            {project.title}
                          </Link>
                        </h3>
                        <i className="fi fi-br-star text-xs leading-none text-foreground" aria-hidden="true" />
                      </div>
                      <p className="text-body text-muted line-clamp-3">
                        {project.summary}
                      </p>
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {project.tags.map((tag) => (
                            <Badge key={tag}>{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="pt-6 mt-auto">
                      <Button asChild variant="secondary" size="md" className="animate-btn-scale">
                        <Link href={`/projects/${project.slug}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </AnimateIn>
              ))}
            </div>
          )}
        </Container>
      </section>

      {testimonials.length > 0 && (
        <section className="border-t border-border pt-16" aria-labelledby="testimonials-title">
          <Container className="space-y-12">
            <AnimateIn from="up" distance={16}>
              <h2 id="testimonials-title" className="text-h2 font-bold tracking-tight">
                Recommendations
              </h2>
            </AnimateIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((t, index) => (
                <AnimateIn key={t.id} from="up" distance={20} staggerIndex={index}>
                  <Card className="p-6 md:p-8 flex flex-col justify-between h-full space-y-6">
                    <p className="text-body-lg italic text-muted prose-readable">
                      "{t.quote}"
                    </p>

                    <div className="flex items-center space-x-4 pt-4 border-t border-border">
                      {t.avatar_url ? (
                        <img
                          src={t.avatar_url}
                          alt={t.author_name}
                          className="h-11 w-11 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="h-11 w-11 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-body text-foreground">
                          {t.author_name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-body font-bold text-foreground">{t.author_name}</p>
                        <p className="text-small text-muted">{t.company ? `${t.author_role} @ ${t.company}` : t.author_role}</p>
                      </div>
                    </div>
                  </Card>
                </AnimateIn>
              ))}
            </div>
          </Container>
        </section>
      )}

      {latestPosts.length > 0 && (
        <section className="border-t border-border pt-16" aria-labelledby="articles-preview-title">
          <Container className="space-y-12">
            <AnimateIn from="up" distance={16}>
              <div className="flex justify-between items-end">
                <h2 id="articles-preview-title" className="text-h2 font-bold tracking-tight">
                  Latest Writing
                </h2>
                <Link
                  href="/blog"
                  className="inline-flex items-center text-small font-semibold hover:underline underline-offset-4 animate-arrow-slide"
                >
                  All articles
                  <i className="fi fi-br-angle-right ml-2 text-xs leading-none" aria-hidden="true" />
                </Link>
              </div>
            </AnimateIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestPosts.map((post, index) => (
                <AnimateIn key={post.id} from="up" distance={20} staggerIndex={index}>
                  <Card className="p-6 flex flex-col justify-between h-full space-y-4 hover:border-border-strong transition-colors animate-card-float">
                    <div className="space-y-3">
                      <h3 className="text-h3 font-bold tracking-tight hover:underline">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-body text-muted line-clamp-3">
                        {post.excerpt || post.content}
                      </p>
                    </div>

                    <div className="pt-4 mt-auto">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-small font-semibold hover:underline underline-offset-4 animate-arrow-slide"
                      >
                        Read article
                        <i className="fi fi-br-angle-right ml-2 text-xs leading-none" aria-hidden="true" />
                      </Link>
                    </div>
                  </Card>
                </AnimateIn>
              ))}
            </div>
          </Container>
        </section>
      )}

      {topSkills.length > 0 && (
        <section className="border-t border-border pt-16" aria-labelledby="skills-preview-title">
          <Container className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimateIn from="up" distance={16}>
              <h2 id="skills-preview-title" className="text-h2 font-bold tracking-tight">
                Skills
              </h2>
            </AnimateIn>
            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-3">
                {topSkills.map((skill, index) => (
                  <AnimateIn key={skill.id} from="up" distance={10} staggerIndex={index} viewportAmount={0.05}>
                    <Badge className="text-body py-1.5 px-3 animate-badge-glow">
                      {skill.name}
                    </Badge>
                  </AnimateIn>
                ))}
              </div>
              <AnimateIn from="up" distance={12} delay={0.3}>
                <div className="mt-6">
                  <Link
                    href="/about#skills"
                    className="inline-flex items-center text-small font-semibold hover:underline underline-offset-4 animate-arrow-slide"
                  >
                    View all skills
                    <i className="fi fi-br-angle-right ml-2 text-xs leading-none" aria-hidden="true" />
                  </Link>
                </div>
              </AnimateIn>
            </div>
          </Container>
        </section>
      )}

      {latestExperience.length > 0 && (
        <section className="border-t border-border pt-16" aria-labelledby="experience-preview-title">
          <Container className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimateIn from="up" distance={16}>
              <h2 id="experience-preview-title" className="text-h2 font-bold tracking-tight">
                Experience
              </h2>
            </AnimateIn>
            <div className="md:col-span-2 space-y-8">
              <div className="relative border-l border-border pl-6 space-y-8">
                {latestExperience.map((exp, index) => (
                  <AnimateIn key={exp.id} from="up" distance={16} staggerIndex={index}>
                    <div className="relative">
                      <span className="absolute -left-[31px] top-1.5 bg-background p-1 border border-border rounded-full">
                        <i className="fi fi-br-briefcase text-xs leading-none text-foreground" aria-hidden="true" />
                      </span>
                      <div className="space-y-1">
                        <span className="text-caption font-semibold uppercase tracking-wider text-muted flex items-center">
                          <i className="fi fi-br-calendar mr-1 text-xs leading-none" aria-hidden="true" />
                          {new Date(exp.start_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                          {" to "}
                          {exp.current
                            ? "Present"
                            : exp.end_date
                            ? new Date(exp.end_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })
                            : ""}
                        </span>
                        <h3 className="text-h3 font-bold tracking-tight">
                          {exp.role}
                        </h3>
                        <p className="text-body font-medium text-foreground">
                          {exp.organization}
                        </p>
                        <p className="text-small text-muted prose-readable line-clamp-2">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  </AnimateIn>
                ))}
              </div>
              <AnimateIn from="up" distance={12}>
                <div>
                  <Link
                    href="/experience"
                    className="inline-flex items-center text-small font-semibold hover:underline underline-offset-4 animate-arrow-slide"
                  >
                    Full professional timeline
                    <i className="fi fi-br-angle-right ml-2 text-xs leading-none" aria-hidden="true" />
                  </Link>
                </div>
              </AnimateIn>
            </div>
          </Container>
        </section>
      )}

      <section className="border-t border-border pt-16" aria-labelledby="contact-cta-title">
        <Container>
          <AnimateIn from="up" distance={20}>
            <div className="max-w-[700px] space-y-6">
              <h2 id="contact-cta-title" className="text-h2 font-bold tracking-tight">
                Get in touch
              </h2>
              <p className="prose-readable text-body text-muted">
                {contactCta}
              </p>
              <div>
                <Button asChild size="lg" className="animate-btn-scale">
                  <Link href="/contact">
                    Send a Message
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

