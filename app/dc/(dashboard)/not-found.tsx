import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileQuestion, LayoutDashboard } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 space-y-6">
      <Card className="bg-surface border border-border p-8 rounded-xl shadow-xs space-y-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-surface-raised border border-border flex items-center justify-center shadow-2xs">
          <FileQuestion className="h-8 w-8 text-foreground/80" />
        </div>

        <div className="space-y-2">
          <Badge variant="pill" className="text-xs px-2.5 py-0.5 border border-border bg-surface text-foreground font-mono">
            404 — Admin
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            CMS Resource Not Found
          </h1>
          <p className="text-small text-muted max-w-md mx-auto">
            The requested admin module, database entry, or CMS record could not be found or has been deleted.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button asChild variant="primary" className="rounded-md">
            <Link href="/dc">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Return to Dashboard Overview
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
