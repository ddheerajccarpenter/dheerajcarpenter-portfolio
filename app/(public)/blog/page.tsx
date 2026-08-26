import Link from "next/link";
import { getPublishedPosts } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Card, Badge } from "@/components/ui";
import { Calendar, Clock, ArrowRight, Newspaper } from "lucide-react";
import { AnimateIn } from "@/components/ui/animate-in";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="py-16 md:py-24 space-y-12">
      <Container className="space-y-4">
        <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
          <div className="inline-flex items-center gap-2 text-caption font-bold uppercase tracking-[0.14em] text-muted mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
            Writing & Engineering Notes
          </div>
          <h1 className="text-h1 font-bold tracking-tight sm:text-[3rem] text-editorial-gradient">
            Articles & Insights
          </h1>
        </AnimateIn>
        <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
          <p className="prose-readable text-body-lg text-muted">
            Essays, technical deep dives, and architectural patterns in modern software development and design.
          </p>
        </AnimateIn>
      </Container>

      <Container>
        {posts.length === 0 ? (
          <AnimateIn from="up" distance={12}>
            <div className="border border-dashed border-border p-16 text-center text-muted rounded-2xl bg-surface/30 space-y-3">
              <Newspaper className="mx-auto h-8 w-8 opacity-40 text-foreground" />
              <p className="text-body font-medium">No articles published yet.</p>
              <p className="text-small text-muted">Check back soon for new technical posts and articles.</p>
            </div>
          </AnimateIn>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {posts.map((post, index) => (
              <AnimateIn key={post.id} from="up" distance={16} staggerIndex={index}>
                <Card className="flex flex-col h-full justify-between p-6 md:p-8 card-accent-bar !p-0 overflow-hidden">
                  {/* Cover image if available */}
                  {post.cover_url && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border animate-grayscale-hover bg-surface-overlay">
                      <img
                        src={post.cover_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6 md:p-8 flex flex-col flex-1 justify-between space-y-4">
                    <div className="space-y-3.5">
                      <div className="flex flex-wrap items-center gap-3 text-caption font-semibold text-muted font-mono">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted" />
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : new Date(post.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted" />
                          {post.reading_time_minutes || 4} min read
                        </span>
                      </div>

                      <h2 className="text-h3 font-bold tracking-tight hover:underline">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>

                      <p className="text-body text-muted line-clamp-3 leading-relaxed">
                        {post.excerpt || post.content}
                      </p>

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="pill">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-5 mt-auto border-t border-border">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-small font-semibold hover:underline underline-offset-4 animate-arrow-slide text-foreground gap-1.5"
                      >
                        Read full article
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </Card>
              </AnimateIn>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
