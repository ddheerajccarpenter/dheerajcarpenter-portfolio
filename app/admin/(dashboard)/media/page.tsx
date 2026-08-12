"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { deleteStorageFile } from "@/lib/data/actions";
import { Button, Input, Card, Label } from "@/components/ui";
import { Loader2, Search, Grid, List, Copy, Trash2, Upload, FileText, Check, ExternalLink } from "lucide-react";

interface StorageFile {
  name: string;
  id: string;
  created_at: string;
  metadata: {
    size: number;
    mimetype: string;
  };
}

export default function MediaLibraryPage() {
  const [bucket, setBucket] = useState<"images" | "resume">("images");
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.storage.from(bucket).list("", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

      if (error) throw error;
      setFiles(data as unknown as StorageFile[]);
    } catch (err) {
      console.error("Error listing files:", err);
      setErrorMsg("Failed to fetch files from storage bucket.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [bucket]);

  const handleCopyUrl = (fileName: string) => {
    const supabase = createClient();
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    navigator.clipboard.writeText(data.publicUrl);
    setCopiedId(fileName);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPublicUrl = (fileName: string) => {
    const supabase = createClient();
    return supabase.storage.from(bucket).getPublicUrl(fileName).data.publicUrl;
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"? This cannot be undone.`)) return;
    try {
      await deleteStorageFile(bucket, fileName);
      setFiles(files.filter((f) => f.name !== fileName));
    } catch (err) {
      const error = err as Error;
      alert(`Failed to delete file: ${error.message}`);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Limit to 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    setUploading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      const { error } = await supabase.storage.from(bucket).upload(fileName, selectedFile, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) throw error;

      await fetchFiles();
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || "Failed to upload file.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isImgFile = (mimetype: string) => {
    return mimetype?.startsWith("image/");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-h1 font-bold tracking-tight">Media Library</h1>
          <p className="text-small text-muted">
            Manage your uploaded assets, images, and documents across buckets.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept={bucket === "images" ? "image/*" : ".pdf,.docx,.doc"}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="h-10"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Controls */}
        <div className="space-y-4">
          <Card className="space-y-4">
            <Label>Select Storage Bucket</Label>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setBucket("images")}
                className={`w-full text-left px-3 py-2 rounded-sm text-small font-medium border transition-colors ${
                  bucket === "images"
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:bg-surface"
                }`}
              >
                images
              </button>
              <button
                onClick={() => setBucket("resume")}
                className={`w-full text-left px-3 py-2 rounded-sm text-small font-medium border transition-colors ${
                  bucket === "resume"
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:bg-surface"
                }`}
              >
                resume
              </button>
            </div>
          </Card>

          <Card className="space-y-4">
            <Label>Storage Statistics</Label>
            <div className="text-caption space-y-2 text-muted">
              <p>Total Files: <span className="text-foreground font-semibold">{files.length}</span></p>
              <p>Max File Size: <span className="text-foreground font-semibold">5 MB</span></p>
              <p>Active Bucket: <span className="text-foreground font-semibold capitalize">{bucket}</span></p>
            </div>
          </Card>
        </div>

        {/* Media Files Panel */}
        <div className="lg:col-span-3 space-y-4">
          {errorMsg && (
            <div className="border border-border p-4 rounded-sm bg-surface text-small text-foreground">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-surface border border-border p-4 rounded-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <Input
                placeholder="Search file name..."
                className="pl-9 h-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2 shrink-0 justify-end">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 border rounded-sm transition-colors ${
                  viewMode === "grid" ? "border-foreground bg-foreground text-background" : "border-border hover:bg-surface"
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 border rounded-sm transition-colors ${
                  viewMode === "list" ? "border-foreground bg-foreground text-background" : "border-border hover:bg-surface"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted" />
              <p className="text-caption text-muted mt-2">Loading library files...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="border border-border border-dashed p-16 text-center rounded-sm bg-background text-muted">
              <FileText className="h-10 w-10 mx-auto mb-3" />
              <p className="text-body font-medium">No assets found</p>
              <p className="text-caption">Upload files to display them here.</p>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFiles.map((file) => {
                const publicUrl = getPublicUrl(file.name);
                const isImage = isImgFile(file.metadata?.mimetype);

                return (
                  <Card key={file.name} className="flex flex-col p-2 group overflow-hidden">
                    <div className="relative aspect-square w-full bg-background border border-border rounded-sm overflow-hidden flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                      {isImage ? (
                        <img
                          src={publicUrl}
                          alt={file.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FileText className="h-12 w-12 text-muted" />
                      )}
                    </div>

                    <div className="pt-2 flex-1 flex flex-col justify-between">
                      <div className="truncate">
                        <span className="text-[11px] font-bold text-foreground block truncate" title={file.name}>
                          {file.name}
                        </span>
                        <span className="text-[9px] text-muted block">
                          {formatSize(file.metadata?.size || 0)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-border mt-2 pt-2">
                        <button
                          onClick={() => handleCopyUrl(file.name)}
                          className="p-1 text-muted hover:text-foreground transition-colors"
                          title="Copy Public URL"
                        >
                          {copiedId === file.name ? (
                            <Check className="h-3.5 w-3.5 text-foreground" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <a
                          href={publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-muted hover:text-foreground transition-colors"
                          title="Open in new tab"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <button
                          onClick={() => handleDelete(file.name)}
                          className="p-1 text-muted hover:text-foreground transition-colors"
                          title="Delete File"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="border border-border rounded-sm bg-surface overflow-hidden divide-y divide-border">
              {filteredFiles.map((file) => {
                const publicUrl = getPublicUrl(file.name);
                const isImage = isImgFile(file.metadata?.mimetype);

                return (
                  <div key={file.name} className="flex items-center justify-between p-4 bg-background hover:bg-surface/50 transition-colors gap-4">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="h-10 w-10 border border-border rounded-sm overflow-hidden shrink-0 flex items-center justify-center grayscale bg-background">
                        {isImage ? (
                          <img src={publicUrl} alt={file.name} className="h-full w-full object-cover" />
                        ) : (
                          <FileText className="h-5 w-5 text-muted" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-small font-bold text-foreground block truncate" title={file.name}>
                          {file.name}
                        </span>
                        <span className="text-[10px] text-muted block">
                          {formatSize(file.metadata?.size || 0)} • {file.metadata?.mimetype || "document"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <Button
                        onClick={() => handleCopyUrl(file.name)}
                        variant="secondary"
                        size="sm"
                        className="h-8"
                      >
                        {copiedId === file.name ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy Link
                          </>
                        )}
                      </Button>
                      <a
                        href={publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-border rounded-sm hover:bg-surface transition-colors"
                        title="Open File"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <Button
                        onClick={() => handleDelete(file.name)}
                        variant="secondary"
                        size="sm"
                        className="h-8 p-2"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
