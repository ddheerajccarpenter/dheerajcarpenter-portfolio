"use client";

import { useState } from "react";
import type { PublicNotification } from "@/types/database";
import {
  createPublicNotification,
  updatePublicNotification,
  deletePublicNotification,
} from "@/lib/data/actions";
import { Button, Input, Textarea, Card } from "@/components/ui";
import { useAdminToast } from "@/components/admin/admin-toast";
import { Megaphone, Plus, Trash2, Bell, AlertTriangle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";

interface NotificationsManagerProps {
  initialNotifications: PublicNotification[];
}

export function NotificationsManager({ initialNotifications }: NotificationsManagerProps) {
  const [notifications, setNotifications] = useState<PublicNotification[]>(initialNotifications);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useAdminToast();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "announcement" | "alert" | "success">("announcement");
  const [active, setActive] = useState(true);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSubmitting(true);

    try {
      const created = await createPublicNotification({
        title: title.trim(),
        message: message.trim(),
        type,
        active,
      });

      if (created) {
        setNotifications((prev) => [created, ...prev]);
      }
      toast.success("Notification Broadcasted", `"${title.trim()}" is now live on the public site!`);

      setTitle("");
      setMessage("");
      setType("announcement");
      setActive(true);
      setIsCreating(false);
    } catch (err) {
      const error = err as Error;
      toast.error("Failed to send notification", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (notif: PublicNotification) => {
    const nextActive = !notif.active;
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, active: nextActive } : n))
    );

    try {
      await updatePublicNotification(notif.id, { active: nextActive });
      toast.success(
        nextActive ? "Notification Activated" : "Notification Deactivated",
        `"${notif.title}" is now ${nextActive ? "visible to public visitors" : "hidden"}`
      );
    } catch (err) {
      const error = err as Error;
      toast.error("Failed to update notification status", error.message);
    }
  };

  const handleDelete = async (id: string, notifTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${notifTitle}"?`)) return;

    try {
      await deletePublicNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notification Deleted", `"${notifTitle}" has been removed.`);
    } catch (err) {
      const error = err as Error;
      toast.error("Failed to delete notification", error.message);
    }
  };

  const iconMap = {
    info: <Bell className="h-4 w-4 text-blue-500 shrink-0" />,
    announcement: <Megaphone className="h-4 w-4 text-indigo-500 shrink-0" />,
    alert: <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />,
    success: <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />,
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-h2 font-bold tracking-tight text-foreground flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-foreground" />
            Public Announcements & Notifications
          </h1>
          <p className="text-small text-muted mt-1">
            Broadcast pop-up notifications directly to public website visitors. Users will see active notifications once upon visiting, without repeated pops on page refresh.
          </p>
        </div>
        <Button
          onClick={() => setIsCreating(!isCreating)}
          variant={isCreating ? "secondary" : "primary"}
          className="shrink-0"
        >
          {isCreating ? "Cancel" : <><Plus className="mr-2 h-4 w-4" /> Send Announcement</>}
        </Button>
      </div>

      {/* Creation form */}
      {isCreating && (
        <Card className="p-6 space-y-6 border-foreground/20 animate-scale-in">
          <div className="border-b border-border pb-3">
            <h2 className="text-h3 font-bold text-foreground">Compose Broadcast Notification</h2>
            <p className="text-caption text-muted mt-0.5">
              Broadcast a minimal pop-up announcement to all public site visitors.
            </p>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-caption font-semibold text-foreground">Notification Title</label>
              <Input
                placeholder="e.g. New Project Case Study Released!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-caption font-semibold text-foreground">Message Content</label>
              <Textarea
                placeholder="e.g. Check out the latest AI Fullstack Case Study on the projects page."
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-caption font-semibold text-foreground">Category Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-small text-foreground"
                  disabled={isSubmitting}
                >
                  <option value="announcement">Megaphone / Announcement</option>
                  <option value="info">Info / General Notice</option>
                  <option value="alert">Alert / Warning Notice</option>
                  <option value="success">Success / Achievement</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-caption font-semibold text-foreground">Initial Status</label>
                <select
                  value={active ? "active" : "inactive"}
                  onChange={(e) => setActive(e.target.value === "active")}
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-small text-foreground"
                  disabled={isSubmitting}
                >
                  <option value="active">Active (Broadcast to visitors immediately)</option>
                  <option value="inactive">Draft / Inactive (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsCreating(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Broadcasting...
                  </>
                ) : (
                  "Broadcast to Public Site"
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        <h2 className="text-h3 font-bold tracking-tight text-foreground">
          Broadcast History ({notifications.length})
        </h2>

        {notifications.length === 0 ? (
          <Card className="p-8 text-center text-muted space-y-2">
            <Megaphone className="h-8 w-8 mx-auto text-muted/60" />
            <p className="text-body font-medium text-foreground">No public notifications sent yet</p>
            <p className="text-caption text-muted">Click &quot;Send Announcement&quot; above to compose your first broadcast pop-up.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <Card
                key={notif.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-border hover:border-border-strong transition-all"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-surface border border-border shrink-0 mt-0.5">
                    {iconMap[notif.type]}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-body-lg font-bold text-foreground truncate">{notif.title}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-border bg-surface text-muted">
                        {notif.type}
                      </span>
                      {notif.active ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                          Active Broadcast
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted/20 border border-border text-muted">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-small text-muted leading-relaxed whitespace-pre-line">
                      {notif.message}
                    </p>
                    <p className="text-[11px] text-muted/70">
                      Created: {new Date(notif.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Button
                    size="sm"
                    variant={notif.active ? "secondary" : "primary"}
                    onClick={() => handleToggleActive(notif)}
                  >
                    {notif.active ? (
                      <>
                        <EyeOff className="mr-1.5 h-3.5 w-3.5" /> Deactivate
                      </>
                    ) : (
                      <>
                        <Eye className="mr-1.5 h-3.5 w-3.5" /> Activate
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                    onClick={() => handleDelete(notif.id, notif.title)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
