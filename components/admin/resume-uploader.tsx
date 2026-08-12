"use client";

import { useState } from "react";
import { updateResumeInSettings } from "@/lib/data/actions";
import { Card, Button } from "@/components/ui";
import { MediaUpload } from "./media-upload";
import { CheckCircle2, FileText, Download } from "lucide-react";

interface ResumeUploaderProps {
  initialUrl: string | null;
  initialFilename: string | null;
  initialUpdatedAt: string | null;
}

import { useAdminToast } from "@/components/admin/admin-toast";

export function ResumeUploader({
  initialUrl,
  initialFilename,
  initialUpdatedAt,
}: ResumeUploaderProps) {
  const [resumeUrl, setResumeUrl] = useState<string | null>(initialUrl);
  const [resumeFilename, setResumeFilename] = useState<string | null>(initialFilename);
  const [updatedAt, setUpdatedAt] = useState<string | null>(initialUpdatedAt);
  const toast = useAdminToast();

  const handleResumeChange = async (url: string | null, filename?: string | null) => {
    try {
      await updateResumeInSettings(url, filename || null);
      setResumeUrl(url);
      setResumeFilename(filename || null);
      setUpdatedAt(url ? new Date().toISOString() : null);
      if (url) {
        toast.success("Resume updated", filename || "PDF uploaded");
      } else {
        toast.success("Resume removed", "Resume link cleared");
      }
    } catch (err) {
      const error = err as Error;
      toast.error("Failed to update resume", error.message);
    }
  };

  return (
    <Card className="space-y-6 max-w-[600px]">
      <h2 className="text-h3 font-bold tracking-tight border-b border-border pb-2">
        Resume Document (PDF)
      </h2>

      <div className="space-y-4">
        <MediaUpload
          bucket="resume"
          value={resumeUrl}
          onChange={handleResumeChange}
          accept="application/pdf"
          maxSizeMB={10}
        />

        {resumeUrl && (
          <div className="border border-border p-4 rounded-sm bg-surface space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted block">
                  Active Document
                </span>
                <span className="text-body font-semibold text-foreground flex items-center">
                  <FileText className="mr-2 h-4 w-4 shrink-0" />
                  {resumeFilename || "Resume.pdf"}
                </span>
                {updatedAt && (
                  <span className="text-[10px] text-muted block">
                    Last modified: {new Date(updatedAt).toLocaleString()}
                  </span>
                )}
              </div>

              <Button asChild variant="secondary" size="sm">
                <a href={resumeUrl} download={resumeFilename || "Resume.pdf"} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Download
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
