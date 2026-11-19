export interface FAQItem {
  id: string;
  category: "all" | "background" | "tech" | "contact";
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
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
