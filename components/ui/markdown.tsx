import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  className?: string;
}

/**
 * Custom Markdown component.
 * Ensures lists, links, headers, and code snippets render strictly in B&W
 * with proportional typography spacing.
 */
export function Markdown({ content, className }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className={cn(
        "prose-readable text-body text-muted space-y-4",
        // Custom Markdown styles conforming to B&W typography guidelines
        "[&_h1]:text-h1 [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mt-8 [&_h1]:mb-4",
        "[&_h2]:text-h2 [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-6 [&_h2]:mb-3",
        "[&_h3]:text-h3 [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-4 [&_h3]:mb-2",
        "[&_p]:leading-relaxed [&_p]:mb-4",
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-4",
        "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:mb-4",
        "[&_li]:leading-normal",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-foreground [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote]:text-foreground",
        "[&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:font-medium hover:[&_a]:opacity-80 transition-opacity",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_code]:px-1.5 [&_code]:py-0.5 [&_code]:bg-surface [&_code]:border [&_code]:border-border [&_code]:rounded-md [&_code]:font-mono [&_code]:text-small [&_code]:text-foreground",
        "[&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:bg-surface [&_pre]:border [&_pre]:border-border [&_pre]:overflow-x-auto [&_pre]:my-4 [&_pre_code]:p-0 [&_pre_code]:bg-transparent [&_pre_code]:border-0 [&_pre_code]:rounded-none",
        "[&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:border [&_th]:border-border [&_th]:p-2.5 [&_th]:bg-surface [&_th]:text-left [&_th]:font-semibold [&_th]:text-foreground [&_td]:border [&_td]:border-border [&_td]:p-2.5",
        "[&_img]:rounded-xl [&_img]:border [&_img]:border-border [&_img]:my-4 [&_img]:max-w-full",
        className
      )}
    >
      {content}
    </ReactMarkdown>
  );
}
