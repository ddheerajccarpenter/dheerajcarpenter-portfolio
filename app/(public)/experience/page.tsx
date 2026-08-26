import { getPublishedExperience } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";
import { Briefcase, GraduationCap, Award, Calendar, MapPin, ExternalLink } from "lucide-react";

export const revalidate = 0;
export const dynamic = "force-dynamic";

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

  return (
    <SkeletonWrapper pageType="experience">
      <div className="py-16 md:py-24 space-y-12">
        <Container className="space-y-4">
          <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
            <div className="inline-flex items-center gap-2 text-caption font-bold uppercase tracking-[0.14em] text-muted mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
              Career & Credentials
            </div>
            <h1 className="text-h1 font-bold tracking-tight sm:text-[3rem] text-editorial-gradient">
              Experience
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
            <p className="prose-readable text-body-lg text-muted">
              A comprehensive chronicle of my professional engineering career, leadership roles, and academic foundations.
            </p>
          </AnimateIn>
        </Container>

        <Container>
          {experiences.length === 0 ? (
            <AnimateIn from="up" distance={12}>
              <div className="border border-dashed border-border p-16 text-center text-muted rounded-2xl bg-surface/30">
                No experience history published yet.
              </div>
            </AnimateIn>
          ) : (
            <div className="relative border-l border-border/80 pl-8 ml-4 space-y-10 py-2">
              {experiences.map((exp, index) => {
                const IconComponent = TYPE_ICONS[exp.type] || Briefcase;
                const typeLabel = TYPE_LABELS[exp.type] || "Experience";

                return (
                  <AnimateIn key={exp.id} from="up" distance={16} staggerIndex={index}>
                    <div className="relative group tactile-card rounded-2xl p-6 md:p-7 border border-border">
                      {/* Timeline Dot Indicator */}
                      <span className="absolute -left-[49px] top-6 bg-surface p-2 border border-border rounded-full shadow-xs group-hover:border-foreground transition-colors">
                        <IconComponent className="h-4 w-4 text-foreground opacity-80" />
                      </span>

                      <div className="space-y-3">
                        {/* Date and Type Badge */}
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-caption font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5 font-mono">
                            <Calendar className="h-3.5 w-3.5 text-muted" />
                            {new Date(exp.start_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                            {" – "}
                            {exp.current
                              ? "Present"
                              : exp.end_date
                              ? new Date(exp.end_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })
                              : ""}
                          </span>
                          <Badge variant="pill" className="uppercase tracking-wider text-[10px] py-0.5 px-2">
                            {typeLabel}
                          </Badge>
                        </div>

                        {/* Role / Organization */}
                        <div className="space-y-1">
                          <h2 className="text-h3 font-bold tracking-tight">
                            {exp.role}
                          </h2>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body font-medium text-foreground">
                            <span>{exp.organization}</span>
                            {exp.location && (
                              <span className="text-caption text-muted flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {exp.location}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        {exp.description && (
                          <p className="text-small text-muted prose-readable whitespace-pre-line leading-relaxed pt-1">
                            {exp.description}
                          </p>
                        )}

                        {/* URL Link */}
                        {exp.url && (
                          <div className="pt-2">
                            <a
                              href={exp.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-caption font-semibold text-foreground hover:underline gap-1.5"
                            >
                              <span>Visit Website</span>
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
          )}
        </Container>
      </div>
    </SkeletonWrapper>
  );
}
