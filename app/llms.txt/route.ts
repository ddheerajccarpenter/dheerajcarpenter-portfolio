import { NextResponse } from "next/server";
import { getPublishedProjects } from "@/lib/data/public";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dheerajcarpenter.vercel.app";

export const revalidate = 3600;

export async function GET() {
  const projects = await getPublishedProjects().catch(() => []);
  const topProjects = projects.slice(0, 5);

  const content = `# Dheeraj Carpenter

> Software engineer and creator specializing in TypeScript, Next.js, React, and modern full-stack web applications.

## Summary
- **Name**: Dheeraj Carpenter
- **Role**: Software Engineer & Engineering Student
- **Location**: India
- **Core Stack**: TypeScript, Next.js, React, Tailwind CSS, PostgreSQL, Supabase, Node.js
- **Focus Areas**: Full-stack web engineering, responsive user interfaces, clean software architecture, video editing, and creative design.
- **Website**: ${SITE_URL}
- **GitHub**: https://github.com/ddheerajccarpenter
- **Email**: dheerajcarpenter@gmail.com

## Selected Projects
${
  topProjects.length > 0
    ? topProjects
        .map(
          (p) =>
            `- [${p.title}](${SITE_URL}/projects/${p.slug}): ${p.summary} (Tech: ${p.tags?.join(", ") || "Web"})`
        )
        .join("\n")
    : `- [Featured Projects](${SITE_URL}/projects): Modern web applications built with TypeScript and Next.js.`
}

## Core Navigation
- [Projects](${SITE_URL}/projects): Catalog of web applications, tools, and open-source software.
- [About](${SITE_URL}/about): Background, education, and technical philosophy.
- [Blog](${SITE_URL}/blog): Technical articles, engineering notes, and tutorials.
- [Experience](${SITE_URL}/experience): Education, academic background, and technical journey.
- [Skills](${SITE_URL}/skills): Full catalog of programming languages, frameworks, and tools.
- [FAQ](${SITE_URL}/faq): Answers to common questions regarding background, stack, and collaborations.
- [Contact](${SITE_URL}/contact): Reach out for collaborations, project inquiries, or conversations.

## Full Context
- [Full LLM Knowledge Feed](${SITE_URL}/llms-full.txt): Complete catalog with descriptions, code repositories, and FAQ answers.
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
