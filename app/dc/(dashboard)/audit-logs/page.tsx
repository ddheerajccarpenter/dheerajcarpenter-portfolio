import { getAuditLogs } from "@/lib/data/public";
import { AuditLogsView } from "@/components/admin/audit-logs-view";

export const revalidate = 0;

export default async function AdminAuditLogsPage() {
  const logs = await getAuditLogs();

  return (
    <div className="p-6 md:p-8">
      <AuditLogsView initialLogs={logs} />
    </div>
  );
}
