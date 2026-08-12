"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-6 py-24 space-y-6">
      <div className="p-4 bg-surface border border-border rounded-full">
        <AlertTriangle className="h-10 w-10 text-foreground" />
      </div>
      <div className="space-y-2 max-w-[40ch]">
        <h1 className="text-h2 font-bold tracking-tight">Something went wrong</h1>
        <p className="text-body text-muted leading-relaxed">
          An unexpected error occurred while rendering this page.
        </p>
      </div>
      <div className="pt-2">
        <Button onClick={() => reset()} variant="primary">
          Try again
        </Button>
      </div>
    </div>
  );
}
