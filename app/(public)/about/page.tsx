import {
  getAboutContent,
  getSkills,
  getPublishedExperience,
  getFeaturedTestimonials,
  getActiveServices,
} from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Badge, Card } from "@/components/ui";
import { Markdown } from "@/components/ui/markdown";
import { GraduationCap, Calendar, MapPin } from "lucide-react";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [aboutContent, skills, experience, testimonials] = await Promise.all([
    getAboutContent(),
    getSkills(),
    getPublishedExperience(),
    getFeaturedTestimonials(),
    getActiveServices(),
  ]);

  const headline = aboutContent?.headline || "About Me";
  const bio = aboutContent?.bio || "No biography available. Please configure it in the admin CMS.";
  const overview = aboutContent?.overview || "";
  const photoUrl = aboutContent?.photo_url;

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const education = experience.filter((exp) => exp.type === "education");

  return (
    <SkeletonWrapper pageType="about">
      <div className="py-16 md:py-24 space-y-20">
        <section aria-labelledby="about-headline">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
              <div className="space-y-4 md:col-span-2">
                <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
                  <div className="inline-flex items-center gap-2 text-caption font-bold uppercase tracking-[0.14em] text-muted mb-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
                    Background & Philosophy
                  </div>
                  <h1 id="about-headline" className="text-h1 font-bold tracking-tight sm:text-[3rem] text-editorial-gradient">
                    {headline}
                  </h1>
                </AnimateIn>
                <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
                  <div className="pt-4">
                    <Markdown content={bio} />
                  </div>
                </AnimateIn>
              </div>

              {photoUrl ? (
                <AnimateIn from="right" distance={16} delay={0.15} viewport={false}>
                  <div className="relative border border-border p-2 bg-surface rounded-2xl aspect-[4/5] w-full max-w-[320px] mx-auto md:mx-0 overflow-hidden shadow-xs">
                    <div className="relative w-full h-full overflow-hidden rounded-xl animate-grayscale-hover">
                      <img
                        src={photoUrl}
                        alt="Profile Photo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </AnimateIn>
              ) : (
                <div className="border border-dashed border-border aspect-[4/5] w-full max-w-[320px] mx-auto md:mx-0 flex items-center justify-center text-muted text-caption rounded-2xl bg-surface/30">
                  No photo uploaded
                </div>
              )}
            </div>
          </Container>
        </section>

        {overview && (
          <section className="border-t border-border/80 pt-16" aria-labelledby="personal-overview-title">
            <Container className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimateIn from="up" distance={12}>
                <div className="space-y-1">
                  <p className="text-caption font-bold uppercase tracking-[0.14em] text-muted flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
                    Overview
                  </p>
                  <h2 id="personal-overview-title" className="text-h2 font-bold tracking-tight">
                    Personal Overview
                  </h2>
                </div>
              </AnimateIn>
              <AnimateIn from="up" distance={12} delay={0.08} className="md:col-span-2">
                <Markdown content={overview} />
              </AnimateIn>
            </Container>
          </section>
        )}

        <section id="skills" className="border-t border-border/80 pt-20" aria-labelledby="skills-title">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
              <AnimateIn from="up" distance={12} className="md:col-span-4" viewport>
                <div className="space-y-1 md:sticky md:top-28">
                  <p className="text-caption font-bold uppercase tracking-[0.14em] text-muted flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
                    Stack & Competencies
                  </p>
                  <h2 id="skills-title" className="text-h2 font-bold tracking-tight">
                    Expertise
                  </h2>
                </div>
              </AnimateIn>
              <div className="md:col-span-8 space-y-10">
                {Object.keys(skillsByCategory).length === 0 ? (
                  <div className="border border-dashed border-border p-8 text-center text-muted rounded-2xl bg-surface/30">
                    No skills entered yet.
                  </div>
                ) : (
                  Object.entries(skillsByCategory).map(([category, items], catIndex) => (
                    <AnimateIn key={category} from="up" distance={14} staggerIndex={catIndex} viewport>
                      <div className="space-y-4">
                        <h3 className="text-caption font-bold uppercase tracking-widest text-foreground border-b border-border/80 pb-2 flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-foreground inline-block opacity-60" />
                          {category}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {items.map((skill) => (
                            <Badge key={skill.id} variant="pill" className="text-small py-1.5 px-4 animate-badge-glow">
                              {skill.name}
                              {skill.proficiency !== null && (
                                <span className="ml-1.5 text-caption opacity-60 font-mono">{skill.proficiency}%</span>
                              )}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </AnimateIn>
                  ))
                )}
              </div>
            </div>
          </Container>
        </section>

        {testimonials.length > 0 && (
          <section className="border-t border-border/80 pt-16" aria-labelledby="about-testimonials-title">
            <Container className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimateIn from="up" distance={12}>
                <div className="space-y-1">
                  <p className="text-caption font-bold uppercase tracking-[0.14em] text-muted flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
                    Feedback
                  </p>
                  <h2 id="about-testimonials-title" className="text-h2 font-bold tracking-tight">
                    Recommendations
                  </h2>
                </div>
              </AnimateIn>
              <div className="md:col-span-2 space-y-6">
                {testimonials.map((t, index) => (
                  <AnimateIn key={t.id} from="up" distance={14} staggerIndex={index}>
                    <Card className="p-6 md:p-7 flex flex-col justify-between space-y-4">
                      <p className="text-body-lg italic text-muted prose-readable leading-relaxed">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="flex items-center space-x-3.5 pt-4 border-t border-border">
                        {t.avatar_url ? (
                          <img
                            src={t.avatar_url}
                            alt={t.author_name}
                            className="h-9 w-9 rounded-full object-cover border border-border shrink-0"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-surface-overlay border border-border flex items-center justify-center font-bold text-caption text-foreground shrink-0">
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

        <section className="border-t border-border/80 pt-16" aria-labelledby="education-title">
          <Container className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimateIn from="up" distance={12}>
              <div className="space-y-1">
                <p className="text-caption font-bold uppercase tracking-[0.14em] text-muted flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
                  Academic History
                </p>
                <h2 id="education-title" className="text-h2 font-bold tracking-tight">
                  Education
                </h2>
              </div>
            </AnimateIn>
            <div className="md:col-span-2 space-y-8">
              {education.length === 0 ? (
                <div className="border border-dashed border-border p-8 text-center text-muted rounded-2xl bg-surface/30">
                  No education history listed.
                </div>
              ) : (
                <div className="space-y-8 border-l border-border/80 pl-6 relative">
                  {education.map((edu, index) => (
                    <AnimateIn key={edu.id} from="up" distance={14} staggerIndex={index}>
                      <div className="relative">
                        <span className="absolute -left-[33px] top-1 bg-surface p-1.5 border border-border rounded-full shadow-xs">
                          <GraduationCap className="h-3.5 w-3.5 text-foreground opacity-80" />
                        </span>
                        <div className="space-y-1.5">
                          <span className="text-caption font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 font-mono">
                            <Calendar className="h-3 w-3" />
                            {new Date(edu.start_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                            {" – "}
                            {edu.current
                              ? "Present"
                              : edu.end_date
                              ? new Date(edu.end_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })
                              : ""}
                          </span>
                          <h3 className="text-h3 font-bold tracking-tight">
                            {edu.role}
                          </h3>
                          <p className="text-body font-medium text-foreground">
                            {edu.organization}
                          </p>
                          {edu.location && (
                            <p className="text-caption text-muted flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {edu.location}
                            </p>
                          )}
                          {edu.description && (
                            <p className="text-small text-muted prose-readable pt-1">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </AnimateIn>
                  ))}
                </div>
              )}
            </div>
          </Container>
        </section>
      </div>
    </SkeletonWrapper>
  );
}
