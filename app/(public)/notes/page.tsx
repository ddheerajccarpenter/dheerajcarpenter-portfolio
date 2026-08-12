import { getAdminNotes } from "@/lib/data/public";
import { Container } from "@/components/layout/container";
import { Card, Badge } from "@/components/ui";
import { SkeletonWrapper } from "@/components/ui/skeleton-wrapper";
import { AnimateIn } from "@/components/ui/animate-in";

export const revalidate = 0; // Dynamic rendering for instant CMS updates
export const dynamic = "force-dynamic";

export default async function PublicNotesPage() {
  const notes = await getAdminNotes();

  return (
    <SkeletonWrapper pageType="projects">
      <div className="py-12 md:py-16 space-y-12">
        <Container className="space-y-4">
          <AnimateIn from="up" distance={20} duration={0.6} viewport={false}>
            <h1 className="text-h1 font-bold tracking-tight sm:text-[3rem]">
              Notes & Thoughts
            </h1>
          </AnimateIn>
          <AnimateIn from="up" distance={14} delay={0.12} viewport={false}>
            <p className="prose-readable text-body-lg text-muted">
              Engineering scratchpad, task logs, project ideas, and technical notes.
            </p>
          </AnimateIn>
        </Container>

        <Container>
          {notes.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-sm text-muted">
              <i className="fi fi-br-copy text-2xl mb-3 block text-foreground" aria-hidden="true" />
              <p className="text-body font-medium">No notes published yet.</p>
              <p className="text-small text-muted mt-1">Check back soon for new task updates and technical logs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note, index) => (
                <AnimateIn key={note.id} from="up" distance={20} staggerIndex={index}>
                  <Card
                    className={`p-6 flex flex-col justify-between space-y-4 h-full border transition-all hover:border-border-strong ${
                      note.pinned ? "border-foreground/30 bg-surface/80 shadow-xs" : "border-border bg-surface/30"
                    }`}
                  >
                    <div className="space-y-3">
                      {note.image_url && (
                        <div className="overflow-hidden rounded-sm border border-border max-h-48 mb-2">
                          <img src={note.image_url} alt={note.title} className="w-full h-36 object-cover" />
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-h3 font-bold ${note.completed ? "line-through text-muted" : "text-foreground"}`}>
                          {note.title}
                        </h3>
                        {note.pinned && (
                          <Badge className="shrink-0 text-caption font-semibold">
                            Pinned
                          </Badge>
                        )}
                      </div>

                      <p className="text-body-sm text-muted whitespace-pre-line leading-relaxed">
                        {note.content}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border mt-auto flex items-center justify-between text-caption text-muted font-medium">
                      <span>
                        {new Date(note.updated_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {note.completed && (
                        <span className="text-emerald-500 font-semibold flex items-center">
                          <i className="fi fi-br-check-circle mr-1 text-xs" aria-hidden="true" />
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
