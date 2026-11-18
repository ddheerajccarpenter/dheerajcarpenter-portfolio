"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { ChevronDown, Sparkles, Code2, GraduationCap, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FAQItem {
  id: string;
  category: "all" | "background" | "tech" | "contact";
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "studies",
    category: "background",
    question: "What are you studying and what are your main interests?",
    answer:
      "I am an engineering student with a deep passion for technology, coding, video editing, and creative design. I enjoy building modern, fast web applications and exploring new technologies while continuously improving my technical skills.",
  },
  {
    id: "tech-stack",
    category: "tech",
    question: "What is your primary technology stack?",
    answer:
      "My primary development stack includes TypeScript, Next.js, React, Tailwind CSS, PostgreSQL, and Supabase. For creative work, interface design, and multimedia, I use Figma and standard digital editing tools.",
  },
  {
    id: "projects",
    category: "tech",
    question: "What kind of projects do you enjoy building?",
    answer:
      "I build full-stack web applications, interactive web tools, and clean content platforms. I focus on clean architecture, responsive layouts, accessibility, and high performance.",
  },
  {
    id: "opportunities",
    category: "background",
    question: "Are you open to internships or collaborative projects?",
    answer:
      "Yes! I am always eager to collaborate on exciting projects, contribute to open-source software, and explore engineering internships or developer opportunities.",
  },
  {
    id: "contact",
    category: "contact",
    question: "How can I get in touch with you?",
    answer:
      "The easiest way is through the Contact page or by emailing me directly at dheerajcarpenter@gmail.com. You can also find my work and repositories on GitHub.",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Questions", icon: Sparkles },
  { id: "background", label: "Background & Studies", icon: GraduationCap },
  { id: "tech", label: "Tech & Stack", icon: Code2 },
  { id: "contact", label: "Contact", icon: Mail },
] as const;

export function FaqAccordion() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    studies: true,
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
      <div className="relative flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer active:scale-95 ${
                isActive
                  ? "text-background font-semibold"
                  : "border border-border bg-surface/50 text-muted hover:text-foreground hover:bg-surface"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="faqCategoryPill"
                  className="absolute inset-0 bg-foreground rounded-full -z-10 shadow-xs"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
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
              className={`transition-all duration-200 border !p-0 overflow-hidden ${
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
