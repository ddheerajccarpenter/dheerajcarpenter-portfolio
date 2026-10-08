import { Container } from "@/components/layout/container";
import { AnimateIn } from "@/components/ui/animate-in";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { HelpCircle, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Dheeraj Carpenter",
  description: "Answers to frequently asked questions about full-stack engineering, tech stack, freelance availability, turnaround time, and collaboration.",
};

export default function FaqPage() {
  return (
    <div className="py-12 md:py-20 space-y-12">
      <Container className="space-y-4">
        <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
          <div className="flex items-center gap-2 text-muted mono-eyebrow mb-2">
            <HelpCircle className="h-3.5 w-3.5 text-foreground/70" />
            <span>Common Inquiries</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h1>
        </AnimateIn>
        <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
          <p className="prose-readable text-body-lg text-muted max-w-[640px]">
            Everything you need to know about working together, project scopes, turnaround times, and engineering stack.
          </p>
        </AnimateIn>
      </Container>

      <Container>
        <div className="max-w-3xl space-y-12">
          <FaqAccordion />

          {/* Bottom CTA Box */}
          <div className="p-8 rounded-2xl border border-border bg-surface/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-foreground">Have a question not listed here?</h3>
              <p className="text-small text-muted">
                Feel free to reach out directly. I am happy to discuss your specific technical needs.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background text-small font-semibold hover:opacity-90 transition-opacity shrink-0"
            >
              <Mail className="h-4 w-4" />
              Get in Touch
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
