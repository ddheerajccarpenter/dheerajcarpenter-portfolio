import { getSettings } from "@/lib/data/public";
import { SettingsEditor } from "@/components/admin/settings-editor";

export const revalidate = 0; // Dynamic rendering for admin pages

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  const initialData = {
    site_title: settings?.site_title || "Portfolio",
    site_description: settings?.site_description || "",
    contact_email: settings?.contact_email || null,
    default_theme: (settings?.default_theme as "system" | "light" | "dark") || "system",
    animation_style: (settings?.animation_style as "new" | "classic" | "minimal" | "fluid" | "magnetic") || "new",
    ui_design: (settings?.ui_design as "minimalist" | "obsidian" | "nordic" | "tokyo" | "monolith" | "aurora") || "minimalist",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-bold tracking-tight">
          Global Settings
        </h1>
        <p className="text-small text-muted">
          Modify the primary title metadata, public communication email, and styling settings.
        </p>
      </div>

      <SettingsEditor initialData={initialData} />
    </div>
  );
}
