import type { Project, BlogPost } from "@/types/database";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dheerajcarpenter.vercel.app";

/**
 * PersonJsonLd — Core Entity Schema for Dheeraj Carpenter.
 * Establishes authority for Google Knowledge Graph, Perplexity, ChatGPT Search, and Gemini.
 */
export function PersonJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Dheeraj Carpenter",
    givenName: "Dheeraj",
    familyName: "Carpenter",
    url: SITE_URL,
    jobTitle: "Software Engineer",
    description:
      "Dheeraj Carpenter is a software engineer and engineering student specializing in TypeScript, Next.js, React, and modern full-stack web applications.",
    sameAs: [
      "https://github.com/ddheerajccarpenter",
      "https://linkedin.com/in/dheerajcarpenter",
      "https://twitter.com/dheerajcarpenter",
    ],
    knowsAbout: [
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "Node.js",
      "Tailwind CSS",
      "PostgreSQL",
      "Supabase",
      "Web Architecture",
      "UI/UX Design",
      "Video Editing",
    ],
    homeLocation: {
      "@type": "Place",
      name: "India",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
      },
    },
    nationality: {
      "@type": "Country",
      name: "India",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * WebSiteJsonLd — WebSite schema for search indexing and sitelinks.
 */
export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Dheeraj Carpenter",
    description:
      "Official portfolio, projects, articles, and technical notes of Dheeraj Carpenter.",
    publisher: {
      "@id": `${SITE_URL}/#person`,
    },
    inLanguage: "en-US",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * ProjectJsonLd — CreativeWork / SoftwareApplication Schema for projects.
 */
export function ProjectJsonLd({ project }: { project: Project }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    headline: project.title,
    description: project.summary,
    url: `${SITE_URL}/projects/${project.slug}`,
    image: project.cover_url || undefined,
    applicationCategory: "WebApplication",
    operatingSystem: "Web",
    author: {
      "@id": `${SITE_URL}/#person`,
      name: "Dheeraj Carpenter",
    },
    creator: {
      "@id": `${SITE_URL}/#person`,
      name: "Dheeraj Carpenter",
    },
    keywords: project.tags?.join(", "),
    datePublished: project.created_at,
    ...(project.source_url ? { codeRepository: project.source_url } : {}),
    ...(project.live_url ? { installUrl: project.live_url } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * ArticleJsonLd — BlogPosting / Article Schema for blog posts.
 */
export function ArticleJsonLd({ post }: { post: BlogPost }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    url: `${SITE_URL}/blog/${post.slug}`,
    image: post.cover_url || undefined,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: {
      "@id": `${SITE_URL}/#person`,
      name: "Dheeraj Carpenter",
      url: SITE_URL,
    },
    publisher: {
      "@id": `${SITE_URL}/#person`,
      name: "Dheeraj Carpenter",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.tags?.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FaqJsonLd — FAQPage Schema for Answer Engine and Google Rich Snippet optimization.
 */
export function FaqJsonLd({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * BreadcrumbJsonLd — Breadcrumb hierarchy for search navigation.
 */
export function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
