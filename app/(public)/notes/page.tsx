import { getAdminNotes } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Card, Badge } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { CheckCircle2, Pin } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Engineering Notes & Scratchpad — Dheeraj Carpenter",
  description:
    "Quick technical notes, development logs, project ideas, and snippets by Dheeraj Carpenter.",
  alternates: {
    canonical: "/notes",
  },
  openGraph: {
    title: "Engineering Notes & Scratchpad — Dheeraj Carpenter",
    description:
      "Quick technical notes, development logs, project ideas, and snippets by Dheeraj Carpenter.",
    url: "/notes",
    type: "website",
  },
};

export default async function PublicNotesPage() {
  const notes = await getAdminNotes();

  return (
    <SkeletonWrapper pageType="projects">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Notes", url: "/notes" },
        ]}
      />
      <div className="py-16 md:py-24 space-y-12">
        <Container className="space-y-4">
          <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
            <p className="mono-eyebrow text-muted mb-2">
              Scratchpad
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Notes &amp; Scratchpad
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
            <p className="prose-readable text-body sm:text-body-lg text-muted max-w-[640px] leading-relaxed">
              Quick thoughts, project ideas, learning logs, and technical snippets.
            </p>
          </AnimateIn>
        </Container>

        <Container>
          {notes.length === 0 ? (
            <AnimateIn variant="fade-rise" distance={14}>
              <div className="border border-border p-12 sm:p-16 text-center text-muted rounded-2xl bg-surface/40 space-y-3">
                <Pin className="mx-auto h-10 w-10 text-foreground/50" />
                <h3 className="text-lg font-bold text-foreground">Scratchpad in Progress</h3>
                <p className="text-small text-muted max-w-md mx-auto leading-relaxed">
                  Development snippets, technical logs, and ideas will be shared here. Check back soon.
                </p>
              </div>
            </AnimateIn>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note, index) => (
                <AnimateIn key={note.id} from="up" distance={16} staggerIndex={index}>
                  <Card
                    className={`p-6 flex flex-col justify-between space-y-4 h-full geist-card ${
                      note.pinned ? "border-border-strong shadow-xs" : ""
                    }`}
                  >
                    <div className="space-y-3">
                      {note.image_url && (
                        <div className="overflow-hidden rounded-xl border border-border max-h-48 mb-2 bg-surface-overlay">
                          <img
                            src={note.image_url}
                            alt={note.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-36 object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-h3 font-bold ${note.completed ? "line-through text-muted" : "text-foreground"}`}>
                          {note.title}
                        </h3>
                        {note.pinned && (
                          <span className="notion-tag text-[10px] shrink-0">
                            <Pin className="h-2.5 w-2.5" />
                            Pinned
                          </span>
                        )}
                      </div>

                      <p className="text-small text-muted whitespace-pre-line leading-relaxed">
                        {note.content}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border mt-auto flex items-center justify-between text-caption text-muted font-mono">
                      <span>
                        {new Date(note.updated_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {note.completed && (
                        <span className="text-foreground font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-foreground opacity-80" />
                          Completed
                        </span>
                      )}
                    </div>
                  </Card>
                </AnimateIn>
              ))}
            </div>
          )}
        </Container>
      </div>
    </SkeletonWrapper>
  );
}
