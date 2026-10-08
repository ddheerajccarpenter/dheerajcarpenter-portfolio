import { getAllProjects } from "@/lib/data/public";
import { ProjectsManager } from "@/components/admin/projects-manager";

export const revalidate = 0; // Dynamic rendering for admin pages

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-bold tracking-tight">
          Manage Projects
        </h1>
        <p className="text-small text-muted">
          Add, edit, and delete projects in your portfolio, upload cover images, and manage screenshots.
        </p>
      </div>

      <ProjectsManager initialProjects={projects} />
    </div>
  );
}
