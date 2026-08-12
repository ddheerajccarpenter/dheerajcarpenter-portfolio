import Link from "next/link";
import {
  getAllProjects,
  getAllExperience,
  getContactSubmissions,
  getAllPosts,
  getAllServices,
  getAllTestimonials,
  getAdminNotes,
} from "@/lib/data/public";
import { Card, Button } from "@/components/ui";
import { SubmissionsTable } from "@/components/admin/submissions-table";
import { AnimateIn } from "@/components/ui/animate-in";
import {
  Plus,
  ShieldCheck,
  StickyNote,
} from "lucide-react";

export const revalidate = 0; // Dynamic rendering for admin dashboard

export default async function AdminDashboardPage() {
  const [projects, experiences, submissions, posts, services, testimonials, notes] = await Promise.all([
    getAllProjects(),
    getAllExperience(),
    getContactSubmissions(),
    getAllPosts(),
    getAllServices(),
    getAllTestimonials(),
    getAdminNotes(),
  ]);

  const totalProjects = projects.length;
  const totalExperience = experiences.length;
  const unreadSubmissions = submissions.filter((sub) => !sub.is_read).length;
  const totalPosts = posts.length;
  const totalServices = services.length;
  const totalTestimonials = testimonials.length;
  const activeNotes = notes.filter((n) => !n.completed).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <AnimateIn from="up" distance={12} duration={0.35} viewport={false}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-h2 md:text-h1 font-bold tracking-tight text-foreground">
              Dashboard Overview
            </h1>
            <p className="text-small text-muted mt-1">
              Central control hub for your portfolio content, CMS entries, and system activity.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-caption font-semibold uppercase tracking-wider text-foreground border border-border px-3 py-1.5 bg-surface rounded-md shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>System Active & Verified</span>
          </div>
        </div>
      </AnimateIn>

      {/* Metrics Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimateIn from="up" distance={16} staggerIndex={0} viewport={false}>
          <Card className="flex items-center justify-between p-5 hover:border-border-strong transition-all animate-card-float">
            <div className="space-y-1">
              <span className="text-caption font-bold uppercase tracking-wider text-muted">
                Total Projects
              </span>
              <p className="text-[2.25rem] font-bold leading-none text-foreground">{totalProjects}</p>
            </div>
            <div className="p-3 bg-surface border border-border rounded-lg shadow-2xs">
              <i className="fi fi-br-folder text-xl text-foreground leading-none" aria-hidden="true" />
            </div>
          </Card>
        </AnimateIn>

        <AnimateIn from="up" distance={16} staggerIndex={1} viewport={false}>
          <Card className="flex items-center justify-between p-5 hover:border-border-strong transition-all animate-card-float">
            <div className="space-y-1">
              <span className="text-caption font-bold uppercase tracking-wider text-muted">
                Blog Articles
              </span>
              <p className="text-[2.25rem] font-bold leading-none text-foreground">{totalPosts}</p>
            </div>
            <div className="p-3 bg-surface border border-border rounded-lg shadow-2xs">
              <i className="fi fi-br-edit text-xl text-foreground leading-none" aria-hidden="true" />
            </div>
          </Card>
        </AnimateIn>

        <AnimateIn from="up" distance={16} staggerIndex={2} viewport={false}>
          <Card className="flex items-center justify-between p-5 hover:border-border-strong transition-all animate-card-float">
            <div className="space-y-1">
              <span className="text-caption font-bold uppercase tracking-wider text-muted">
                Services Offered
              </span>
              <p className="text-[2.25rem] font-bold leading-none text-foreground">{totalServices}</p>
            </div>
            <div className="p-3 bg-surface border border-border rounded-lg shadow-2xs">
              <i className="fi fi-br-cube text-xl text-foreground leading-none" aria-hidden="true" />
            </div>
          </Card>
        </AnimateIn>

        <AnimateIn from="up" distance={16} staggerIndex={3} viewport={false}>
          <Card className="flex items-center justify-between p-5 hover:border-border-strong transition-all animate-card-float">
            <div className="space-y-1">
              <span className="text-caption font-bold uppercase tracking-wider text-muted">
                Unread Messages
              </span>
              <p className="text-[2.25rem] font-bold leading-none text-foreground">{unreadSubmissions}</p>
            </div>
            <div className="p-3 bg-surface border border-border rounded-lg shadow-2xs">
              <i className="fi fi-br-envelope text-xl text-foreground leading-none" aria-hidden="true" />
            </div>
          </Card>
        </AnimateIn>
      </div>

      {/* Metrics Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AnimateIn from="up" distance={16} staggerIndex={4} viewport={false}>
          <Card className="flex items-center justify-between p-5 hover:border-border-strong transition-all animate-card-float">
            <div>
              <span className="text-caption font-bold uppercase tracking-wider text-muted">
                Testimonials
              </span>
              <p className="text-h3 font-bold mt-1 text-foreground">{totalTestimonials} Received</p>
            </div>
            <i className="fi fi-br-comment-alt text-lg text-muted" aria-hidden="true" />
          </Card>
        </AnimateIn>

        <AnimateIn from="up" distance={16} staggerIndex={5} viewport={false}>
          <Card className="flex items-center justify-between p-5 hover:border-border-strong transition-all animate-card-float">
            <div>
              <span className="text-caption font-bold uppercase tracking-wider text-muted">
                Active Notes
              </span>
              <p className="text-h3 font-bold mt-1 text-foreground">{activeNotes} Open Tasks</p>
            </div>
            <i className="fi fi-br-copy text-lg text-muted" aria-hidden="true" />
          </Card>
        </AnimateIn>

        <AnimateIn from="up" distance={16} staggerIndex={6} viewport={false}>
          <Card className="flex items-center justify-between p-5 hover:border-border-strong transition-all animate-card-float">
            <div>
              <span className="text-caption font-bold uppercase tracking-wider text-muted">
                Timeline Entries
              </span>
              <p className="text-h3 font-bold mt-1 text-foreground">{totalExperience} Total</p>
            </div>
            <i className="fi fi-br-calendar text-lg text-muted" aria-hidden="true" />
          </Card>
        </AnimateIn>
      </div>

      {/* Quick Actions & Submissions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle: Submissions */}
        <AnimateIn from="up" distance={20} delay={0.1} viewport={false} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-h3 font-bold tracking-tight text-foreground">
              Recent Contact Messages
            </h2>
            <Link
              href="/admin/messages"
              className="text-small font-semibold text-muted hover:text-foreground underline underline-offset-4"
            >
              View Inbox
            </Link>
          </div>
          <SubmissionsTable submissions={submissions} />
        </AnimateIn>

        {/* Right: Quick Links */}
        <AnimateIn from="up" distance={20} delay={0.15} viewport={false} className="space-y-4">
          <h2 className="text-h3 font-bold tracking-tight text-foreground">
            CMS Quick Actions
          </h2>
          <Card className="space-y-3 p-5">
            <Button asChild className="w-full justify-start animate-btn-scale" variant="primary">
              <Link href="/admin/posts">
                <Plus className="mr-2 h-4 w-4" />
                Write New Article
              </Link>
            </Button>
            <Button asChild className="w-full justify-start animate-btn-scale" variant="secondary">
              <Link href="/admin/projects">
                <Plus className="mr-2 h-4 w-4" />
                Add New Project
              </Link>
            </Button>
            <Button asChild className="w-full justify-start animate-btn-scale" variant="secondary">
              <Link href="/admin/services">
                <Plus className="mr-2 h-4 w-4" />
                Add Service Offering
              </Link>
            </Button>
            <Button asChild className="w-full justify-start animate-btn-scale" variant="secondary">
              <Link href="/admin/testimonials">
                <Plus className="mr-2 h-4 w-4" />
                Add Testimonial
              </Link>
            </Button>
            <Button asChild className="w-full justify-start animate-btn-scale" variant="secondary">
              <Link href="/admin/notes">
                <StickyNote className="mr-2 h-4 w-4" />
                Quick Scratchpad
              </Link>
            </Button>
            <Button asChild className="w-full justify-start animate-btn-scale" variant="ghost">
              <Link href="/admin/audit-logs">
                <ShieldCheck className="mr-2 h-4 w-4" />
                System Audit Logs
              </Link>
            </Button>
          </Card>
        </AnimateIn>
      </div>
    </div>
  );
}
