"use client";

import { useState } from "react";
import type { BlogPost } from "@/types/database";
import {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/data/actions";
import { Button, Input, Textarea, Card, Badge } from "@/components/ui";
import { Plus, Trash2, Edit2, FileText, ExternalLink, Calendar, Clock, Eye, Globe } from "lucide-react";
import Link from "next/link";

import { useAdminToast } from "@/components/admin/admin-toast";

interface PostsManagerProps {
  initialPosts: BlogPost[];
}

export function PostsManager({ initialPosts }: PostsManagerProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useAdminToast();

  const handleOpenEdit = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setTagsInput(post.tags?.join(", ") || "");
    } else {
      setEditingPost({
        slug: "",
        title: "",
        excerpt: "",
        content: "",
        cover_url: "",
        tags: [],
        reading_time_minutes: 5,
        published: false,
        featured: false,
      });
      setTagsInput("");
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleTitleChange = (title: string) => {
    setEditingPost((prev) => {
      if (!prev) return null;
      // Auto-generate slug if post is new or slug is empty
      const slug = prev.id ? prev.slug : generateSlug(title);
      return { ...prev, title, slug };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title || !editingPost?.slug || !editingPost?.content) return;

    setLoading(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // Auto-calculate reading time (~200 words per minute)
    const wordCount = editingPost.content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    try {
      if (editingPost.id) {
        await updateBlogPost(editingPost.id, {
          title: editingPost.title,
          slug: editingPost.slug,
          excerpt: editingPost.excerpt || "",
          content: editingPost.content,
          cover_url: editingPost.cover_url || null,
          tags,
          reading_time_minutes: readingTime,
          published: Boolean(editingPost.published),
          featured: Boolean(editingPost.featured),
          published_at: editingPost.published ? editingPost.published_at || new Date().toISOString() : null,
        });
        setPosts((prev) =>
          prev.map((p) =>
            p.id === editingPost.id
              ? ({ ...p, ...editingPost, tags, reading_time_minutes: readingTime } as BlogPost)
              : p
          )
        );
        toast.success("Blog post updated", editingPost.title);
      } else {
        const created = await createBlogPost({
          title: editingPost.title,
          slug: editingPost.slug,
          excerpt: editingPost.excerpt || "",
          content: editingPost.content,
          cover_url: editingPost.cover_url || null,
          tags,
          reading_time_minutes: readingTime,
          published: Boolean(editingPost.published),
          featured: Boolean(editingPost.featured),
          published_at: editingPost.published ? new Date().toISOString() : null,
        });
        setPosts((prev) => [created, ...prev]);
        toast.success("Blog post created", editingPost.title);
      }
      setEditingPost(null);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error("Failed to save article", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    setLoading(true);
    try {
      await deleteBlogPost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Blog post deleted");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error("Failed to delete post", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-h2 font-bold tracking-tight">Blog & Articles CMS</h2>
          <p className="text-body text-muted mt-1">
            Write, publish, and manage technical articles and thought-leadership posts.
          </p>
        </div>
        <Button onClick={() => handleOpenEdit()} className="shrink-0 inline-flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </div>

      {statusMsg && (
        <div className="p-4 border border-border rounded-sm bg-surface text-small font-medium text-foreground">
          {statusMsg}
        </div>
      )}

      {/* Editor Modal / Card */}
      {editingPost && (
        <Card className="p-6 md:p-8 space-y-6 border-2 border-foreground/20">
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <h3 className="text-h3 font-bold">
              {editingPost.id ? "Edit Article" : "Create New Article"}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setEditingPost(null)}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-small font-semibold">Article Title *</label>
                <Input
                  required
                  value={editingPost.title || ""}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Building High-Performance Next.js Applications"
                />
              </div>

              <div className="space-y-2">
                <label className="text-small font-semibold">URL Slug *</label>
                <Input
                  required
                  value={editingPost.slug || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                  placeholder="building-high-performance-nextjs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-small font-semibold">Excerpt / Summary</label>
              <Textarea
                rows={2}
                value={editingPost.excerpt || ""}
                onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                placeholder="Brief 1-2 sentence preview of the article..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-small font-semibold">Article Content (Markdown supported) *</label>
              <Textarea
                required
                rows={12}
                value={editingPost.content || ""}
                onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                placeholder="# Introduction\n\nWrite your article content here in Markdown format..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-small font-semibold">Cover Image URL</label>
                <Input
                  value={editingPost.cover_url || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, cover_url: e.target.value })}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-small font-semibold">Tags (comma separated)</label>
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Next.js, React, Architecture, Performance"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6 pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingPost.published ?? false}
                  onChange={(e) => setEditingPost({ ...editingPost, published: e.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
                <span className="text-small font-medium">Publish (Visible to public)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingPost.featured ?? false}
                  onChange={(e) => setEditingPost({ ...editingPost, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-border"
                />
                <span className="text-small font-medium">Featured Article</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="secondary" onClick={() => setEditingPost(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : editingPost.id ? "Update Article" : "Publish Article"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Posts Table / List */}
      {posts.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-sm text-muted">
          <FileText className="mx-auto h-8 w-8 mb-3 opacity-50" />
          <p className="text-body font-medium">No blog posts written yet.</p>
          <p className="text-small text-muted mt-1">Click "New Article" above to draft your first post.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-h3 font-bold">{post.title}</h3>
                  <Badge className="text-caption">
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                  {post.featured && (
                    <Badge className="text-caption bg-foreground text-background">Featured</Badge>
                  )}
                </div>

                <p className="text-body-sm text-muted line-clamp-2">{post.excerpt || post.content}</p>

                <div className="flex flex-wrap items-center gap-4 text-caption text-muted pt-1">
                  <span className="flex items-center">
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    {post.reading_time_minutes || 3} min read
                  </span>
                  <span>/blog/{post.slug}</span>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-1">
                      {post.tags.map((t) => (
                        <span key={t} className="border border-border px-1.5 py-0.5 rounded-sm text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {post.published && (
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(post)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
