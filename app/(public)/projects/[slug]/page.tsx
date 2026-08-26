import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Button, Badge } from "@/components/ui";
import { Markdown } from "@/components/ui/markdown";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";

export const revalidate = 0;
export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <SkeletonWrapper pageType="project-detail">
      <div className="py-12 md:py-20 space-y-12">
        {/* Back Button */}
        <Container>
          <AnimateIn from="left" distance={10} duration={0.3} viewport={false}>
            <Link
              href="/projects"
              className="inline-flex items-center text-small font-medium hover:underline underline-offset-4 text-muted hover:text-foreground transition-colors gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all projects
            </Link>
          </AnimateIn>
        </Container>

        {/* Hero Header */}
        <Container className="space-y-6">
          <div className="space-y-4 max-w-[800px]">
            <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
              <h1 className="text-h1 font-bold tracking-tight sm:text-[3.25rem] leading-tight text-editorial-gradient">
                {project.title}
              </h1>
            </AnimateIn>
            <AnimateIn from="up" distance={12} delay={0.08} viewport={false}>
              <p className="prose-readable text-body-lg text-muted leading-relaxed">
                {project.summary}
              </p>
            </AnimateIn>
          </div>

          {/* Action Buttons */}
          <AnimateIn from="up" distance={8} delay={0.16} viewport={false}>
            <div className="flex flex-wrap gap-3 pt-2">
              {project.live_url && (
                <Button asChild variant="primary" size="md">
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                    Live Demo
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
              {project.source_url && (
                <Button asChild variant="secondary" size="md">
                  <a href={project.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                    Source Code
                    <Github className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </AnimateIn>
        </Container>

        {/* Cover Image */}
        {project.cover_url && (
          <Container>
            <AnimateIn from="up" distance={16} delay={0.12}>
              <div className="relative aspect-[21/9] w-full overflow-hidden border border-border bg-surface rounded-2xl animate-grayscale-hover shadow-xs">
                <img
                  src={project.cover_url}
                  alt={`${project.title} cover image`}
                  className="w-full h-full object-cover"
                />
              </div>
            </AnimateIn>
          </Container>
        )}

        {/* Main Content Layout */}
        <Container className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
          {/* Left Column: Case Study */}
          <AnimateIn from="up" distance={16} className="lg:col-span-2 space-y-6">
            <h2 className="text-h2 font-bold tracking-tight border-b border-border/80 pb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
              Project Overview
            </h2>
            <div className="pt-2">
              <Markdown content={project.description || "No detailed description provided."} />
            </div>
          </AnimateIn>

          {/* Right Column: Sidebar */}
          <div className="space-y-6">
            {/* Tech Stack */}
            {project.tags && project.tags.length > 0 && (
              <AnimateIn from="up" distance={14} delay={0.08}>
                <div className="space-y-3 tactile-panel p-6 rounded-2xl border border-border">
                  <h3 className="text-caption font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="pill">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </AnimateIn>
            )}

            {/* Additional details */}
            <AnimateIn from="up" distance={14} delay={0.16}>
              <div className="space-y-3 tactile-panel p-6 rounded-2xl border border-border text-small text-muted">
                <h3 className="text-caption font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
                  Project Details
                </h3>
                <div className="space-y-2.5 pt-1">
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span>Published</span>
                    <span className="font-medium text-foreground font-mono">
                      {new Date(project.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Role</span>
                    <span className="font-medium text-foreground">Lead Developer</span>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </Container>

        {/* Gallery Section */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="border-t border-border/80 pt-16" aria-labelledby="gallery-title">
            <Container className="space-y-8">
              <AnimateIn from="up" distance={14}>
                <div className="space-y-1">
                  <p className="text-caption font-bold uppercase tracking-[0.14em] text-muted flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
                    Visual Artifacts
                  </p>
                  <h2 id="gallery-title" className="text-h2 font-bold tracking-tight">
                    Project Gallery
                  </h2>
                </div>
              </AnimateIn>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.gallery.map((url, index) => (
                  <AnimateIn key={index} from="up" distance={16} staggerIndex={index}>
                    <div className="relative aspect-[16/10] overflow-hidden border border-border bg-surface rounded-2xl animate-grayscale-hover shadow-xs">
                      <img
                        src={url}
                        alt={`${project.title} screenshot ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </AnimateIn>
                ))}
              </div>
            </Container>
          </section>
        )}
      </div>
    </SkeletonWrapper>
  );
}
