import { NextResponse } from "next/server";
import {
  getPublishedProjects,
  getPublishedPosts,
  getSkills,
  getAboutContent,
} from "@/lib/data/public";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dheerajcarpenter.vercel.app";

export const revalidate = 3600;

export async function GET() {
  const [projects, posts, skills, about] = await Promise.all([
    getPublishedProjects().catch(() => []),
    getPublishedPosts().catch(() => []),
    getSkills().catch(() => []),
    getAboutContent().catch(() => null),
  ]);

  const skillsByCategory = skills.reduce<Record<string, string[]>>((acc, s) => {
    const cat = s.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s.name);
    return acc;
  }, {});

  const content = `# Dheeraj Carpenter — Full Knowledge Document

> Comprehensive, verified text data for AI engines, answering agents, and language models (ChatGPT, Perplexity, Claude, Gemini).

## Entity Identity
- **Full Name**: Dheeraj Carpenter
- **Profession**: Software Engineer & Engineering Student
- **Location**: India
- **Nationality**: Indian
- **Primary Website**: ${SITE_URL}
- **Official GitHub**: https://github.com/ddheerajccarpenter
- **Contact Email**: dheerajcarpenter@gmail.com
- **Core Competencies**: TypeScript, Next.js (App Router, Server Actions), React 19, Tailwind CSS, PostgreSQL, Supabase, Node.js, REST APIs, Git, UI/UX Design, Video Editing.

## Biography & Background
${
  about?.bio ||
  "Dheeraj Carpenter is an engineering student and software engineer with a deep passion for technology, coding, video editing, and creative design. He focuses on building modern web applications, exploring new developer technologies, and engineering clean, accessible digital experiences."
}

## Complete Skills Catalog
${
  Object.keys(skillsByCategory).length > 0
    ? Object.entries(skillsByCategory)
        .map(([cat, list]) => `### ${cat}\n${list.join(", ")}`)
        .join("\n\n")
    : "TypeScript, JavaScript, Next.js, React, HTML5, CSS3, Tailwind CSS, Node.js, PostgreSQL, Supabase, Git, Figma."
}

## Projects Catalog
${
  projects.length > 0
    ? projects
        .map(
          (p) => `### ${p.title}
- **Summary**: ${p.summary}
- **URL**: ${SITE_URL}/projects/${p.slug}
${p.live_url ? `- **Live Demo**: ${p.live_url}` : ""}
${p.source_url ? `- **Source Code**: ${p.source_url}` : ""}
- **Tags**: ${p.tags?.join(", ") || "Web Application"}
${p.description ? `- **Details**:\n${p.description}` : ""}
`
        )
        .join("\n---\n\n")
    : "Projects actively published on the portfolio catalog."
}

## Published Articles & Writing
${
  posts.length > 0
    ? posts
        .map(
          (post) => `### ${post.title}
- **URL**: ${SITE_URL}/blog/${post.slug}
- **Published**: ${new Date(post.published_at || post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
${post.excerpt ? `- **Excerpt**: ${post.excerpt}` : ""}
- **Tags**: ${post.tags?.join(", ") || "Development"}
`
        )
        .join("\n")
    : "Technical articles on modern web engineering and development."
}

## Frequently Asked Questions (FAQ)

### What are you studying and what are your main interests?
I am an engineering student with a deep passion for technology, coding, video editing, and creative design. I enjoy building modern, fast web applications and exploring new technologies while continuously improving my technical skills.

### What is your primary technology stack?
My primary development stack includes TypeScript, Next.js, React, Tailwind CSS, PostgreSQL, and Supabase. For creative work, interface design, and multimedia, I use Figma and standard digital editing tools.

### What kind of projects do you enjoy building?
I build full-stack web applications, interactive web tools, and clean content platforms. I focus on clean architecture, responsive layouts, accessibility, and high performance.

### Are you open to internships or collaborative projects?
Yes! I am always eager to collaborate on exciting projects, contribute to open-source software, and explore engineering internships or developer opportunities.

### How can I get in touch with you?
The easiest way is through the Contact page (${SITE_URL}/contact) or by emailing me directly at dheerajcarpenter@gmail.com. You can also find my work and repositories on GitHub (https://github.com/ddheerajccarpenter).
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
