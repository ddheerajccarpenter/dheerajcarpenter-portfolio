"use client";

import { useState } from "react";
import { createAdminNote, toggleNoteStatus, deleteAdminNote } from "@/lib/data/actions";
import { useAdminToast } from "@/components/admin/admin-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  StickyNote,
  Loader2,
  ArrowRight,
  Pin,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NoteItem {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  completed: boolean;
  created_at: string;
}

export function DashboardScratchpad({ initialNotes }: { initialNotes: NoteItem[] }) {
  const { toast } = useAdminToast();
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [newTitle, setNewTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "done">("active");

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await createAdminNote({
        title: newTitle.trim(),
        content: "",
        pinned: false,
        completed: false,
      });

      if (created) {
        setNotes((prev) => [created, ...prev]);
        setNewTitle("");
        toast({
          title: "Task Added",
          description: `"${created.title}" added to scratchpad.`,
          variant: "success",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleDone = async (note: NoteItem) => {
    const nextCompleted = !note.completed;
    // Optimistic UI update
    setNotes((prev) =>
      prev.map((n) => (n.id === note.id ? { ...n, completed: nextCompleted } : n))
    );

    try {
      await toggleNoteStatus(note.id, nextCompleted);
    } catch {
      // Revert on error
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, completed: note.completed } : n))
      );
      toast({
        title: "Update Failed",
        description: "Could not update task status",
        variant: "error",
      });
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes((prev) => prev.filter((n) => n.id !== id));
    try {
      await deleteAdminNote(id);
    } catch {
      toast({
        title: "Delete Failed",
        description: "Could not remove note",
        variant: "error",
      });
    }
  };

  const filteredNotes = notes.filter((n) => {
    if (filter === "active") return !n.completed;
    if (filter === "done") return n.completed;
    return true;
  });

  const activeCount = notes.filter((n) => !n.completed).length;

  return (
    <Card className="liquid-glass-card p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-surface border border-border shadow-2xs">
            <StickyNote className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-body font-bold tracking-tight text-foreground">
                Quick Scratchpad & Tasks
              </h2>
              <Badge variant="pill" className="text-[10px] px-2 py-0">
                {activeCount} Active
              </Badge>
            </div>
            <p className="text-caption text-muted">
              Live notepad synced with your portfolio CMS
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 bg-surface p-1 rounded-lg border border-border">
          <button
            onClick={() => setFilter("active")}
            className={cn(
              "text-caption px-2 py-0.5 rounded-md font-medium transition-colors",
              filter === "active"
                ? "bg-background text-foreground font-semibold shadow-2xs"
                : "text-muted hover:text-foreground"
            )}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "text-caption px-2 py-0.5 rounded-md font-medium transition-colors",
              filter === "all"
                ? "bg-background text-foreground font-semibold shadow-2xs"
                : "text-muted hover:text-foreground"
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter("done")}
            className={cn(
              "text-caption px-2 py-0.5 rounded-md font-medium transition-colors",
              filter === "done"
                ? "bg-background text-foreground font-semibold shadow-2xs"
                : "text-muted hover:text-foreground"
            )}
          >
            Done
          </button>
        </div>
      </div>

      {/* Quick Add Form */}
      <form onSubmit={handleAddNote} className="flex gap-2">
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Type a new to-do or quick idea..."
          className="h-10 text-small bg-surface/80"
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={isSubmitting || !newTitle.trim()}
          className="h-10 px-4 shrink-0 animate-btn-scale"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          <span className="hidden sm:inline ml-1">Add</span>
        </Button>
      </form>

      {/* Tasks List */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-border rounded-lg text-caption text-muted">
            {filter === "done"
              ? "No completed tasks yet."
              : "All caught up! Type above to add a new note."}
          </div>
        ) : (
          filteredNotes.slice(0, 8).map((note) => (
            <div
              key={note.id}
              onClick={() => handleToggleDone(note)}
              className={cn(
                "group flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer select-none",
                note.completed
                  ? "bg-surface/40 border-border/50 opacity-60"
                  : "bg-surface/70 border-border hover:border-border-strong hover:bg-surface"
              )}
            >
              <div className="flex items-center space-x-3 min-w-0 pr-2">
                {note.completed ? (
                  <CheckSquare className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <Square className="h-4 w-4 text-muted shrink-0 group-hover:text-foreground" />
                )}
                <span
                  className={cn(
                    "text-small truncate",
                    note.completed
                      ? "line-through text-muted"
                      : "text-foreground font-medium"
                  )}
                >
                  {note.title}
                </span>
                {note.pinned && (
                  <Pin className="h-3 w-3 text-amber-500 shrink-0 fill-amber-500 rotate-45" />
                )}
              </div>

              <div className="flex items-center space-x-1 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleDelete(note.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-red-500 transition-opacity"
                  title="Delete note"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-2 border-t border-border flex items-center justify-between">
        <span className="text-caption text-muted">
          Showing {Math.min(filteredNotes.length, 8)} of {notes.length} notes
        </span>
        <Link
          href="/admin/notes"
          className="inline-flex items-center text-caption font-semibold text-foreground hover:underline underline-offset-4"
        >
          <span>Open Full Scratchpad</span>
          <ArrowRight className="h-3 w-3 ml-1" />
        </Link>
      </div>
    </Card>
  );
}
