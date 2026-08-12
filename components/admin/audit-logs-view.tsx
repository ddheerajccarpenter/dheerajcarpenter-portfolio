"use client";

import { useState } from "react";
import type { AuditLog } from "@/types/database";
import { clearAuditLogs } from "@/lib/data/actions";
import { Button, Input, Card, Badge } from "@/components/ui";
import { ShieldAlert, Trash2, Search, Filter, ShieldCheck, Activity, Clock, RefreshCw } from "lucide-react";

interface AuditLogsViewProps {
  initialLogs: AuditLog[];
}

export function AuditLogsView({ initialLogs }: AuditLogsViewProps) {
  const [logs, setLogs] = useState<AuditLog[]>(initialLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user_email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesModule = moduleFilter === "all" || log.module === moduleFilter;

    return matchesSearch && matchesModule;
  });

  const handleClear = async () => {
    if (!confirm("Are you sure you want to clear all audit logs?")) return;
    setLoading(true);
    try {
      await clearAuditLogs();
      setLogs([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const modules = Array.from(new Set(logs.map((l) => l.module)));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-h2 font-bold tracking-tight">System Activity & Audit Logs</h2>
          <p className="text-body text-muted mt-1">
            Real-time security trail of administrative mutations, updates, and system events.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          {logs.length > 0 && (
            <Button variant="ghost" onClick={handleClear} disabled={loading} className="text-red-500 hover:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Logs
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface p-4 border border-border rounded-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action or details..."
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted shrink-0" />
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="w-full sm:w-auto bg-background border border-border rounded-sm px-3 py-2 text-small font-medium"
          >
            <option value="all">All Modules</option>
            {modules.map((m) => (
              <option key={m} value={m}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table / Timeline */}
      {filteredLogs.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-sm text-muted">
          <Activity className="mx-auto h-8 w-8 mb-3 opacity-50" />
          <p className="text-body font-medium">No audit logs found.</p>
          <p className="text-small text-muted mt-1">Actions performed in the admin panel will automatically be logged here.</p>
        </div>
      ) : (
        <Card className="divide-y divide-border overflow-hidden">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:bg-surface/50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-small font-bold text-foreground">{log.action}</span>
                  <Badge className="text-[10px] uppercase tracking-wider">
                    {log.module}
                  </Badge>
                </div>
                <p className="text-body-sm text-muted">{log.details}</p>
              </div>

              <div className="flex items-center gap-4 text-caption text-muted shrink-0">
                <span>{log.user_email}</span>
                <span className="flex items-center">
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  {new Date(log.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
