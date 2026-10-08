import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AnimateIn } from "@/components/ui/animate-in";
import { Wrench, RotateCw, Home, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "503 — System Maintenance",
  description: "Temporary maintenance and database synchronization in progress.",
};

export default function ServiceUnavailablePage() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24 text-center">
      <div className="max-w-xl w-full space-y-8">
        {/* Isometric 503 Visual Hero */}
        <AnimateIn variant="iso" duration={0.4} viewport={false}>
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-surface border border-border jitter-iso-card flex items-center justify-center shadow-md">
              <Wrench className="h-12 w-12 text-sky-500 animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Badge variant="pill" className="text-[11px] font-mono px-2.5 py-0.5 border border-border bg-foreground text-background font-bold shadow-xs">
                503
              </Badge>
            </div>
          </div>
        </AnimateIn>

        {/* Text Details */}
        <AnimateIn variant="fade-rise" distance={16} duration={0.35} delay={0.1} viewport={false}>
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-500 animate-ping" />
              <p className="font-mono text-xs uppercase tracking-widest text-muted">
                System Upgrade & Synchronization
              </p>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Scheduled Platform Maintenance
            </h1>
            <p className="text-body text-muted max-w-[480px] mx-auto leading-relaxed">
              We are currently performing routine database optimization and cache infrastructure upgrades for{" "}
              <span className="font-anak-manja text-foreground inline-block">Dheeraj Carpenter</span>
              &apos;s portfolio. Services will resume in seconds.
            </p>
          </div>
        </AnimateIn>

        {/* Action Buttons */}
        <AnimateIn variant="fade-rise" distance={16} duration={0.35} delay={0.2} viewport={false}>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              asChild
              variant="primary"
              size="lg"
              className="rounded-full px-6"
            >
              <Link href="/">
                <RotateCw className="h-4 w-4 mr-2" />
                Check Status & Retry
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="rounded-full px-6 border border-border">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Return to Home
              </Link>
            </Button>
          </div>
        </AnimateIn>

        {/* Status Guarantee Card */}
        <AnimateIn variant="iso-card" duration={0.4} delay={0.3} viewport={false}>
          <Card className="p-4 bg-surface/70 border border-border rounded-xl text-left text-small text-muted flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-foreground font-semibold text-caption uppercase tracking-wider">
                Zero Data Loss Guarantee
              </p>
              <p className="text-caption">
                All contact submissions, draft entries, and analytics queues are securely persisted in redundant cold storage during maintenance windows.
              </p>
            </div>
          </Card>
        </AnimateIn>
      </div>
    </div>
  );
}
