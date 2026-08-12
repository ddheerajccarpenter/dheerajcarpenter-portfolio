"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectValues } from "@/lib/validators";
import { createProject, updateProject, deleteProject } from "@/lib/data/actions";
import { normalizeUrl } from "@/lib/utils";
import { Button, Input, Textarea, Label, Card } from "@/components/ui";
import { MediaUpload } from "./media-upload";
import { Loader2, Edit2, Trash2, X, CheckCircle2, Star, EyeOff } from "lucide-react";

import { useAdminToast } from "@/components/admin/admin-toast";

interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  cover_url: string | null;
  gallery: string[];
  tags: string[];
  live_url: string | null;
  source_url: string | null;
  featured: boolean;
  published: boolean;
  order: number;
  created_at: string;
}

export function ProjectsManager({ initialProjects }: { initialProjects: Project[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [editingProj, setEditingProj] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useAdminToast();

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  // For tags input field: temporary state
  const [tagsInput, setTagsInput] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      slug: "",
      title: "",
      summary: "",
      description: "",
      cover_url: null,
      gallery: [],
      tags: [],
      live_url: "",
      source_url: "",
      featured: false,
      published: true,
      order: 0,
    },
  });

  const coverUrl = watch("cover_url");
  const gallery = watch("gallery") || [];

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleVal = e.target.value;
    setValue("title", titleVal);
    
    // Auto-generate slug if we are creating a new project
    if (!editingProj) {
      const generatedSlug = titleVal
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", generatedSlug);
    }
  };

  const onSubmit = async (data: ProjectValues) => {
    setIsSubmitting(true);

    const formattedData = {
      ...data,
      live_url: data.live_url || null,
      source_url: data.source_url || null,
    };

    try {
      if (editingProj) {
        await updateProject(editingProj.id, formattedData);
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProj.id ? { ...p, ...formattedData } : p))
        );
        toast.success("Project updated", data.title);
        setEditingProj(null);
      } else {
        const created = await createProject(formattedData);
        if (created && typeof created === "object" && "id" in created) {
          setProjects((prev) => [...prev, created as Project]);
        }
        toast.success("Project created", data.title);
      }
      reset({
        slug: "",
        title: "",
        summary: "",
        description: "",
        cover_url: null,
        gallery: [],
        tags: [],
        live_url: "",
        source_url: "",
        featured: false,
        published: true,
        order: 0,
      });
      setTagsInput("");
      router.refresh();
    } catch (err) {
      const error = err as Error;
      toast.error("Failed to save project", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (proj: Project) => {
    setEditingProj(proj);
    setValue("slug", proj.slug);
    setValue("title", proj.title);
    setValue("summary", proj.summary);
    setValue("description", proj.description);
    setValue("cover_url", proj.cover_url);
    setValue("gallery", proj.gallery);
    setValue("tags", proj.tags);
    setValue("live_url", proj.live_url || "");
    setValue("source_url", proj.source_url || "");
    setValue("featured", proj.featured);
    setValue("published", proj.published);
    setValue("order", proj.order);
    
    setTagsInput(proj.tags.join(", "));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingProj(null);
    reset({
      slug: "",
      title: "",
      summary: "",
      description: "",
      cover_url: null,
      gallery: [],
      tags: [],
      live_url: "",
      source_url: "",
      featured: false,
      published: true,
      order: 0,
    });
    setTagsInput("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setIsSubmitting(true);
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted");
      router.refresh();
    } catch (err) {
      const error = err as Error;
      toast.error("Failed to delete project", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add tag to the form list
  const handleTagsInputBlur = () => {
    const list = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    setValue("tags", list);
  };

  // Add file to gallery list
  const handleAddToGallery = (url: string | null) => {
    if (!url) return;
    setValue("gallery", [...gallery, url]);
  };

  const handleRemoveFromGallery = (indexToRemove: number) => {
    setValue("gallery", gallery.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Editor Panel */}
      <div className="lg:col-span-1">
        <Card className="space-y-6 sticky top-24 max-h-[85vh] overflow-y-auto pb-4">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <h2 className="text-h3 font-bold tracking-tight">
              {editingProj ? "Edit Project" : "Add Project"}
            </h2>
            {editingProj && (
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
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                placeholder="e.g. My Portfolio Platform"
                {...register("title")}
                onChange={handleTitleChange}
                disabled={isSubmitting}
              />
              {errors.title && <p className="text-caption text-foreground">{errors.title.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug">Project Slug (URL path)</Label>
              <Input id="slug" placeholder="e.g. my-portfolio-platform" {...register("slug")} disabled={isSubmitting} />
              {errors.slug && <p className="text-caption text-foreground">{errors.slug.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="summary">Brief Summary</Label>
              <Input id="summary" placeholder="e.g. A production-ready portfolio built with Next.js." {...register("summary")} disabled={isSubmitting} />
            </div>

            <div className="space-y-1.5">
              <Label>Cover Image</Label>
              <MediaUpload
                bucket="images"
                value={coverUrl}
                onChange={(url) => setValue("cover_url", url)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tagsInput">Tags (comma-separated)</Label>
              <Input
                id="tagsInput"
                placeholder="Next.js, Tailwind, Supabase"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onBlur={handleTagsInputBlur}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="live_url">Live Demo URL</Label>
                <Input
                  id="live_url"
                  placeholder="e.g. google.com or https://..."
                  {...register("live_url")}
                  onBlur={(e) => {
                    if (e.target.value) {
                      setValue("live_url", normalizeUrl(e.target.value));
                    }
                  }}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="source_url">Source Code URL</Label>
                <Input
                  id="source_url"
                  placeholder="e.g. github.com/..."
                  {...register("source_url")}
                  onBlur={(e) => {
                    if (e.target.value) {
                      setValue("source_url", normalizeUrl(e.target.value));
                    }
                  }}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Case Study / Description (Markdown)</Label>
              <Textarea id="description" rows={6} placeholder="Detailed project breakdown..." {...register("description")} disabled={isSubmitting} className="font-mono text-small" />
            </div>

            {/* Gallery manager inside form */}
            <div className="space-y-3 pt-2 border-t border-border">
              <Label>Project Gallery Screenshots</Label>
              
              {gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {gallery.map((url, idx) => (
                    <div key={idx} className="relative aspect-video border border-border rounded-sm bg-surface overflow-hidden grayscale">
                      <img src={url} alt="Gallery item" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveFromGallery(idx)}
                        className="absolute top-1 right-1 bg-foreground text-background border border-border rounded-full p-0.5 hover:opacity-85"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <MediaUpload
                bucket="images"
                value={null} // Keep it null so it always displays the uploader triggers
                onChange={handleAddToGallery}
                accept="image/*"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div className="space-y-1.5">
                <Label htmlFor="order">Display Order</Label>
                <Input id="order" type="number" {...register("order", { valueAsNumber: true })} disabled={isSubmitting} />
              </div>

              <div className="space-y-2 pt-6">
                <div className="flex items-center space-x-2">
                  <input
                    id="featured"
                    type="checkbox"
                    {...register("featured")}
                    disabled={isSubmitting}
                    className="h-4 w-4 rounded-sm border-border bg-background text-foreground"
                  />
                  <Label htmlFor="featured" className="cursor-pointer">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="published"
                    type="checkbox"
                    {...register("published")}
                    disabled={isSubmitting}
                    className="h-4 w-4 rounded-sm border-border bg-background text-foreground"
                  />
                  <Label htmlFor="published" className="cursor-pointer">Published</Label>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingProj ? (
                  "Update Project"
                ) : (
                  "Add Project"
                )}
              </Button>
              {editingProj && (
                <Button onClick={handleCancelEdit} variant="secondary" type="button">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>

      {/* Projects List Grid */}
      <div className="lg:col-span-2 space-y-4">
        {projects.length === 0 ? (
          <div className="border border-dashed border-border p-16 text-center text-muted rounded-sm">
            No projects in the portfolio yet. Use the editor to add one.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <Card
                key={proj.id}
                className={cn(
                  "flex flex-col justify-between hover:border-border-strong transition-colors",
                  !proj.published && "opacity-60 border-dashed"
                )}
              >
                <div className="space-y-3">
                  {/* Thumbnail preview */}
                  {proj.cover_url ? (
                    <div className="relative aspect-video -mx-6 -mt-6 mb-4 overflow-hidden border-b border-border bg-surface grayscale">
                      <img src={proj.cover_url} alt={proj.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="relative aspect-video -mx-6 -mt-6 mb-4 bg-surface border-b border-border flex items-center justify-center text-[10px] text-muted">
                      No cover image
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-body font-bold text-foreground truncate pr-2" title={proj.title}>
                        {proj.title}
                      </h3>
                      <div className="flex gap-1 shrink-0">
                        {proj.featured && (
                          <span title="Featured">
                            <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />
                          </span>
                        )}
                        {!proj.published && (
                          <span title="Unpublished">
                            <EyeOff className="h-3.5 w-3.5 text-muted" />
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-muted font-mono truncate">
                      /{proj.slug}
                    </p>
                    <p className="text-small text-muted line-clamp-2">
                      {proj.summary}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border mt-4">
                  <span className="text-caption text-muted">Order: {proj.order}</span>
                  <div className="flex space-x-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(proj)}
                      disabled={isSubmitting}
                      className="h-8 w-8 p-0"
                      title="Edit project"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(proj.id)}
                      disabled={isSubmitting}
                      className="h-8 w-8 p-0"
                      title="Delete project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
