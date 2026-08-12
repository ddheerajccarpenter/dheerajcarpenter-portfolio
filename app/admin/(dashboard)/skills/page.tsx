import { getSkills } from "@/lib/data/public";
import { SkillsManager } from "@/components/admin/skills-manager";

export const revalidate = 0; // Dynamic rendering for admin pages

export default async function AdminSkillsPage() {
  const skills = await getSkills();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-bold tracking-tight">
          Manage Skills
        </h1>
        <p className="text-small text-muted">
          Add, edit, or delete skills grouped by categories.
        </p>
      </div>

      <SkillsManager initialSkills={skills} />
    </div>
  );
}
