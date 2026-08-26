import Link from "next/link";
import { getPublishedProjects } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Card, Badge, Button } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";
import { ArrowRight } from "lucide-react";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <SkeletonWrapper pageType="projects">
      <div className="py-16 md:py-24 space-y-12">
        <Container className="space-y-4">
          <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
            <div className="inline-flex items-center gap-2 text-caption font-bold uppercase tracking-[0.14em] text-muted mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
              Selected Portfolio
            </div>
            <h1 className="text-h1 font-bold tracking-tight sm:text-[3rem] text-editorial-gradient">
              Projects
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
            <p className="prose-readable text-body-lg text-muted">
              A curated collection of production engineering projects, architectural systems, and open-source work.
            </p>
          </AnimateIn>
        </Container>

        <Container>
          {projects.length === 0 ? (
            <AnimateIn from="up" distance={12}>
              <div className="border border-dashed border-border p-16 text-center text-muted rounded-2xl bg-surface/30">
                No projects published yet. Please add them in the admin dashboard.
              </div>
            </AnimateIn>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {projects.map((project, index) => (
                <AnimateIn key={project.id} from="up" distance={16} staggerIndex={index} viewportAmount={0.05}>
                  <Card className="flex flex-col h-full card-accent-bar !p-0 overflow-hidden">
                    {/* Cover Image Wrapper */}
                    {project.cover_url ? (
                      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border animate-grayscale-hover bg-surface-overlay">
                        <img
                          src={project.cover_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="relative aspect-[16/10] w-full bg-surface-overlay border-b border-border flex items-center justify-center text-caption text-muted font-mono">
                        No preview
                      </div>
                    )}

                    <div className="flex flex-col flex-1 justify-between space-y-4 p-6">
                      <div className="space-y-2.5">
                        <h2 className="text-h3 font-bold tracking-tight hover:underline">
                          <Link href={`/projects/${project.slug}`}>
                            {project.title}
                          </Link>
                        </h2>
                        <p className="text-small text-muted line-clamp-3 leading-relaxed">
                          {project.summary}
                        </p>
                      </div>

                      <div className="space-y-4 pt-4 mt-auto border-t border-border">
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.tags.map((tag) => (
                              <Badge key={tag} variant="pill">{tag}</Badge>
                            ))}
                          </div>
                        )}
                        <Button asChild variant="secondary" size="sm" className="w-full justify-center">
                          <Link href={`/projects/${project.slug}`}>
                            View Case Study
                            <ArrowRight className="ml-2 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </AnimateIn>
              ))}
            </div>
          )}
        </Container>
      </div>
    </SkeletonWrapper>
  );
}
