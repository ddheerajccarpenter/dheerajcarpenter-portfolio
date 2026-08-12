"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { markSubmissionRead, deleteSubmission } from "@/lib/data/actions";
import { Button } from "@/components/ui";
import { MailOpen, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Submission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function SubmissionsTable({ submissions }: { submissions: Submission[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Submission[]>(submissions);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    setItems(submissions);
  }, [submissions]);

  const handleMarkRead = async (id: string) => {
    setLoadingId(id);
    try {
      await markSubmissionRead(id);
      setItems((prev) => prev.map((s) => (s.id === id ? { ...s, is_read: true } : s)));
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to mark as read");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    setLoadingId(id);
    try {
      await deleteSubmission(id);
      setItems((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete submission");
    } finally {
      setLoadingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="border border-dashed border-border p-12 text-center text-muted rounded-sm">
        No submissions received yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-border rounded-sm">
      <table className="w-full text-left border-collapse text-small">
        <thead>
          <tr className="border-b border-border bg-surface text-foreground font-semibold">
            <th className="p-4">Date</th>
            <th className="p-4">From</th>
            <th className="p-4">Subject</th>
            <th className="p-4">Message</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((sub) => {
            const isLoading = loadingId === sub.id;
            return (
              <tr
                key={sub.id}
                className={cn(
                  "hover:bg-surface/50 transition-colors",
                  !sub.is_read ? "font-semibold bg-surface/30" : "text-muted"
                )}
              >
                <td className="p-4 whitespace-nowrap">
                  {new Date(sub.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "2-digit",
                  })}
                </td>
                <td className="p-4">
                  <div className="text-foreground">{sub.name}</div>
                  <div className="text-caption text-muted font-normal">{sub.email}</div>
                </td>
                <td className="p-4 max-w-[200px] truncate text-foreground">
                  {sub.subject || "—"}
                </td>
                <td className="p-4 max-w-[300px] truncate" title={sub.message}>
                  {sub.message}
                </td>
                <td className="p-4 text-right space-x-2 whitespace-nowrap">
                  {!sub.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkRead(sub.id)}
                      disabled={isLoading}
                      title="Mark as read"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MailOpen className="h-4 w-4 text-foreground" />
                      )}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(sub.id)}
                    disabled={isLoading}
                    title="Delete"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-foreground" />
                    )}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


