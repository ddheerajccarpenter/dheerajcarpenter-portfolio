"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, RotateCcw, LayoutDashboard, ExternalLink } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin dashboard exception:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 space-y-6">
      <Card className="bg-surface border border-border p-8 rounded-xl shadow-xs space-y-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-surface-raised border border-border flex items-center justify-center shadow-2xs">
          <AlertCircle className="h-8 w-8 text-rose-500" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5">
            <Badge variant="pill" className="text-xs px-2.5 py-0.5 border border-border bg-surface text-foreground font-mono">
              CMS Error
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Admin Operation Failed
          </h1>
          <p className="text-small text-muted max-w-md mx-auto">
            An exception occurred while processing CMS data or authenticating permissions for this section.
          </p>
        </div>

        {error.message && (
          <div className="p-3 bg-surface-raised border border-border rounded-lg text-left text-xs font-mono text-muted break-all">
            <span className="text-foreground font-semibold">Message:</span> {error.message}
          </div>
        )}

        {error.digest && (
          <p className="text-caption font-mono text-muted">
            Incident Hash: <span className="text-foreground select-all">{error.digest}</span>
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()} variant="primary" className="rounded-md">
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry Operation
          </Button>
          <Button asChild variant="secondary" className="rounded-md border border-border">
            <Link href="/dc">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-md">
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <span>View Site</span>
              <ExternalLink className="h-3 w-3 ml-1.5 opacity-70" />
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
