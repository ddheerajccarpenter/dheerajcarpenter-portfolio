import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Globe,
  Layers,
  FileText,
  Briefcase,
  Headphones,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

interface ContentHealthProps {
  projects: { id: string; published: boolean; cover_url?: string | null; live_url?: string | null }[];
  posts: { id: string; published: boolean; cover_url?: string | null }[];
  services: { id: string; active?: boolean }[];
  testimonials: { id: string; avatar_url?: string | null }[];
  unreadMessages: number;
}

export function ContentHealthWidget({
  projects,
  posts,
  services,
  testimonials,
  unreadMessages,
}: ContentHealthProps) {
  const publishedProjects = projects.filter((p) => p.published).length;
  const liveDemoProjects = projects.filter((p) => Boolean(p.live_url)).length;
  const publishedPosts = posts.filter((p) => p.published).length;
  const activeServices = services.filter((s) => s.active !== false).length;

  // Calculate a dynamic portfolio completeness score
  let score = 0;
  if (publishedProjects >= 3) score += 30;
  else if (publishedProjects > 0) score += 15;

  if (publishedPosts >= 2) score += 20;
  else if (publishedPosts > 0) score += 10;

  if (activeServices > 0) score += 20;
  if (testimonials.length > 0) score += 15;
  if (unreadMessages === 0) score += 15;

  return (
    <Card className="liquid-glass-card p-5 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-surface border border-border shadow-2xs">
            <TrendingUp className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <h2 className="text-body font-bold tracking-tight text-foreground">
              Portfolio Content Health
            </h2>
            <p className="text-caption text-muted">
              Live audit of published work, case studies & readiness
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-h3 font-bold text-foreground tabular-nums">
            {score}%
          </span>
          <Badge
            variant="pill"
            className={
              score >= 80
                ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
                : "border-amber-500/30 text-amber-500 bg-amber-500/10"
            }
          >
            {score >= 80 ? "Optimal" : "In Progress"}
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-2 rounded-full bg-surface border border-border overflow-hidden">
          <div
            className="h-full bg-foreground transition-all duration-500 rounded-full"
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-muted font-medium">
          <span>Readiness Score</span>
          <span>{score} of 100 Points</span>
        </div>
      </div>

      {/* Detailed Checklist Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Projects Status */}
        <Link
          href="/admin/projects"
          className="p-3 rounded-lg border border-border bg-surface/50 hover:bg-surface hover:border-border-strong transition-all flex flex-col justify-between space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-caption font-bold text-foreground">
              <Layers className="h-3.5 w-3.5" />
              <span>Projects</span>
            </div>
            <ArrowUpRight className="h-3 w-3 text-muted group-hover:text-foreground transition-colors" />
          </div>
          <div className="flex items-baseline justify-between text-caption">
            <span className="text-muted">Published</span>
            <span className="font-bold text-foreground tabular-nums">
              {publishedProjects} / {projects.length}
            </span>
          </div>
        </Link>

        {/* Blog Posts */}
        <Link
          href="/admin/posts"
          className="p-3 rounded-lg border border-border bg-surface/50 hover:bg-surface hover:border-border-strong transition-all flex flex-col justify-between space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-caption font-bold text-foreground">
              <FileText className="h-3.5 w-3.5" />
              <span>Articles</span>
            </div>
            <ArrowUpRight className="h-3 w-3 text-muted group-hover:text-foreground transition-colors" />
          </div>
          <div className="flex items-baseline justify-between text-caption">
            <span className="text-muted">Published</span>
            <span className="font-bold text-foreground tabular-nums">
              {publishedPosts} / {posts.length}
            </span>
          </div>
        </Link>

        {/* Services */}
        <Link
          href="/admin/services"
          className="p-3 rounded-lg border border-border bg-surface/50 hover:bg-surface hover:border-border-strong transition-all flex flex-col justify-between space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-caption font-bold text-foreground">
              <Headphones className="h-3.5 w-3.5" />
              <span>Services</span>
            </div>
            <ArrowUpRight className="h-3 w-3 text-muted group-hover:text-foreground transition-colors" />
          </div>
          <div className="flex items-baseline justify-between text-caption">
            <span className="text-muted">Active</span>
            <span className="font-bold text-foreground tabular-nums">
              {activeServices}
            </span>
          </div>
        </Link>

        {/* Testimonials */}
        <Link
          href="/admin/testimonials"
          className="p-3 rounded-lg border border-border bg-surface/50 hover:bg-surface hover:border-border-strong transition-all flex flex-col justify-between space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-caption font-bold text-foreground">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Reviews</span>
            </div>
            <ArrowUpRight className="h-3 w-3 text-muted group-hover:text-foreground transition-colors" />
          </div>
          <div className="flex items-baseline justify-between text-caption">
            <span className="text-muted">Approved</span>
            <span className="font-bold text-foreground tabular-nums">
              {testimonials.length}
            </span>
          </div>
        </Link>
      </div>

      {/* Quick notice if there are unread messages */}
      {unreadMessages > 0 ? (
        <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-caption text-amber-500">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-medium">
              {unreadMessages} new inquiry {unreadMessages === 1 ? "message" : "messages"} pending review.
            </span>
          </div>
          <Link
            href="/admin/messages"
            className="font-bold underline underline-offset-4 hover:opacity-80"
          >
            Reply
          </Link>
        </div>
      ) : (
        <div className="flex items-center space-x-2 p-3 rounded-lg bg-surface border border-border text-caption text-muted">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>All contact messages reviewed and resolved.</span>
        </div>
      )}
    </Card>
  );
}
