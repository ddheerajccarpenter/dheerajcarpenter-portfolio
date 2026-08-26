"use client";

import { useState } from "react";
import type { ServiceOffering } from "@/types/database";
import {
  createServiceOffering,
  updateServiceOffering,
  deleteServiceOffering,
} from "@/lib/data/actions";
import { Button, Input, Textarea, Card, Badge } from "@/components/ui";
import { Plus, Trash2, Edit2, Wrench, CheckCircle2, ShieldCheck, Tag } from "lucide-react";

import { useAdminToast } from "@/components/admin/admin-toast";

interface ServicesManagerProps {
  initialServices: ServiceOffering[];
}

export function ServicesManager({ initialServices }: ServicesManagerProps) {
  const [items, setItems] = useState<ServiceOffering[]>(initialServices);
  const [editingItem, setEditingItem] = useState<Partial<ServiceOffering> | null>(null);
  const [deliverablesInput, setDeliverablesInput] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useAdminToast();

  const handleOpenEdit = (item?: ServiceOffering) => {
    if (item) {
      setEditingItem(item);
      setDeliverablesInput(item.deliverables?.join("\n") || "");
    } else {
      setEditingItem({
        title: "",
        tagline: "",
        description: "",
        deliverables: [],
        price_range: "",
        active: true,
        order: items.length,
      });
      setDeliverablesInput("");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.tagline || !editingItem?.description) return;

    setLoading(true);

    const deliverables = deliverablesInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    try {
      if (editingItem.id) {
        await updateServiceOffering(editingItem.id, {
          title: editingItem.title,
          tagline: editingItem.tagline,
          description: editingItem.description,
          deliverables,
          price_range: editingItem.price_range || null,
          icon: editingItem.icon || null,
          active: Boolean(editingItem.active),
          order: Number(editingItem.order ?? 0),
        });
        setItems((prev) =>
          prev.map((i) =>
            i.id === editingItem.id ? ({ ...i, ...editingItem, deliverables } as ServiceOffering) : i
          )
        );
        toast.success("Service updated", editingItem.title);
      } else {
        const created = await createServiceOffering({
          title: editingItem.title,
          tagline: editingItem.tagline,
          description: editingItem.description,
          deliverables,
          price_range: editingItem.price_range || null,
          icon: editingItem.icon || null,
          active: Boolean(editingItem.active),
          order: items.length,
        });
        setItems((prev) => [...prev, created]);
        toast.success("Service created", editingItem.title);
      }
      setEditingItem(null);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error("Failed to save service", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service offering?")) return;
    setLoading(true);
    try {
      await deleteServiceOffering(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Service deleted");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error("Failed to delete service", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (item: ServiceOffering) => {
    const nextVal = !item.active;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, active: nextVal } : i)));
    try {
      await updateServiceOffering(item.id, { active: nextVal });
      toast.success(nextVal ? "Service activated" : "Service hidden", item.title);
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
          <h2 className="text-h2 font-bold tracking-tight">Services & Consulting Offerings</h2>
          <p className="text-body text-muted mt-1">
            Configure offered services, freelance packages, and deliverables for clients.
          </p>
        </div>
        <Button onClick={() => handleOpenEdit()} className="shrink-0 inline-flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      {/* Edit / Create Form Modal Card */}
      {editingItem && (
        <Card className="p-6 md:p-8 space-y-6 border-2 border-foreground/20">
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <h3 className="text-h3 font-bold">
              {editingItem.id ? "Edit Service" : "Create New Service"}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-small font-semibold">Service Title *</label>
                <Input
                  required
                  value={editingItem.title || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. Full-Stack Web Application Development"
                />
              </div>

              <div className="space-y-2">
                <label className="text-small font-semibold">Tagline / Short Summary *</label>
                <Input
                  required
                  value={editingItem.tagline || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, tagline: e.target.value })}
                  placeholder="e.g. Scalable React & Next.js systems engineered for speed."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-small font-semibold">Full Description *</label>
              <Textarea
                required
                rows={3}
                value={editingItem.description || ""}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                placeholder="Detailed overview of what this service entails..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-small font-semibold">Deliverables (one per line)</label>
              <Textarea
                rows={4}
                value={deliverablesInput}
                onChange={(e) => setDeliverablesInput(e.target.value)}
                placeholder={"Next.js & TypeScript Architecture\nResponsive UI Component Library\nAPI & Supabase Integration\nPerformance & SEO Optimization"}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-small font-semibold">Price Estimate / Starting Rate</label>
                <Input
                  value={editingItem.price_range || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, price_range: e.target.value })}
                  placeholder="e.g. Starting from $1,500 / Project"
                />
              </div>

              <div className="space-y-2">
                <label className="text-small font-semibold">Display Order</label>
                <Input
                  type="number"
                  value={editingItem.order ?? 0}
                  onChange={(e) => setEditingItem({ ...editingItem, order: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-6 pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingItem.active ?? true}
                  onChange={(e) => setEditingItem({ ...editingItem, active: e.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
                <span className="text-small font-medium">Active (Visible on public site)</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="secondary" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : editingItem.id ? "Update Service" : "Create Service"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Services Grid */}
      {items.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-sm text-muted">
          <Wrench className="mx-auto h-8 w-8 mb-3 opacity-50" />
          <p className="text-body font-medium">No service offerings created yet.</p>
          <p className="text-small text-muted mt-1">Click "Add Service" to list your consulting or development offerings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-h3 font-bold">{item.title}</h3>
                      <button
                        onClick={() => toggleActive(item)}
                        className={`text-caption font-semibold px-2 py-0.5 rounded-sm border ${
                          item.active
                            ? "bg-surface border-border text-foreground"
                            : "border-border text-muted"
                        }`}
                      >
                        {item.active ? "Active" : "Draft"}
                      </button>
                    </div>
                    <p className="text-body-sm font-medium text-muted">{item.tagline}</p>
                  </div>
                </div>

                <p className="text-body text-muted prose-readable line-clamp-3">
                  {item.description}
                </p>

                {item.deliverables && item.deliverables.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <span className="text-caption font-bold uppercase tracking-wider text-foreground">
                      Key Deliverables
                    </span>
                    <ul className="space-y-1.5">
                      {item.deliverables.map((d, idx) => (
                        <li key={idx} className="flex items-start text-small text-muted">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-foreground shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                <span className="text-small font-semibold text-foreground">
                  {item.price_range || "Custom Pricing"}
                </span>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(item)}>
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
