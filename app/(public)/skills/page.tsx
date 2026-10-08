import { getSkills } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Card, Badge } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";

export const revalidate = 3600;

export default async function PublicSkillsPage() {
  const skills = await getSkills();

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <SkeletonWrapper pageType="about">
      <div className="py-16 md:py-24 space-y-12">
        <Container className="space-y-4">
          <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
            <p className="mono-eyebrow text-muted mb-2">
              Technical Proficiencies
            </p>
            <h1 className="text-h1 font-bold tracking-tight sm:text-[3rem] text-foreground">
              Skills & Expertise
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
            <p className="prose-readable text-body-lg text-muted">
              Technical proficiencies, frameworks, tools, and domain specialisations mastered over years of hands-on software development.
            </p>
          </AnimateIn>
        </Container>

        <Container>
          {Object.keys(skillsByCategory).length === 0 ? (
            <div className="p-16 text-center border border-dashed border-border rounded-2xl text-muted bg-surface/30">
              <p className="text-body font-medium">No skills cataloged yet.</p>
              <p className="text-small text-muted mt-1">Check back soon for technical skills catalog updates.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(skillsByCategory).map(([category, categorySkills], catIndex) => (
                <AnimateIn key={category} variant="fade-rise" distance={16} duration={0.3} staggerIndex={catIndex} viewport viewportAmount={0.05}>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-border/80 pb-3">
                      <h2 className="mono-eyebrow text-foreground">
                        {category}
                      </h2>
                      <span className="text-caption text-muted font-mono">
                        {categorySkills.length} {categorySkills.length === 1 ? "Skill" : "Skills"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categorySkills.map((skill) => (
                        <Card
                          key={skill.id}
                          className="!p-5 space-y-3 tactile-card hover-lift-sm flex flex-col justify-between"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-small font-bold text-foreground">{skill.name}</span>
                            {skill.proficiency !== null && (
                              <span className="text-caption font-mono font-semibold text-muted">
                                {skill.proficiency}%
                              </span>
                            )}
                          </div>

                          {skill.proficiency !== null && (
                            <div className="w-full bg-surface-overlay border border-border/60 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-foreground h-full rounded-full transition-all duration-500 ease-out opacity-85"
                                style={{ width: `${Math.min(100, Math.max(0, skill.proficiency))}%` }}
                              />
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          )}
        </Container>
      </div>
    </SkeletonWrapper>
  );
}
