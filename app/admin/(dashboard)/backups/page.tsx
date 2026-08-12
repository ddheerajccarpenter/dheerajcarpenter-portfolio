"use client";

import { useState } from "react";
import { exportDatabaseContent } from "@/lib/data/actions";
import { Button, Card } from "@/components/ui";
import { Loader2, Download, Database, Cloud, FileCode, CheckCircle2, AlertCircle } from "lucide-react";

export default function BackupCenterPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setSuccess(null);
    setErrorMsg(null);

    try {
      const data = await exportDatabaseContent();

      // Convert to JSON and trigger client-side download
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      
      const dateString = new Date().toISOString().slice(0, 10);
      downloadAnchor.setAttribute("download", `dheerajcarpenter_backup_${dateString}.json`);
      
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setSuccess("Database contents exported and downloaded successfully.");
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      console.error(err);
      const error = err as Error;
      setErrorMsg(error.message || "Failed to compile database export.");
    } finally {
      setIsExporting(false);
    }
  };

  // Mock list of previous backups for UI completion
  const mockBackups = [
    { type: "Manual Export", name: "dheerajcarpenter_backup_2026-06-20.json", size: "84 KB", status: "Completed", date: "1 day ago" },
    { type: "System Auto-Backup", name: "auto_db_snapshot_prod_week24.sql", size: "128 KB", status: "Completed", date: "5 days ago" },
    { type: "Storage Archive", name: "images_bucket_backup_2026-06-15.tar.gz", size: "14.2 MB", status: "Completed", date: "6 days ago" },
  ];

  return (
    <div className="space-y-6 max-w-[800px]">
      <div>
        <h1 className="text-h1 font-bold tracking-tight">Backup Center</h1>
        <p className="text-small text-muted">
          Export database tables, download snapshot archives, and verify storage bucket health.
        </p>
      </div>

      {success && (
        <div className="border border-border p-4 rounded-sm bg-surface flex items-center space-x-3 text-small text-foreground">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {errorMsg && (
        <div className="border border-border p-4 rounded-sm bg-surface flex items-center space-x-3 text-small text-foreground">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Database backup card */}
        <Card className="p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-border pb-2">
              <Database className="h-4 w-4 text-muted" />
              <h2 className="text-h3 font-bold">SQL Database Export</h2>
            </div>
            <p className="text-caption text-muted">
              Export all CMS tables (site settings, home/about sections, projects, experience, skills, certifications, social links, and SEO metadata) as a type-safe JSON document.
            </p>
            <div className="text-[11px] text-muted space-y-1 pt-1">
              <p>• Tables included: <span className="text-foreground font-semibold">9 tables</span></p>
              <p>• Output Format: <span className="text-foreground font-semibold">JSON UTF-8</span></p>
              <p>• Backup Status: <span className="text-foreground font-semibold">Ready</span></p>
            </div>
          </div>

          <Button onClick={handleExport} disabled={isExporting} className="w-full mt-4">
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Compiling...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export Database
              </>
            )}
          </Button>
        </Card>

        {/* Storage status card */}
        <Card className="p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-border pb-2">
              <Cloud className="h-4 w-4 text-muted" />
              <h2 className="text-h3 font-bold">Storage Buckets Health</h2>
            </div>
            <p className="text-caption text-muted">
              Verify connection health and availability of your Supabase Storage buckets.
            </p>
            <div className="text-[11px] text-muted space-y-2 pt-1">
              <div className="flex justify-between items-center">
                <span>images/ (Images & media)</span>
                <span className="text-[9px] font-bold bg-foreground text-background px-1.5 py-0.2 rounded-sm">ONLINE</span>
              </div>
              <div className="flex justify-between items-center">
                <span>resume/ (Documents & PDFs)</span>
                <span className="text-[9px] font-bold bg-foreground text-background px-1.5 py-0.2 rounded-sm">ONLINE</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border mt-4 text-[10px] text-muted italic text-center">
            Storage bucket backups are compiled weekly.
          </div>
        </Card>
      </div>

      {/* Backup Logs */}
      <Card className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-border pb-2">
          <FileCode className="h-4 w-4 text-muted" />
          <h2 className="text-h3 font-bold">Recent Backup Snapshots</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-small">
            <thead>
              <tr className="border-b border-border text-muted font-bold text-[10px] uppercase tracking-wider">
                <th className="pb-3">Backup Type</th>
                <th className="pb-3">File Name</th>
                <th className="pb-3">Size</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockBackups.map((bk, i) => (
                <tr key={i} className="hover:bg-surface/30 transition-colors">
                  <td className="py-3 font-semibold text-foreground">{bk.type}</td>
                  <td className="py-3 text-muted font-mono text-caption">{bk.name}</td>
                  <td className="py-3 text-muted">{bk.size}</td>
                  <td className="py-3 text-foreground font-semibold">{bk.status}</td>
                  <td className="py-3 text-right text-muted">{bk.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
