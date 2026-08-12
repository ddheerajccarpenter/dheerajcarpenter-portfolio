import { getPublishedExperience } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";

export const revalidate = 0; // Dynamic rendering for instant CMS updates

const TYPE_FLATICON_CLASSES = {
  work: "fi fi-br-briefcase",
  education: "fi fi-br-graduation-cap",
  certification: "fi fi-br-award",
} as const;

const TYPE_LABELS = {
  work: "Work Experience",
  education: "Education",
  certification: "Certification",
} as const;

export default async function ExperiencePage() {
  const experiences = await getPublishedExperience();

  // Group by type or just sort by date
  // In actions.ts, experience is fetched ordered by the "order" column
  // Let's display them in a unified vertical timeline.

  return (
    <SkeletonWrapper pageType="experience">
      <div className="py-16 md:py-24 space-y-12">
        <Container className="space-y-4">
        <AnimateIn from="up" distance={20} duration={0.6} viewport={false}>
          <h1 className="text-h1 font-bold tracking-tight sm:text-[3rem]">
            Experience
          </h1>
        </AnimateIn>
        <AnimateIn from="up" distance={14} delay={0.12} viewport={false}>
          <p className="prose-readable text-body-lg text-muted">
            My professional journey, academic background, and relevant technical certifications.
          </p>
        </AnimateIn>
      </Container>

      <Container>
        {experiences.length === 0 ? (
          <AnimateIn from="up" distance={12}>
            <div className="border border-dashed border-border p-16 text-center text-muted rounded-sm">
              No experience history published yet.
            </div>
          </AnimateIn>
        ) : (
          <div className="relative border-l border-border pl-8 ml-4 space-y-12 py-2">
            {experiences.map((exp, index) => {
              const iconClass = TYPE_FLATICON_CLASSES[exp.type] || "fi fi-br-briefcase";
              const typeLabel = TYPE_LABELS[exp.type] || "Experience";

              return (
                <AnimateIn key={exp.id} from="up" distance={20} staggerIndex={index}>
                  <div className="relative group">
                    {/* Timeline Dot with Flaticon Icon */}
                    <span className="absolute -left-[49px] top-1 bg-background p-2 border border-border rounded-full animate-dot-pulse">
                      <i className={`${iconClass} text-sm leading-none text-foreground`} aria-hidden="true" />
                    </span>

                    <div className="space-y-3">
                      {/* Date and Type Badge */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-caption font-semibold uppercase tracking-wider text-muted flex items-center">
                          <i className="fi fi-br-calendar mr-1.5 text-xs leading-none" aria-hidden="true" />
                          {new Date(exp.start_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                          {" to "}
                          {exp.current
                            ? "Present"
                            : exp.end_date
                            ? new Date(exp.end_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })
                            : ""}
                        </span>
                        <Badge className="uppercase tracking-wider text-[10px] py-0.5 px-2">
                          {typeLabel}
                        </Badge>
                      </div>

                      {/* Role / Degree / Certification Name */}
                      <div className="space-y-1">
                        <h2 className="text-h3 font-bold tracking-tight">
                          {exp.role}
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body font-medium text-foreground">
                          <span>{exp.organization}</span>
                          {exp.location && (
                            <span className="text-caption text-muted flex items-center">
                              <i className="fi fi-br-marker mr-1 text-xs leading-none" aria-hidden="true" />
                              {exp.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description (Markdown) */}
                      {exp.description && (
                        <p className="text-body text-muted prose-readable whitespace-pre-line leading-relaxed">
                          {exp.description}
                        </p>
                      )}

                      {/* URL Link */}
                      {exp.url && (
                        <div className="pt-1">
                          <a
                            href={exp.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-caption font-semibold text-foreground hover:underline"
                          >
                            <span>Visit Website</span>
                            <i className="fi fi-br-angle-small-right ml-1 text-xs leading-none" aria-hidden="true" />
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
