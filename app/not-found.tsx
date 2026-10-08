import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimateIn } from "@/components/ui/animate-in";
import { Home, Briefcase, Mail, ArrowRight, FileQuestion, Sparkles, BookOpen } from "lucide-react";

export const metadata = {
  title: "404 — Page Not Found",
  description: "The requested page could not be found on Dheeraj Carpenter's portfolio.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24 text-center">
      <div className="max-w-2xl w-full space-y-8">
        {/* Isometric 404 Visual Hero */}
        <AnimateIn variant="iso" duration={0.4} viewport={false}>
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-surface border border-border jitter-iso-card flex items-center justify-center shadow-md">
              <FileQuestion className="h-12 w-12 text-foreground/80" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Badge variant="pill" className="text-[11px] font-mono px-2.5 py-0.5 border border-border bg-foreground text-background font-bold shadow-xs">
                404
              </Badge>
            </div>
          </div>
        </AnimateIn>

        {/* Text Details */}
        <AnimateIn variant="fade-rise" distance={16} duration={0.35} delay={0.1} viewport={false}>
          <div className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              Error 404 — Resource Missing
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Lost in the Digital Expanse
            </h1>
            <p className="text-body text-muted max-w-[500px] mx-auto leading-relaxed">
              The page you are looking for has been relocated, renamed, or never existed in{" "}
              <span className="font-anak-manja text-foreground inline-block">Dheeraj Carpenter</span>
              &apos;s portfolio.
            </p>
          </div>
        </AnimateIn>

        {/* Primary Action Buttons */}
        <AnimateIn variant="fade-rise" distance={16} duration={0.35} delay={0.2} viewport={false}>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild variant="primary" size="lg" className="rounded-full px-6">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Return Home
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="rounded-full px-6 border border-border">
              <Link href="/projects">
                <Briefcase className="h-4 w-4 mr-2" />
                Explore Projects
              </Link>
            </Button>
          </div>
        </AnimateIn>

        {/* Helpful Destinations Grid */}
        <AnimateIn variant="iso-card" duration={0.4} delay={0.3} viewport={false}>
          <div className="pt-6 border-t border-border/80">
            <p className="text-caption font-semibold uppercase tracking-wider text-muted mb-4">
              Suggested Destinations
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <Link href="/projects" className="group">
                <Card className="p-4 bg-surface/70 hover:bg-surface border border-border hover:border-border-strong transition-all rounded-xl jitter-iso-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-small font-semibold text-foreground group-hover:underline">Projects</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-caption text-muted">Case studies, architecture & live code demos.</p>
                </Card>
              </Link>

              <Link href="/blog" className="group">
                <Card className="p-4 bg-surface/70 hover:bg-surface border border-border hover:border-border-strong transition-all rounded-xl jitter-iso-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-small font-semibold text-foreground group-hover:underline">Articles</span>
                    <BookOpen className="h-3.5 w-3.5 text-muted group-hover:text-foreground transition-colors" />
                  </div>
                  <p className="text-caption text-muted">Engineering deep-dives & design essays.</p>
                </Card>
              </Link>

              <Link href="/contact" className="group">
                <Card className="p-4 bg-surface/70 hover:bg-surface border border-border hover:border-border-strong transition-all rounded-xl jitter-iso-card">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-small font-semibold text-foreground group-hover:underline">Contact</span>
                    <Mail className="h-3.5 w-3.5 text-muted group-hover:text-foreground transition-colors" />
                  </div>
                  <p className="text-caption text-muted">Reach out for freelance or collaboration.</p>
                </Card>
              </Link>
            </div>
          </div>
        </AnimateIn>
      </div>
    </div>
  );
}
