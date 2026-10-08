import { getAllPublicNotifications } from "@/lib/data/public";
import { NotificationsManager } from "@/components/admin/notifications-manager";

export const revalidate = 0; // Dynamic rendering for admin announcements page

export default async function AdminNotificationsPage() {
  const notifications = await getAllPublicNotifications();

  return <NotificationsManager initialNotifications={notifications} />;
}
