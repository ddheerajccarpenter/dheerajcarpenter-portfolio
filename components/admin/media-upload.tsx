"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2, FileIcon } from "lucide-react";

interface MediaUploadProps {
  bucket: "images" | "resume";
  value: string | null;
  onChange: (url: string | null, filename?: string | null) => void;
  accept?: string;
  maxSizeMB?: number;
}

import { useAdminToast } from "@/components/admin/admin-toast";

export function MediaUpload({
  bucket,
  value,
  onChange,
  accept = "image/*",
  maxSizeMB = 5,
}: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const toast = useAdminToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error("File size exceeded", `Max allowed size is ${maxSizeMB}MB.`);
      return;
    }

    setIsUploading(true);

    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = fileName;

    try {
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public url
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      onChange(data.publicUrl, file.name);
      toast.success("File uploaded", file.name);
    } catch (err) {
      const error = err as Error;
      toast.error("Upload failed", error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!value) return;
    setErrorMsg(null);

    // Extraction of file name from public URL
    // Public URL format: .../storage/v1/object/public/bucket/filename
    try {
      const parts = value.split("/");
      const fileName = parts[parts.length - 1];

      const supabase = createClient();
      const { error } = await supabase.storage.from(bucket).remove([fileName]);

      if (error) {
        throw error;
      }

      onChange(null, null);
    } catch (err) {
      // Even if deleting from storage fails (e.g. file already gone), we clear the value
      console.error(err);
      onChange(null, null);
    }
  };

  const isImage = accept.includes("image");

  return (
    <div className="space-y-4">
      {errorMsg && (
        <p className="text-caption text-foreground font-medium flex items-center">
          {errorMsg}
        </p>
      )}

      {value ? (
        <div className="relative inline-block border border-border p-2 rounded-sm bg-surface">
          {isImage ? (
            <div className="relative h-40 w-40 overflow-hidden rounded-sm grayscale bg-background">
              <img
                src={value}
                alt="Uploaded media preview"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center space-x-3 p-4 bg-background border border-border rounded-sm min-w-[200px]">
              <FileIcon className="h-8 w-8 text-muted shrink-0" />
              <div className="truncate pr-4">
                <span className="text-small font-medium text-foreground block truncate">
                  Uploaded Document
                </span>
                <span className="text-[10px] text-muted block truncate">
                  {value.split("/").pop()}
                </span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-foreground text-background border border-border rounded-full p-1 hover:opacity-85 transition-opacity"
            title="Remove media"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="border border-dashed border-border rounded-sm hover:bg-surface/50 transition-colors">
          <label className="flex flex-col items-center justify-center py-8 px-4 cursor-pointer">
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-muted" />
                <span className="text-caption text-muted">Uploading asset...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-8 w-8 text-muted" />
                <span className="text-small font-medium text-foreground text-center">
                  Click to upload or drag & drop
                </span>
                <span className="text-[10px] text-muted text-center">
                  {isImage ? "PNG, JPG, WEBP" : "PDF"} up to {maxSizeMB}MB
                </span>
              </div>
            )}
            <input
              type="file"
              accept={accept}
              onChange={handleUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}
