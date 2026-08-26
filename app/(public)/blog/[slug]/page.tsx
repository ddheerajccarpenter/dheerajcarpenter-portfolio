import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui";
import { Markdown } from "@/components/ui/markdown";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { AnimateIn } from "@/components/ui/animate-in";

export const revalidate = 0;
export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <div className="py-12 md:py-20 space-y-12">
      {/* Back Button */}
      <Container className="max-w-[800px]">
        <AnimateIn from="left" distance={10} duration={0.3} viewport={false}>
          <Link
            href="/blog"
            className="inline-flex items-center text-small font-medium hover:underline underline-offset-4 text-muted hover:text-foreground transition-colors gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all articles
          </Link>
        </AnimateIn>
      </Container>

      {/* Hero Header */}
      <Container className="max-w-[800px] space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-caption font-semibold text-muted font-mono">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted" />
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : new Date(post.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-muted" />
              {post.reading_time_minutes || 4} min read
            </span>
          </div>

          <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
            <h1 className="text-h1 font-bold tracking-tight sm:text-[3.25rem] leading-tight text-editorial-gradient">
              {post.title}
            </h1>
          </AnimateIn>

          {post.excerpt && (
            <AnimateIn from="up" distance={12} delay={0.08} viewport={false}>
              <p className="prose-readable text-body-lg text-muted italic leading-relaxed">
                {post.excerpt}
              </p>
            </AnimateIn>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="pill">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </Container>

      {/* Cover Image */}
      {post.cover_url && (
        <Container className="max-w-[880px]">
          <AnimateIn from="up" distance={16} delay={0.12}>
            <div className="relative aspect-[21/9] w-full overflow-hidden border border-border bg-surface rounded-2xl shadow-xs">
              <img
                src={post.cover_url}
                alt={`${post.title} cover`}
                className="w-full h-full object-cover"
              />
            </div>
          </AnimateIn>
        </Container>
      )}

      {/* Article Body */}
      <Container className="max-w-[800px] pt-4">
        <AnimateIn from="up" distance={16} className="space-y-6">
          <div className="pt-2">
            <Markdown content={post.content || "No article content written."} />
          </div>
        </AnimateIn>
      </Container>
    </div>
  );
}
