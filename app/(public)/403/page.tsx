import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AnimateIn } from "@/components/ui/animate-in";
import { ShieldAlert, LogIn, Home, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "403 — Access Restricted",
  description: "Administrative clearance is required to view this sector.",
};

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24 text-center">
      <div className="max-w-xl w-full space-y-8">
        {/* Isometric 403 Visual Hero */}
        <AnimateIn variant="iso" duration={0.4} viewport={false}>
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-surface border border-border jitter-iso-card flex items-center justify-center shadow-md">
              <ShieldAlert className="h-12 w-12 text-rose-500" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Badge variant="pill" className="text-[11px] font-mono px-2.5 py-0.5 border border-border bg-foreground text-background font-bold shadow-xs">
                403
              </Badge>
            </div>
          </div>
        </AnimateIn>

        {/* Text Details */}
        <AnimateIn variant="fade-rise" distance={16} duration={0.35} delay={0.1} viewport={false}>
          <div className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              Security Boundary — Restricted Sector
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Administrative Clearance Required
            </h1>
            <p className="text-body text-muted max-w-[480px] mx-auto leading-relaxed">
              You do not have the credentials or role assignment required to enter this sector of{" "}
              <span className="font-anak-manja text-foreground inline-block">Dheeraj Carpenter</span>
              &apos;s workspace.
            </p>
          </div>
        </AnimateIn>

        {/* Action Buttons */}
        <AnimateIn variant="fade-rise" distance={16} duration={0.35} delay={0.2} viewport={false}>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild variant="primary" size="lg" className="rounded-full px-6">
              <Link href="/dc/login">
                <LogIn className="h-4 w-4 mr-2" />
                Log In to CMS
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="rounded-full px-6 border border-border">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Return to Portfolio
              </Link>
            </Button>
          </div>
        </AnimateIn>

        {/* Security Note Card */}
        <AnimateIn variant="iso-card" duration={0.4} delay={0.3} viewport={false}>
          <Card className="p-4 bg-surface/70 border border-border rounded-xl text-left text-small text-muted space-y-1">
            <p className="text-foreground font-semibold text-caption uppercase tracking-wider">
              Security Notice
            </p>
            <p className="text-caption">
              All unauthorized endpoint probe attempts and credential brute-force routines are automatically recorded in the cryptographic audit log.
            </p>
          </Card>
        </AnimateIn>
      </div>
    </div>
  );
}
