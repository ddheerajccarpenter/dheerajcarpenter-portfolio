import { getAllServices } from "@/lib/data/public";
import { ServicesManager } from "@/components/admin/services-manager";

export const revalidate = 0;

export default async function AdminServicesPage() {
  const services = await getAllServices();

  return (
    <div className="p-6 md:p-8">
      <ServicesManager initialServices={services} />
    </div>
  );
}
