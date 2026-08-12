import { getAllExperience } from "@/lib/data/public";
import { ExperienceManager } from "@/components/admin/experience-manager";

export const revalidate = 0; // Dynamic rendering for admin pages

export default async function AdminExperiencePage() {
  const experience = await getAllExperience();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-bold tracking-tight">
          Manage Timeline
        </h1>
        <p className="text-small text-muted">
          Add, edit, or delete items on your professional work, academic, and certificate timeline.
        </p>
      </div>

      <ExperienceManager initialExperience={experience} />
    </div>
  );
}
