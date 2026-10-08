"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Project } from "@/types/database";
import { Card, Badge, Button } from "@/components/ui";
import { AnimateIn } from "@/components/ui/animate-in";
import {
  LayoutGrid,
  List as ListIcon,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Calendar,
} from "lucide-react";

interface ProjectsViewProps {
  projects: Project[];
}

export function ProjectsView({ projects }: ProjectsViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Read saved view mode from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("projects-view-mode");
      if (saved === "list" || saved === "grid") {
        setViewMode(saved);
      }
    } catch {
      // Ignore localStorage read errors in restricted contexts
    }
  }, []);

  // Handler to switch view and persist in localStorage
  const handleToggle = (mode: "grid" | "list") => {
    setViewMode(mode);
    try {
      localStorage.setItem("projects-view-mode", mode);
    } catch {
      // Ignore localStorage write errors
    }
  };

  if (projects.length === 0) {
    return (
      <AnimateIn from="up" distance={12}>
        <div className="border border-dashed border-border p-16 text-center text-muted rounded-2xl bg-surface/30">
          No projects published yet. Please add them in the admin dashboard.
        </div>
      </AnimateIn>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar: View Toggle & Count */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div className="flex items-center gap-2 text-small text-muted font-mono">
          <span>{projects.length} Projects</span>
          <span className="opacity-40">•</span>
          <span className="capitalize">{viewMode} view</span>
        </div>

        {/* Segmented View Switcher */}
        <div
          role="radiogroup"
          aria-label="View format"
          className="inline-flex items-center p-0.5 rounded-lg border border-border bg-surface/50 backdrop-blur-sm shadow-xs"
        >
          <button
            type="button"
            role="radio"
            aria-checked={viewMode === "grid"}
            onClick={() => handleToggle("grid")}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-foreground text-background shadow-xs font-semibold"
                : "text-muted hover:text-foreground"
            }`}
            title="Grid View"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={viewMode === "list"}
            onClick={() => handleToggle("list")}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              viewMode === "list"
                ? "bg-foreground text-background shadow-xs font-semibold"
                : "text-muted hover:text-foreground"
            }`}
            title="List View"
          >
            <ListIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      {/* Grid View Mode */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {projects.map((project, index) => (
            <AnimateIn
              key={project.id}
              variant="fade-rise"
              distance={40}
              duration={0.45}
              staggerIndex={index}
              delay={0.03}
              viewportAmount={0.05}
              viewport
            >
              <Card className="flex flex-col h-full geist-card !p-0 overflow-hidden group animate-glow-hover">
                {/* Cover Image Wrapper */}
                {project.cover_url ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border/70 bg-surface-overlay image-pan-hover">
                    <img
                      src={project.cover_url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    {project.live_url && (
                      <div className="absolute top-3 right-3">
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 text-[11px] font-mono text-white flex items-center gap-1 hover:bg-black transition-colors"
                        >
                          Live
                          <ArrowUpRight className="h-3 w-3 opacity-80" />
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative aspect-[16/10] w-full bg-surface-overlay border-b border-border/70 flex items-center justify-center text-caption text-muted font-mono">
                    Interactive Project
                  </div>
                )}

                <div className="flex flex-col flex-1 justify-between p-6 space-y-4">
                  <div className="space-y-2.5">
                    <h2 className="text-xl font-bold tracking-tight group-hover:text-foreground/90 transition-colors">
                      <Link href={`/projects/${project.slug}`}>
                        {project.title}
                      </Link>
                    </h2>
                    <p className="text-small text-muted line-clamp-3 leading-relaxed">
                      {project.summary}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 mt-auto border-t border-border/70">
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="pill" className="text-caption font-mono">{tag}</Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Button asChild variant="secondary" size="sm" className="flex-1 justify-center group-hover:border-border-strong">
                        <Link href={`/projects/${project.slug}`}>
                          View Case Study
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                      </Button>
                      {project.live_url && (
                        <Button asChild variant="primary" size="sm" className="shrink-0">
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer" aria-label="Visit Live Demo">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </AnimateIn>
          ))}
        </div>
      ) : (
        /* List View Mode */
        <div className="space-y-3">
          {projects.map((project, index) => (
            <AnimateIn
              key={project.id}
              variant={index % 2 === 0 ? "slide-right" : "slide-left"}
              distance={20}
              duration={0.4}
              staggerIndex={index}
              delay={0.02}
              viewportAmount={0.05}
              viewport
            >
              <Card className="p-4 sm:p-5 geist-card hover:border-foreground/30 transition-all group animate-card-float">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                    {project.cover_url ? (
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden border border-border/60 bg-surface-overlay">
                        <img
                          src={project.cover_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg border border-border/60 bg-surface-overlay flex items-center justify-center text-xs text-muted font-mono">
                        N/A
                      </div>
                    )}

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground group-hover:text-foreground/90">
                          <Link href={`/projects/${project.slug}`} className="hover:underline">
                            {project.title}
                          </Link>
                        </h2>
                        {project.live_url && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            Live
                          </span>
                        )}
                        {project.year && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted font-mono">
                            <Calendar className="h-3 w-3 opacity-60" />
                            {project.year}
                          </span>
                        )}
                      </div>

                      <p className="text-small text-muted line-clamp-1 sm:line-clamp-2 leading-relaxed">
                        {project.summary}
                      </p>

                      {project.tags && project.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {project.tags.slice(0, 4).map((tag) => (
                            <Badge key={tag} variant="pill" className="text-[10px] py-0 px-2 font-mono">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 4 && (
                            <span className="text-[10px] font-mono text-muted">
                              +{project.tags.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <Button asChild variant="secondary" size="sm" className="text-xs">
                      <Link href={`/projects/${project.slug}`}>
                        Case Study
                        <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                    {project.live_url && (
                      <Button asChild variant="primary" size="sm" className="text-xs">
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </AnimateIn>
          ))}
        </div>
      )}
    </div>
  );
}
