"use client";

import { useState } from "react";
import type { AdminNote } from "@/types/database";
import {
  createAdminNote,
  updateAdminNote,
  deleteAdminNote,
} from "@/lib/data/actions";
import { Button, Input, Textarea, Card, Badge } from "@/components/ui";
import { Plus, Trash2, Pin, CheckSquare, Square, StickyNote, Copy, Check } from "lucide-react";

interface NotesManagerProps {
  initialNotes: AdminNote[];
}

export function NotesManager({ initialNotes }: NotesManagerProps) {
  const [notes, setNotes] = useState<AdminNote[]>(initialNotes);
  const [editingNote, setEditingNote] = useState<Partial<AdminNote> | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict 50 KB limit validation (51,200 bytes)
    if (file.size > 51200) {
      setImageError(`File size (${(file.size / 1024).toFixed(1)} KB) exceeds max 50 KB limit!`);
      e.target.value = "";
      return;
    }

    setImageError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setEditingNote((prev) => (prev ? { ...prev, image_url: base64 } : prev));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote?.title || !editingNote?.content) return;

    setLoading(true);

    try {
      if (editingNote.id) {
        setNotes((prev) =>
          prev.map((n) => (n.id === editingNote.id ? ({ ...n, ...editingNote } as AdminNote) : n))
        );
        await updateAdminNote(editingNote.id, {
          title: editingNote.title,
          content: editingNote.content,
          pinned: Boolean(editingNote.pinned),
          completed: Boolean(editingNote.completed),
          image_url: editingNote.image_url || null,
        });
      } else {
        const created = await createAdminNote({
          title: editingNote.title,
          content: editingNote.content,
          pinned: Boolean(editingNote.pinned),
          completed: Boolean(editingNote.completed),
          image_url: editingNote.image_url || null,
        });
        if (created) {
          setNotes((prev) => [created as AdminNote, ...prev]);
        }
      }
    } catch (err) {
      console.error("Error saving note:", err);
    } finally {
      setEditingNote(null);
      setLoading(false);
      setImageError(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    setLoading(true);
    try {
      await deleteAdminNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePin = async (note: AdminNote) => {
    const nextVal = !note.pinned;
    setNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, pinned: nextVal } : n)));
    try {
      await updateAdminNote(note.id, { pinned: nextVal });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCompleted = async (note: AdminNote) => {
    const nextVal = !note.completed;
    setNotes((prev) => prev.map((n) => (n.id === note.id ? { ...n, completed: nextVal } : n)));
    try {
      await updateAdminNote(note.id, { completed: nextVal });
    } catch (err) {
      console.error(err);
    }
  };

  const copyContent = (note: AdminNote) => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-h2 font-bold tracking-tight">Quick Notes & Scratchpad</h2>
          <p className="text-body text-muted mt-1">
            Personal admin scratchpad for task checklists, draft copy, and project ideas.
          </p>
        </div>
        <Button
          onClick={() =>
            setEditingNote({
              title: "",
              content: "",
              pinned: false,
              completed: false,
            })
          }
          className="shrink-0 inline-flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>

      {/* Editor Modal / Form */}
      {editingNote && (
        <Card className="p-6 border-2 border-foreground/20 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <h3 className="text-h3 font-bold">
              {editingNote.id ? "Edit Note" : "New Quick Note"}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setEditingNote(null)}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <label className="text-small font-semibold">Title</label>
              <Input
                required
                value={editingNote.title || ""}
                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                placeholder="e.g. Next.js 15 upgrade ideas..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-small font-semibold">Content</label>
              <Textarea
                required
                rows={5}
                value={editingNote.content || ""}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                placeholder="Write your note, code snippet, or checklist..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-small font-semibold flex items-center justify-between">
                <span>Attach Image (Square / Rectangle, Max 50 KB)</span>
                {imageError && <span className="text-red-500 text-xs font-semibold">{imageError}</span>}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="text-small text-muted block w-full file:mr-4 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-small file:font-semibold file:bg-surface file:text-foreground hover:file:bg-surface/80"
              />
              {editingNote.image_url && (
                <div className="relative mt-2 max-h-40 overflow-hidden rounded-sm border border-border">
                  <img src={editingNote.image_url} alt="Note Attachment" className="h-32 w-auto object-cover rounded-sm" />
                  <button
                    type="button"
                    onClick={() => setEditingNote({ ...editingNote, image_url: null })}
                    className="absolute top-1 right-1 bg-background/80 text-foreground text-xs px-2 py-0.5 rounded border border-border font-bold hover:bg-background"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingNote.pinned ?? false}
                  onChange={(e) => setEditingNote({ ...editingNote, pinned: e.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
                <span className="text-small font-medium">Pin to Top</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => setEditingNote(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : editingNote.id ? "Update Note" : "Save Note"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Grid of Notes */}
      {notes.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-sm text-muted">
          <StickyNote className="mx-auto h-8 w-8 mb-3 opacity-50" />
          <p className="text-body font-medium">No notes created yet.</p>
          <p className="text-small text-muted mt-1">Click "Add Note" above to write quick thoughts or task checklists.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Card
              key={note.id}
              className={`p-5 flex flex-col justify-between space-y-4 border transition-all ${
                note.pinned ? "border-foreground/40 bg-surface/80" : "border-border bg-surface/30"
              }`}
            >
              <div className="space-y-3">
                {note.image_url && (
                  <div className="overflow-hidden rounded-sm border border-border max-h-48">
                    <img src={note.image_url} alt={note.title} className="w-full h-36 object-cover" />
                  </div>
                )}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleCompleted(note)}
                      className="text-muted hover:text-foreground transition-colors"
                    >
                      {note.completed ? (
                        <CheckSquare className="h-5 w-5 text-foreground" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                    <h3
                      className={`text-body font-bold ${
                        note.completed ? "line-through text-muted" : "text-foreground"
                      }`}
                    >
                      {note.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => togglePin(note)}
                    className="text-muted hover:text-foreground transition-colors"
                    title={note.pinned ? "Unpin Note" : "Pin Note"}
                  >
                    <Pin className={`h-4 w-4 ${note.pinned ? "fill-foreground text-foreground" : ""}`} />
                  </button>
                </div>

                <p className="text-body-sm text-muted whitespace-pre-line leading-relaxed">
                  {note.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border mt-auto text-caption text-muted">
                <span>
                  {new Date(note.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => copyContent(note)} title="Copy Content">
                    {copiedId === note.id ? <Check className="h-3.5 w-3.5 text-foreground" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingNote(note)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(note.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
