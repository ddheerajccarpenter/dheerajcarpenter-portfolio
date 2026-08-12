import { requireAdmin } from "@/lib/auth";
import { AccountManager } from "@/components/admin/account-manager";

export const revalidate = 0; // Dynamic rendering for admin pages

export default async function AdminAccountPage() {
  const session = await requireAdmin();

  const initialUser = {
    email: session.email || "",
    name: session.name || "",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-bold tracking-tight">
          Admin Account Settings
        </h1>
        <p className="text-small text-muted">
          Configure profile details and secure password credentials for CMS access.
        </p>
      </div>

      <AccountManager initialUser={initialUser} />
    </div>
  );
}
