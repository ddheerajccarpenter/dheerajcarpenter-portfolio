import { getSkills } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Card, Badge } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";

export const revalidate = 0; // Dynamic rendering for instant CMS updates
export const dynamic = "force-dynamic";

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
      <div className="py-12 md:py-16 space-y-12">
        <Container className="space-y-4">
          <AnimateIn from="up" distance={20} duration={0.6} viewport={false}>
            <h1 className="text-h1 font-bold tracking-tight sm:text-[3rem]">
              Skills & Expertise
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={14} delay={0.12} viewport={false}>
            <p className="prose-readable text-body-lg text-muted">
              Technical proficiencies, frameworks, tools, and domain specialisations mastered over years of hands-on software development.
            </p>
          </AnimateIn>
        </Container>

        <Container>
          {Object.keys(skillsByCategory).length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-sm text-muted">
              <i className="fi fi-br-stats text-2xl mb-3 block text-foreground" aria-hidden="true" />
              <p className="text-body font-medium">No skills cataloged yet.</p>
              <p className="text-small text-muted mt-1">Check back soon for technical skills catalog updates.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(skillsByCategory).map(([category, categorySkills], catIndex) => (
                <AnimateIn key={category} from="up" distance={20} staggerIndex={catIndex}>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 border-b border-border pb-2">
                      <Badge className="uppercase tracking-wider text-xs px-2.5 py-0.5">
                        {category}
                      </Badge>
                      <span className="text-caption text-muted font-mono">
                        {categorySkills.length} {categorySkills.length === 1 ? "Skill" : "Skills"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categorySkills.map((skill) => (
                        <Card
                          key={skill.id}
                          className="p-4 space-y-3 hover:border-border-strong transition-all flex flex-col justify-between"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-body font-bold text-foreground">{skill.name}</span>
                            {skill.proficiency !== null && (
                              <span className="text-caption font-mono font-semibold text-muted">
                                {skill.proficiency}%
                              </span>
                            )}
                          </div>

                          {skill.proficiency !== null && (
                            <div className="w-full bg-surface border border-border h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-foreground h-full rounded-full transition-all duration-500 ease-out"
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
