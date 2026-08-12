"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Search, X, Briefcase, Calendar, Layers, Mail, User, Command, ArrowRight, Loader2 } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  category: "projects" | "experience" | "skills" | "messages" | "pages";
  subtitle?: string;
  href: string;
}

export function GlobalSearch() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick navigation pages
  const systemPages: SearchResult[] = [
    { id: "overview", title: "Overview / Dashboard", category: "pages", href: "/admin" },
    { id: "content", title: "Content Manager Hub", category: "pages", href: "/admin/content" },
    { id: "notifications", title: "Public Announcements & Notifications", category: "pages", href: "/admin/notifications" },
    { id: "media", title: "Media Library", category: "pages", href: "/admin/media" },
    { id: "messages", title: "Contact Messages Inbox", category: "pages", href: "/admin/messages" },
    { id: "seo", title: "SEO Metadata Settings", category: "pages", href: "/admin/seo" },
    { id: "analytics", title: "Analytics Dashboard", category: "pages", href: "/admin/analytics" },
    { id: "security", title: "Security settings & passwords", category: "pages", href: "/admin/security" },
    { id: "backups", title: "Backup & Export Center", category: "pages", href: "/admin/backups" },
    { id: "users", title: "User Accounts Manager", category: "pages", href: "/admin/users" },
  ];

  // Hotkey listener: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Run live queries as user types
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const searchResults: SearchResult[] = [];

        // 1. Query Projects
        const { data: projects } = await supabase
          .from("projects")
          .select("id, title, slug")
          .ilike("title", `%${query}%`)
          .limit(3);

        if (projects) {
          projects.forEach((p) => {
            searchResults.push({
              id: p.id,
              title: p.title,
              category: "projects",
              subtitle: `/projects/${p.slug}`,
              href: `/admin/projects`, // Routes to projects listing where they edit
            });
          });
        }

        // 2. Query Experience
        const { data: experience } = await supabase
          .from("experience")
          .select("id, role, organization")
          .or(`role.ilike.%${query}%,organization.ilike.%${query}%`)
          .limit(3);

        if (experience) {
          experience.forEach((exp) => {
            searchResults.push({
              id: exp.id,
              title: exp.role,
              category: "experience",
              subtitle: exp.organization,
              href: `/admin/experience`,
            });
          });
        }

        // 3. Query Skills
        const { data: skills } = await supabase
          .from("skills")
          .select("id, name, category")
          .ilike("name", `%${query}%`)
          .limit(3);

        if (skills) {
          skills.forEach((s) => {
            searchResults.push({
              id: s.id,
              title: s.name,
              category: "skills",
              subtitle: s.category,
              href: `/admin/skills`,
            });
          });
        }

        // 4. Query Messages
        const { data: messages } = await supabase
          .from("contact_submissions")
          .select("id, name, subject")
          .or(`name.ilike.%${query}%,subject.ilike.%${query}%`)
          .limit(3);

        if (messages) {
          messages.forEach((m) => {
            searchResults.push({
              id: m.id,
              title: m.subject || "(No Subject)",
              category: "messages",
              subtitle: `From: ${m.name}`,
              href: `/admin/messages`,
            });
          });
        }

        // 5. Filter local system pages
        const matchedPages = systemPages.filter(
          (page) =>
            page.title.toLowerCase().includes(query.toLowerCase()) ||
            page.href.toLowerCase().includes(query.toLowerCase())
        );
        searchResults.push(...matchedPages.slice(0, 3));

        setResults(searchResults);
      } catch (err) {
        console.error("Search query error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "projects":
        return <Briefcase className="h-4 w-4 shrink-0 text-muted" />;
      case "experience":
        return <Calendar className="h-4 w-4 shrink-0 text-muted" />;
      case "skills":
        return <Layers className="h-4 w-4 shrink-0 text-muted" />;
      case "messages":
        return <Mail className="h-4 w-4 shrink-0 text-muted" />;
      case "pages":
      default:
        return <ArrowRight className="h-4 w-4 shrink-0 text-muted" />;
    }
  };

  return (
    <>
      {/* Header Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 border border-border bg-surface px-3 py-1.5 rounded-sm hover:bg-surface/80 transition-colors text-muted hover:text-foreground text-caption"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline font-medium">Search CMS...</span>
        <div className="hidden lg:flex items-center space-x-0.5 border border-border bg-background px-1 py-0.2 rounded-sm text-[9px] font-bold">
          <Command className="h-2 w-2" />
          <span>K</span>
        </div>
      </button>

      {/* Backdrop Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4 md:pt-32">
          <div
            ref={modalRef}
            className="bg-background border border-border w-full max-w-[600px] rounded-sm overflow-hidden flex flex-col shadow-2xl animate-dialog-enter"
          >
            {/* Input Header */}
            <div className="flex items-center border-b border-border px-4 py-3 bg-surface/30">
              <Search className="h-5 w-5 text-muted mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search projects, skills, inbox, pages..."
                className="w-full bg-transparent border-0 outline-0 ring-0 text-body text-foreground placeholder-muted"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-surface border border-border rounded-sm transition-colors ml-3"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results Body */}
            <div className="max-h-[360px] overflow-y-auto p-2">
              {loading ? (
                <div className="flex items-center justify-center py-12 space-x-2 text-caption text-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Searching databases...</span>
                </div>
              ) : query === "" ? (
                /* Default Navigation Suggestions */
                <div className="space-y-2">
                  <div className="px-3 py-1.5 text-[9px] font-bold text-muted uppercase tracking-wider">
                    Quick Navigation
                  </div>
                  <div className="grid grid-cols-2 gap-1 pb-2">
                    {systemPages.slice(0, 6).map((page) => (
                      <button
                        key={page.id}
                        onClick={() => handleSelect(page.href)}
                        className="flex items-center space-x-3 p-3 border border-border rounded-sm hover:bg-surface transition-colors text-left text-small font-semibold text-foreground"
                      >
                        {getCategoryIcon(page.category)}
                        <span className="truncate">{page.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <div className="py-12 text-center text-muted text-small">
                  No matches found for &quot;<span className="font-semibold text-foreground">{query}</span>&quot;
                </div>
              ) : (
                /* Matches List */
                <div className="space-y-1">
                  <div className="px-3 py-1.5 text-[9px] font-bold text-muted uppercase tracking-wider border-b border-border/50 mb-1">
                    Matching Results ({results.length})
                  </div>
                  {results.map((res) => (
                    <button
                      key={`${res.category}-${res.id}`}
                      onClick={() => handleSelect(res.href)}
                      className="w-full flex items-center justify-between p-3 border border-border hover:border-foreground rounded-sm hover:bg-surface/50 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        {getCategoryIcon(res.category)}
                        <div className="min-w-0">
                          <span className="text-small font-bold text-foreground block truncate">
                            {res.title}
                          </span>
                          {res.subtitle && (
                            <span className="text-[10px] text-muted block truncate">
                              {res.subtitle}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[9px] font-bold border border-border px-2 py-0.5 rounded-sm uppercase tracking-wider text-muted shrink-0 capitalize ml-3">
                        {res.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-4 py-2 bg-surface/20 flex justify-between items-center text-[10px] text-muted font-medium">
              <span>ESC to close</span>
              <span>Click or Enter to select</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
