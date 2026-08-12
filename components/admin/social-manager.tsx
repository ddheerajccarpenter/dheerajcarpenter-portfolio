"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { socialLinkSchema, type SocialLinkValues } from "@/lib/validators";
import { createSocialLink, updateSocialLink, deleteSocialLink } from "@/lib/data/actions";
import { normalizeUrl } from "@/lib/utils";
import { Button, Input, Label, Card, Badge } from "@/components/ui";
import { Loader2, Edit2, Trash2, X, CheckCircle2, Share2 } from "lucide-react";

interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  order: number;
}

export function SocialManager({ initialLinks }: { initialLinks: SocialLink[] }) {
  const router = useRouter();
  const [links, setLinks] = useState<SocialLink[]>(initialLinks);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setLinks(initialLinks);
  }, [initialLinks]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SocialLinkValues>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: "github",
      label: "",
      url: "",
      order: 0,
    },
  });

  const onSubmit = async (data: SocialLinkValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccess(null);

    try {
      if (editingLink) {
        await updateSocialLink(editingLink.id, data);
        setLinks((prev) =>
          prev.map((l) => (l.id === editingLink.id ? { ...l, ...data } : l))
        );
        setSuccess("Social link updated successfully!");
        setEditingLink(null);
      } else {
        const created = await createSocialLink(data as { platform: string; label: string; url: string; order: number });
        if (created) {
          setLinks((prev) => [...prev, created as SocialLink]);
        }
        setSuccess("Social link created successfully!");
      }
      reset({
        platform: "github",
        label: "",
        url: "",
        order: 0,
      });
      router.refresh();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || "Failed to save social link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (link: SocialLink) => {
    setEditingLink(link);
    setValue("platform", link.platform as SocialLinkValues["platform"]);
    setValue("label", link.label);
    setValue("url", link.url);
    setValue("order", link.order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingLink(null);
    reset({
      platform: "github",
      label: "",
      url: "",
      order: 0,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this social link?")) return;
    setIsSubmitting(true);
    try {
      await deleteSocialLink(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      setSuccess("Social link deleted successfully!");
      router.refresh();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || "Failed to delete social link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Editor Panel */}
      <div>
        <Card className="space-y-6 sticky top-24">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <h2 className="text-h3 font-bold tracking-tight">
              {editingLink ? "Edit Link" : "Add Link"}
            </h2>
            {editingLink && (
              <Button onClick={handleCancelEdit} variant="ghost" size="sm" className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {success && (
            <div className="border border-border p-3 rounded-sm bg-surface flex items-center space-x-2 text-caption">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {errorMsg && (
            <div className="border border-border p-3 rounded-sm bg-surface text-caption text-foreground">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="platform">Platform</Label>
              <select
                id="platform"
                {...register("platform")}
                disabled={isSubmitting}
                className="w-full bg-background border border-border rounded-sm py-2 px-3 text-body focus:ring-1 focus:ring-focus outline-none"
              >
                <option value="github">GitHub</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter / X</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="dribbble">Dribbble</option>
                <option value="behance">Behance</option>
                <option value="website">Personal Website</option>
                <option value="email">Email</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="label">Display Label</Label>
              <Input id="label" placeholder="e.g. Follow on Twitter" {...register("label")} disabled={isSubmitting} />
              {errors.label && <p className="text-caption text-foreground">{errors.label.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="url">Link URL</Label>
              <Input
                id="url"
                placeholder="e.g. github.com/username or https://..."
                {...register("url")}
                disabled={isSubmitting}
                onBlur={(e) => {
                  if (e.target.value) {
                    setValue("url", normalizeUrl(e.target.value));
                  }
                }}
              />
              {errors.url && <p className="text-caption text-foreground">{errors.url.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="order">Display Order (weight)</Label>
              <Input
                id="order"
                type="number"
                placeholder="e.g. 0"
                {...register("order", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
            </div>

            <div className="pt-2 flex gap-3">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingLink ? (
                  "Update Link"
                ) : (
                  "Add Link"
                )}
              </Button>
              {editingLink && (
                <Button onClick={handleCancelEdit} variant="secondary" type="button">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>

      {/* Social Links List */}
      <div className="lg:col-span-2 space-y-4">
        {links.length === 0 ? (
          <div className="border border-dashed border-border p-16 text-center text-muted rounded-sm">
            No social channels listed yet.
          </div>
        ) : (
          links.map((link) => (
            <Card
              key={link.id}
              className="flex justify-between items-center py-3 px-4 hover:border-border-strong transition-colors"
            >
              <div className="space-y-1 truncate pr-4">
                <div className="flex items-center space-x-2">
                  <Share2 className="h-4 w-4 text-foreground" />
                  <span className="text-body font-bold text-foreground">{link.label}</span>
                  <Badge className="uppercase tracking-wider text-[9px] py-0.5 px-1.5">
                    {link.platform}
                  </Badge>
                </div>
                <span className="text-caption text-muted block truncate font-mono">
                  {link.url}
                </span>
              </div>

              <div className="flex space-x-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(link)}
                  disabled={isSubmitting}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(link.id)}
                  disabled={isSubmitting}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
