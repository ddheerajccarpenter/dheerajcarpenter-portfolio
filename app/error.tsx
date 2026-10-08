"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AnimateIn } from "@/components/ui/animate-in";
import { AlertTriangle, RotateCcw, Home, LifeBuoy } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime exception caught by boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24 text-center">
      <div className="max-w-xl w-full space-y-8">
        {/* Isometric 500 Visual Hero */}
        <AnimateIn variant="iso" duration={0.4} viewport={false}>
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-surface border border-border jitter-iso-card flex items-center justify-center shadow-md">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Badge variant="pill" className="text-[11px] font-mono px-2.5 py-0.5 border border-border bg-foreground text-background font-bold shadow-xs">
                500
              </Badge>
            </div>
          </div>
        </AnimateIn>

        {/* Text Details */}
        <AnimateIn variant="fade-rise" distance={16} duration={0.35} delay={0.1} viewport={false}>
          <div className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              Error 500 — Internal Server Issue
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Something Interrupted the Signal
            </h1>
            <p className="text-body text-muted max-w-[480px] mx-auto leading-relaxed">
              An unexpected runtime error occurred while executing this component. The exception has been logged.
            </p>
          </div>
        </AnimateIn>

        {/* Diagnostic Digest if present */}
        {error.digest && (
          <AnimateIn variant="jitter-pop" delay={0.15} viewport={false}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface border border-border text-caption font-mono text-muted">
              <span>Incident Digest:</span>
              <span className="text-foreground font-semibold select-all">{error.digest}</span>
            </div>
          </AnimateIn>
        )}

        {/* Primary Action Buttons */}
        <AnimateIn variant="fade-rise" distance={16} duration={0.35} delay={0.2} viewport={false}>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => reset()}
              variant="primary"
              size="lg"
              className="rounded-full px-6"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button asChild variant="secondary" size="lg" className="rounded-full px-6 border border-border">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Return Home
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="rounded-full px-5">
              <Link href="/contact">
                <LifeBuoy className="h-4 w-4 mr-1.5" />
                Report Problem
              </Link>
            </Button>
          </div>
        </AnimateIn>
      </div>
    </div>
  );
}
