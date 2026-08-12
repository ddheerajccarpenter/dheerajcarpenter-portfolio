import Link from "next/link";
import { Button } from "@/components/ui";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-6 py-24 space-y-6">
      <div className="p-4 bg-surface border border-border rounded-full">
        <FileQuestion className="h-10 w-10 text-foreground" />
      </div>
      <div className="space-y-2 max-w-[40ch]">
        <h1 className="text-h2 font-bold tracking-tight">Page not found</h1>
        <p className="text-body text-muted leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
      <div className="pt-2">
        <Button asChild variant="primary">
          <Link href="/">
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
