import { getSkills } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Card, Badge } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Skills & Technical Stack — Dheeraj Carpenter",
  description:
    "Comprehensive overview of Dheeraj Carpenter's technical skills, programming languages, web frameworks, and creative software proficiencies.",
  alternates: {
    canonical: "/skills",
  },
  openGraph: {
    title: "Skills & Technical Stack — Dheeraj Carpenter",
    description:
      "Comprehensive overview of Dheeraj Carpenter's technical skills, programming languages, web frameworks, and creative software proficiencies.",
    url: "/skills",
    type: "website",
  },
};

export default async function PublicSkillsPage() {
  const skillsData = await getSkills();

  const displaySkills =
    skillsData.length > 0
      ? skillsData
      : [
          { id: "s1", name: "TypeScript", category: "Languages", proficiency: 90, order: 1, created_at: "", updated_at: "" },
          { id: "s2", name: "JavaScript (ES6+)", category: "Languages", proficiency: 95, order: 2, created_at: "", updated_at: "" },
          { id: "s3", name: "HTML5 & CSS3", category: "Languages", proficiency: 95, order: 3, created_at: "", updated_at: "" },
          { id: "s4", name: "SQL", category: "Languages", proficiency: 82, order: 4, created_at: "", updated_at: "" },
          { id: "s5", name: "Next.js 15", category: "Frameworks & Web", proficiency: 92, order: 5, created_at: "", updated_at: "" },
          { id: "s6", name: "React 19", category: "Frameworks & Web", proficiency: 92, order: 6, created_at: "", updated_at: "" },
          { id: "s7", name: "Tailwind CSS", category: "Frameworks & Web", proficiency: 95, order: 7, created_at: "", updated_at: "" },
          { id: "s8", name: "Node.js", category: "Frameworks & Web", proficiency: 85, order: 8, created_at: "", updated_at: "" },
          { id: "s9", name: "PostgreSQL", category: "Databases & Cloud", proficiency: 84, order: 9, created_at: "", updated_at: "" },
          { id: "s10", name: "Supabase", category: "Databases & Cloud", proficiency: 88, order: 10, created_at: "", updated_at: "" },
          { id: "s11", name: "Git & GitHub", category: "Databases & Cloud", proficiency: 90, order: 11, created_at: "", updated_at: "" },
          { id: "s12", name: "Vercel", category: "Databases & Cloud", proficiency: 90, order: 12, created_at: "", updated_at: "" },
          { id: "s13", name: "Figma", category: "Design & Creative", proficiency: 88, order: 13, created_at: "", updated_at: "" },
          { id: "s14", name: "Video Editing", category: "Design & Creative", proficiency: 92, order: 14, created_at: "", updated_at: "" },
          { id: "s15", name: "UI/UX Architecture", category: "Design & Creative", proficiency: 86, order: 15, created_at: "", updated_at: "" },
        ];

  // Group skills by category
  const skillsByCategory = displaySkills.reduce<Record<string, typeof displaySkills>>((acc, skill) => {
    const cat = skill.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <SkeletonWrapper pageType="about">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Skills", url: "/skills" },
        ]}
      />
      <div className="py-16 md:py-24 space-y-12">
        <Container className="space-y-4">
          <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
            <p className="mono-eyebrow text-muted mb-2">
              Tech Stack
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Skills &amp; Tools
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
            <p className="prose-readable text-body sm:text-body-lg text-muted max-w-[640px] leading-relaxed">
              Languages, frameworks, libraries, and design tools I use regularly in my work.
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
