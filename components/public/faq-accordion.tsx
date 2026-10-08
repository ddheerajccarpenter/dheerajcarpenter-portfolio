"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { ChevronDown, Sparkles, Code2, Briefcase, Users2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FAQItem {
  id: string;
  category: "all" | "engineering" | "freelance" | "collaboration";
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "services",
    category: "engineering",
    question: "What engineering and design services do you provide?",
    answer:
      "I specialize in end-to-end full-stack web applications, custom SaaS architectures, high-performance UI engineering, and API integrations. Additionally, I deliver frontend performance audits, design token implementations (Vercel & Apple aesthetic), database schema migrations, and admin dashboard CMS platforms.",
  },
  {
    id: "tech-stack",
    category: "engineering",
    question: "What is your primary technology stack?",
    answer:
      "My core production stack is TypeScript, Next.js (App Router, Server Actions), React 19, Tailwind CSS, PostgreSQL, Supabase, and Vercel. For interactive micro-interactions and high-performance physics, I leverage Motion and Web APIs, always with a focus on low GPU overhead and fast LCP times.",
  },
  {
    id: "availability",
    category: "freelance",
    question: "Are you available for freelance contracts or full-time roles?",
    answer:
      "Yes. I take on selective freelance contracts, technical architecture consultations, and senior frontend/full-stack roles. I intentionally cap the number of active clients at any given time to ensure rigorous attention to code quality and delivery deadlines.",
  },
  {
    id: "timeline",
    category: "freelance",
    question: "What is your typical turnaround time for a project?",
    answer:
      "Timelines are structured around iterative sprints. A focused MVP or marketing platform typically spans 2 to 4 weeks. Complex full-stack platforms with custom admin CMS, authentication, payment gateways, and database integrations take between 4 to 8 weeks.",
  },
  {
    id: "pricing",
    category: "freelance",
    question: "How do you handle project pricing and billing?",
    answer:
      "Engagements are usually structured as milestone-based fixed contracts (50% upfront, remaining 50% upon milestone completion and deployment) or weekly sprint retainers for agile product teams. Detailed scope estimates are provided upfront with zero hidden costs.",
  },
  {
    id: "nda",
    category: "collaboration",
    question: "Can we sign a Mutual NDA before discussing our product?",
    answer:
      "Absolutely. I regularly sign standard mutual non-disclosure agreements before reviewing proprietary pitch decks, business logic, or codebase repositories.",
  },
  {
    id: "post-launch",
    category: "collaboration",
    question: "Do you offer post-launch maintenance and support?",
    answer:
      "Yes. Every build includes a 30-day post-launch warranty for critical bug fixes and environment adjustments. For ongoing feature iterations, database optimization, and performance monitoring, monthly maintenance retainers are available.",
  },
  {
    id: "get-started",
    category: "collaboration",
    question: "How do we get started on a project together?",
    answer:
      "Reach out through the Contact page or email me directly at dheerajcarpenter@gmail.com with your project brief, preferred timeline, and budget. I will review the scope and respond within 24 hours to schedule a 30-minute discovery call.",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Questions", icon: Sparkles },
  { id: "engineering", label: "Engineering & Stack", icon: Code2 },
  { id: "freelance", label: "Freelance & Pricing", icon: Briefcase },
  { id: "collaboration", label: "Collaboration & Support", icon: Users2 },
] as const;

export function FaqAccordion() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    services: true,
    "tech-stack": true,
  });

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredItems = FAQ_ITEMS.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  return (
    <div className="space-y-8">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-foreground text-background shadow-xs font-semibold"
                  : "border border-border bg-surface/50 text-muted hover:text-foreground hover:bg-surface"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Accordion Cards */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isOpen = Boolean(openIds[item.id]);
          return (
            <Card
              key={item.id}
              className={`transition-all duration-200 border ${
                isOpen ? "border-foreground/30 bg-surface/80" : "border-border/80 bg-surface/30 hover:border-border"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="flex items-center justify-between w-full p-5 text-left cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="text-base sm:text-lg font-semibold text-foreground pr-4">
                  {item.question}
                </span>
                <span
                  className={`p-1.5 rounded-full border border-border/80 bg-surface text-muted transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 text-foreground" : ""
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 text-small text-muted leading-relaxed border-t border-border/40 mt-1">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
