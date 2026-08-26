"use client";

import { useState } from "react";
import { purgeAllCache, testDatabaseHealth, exportDatabaseContent } from "@/lib/data/actions";
import { useAdminToast } from "@/components/admin/admin-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  RotateCcw,
  Activity,
  Download,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  Database,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export function QuickActionsToolbar() {
  const { toast } = useAdminToast();
  const [isPurging, setIsPurging] = useState(false);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [dbStatus, setDbStatus] = useState<{
    latencyMs?: number;
    status?: "healthy" | "degraded";
    timestamp?: string;
  } | null>(null);

  const handlePurgeCache = async () => {
    setIsPurging(true);
    try {
      await purgeAllCache();
      toast({
        title: "Edge Cache Purged",
        description: "Global ISR and route cache purged. Live site updated.",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Purge Failed",
        description: err instanceof Error ? err.message : "Failed to purge cache",
        variant: "error",
      });
    } finally {
      setIsPurging(false);
    }
  };

  const handleTestDatabase = async () => {
    setIsTestingDb(true);
    try {
      const result = await testDatabaseHealth();
      setDbStatus(result);
      if (result.status === "healthy") {
        toast({
          title: `Supabase Connected (${result.latencyMs}ms)`,
          description: `All database tables responsive and operational.`,
          variant: "success",
        });
      } else {
        toast({
          title: "Database Latency High",
          description: result.error || "Latency degraded",
          variant: "error",
        });
      }
    } catch {
      toast({
        title: "Database Ping Error",
        description: "Could not reach database",
        variant: "error",
      });
    } finally {
      setIsTestingDb(false);
    }
  };

  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
      const data = await exportDatabaseContent();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup Exported",
        description: "JSON file downloaded with all database tables.",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Export Failed",
        description: err instanceof Error ? err.message : "Export failed",
        variant: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="liquid-glass-card p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-surface border border-border shadow-2xs">
            <Sparkles className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <h2 className="text-body font-bold tracking-tight text-foreground">
              Instant Operations & Tools
            </h2>
            <p className="text-caption text-muted">
              Live maintenance triggers, global cache purger & quick data tools
            </p>
          </div>
        </div>

        {dbStatus && (
          <div className="flex items-center space-x-2 text-caption px-3 py-1 rounded-full bg-surface border border-border">
            {dbStatus.status === "healthy" ? (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-foreground">
                  DB: {dbStatus.latencyMs}ms
                </span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="font-semibold text-foreground">DB Degraded</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Purge Cache Button */}
        <Button
          onClick={handlePurgeCache}
          disabled={isPurging}
          variant="secondary"
          className="w-full justify-start text-small h-11 animate-btn-scale"
        >
          {isPurging ? (
            <Loader2 className="mr-2.5 h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="mr-2.5 h-4 w-4 text-foreground" />
          )}
          <span>{isPurging ? "Purging Edge..." : "Purge All Cache"}</span>
        </Button>

        {/* Database Health Ping */}
        <Button
          onClick={handleTestDatabase}
          disabled={isTestingDb}
          variant="secondary"
          className="w-full justify-start text-small h-11 animate-btn-scale"
        >
          {isTestingDb ? (
            <Loader2 className="mr-2.5 h-4 w-4 animate-spin" />
          ) : (
            <Activity className="mr-2.5 h-4 w-4 text-foreground" />
          )}
          <span>{isTestingDb ? "Pinging DB..." : "Ping Database"}</span>
        </Button>

        {/* Quick JSON Export */}
        <Button
          onClick={handleExportBackup}
          disabled={isExporting}
          variant="secondary"
          className="w-full justify-start text-small h-11 animate-btn-scale"
        >
          {isExporting ? (
            <Loader2 className="mr-2.5 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2.5 h-4 w-4 text-foreground" />
          )}
          <span>{isExporting ? "Exporting..." : "Export Full Backup"}</span>
        </Button>

        {/* Live Site Preview Link */}
        <Button
          asChild
          variant="secondary"
          className="w-full justify-start text-small h-11 animate-btn-scale"
        >
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2.5 h-4 w-4 text-foreground" />
            <span>Open Live Site</span>
          </Link>
        </Button>
      </div>
    </Card>
  );
}
