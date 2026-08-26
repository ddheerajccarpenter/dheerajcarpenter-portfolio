import { getAdminNotes } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Card, Badge } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";
import { CheckCircle2, Pin } from "lucide-react";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function PublicNotesPage() {
  const notes = await getAdminNotes();

  return (
    <SkeletonWrapper pageType="projects">
      <div className="py-16 md:py-24 space-y-12">
        <Container className="space-y-4">
          <AnimateIn from="up" distance={16} duration={0.4} viewport={false}>
            <div className="inline-flex items-center gap-2 text-caption font-bold uppercase tracking-[0.14em] text-muted mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground inline-block opacity-60" />
              Engineering Logs & Scratchpad
            </div>
            <h1 className="text-h1 font-bold tracking-tight sm:text-[3rem] text-editorial-gradient">
              Notes & Thoughts
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={12} delay={0.1} viewport={false}>
            <p className="prose-readable text-body-lg text-muted">
              Engineering scratchpad, task logs, project ideas, and technical development notes.
            </p>
          </AnimateIn>
        </Container>

        <Container>
          {notes.length === 0 ? (
            <div className="p-16 text-center border border-dashed border-border rounded-2xl text-muted bg-surface/30">
              <p className="text-body font-medium">No notes published yet.</p>
              <p className="text-small text-muted mt-1">Check back soon for new task updates and technical logs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note, index) => (
                <AnimateIn key={note.id} from="up" distance={16} staggerIndex={index}>
                  <Card
                    className={`p-6 flex flex-col justify-between space-y-4 h-full tactile-card ${
                      note.pinned ? "border-border-strong shadow-xs" : ""
                    }`}
                  >
                    <div className="space-y-3">
                      {note.image_url && (
                        <div className="overflow-hidden rounded-xl border border-border max-h-48 mb-2 bg-surface-overlay">
                          <img src={note.image_url} alt={note.title} className="w-full h-36 object-cover" />
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-h3 font-bold ${note.completed ? "line-through text-muted" : "text-foreground"}`}>
                          {note.title}
                        </h3>
                        {note.pinned && (
                          <Badge variant="pill" className="shrink-0 gap-1 font-mono text-[10px]">
                            <Pin className="h-2.5 w-2.5" />
                            Pinned
                          </Badge>
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
