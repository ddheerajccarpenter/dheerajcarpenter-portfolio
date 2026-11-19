import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui";
import { Markdown } from "@/components/ui/markdown";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { AnimateIn } from "@/components/ui/animate-in";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const revalidate = 3600;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dheerajcarpenter.vercel.app";

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    return {
      title: "Article Not Found",
    };
  }

  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt || `Read ${post.title} by Dheeraj Carpenter.`,
    keywords: post.tags || ["Software Development", "Web Engineering", "Tutorial", "Next.js"],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${post.title} — Dheeraj Carpenter`,
      description: post.excerpt || `Read ${post.title} by Dheeraj Carpenter.`,
      url,
      type: "article",
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at,
      authors: ["Dheeraj Carpenter"],
      images: post.cover_url
        ? [{ url: post.cover_url, width: 1200, height: 630, alt: post.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} — Dheeraj Carpenter`,
      description: post.excerpt || `Read ${post.title} by Dheeraj Carpenter.`,
      images: post.cover_url ? [post.cover_url] : undefined,
    },
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <div className="py-12 md:py-20 space-y-12">
      {/* Schema.org Structured Data for AEO / SEO */}
      <ArticleJsonLd post={post} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />

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
            <h1 className="text-h1 font-bold tracking-tight sm:text-[3.25rem] leading-tight text-foreground">
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
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </AnimateIn>
        </Container>
      )}

      {/* Article Body */}
      <Container className="max-w-[800px]">
        <article className="prose-readable">
          <Markdown content={post.content} />
        </article>
      </Container>
    </div>
  );
}
