import Link from "next/link";
import { getPublishedPosts } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Card, Badge } from "@/components/ui";
import { Calendar, Clock, ArrowRight, Newspaper } from "lucide-react";
import { AnimateIn } from "@/components/ui/animate-in";

export const revalidate = 0;

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="py-16 md:py-24 space-y-12">
      <Container className="space-y-4">
        <AnimateIn from="up" distance={20} duration={0.6} viewport={false}>
          <h1 className="text-h1 font-bold tracking-tight sm:text-[3rem]">
            Articles & Insights
          </h1>
        </AnimateIn>
        <AnimateIn from="up" distance={14} delay={0.12} viewport={false}>
          <p className="prose-readable text-body-lg text-muted">
            Thoughts, technical guides, and architectural notes on software engineering and product design.
          </p>
        </AnimateIn>
      </Container>

      <Container>
        {posts.length === 0 ? (
          <AnimateIn from="up" distance={12}>
            <div className="border border-dashed border-border p-16 text-center text-muted rounded-sm space-y-3">
              <Newspaper className="mx-auto h-8 w-8 opacity-40" />
              <p className="text-body font-medium">No articles published yet.</p>
              <p className="text-small text-muted">Check back soon for new technical posts and articles.</p>
            </div>
          </AnimateIn>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post, index) => (
              <AnimateIn key={post.id} from="up" distance={20} staggerIndex={index}>
                <Card className="flex flex-col h-full justify-between p-6 md:p-8 hover:border-border-strong transition-colors animate-card-float">
                  <div className="space-y-4">
                    {/* Cover image if available */}
                    {post.cover_url && (
                      <div className="relative aspect-[16/9] -mx-6 -mt-6 md:-mx-8 md:-mt-8 mb-4 overflow-hidden border-b border-border">
                        <img
                          src={post.cover_url}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-caption font-semibold text-muted">
                      <span className="flex items-center">
                        <Calendar className="mr-1.5 h-3.5 w-3.5" />
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
                      <span className="flex items-center">
                        <Clock className="mr-1.5 h-3.5 w-3.5" />
                        {post.reading_time_minutes || 4} min read
                      </span>
                    </div>

                    <h2 className="text-h2 font-bold tracking-tight hover:underline">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-body text-muted line-clamp-3">
                      {post.excerpt || post.content}
                    </p>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 mt-auto">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-small font-semibold hover:underline underline-offset-4 animate-arrow-slide"
                    >
                      Read full article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
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
