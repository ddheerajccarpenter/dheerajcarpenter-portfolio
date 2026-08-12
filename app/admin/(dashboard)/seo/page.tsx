import { getAllSeoMetadata } from "@/lib/data/public";
import { SeoEditor } from "@/components/admin/seo-editor";

export const revalidate = 0; // Dynamic rendering for admin pages

export default async function AdminSeoPage() {
  const records = await getAllSeoMetadata();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-bold tracking-tight">
          Manage SEO Metadata
        </h1>
        <p className="text-small text-muted">
          Optimize search engine visibility by configuring title tags, description tags, and social cards per page.
        </p>
      </div>

      <SeoEditor initialRecords={records} />
    </div>
  );
}
