import { getAdminNotes } from "@/lib/data/public";
import { NotesManager } from "@/components/admin/notes-manager";

export const revalidate = 0;

export default async function AdminNotesPage() {
  const notes = await getAdminNotes();

  return (
    <div className="p-6 md:p-8">
      <NotesManager initialNotes={notes} />
    </div>
  );
}
