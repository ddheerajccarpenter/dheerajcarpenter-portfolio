import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui";
import { AnimateIn } from "@/components/ui/animate-in";
import { FileText, ShieldCheck, Scale, AlertCircle, Mail } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Terms & Conditions — Dheeraj Carpenter",
  description: "Terms and conditions governing the use of Dheeraj Carpenter's website, software demonstrations, and freelance engineering services.",
};

export default function TermsPage() {
  const lastUpdated = "September 18, 2026";

  return (
    <div className="py-12 md:py-20 space-y-12">
      <Container className="space-y-4">
        <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
          <div className="flex items-center gap-2 text-muted mono-eyebrow mb-2">
            <Scale className="h-3.5 w-3.5 text-foreground/70" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Terms & Conditions
          </h1>
        </AnimateIn>
        <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
          <p className="prose-readable text-body-lg text-muted max-w-[680px]">
            Please read these terms and conditions carefully before using this portfolio website or engaging in software engineering and design consulting services.
          </p>
          <p className="text-caption font-mono text-muted/70 mt-2">
            Last modified: {lastUpdated}
          </p>
        </AnimateIn>
      </Container>

      <Container>
        <div className="max-w-3xl space-y-10">
          {/* Section 1 */}
          <AnimateIn from="up" distance={12} delay={0.15}>
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded-sm border border-border bg-surface text-muted">01</span>
                Acceptance of Terms
              </h2>
              <p className="text-body text-muted leading-relaxed">
                By accessing, browsing, or utilizing the web applications, interactive demonstrations, code repositories, or articles hosted on this domain (<span className="font-mono text-foreground">dheerajcarpenter.vercel.app</span> or associated custom domains), you confirm that you have read, understood, and agreed to be bound by these Terms & Conditions. If you do not agree with any portion of these terms, please discontinue use immediately.
              </p>
            </section>
          </AnimateIn>

          {/* Section 2 */}
          <AnimateIn from="up" distance={12} delay={0.2}>
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded-sm border border-border bg-surface text-muted">02</span>
                Intellectual Property & Code Ownership
              </h2>
              <p className="text-body text-muted leading-relaxed">
                Unless explicitly marked as open-source under a permissive license (such as MIT or Apache 2.0 on GitHub), all proprietary content—including software architecture diagrams, graphical assets, brand design, project case studies, and editorial articles—remains the sole intellectual property of Dheeraj Carpenter.
              </p>
              <Card className="p-4 bg-surface/50 border-border text-small text-muted space-y-1">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Open Source Code Snippets
                </p>
                <p>
                  Any code snippets provided in the blog or technical notes are intended for educational and reference purposes. You may freely study and apply these principles in your own applications under standard fair use.
                </p>
              </Card>
            </section>
          </AnimateIn>

          {/* Section 3 */}
          <AnimateIn from="up" distance={12} delay={0.25}>
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded-sm border border-border bg-surface text-muted">03</span>
                Consulting & Freelance Engagements
              </h2>
              <p className="text-body text-muted leading-relaxed">
                Inquiries initiated through the contact form, email, or direct outreach do not establish an attorney-client, agency, employment, or contractual obligation. Formal freelance and engineering consulting relationships are established solely through written and countersigned Master Services Agreements (MSA) or Statements of Work (SOW) detailing scope, timelines, IP assignment, and milestone payments.
              </p>
            </section>
          </AnimateIn>

          {/* Section 4 */}
          <AnimateIn from="up" distance={12} delay={0.3}>
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded-sm border border-border bg-surface text-muted">04</span>
                Acceptable Use & Security
              </h2>
              <p className="text-body text-muted leading-relaxed">
                You agree to use this website solely for lawful purposes. You agree not to engage in:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-small text-muted">
                <li>Automated scraping, harvesting, or extraction of private contact details without explicit consent.</li>
                <li>Denial-of-service attempts, probe scans, or deliberate injection of malicious payloads into contact endpoints.</li>
                <li>Impersonation of Dheeraj Carpenter or misrepresentation of affiliation with our software projects.</li>
              </ul>
            </section>
          </AnimateIn>

          {/* Section 5 */}
          <AnimateIn from="up" distance={12} delay={0.35}>
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded-sm border border-border bg-surface text-muted">05</span>
                External Links & Third-Party Platforms
              </h2>
              <p className="text-body text-muted leading-relaxed">
                This website includes outbound hyperlinks to third-party platforms such as GitHub, Vercel, LinkedIn, and external project demos. We do not exercise operational control over external websites and assume no liability for their terms, privacy practices, or availability.
              </p>
            </section>
          </AnimateIn>

          {/* Section 6 */}
          <AnimateIn from="up" distance={12} delay={0.4}>
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded-sm border border-border bg-surface text-muted">06</span>
                Limitation of Liability & Warranty Disclaimer
              </h2>
              <Card className="p-4 bg-surface/30 border-border text-small text-muted space-y-2">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span>As-Is Provision</span>
                </div>
                <p>
                  This website, including its live code demonstrations, preview builds, and technical documentation, is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any kind, whether express or implied. Under no circumstances will Dheeraj Carpenter be held liable for indirect, punitive, or consequential damages arising from site access or reliance on published content.
                </p>
              </Card>
            </section>
          </AnimateIn>

          {/* Section 7 */}
          <AnimateIn from="up" distance={12} delay={0.45}>
            <section className="space-y-3 border-t border-border/60 pt-8">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded-sm border border-border bg-surface text-muted">07</span>
                Contact & Legal Inquiries
              </h2>
              <p className="text-body text-muted leading-relaxed">
                If you have questions regarding these terms, project agreements, or intellectual property rights, please reach out directly:
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-small font-semibold hover:opacity-90 transition-opacity"
                >
                  <Mail className="h-4 w-4" />
                  Contact Form
                </Link>
                <a
                  href="mailto:dheerajcarpenter@gmail.com"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface text-small font-medium text-foreground hover:bg-surface-raised transition-colors"
                >
                  dheerajcarpenter@gmail.com
                </a>
              </div>
            </section>
          </AnimateIn>
        </div>
      </Container>
    </div>
  );
}
