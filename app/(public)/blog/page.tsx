import Link from "next/link";
import { getPublishedPosts } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Card, Badge } from "@/components/ui";
import { Calendar, Clock, ArrowRight, Newspaper } from "lucide-react";
import { AnimateIn } from "@/components/ui/animate-in";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Articles & Engineering Insights — Dheeraj Carpenter",
  description:
    "Technical articles, tutorials, engineering write-ups, and guides on full-stack web development, TypeScript, and design by Dheeraj Carpenter.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Articles & Engineering Insights — Dheeraj Carpenter",
    description:
      "Technical articles, tutorials, engineering write-ups, and guides on full-stack web development, TypeScript, and design.",
    url: "/blog",
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Articles", url: "/blog" },
        ]}
      />
      <div className="py-16 md:py-24 space-y-12">
      <Container className="space-y-4">
        <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
          <p className="mono-eyebrow text-muted mb-2">
            Writing
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Articles &amp; Writing
          </h1>
        </AnimateIn>
        <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
          <p className="prose-readable text-body sm:text-body-lg text-muted max-w-[640px] leading-relaxed">
            Notes, tutorials, and engineering write-ups on software development, TypeScript, and design.
          </p>
        </AnimateIn>
      </Container>

      <Container>
        {posts.length === 0 ? (
          <AnimateIn variant="fade-rise" distance={14}>
            <div className="border border-border p-12 sm:p-16 text-center text-muted rounded-2xl bg-surface/40 space-y-3">
              <Newspaper className="mx-auto h-10 w-10 text-foreground/50" />
              <h3 className="text-lg font-bold text-foreground">Writing in Progress</h3>
              <p className="text-small text-muted max-w-md mx-auto leading-relaxed">
                New articles on Next.js, TypeScript patterns, and digital design are currently being written. Check back soon for updates.
              </p>
            </div>
          </AnimateIn>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {posts.map((post, index) => (
              <AnimateIn key={post.id} from="up" distance={16} staggerIndex={index}>
                <Card className="flex flex-col h-full justify-between card-accent-bar !p-0 overflow-hidden">
                  {/* Cover image if available */}
                  {post.cover_url && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border animate-grayscale-hover bg-surface-overlay">
                      <img
                        src={post.cover_url}
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
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
    </>
  );
}
