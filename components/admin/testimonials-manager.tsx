"use client";

import { useState } from "react";
import type { Testimonial } from "@/types/database";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/data/actions";
import { Button, Input, Textarea, Card, Badge } from "@/components/ui";
import { Plus, Trash2, Edit2, Star, Quote, ArrowUpDown, Check, Sparkles } from "lucide-react";

import { useAdminToast } from "@/components/admin/admin-toast";

interface TestimonialsManagerProps {
  initialTestimonials: Testimonial[];
}

export function TestimonialsManager({ initialTestimonials }: TestimonialsManagerProps) {
  const [items, setItems] = useState<Testimonial[]>(initialTestimonials);
  const [editingItem, setEditingItem] = useState<Partial<Testimonial> | null>(null);
  const [loading, setLoading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const toast = useAdminToast();

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 51200) {
      toast.error("Avatar too large", `Size (${(file.size / 1024).toFixed(1)} KB) exceeds 50 KB limit`);
      e.target.value = "";
      return;
    }

    setAvatarError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setEditingItem((prev) => (prev ? { ...prev, avatar_url: base64 } : prev));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.quote || !editingItem?.author_name || !editingItem?.author_role) return;

    setLoading(true);

    try {
      if (editingItem.id) {
        setItems((prev) =>
          prev.map((i) => (i.id === editingItem.id ? ({ ...i, ...editingItem } as Testimonial) : i))
        );
        await updateTestimonial(editingItem.id, {
          quote: editingItem.quote,
          author_name: editingItem.author_name,
          author_role: editingItem.author_role,
          company: editingItem.company || null,
          avatar_url: editingItem.avatar_url || null,
          featured: Boolean(editingItem.featured),
          order: Number(editingItem.order ?? 0),
        });
        toast.success("Testimonial updated", editingItem.author_name);
      } else {
        const created = await createTestimonial({
          quote: editingItem.quote,
          author_name: editingItem.author_name,
          author_role: editingItem.author_role,
          company: editingItem.company || null,
          avatar_url: editingItem.avatar_url || null,
          featured: Boolean(editingItem.featured),
          order: items.length,
        });
        if (created) {
          setItems((prev) => [...prev, created as Testimonial]);
        }
        toast.success("Testimonial created", editingItem.author_name);
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error("Failed to save testimonial", error.message);
    } finally {
      setEditingItem(null);
      setLoading(false);
      setAvatarError(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setLoading(true);
    try {
      await deleteTestimonial(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Testimonial deleted");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error("Failed to delete testimonial", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (item: Testimonial) => {
    const nextVal = !item.featured;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, featured: nextVal } : i)));
    try {
      await updateTestimonial(item.id, { featured: nextVal });
      toast.success(nextVal ? "Featured recommendation" : "Removed from featured", item.author_name);
    } catch (err) {
      const error = err as Error;
      toast.error("Failed to update status", error.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-h2 font-bold tracking-tight">Testimonials & Recommendations</h2>
          <p className="text-body text-muted mt-1">
            Manage quotes and recommendations from clients, managers, and teammates.
          </p>
        </div>
        <Button
          onClick={() =>
            setEditingItem({
              quote: "",
              author_name: "",
              author_role: "",
              company: "",
              avatar_url: "",
              featured: true,
              order: items.length,
            })
          }
          className="shrink-0 inline-flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      {/* Edit / Create Form Modal Card */}
      {editingItem && (
        <Card className="p-6 md:p-8 space-y-6 border-2 border-foreground/20">
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <h3 className="text-h3 font-bold">
              {editingItem.id ? "Edit Testimonial" : "Add New Testimonial"}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-2">
              <label className="text-small font-semibold">Quote / Recommendation *</label>
              <Textarea
                required
                rows={4}
                value={editingItem.quote || ""}
                onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                placeholder="Write the recommendation quote here..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-small font-semibold">Author Name *</label>
                <Input
                  required
                  value={editingItem.author_name || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, author_name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                />
              </div>

              <div className="space-y-2">
                <label className="text-small font-semibold">Role / Title *</label>
                <Input
                  required
                  value={editingItem.author_role || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, author_role: e.target.value })}
                  placeholder="e.g. VP of Product"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-small font-semibold">Company / Organization</label>
                <Input
                  value={editingItem.company || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                  placeholder="e.g. Vercel Inc."
                />
              </div>

              <div className="space-y-2">
                <label className="text-small font-semibold flex items-center justify-between">
                  <span>Avatar Image (Max 50 KB or URL)</span>
                  {avatarError && <span className="text-red-500 text-xs font-semibold">{avatarError}</span>}
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarSelect}
                    className="text-small text-muted block w-full file:mr-4 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-small file:font-semibold file:bg-surface file:text-foreground hover:file:bg-surface/80"
                  />
                  <Input
                    value={editingItem.avatar_url || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, avatar_url: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                  />
                  {editingItem.avatar_url && (
                    <div className="flex items-center space-x-3 pt-1">
                      <img src={editingItem.avatar_url} alt="Avatar Preview" className="h-10 w-10 rounded-full object-cover border border-border" />
                      <button
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, avatar_url: null })}
                        className="text-xs text-red-500 hover:underline font-semibold"
                      >
                        Remove Avatar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6 pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingItem.featured ?? true}
                  onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
                <span className="text-small font-medium">Feature on Public Home Page</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="secondary" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : editingItem.id ? "Update Testimonial" : "Create Testimonial"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Grid of Testimonials */}
      {items.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-sm text-muted">
          <Quote className="mx-auto h-8 w-8 mb-3 opacity-50" />
          <p className="text-body font-medium">No testimonials added yet.</p>
          <p className="text-small text-muted mt-1">Click "Add Testimonial" above to create your first recommendation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="text-caption">
                    {item.company ? `${item.author_role} @ ${item.company}` : item.author_role}
                  </Badge>
                  <button
                    onClick={() => toggleFeatured(item)}
                    className="p-1 text-muted hover:text-foreground transition-colors"
                    title={item.featured ? "Featured on Home" : "Click to feature"}
                  >
                    <Star
                      className={`h-4 w-4 ${item.featured ? "fill-foreground text-foreground" : "text-muted"}`}
                    />
                  </button>
                </div>

                <p className="text-body italic text-muted prose-readable">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                <div className="flex items-center space-x-3">
                  {item.avatar_url ? (
                    <img
                      src={item.avatar_url}
                      alt={item.author_name}
                      className="h-9 w-9 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-caption text-foreground">
                      {item.author_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-body-sm font-bold">{item.author_name}</p>
                    <p className="text-caption text-muted">{item.company || item.author_role}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditingItem(item)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
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
