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
import { Card, Button, Badge } from "@/components/ui";
import { SubmissionsTable } from "@/components/admin/submissions-table";
import { QuickActionsToolbar } from "@/components/admin/quick-actions-toolbar";
import { DashboardScratchpad } from "@/components/admin/dashboard-scratchpad";
import { ContentHealthWidget } from "@/components/admin/content-health-widget";
import { AnimateIn } from "@/components/ui/animate-in";
import {
  Plus,
  ShieldCheck,
  StickyNote,
  ExternalLink,
  Layers,
  FileText,
  Briefcase,
  Mail,
  Zap,
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
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* ─── Top Header & System Indicator ─────────────────────────────────── */}
      <AnimateIn from="up" distance={12} duration={0.35} viewport={false}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-h2 md:text-h1 font-bold tracking-tight text-foreground">
                Dashboard Overview
              </h1>
              <Badge variant="pill" className="text-xs px-2.5 py-0.5">
                v2.0
              </Badge>
            </div>
            <p className="text-small text-muted mt-1">
              Central control hub for portfolio content, live CMS entries, and system operations.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-caption font-semibold uppercase tracking-wider text-foreground border border-border/80 px-3 py-1.5 liquid-glass rounded-lg shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Active & Verified</span>
            </div>
          </div>
        </div>
      </AnimateIn>

      {/* ─── Quick Operations & Tools Suite ────────────────────────────────── */}
      <AnimateIn from="up" distance={14} delay={0.05} viewport={false}>
        <QuickActionsToolbar />
      </AnimateIn>

      {/* ─── Key Metrics Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimateIn from="up" distance={16} staggerIndex={0} viewport={false}>
          <Link href="/admin/projects" className="block group">
            <Card className="liquid-glass-card flex items-center justify-between p-5 hover:border-border-strong transition-all">
              <div className="space-y-1">
                <span className="text-caption font-bold uppercase tracking-wider text-muted">
                  Total Projects
                </span>
                <p className="text-[2.25rem] font-bold leading-none text-foreground tabular-nums">
                  {totalProjects}
                </p>
                <span className="text-[11px] text-muted group-hover:text-foreground transition-colors font-medium">
                  {projects.filter((p) => p.published).length} Published on site →
                </span>
              </div>
              <div className="p-3 bg-surface/80 border border-border rounded-xl shadow-2xs group-hover:scale-110 transition-transform">
                <i className="fi fi-br-folder text-xl text-foreground leading-none" aria-hidden="true" />
              </div>
            </Card>
          </Link>
        </AnimateIn>

        <AnimateIn from="up" distance={16} staggerIndex={1} viewport={false}>
          <Link href="/admin/posts" className="block group">
            <Card className="liquid-glass-card flex items-center justify-between p-5 hover:border-border-strong transition-all">
              <div className="space-y-1">
                <span className="text-caption font-bold uppercase tracking-wider text-muted">
                  Blog Articles
                </span>
                <p className="text-[2.25rem] font-bold leading-none text-foreground tabular-nums">
                  {totalPosts}
                </p>
                <span className="text-[11px] text-muted group-hover:text-foreground transition-colors font-medium">
                  {posts.filter((p) => p.published).length} Published articles →
                </span>
              </div>
              <div className="p-3 bg-surface/80 border border-border rounded-xl shadow-2xs group-hover:scale-110 transition-transform">
                <i className="fi fi-br-edit text-xl text-foreground leading-none" aria-hidden="true" />
              </div>
            </Card>
          </Link>
        </AnimateIn>

        <AnimateIn from="up" distance={16} staggerIndex={2} viewport={false}>
          <Link href="/admin/services" className="block group">
            <Card className="liquid-glass-card flex items-center justify-between p-5 hover:border-border-strong transition-all">
              <div className="space-y-1">
                <span className="text-caption font-bold uppercase tracking-wider text-muted">
                  Services Offered
                </span>
                <p className="text-[2.25rem] font-bold leading-none text-foreground tabular-nums">
                  {totalServices}
                </p>
                <span className="text-[11px] text-muted group-hover:text-foreground transition-colors font-medium">
                  Active offerings →
                </span>
              </div>
              <div className="p-3 bg-surface/80 border border-border rounded-xl shadow-2xs group-hover:scale-110 transition-transform">
                <i className="fi fi-br-cube text-xl text-foreground leading-none" aria-hidden="true" />
              </div>
            </Card>
          </Link>
        </AnimateIn>

        <AnimateIn from="up" distance={16} staggerIndex={3} viewport={false}>
          <Link href="/admin/messages" className="block group">
            <Card className="liquid-glass-card flex items-center justify-between p-5 hover:border-border-strong transition-all">
              <div className="space-y-1">
                <span className="text-caption font-bold uppercase tracking-wider text-muted">
                  Contact Inquiries
                </span>
                <p className="text-[2.25rem] font-bold leading-none text-foreground tabular-nums">
                  {unreadSubmissions}
                </p>
                <span className="text-[11px] text-muted group-hover:text-foreground transition-colors font-medium">
                  {unreadSubmissions > 0 ? `${unreadSubmissions} Unread pending →` : "All inbox resolved →"}
                </span>
              </div>
              <div className="p-3 bg-surface/80 border border-border rounded-xl shadow-2xs group-hover:scale-110 transition-transform">
                <i className="fi fi-br-envelope text-xl text-foreground leading-none" aria-hidden="true" />
              </div>
            </Card>
          </Link>
        </AnimateIn>
      </div>

      {/* ─── Middle Section: Content Health & Interactive Scratchpad ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimateIn from="up" distance={18} delay={0.1} viewport={false}>
          <ContentHealthWidget
            projects={projects}
            posts={posts}
            services={services}
            testimonials={testimonials}
            unreadMessages={unreadSubmissions}
          />
        </AnimateIn>

        <AnimateIn from="up" distance={18} delay={0.15} viewport={false}>
          <DashboardScratchpad initialNotes={notes} />
        </AnimateIn>
      </div>

      {/* ─── Bottom Section: Recent Inquiries & Fast Creation Shortcuts ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle: Submissions */}
        <AnimateIn from="up" distance={20} delay={0.2} viewport={false} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-h3 font-bold tracking-tight text-foreground">
                Recent Contact Messages
              </h2>
              <p className="text-caption text-muted">
                Inquiries received through the public contact form
              </p>
            </div>
            <Link
              href="/admin/messages"
              className="text-small font-semibold text-foreground hover:underline underline-offset-4"
            >
              Open Full Inbox →
            </Link>
          </div>
          <SubmissionsTable submissions={submissions} />
        </AnimateIn>

        {/* Right: Quick Creation Shortcuts */}
        <AnimateIn from="up" distance={20} delay={0.25} viewport={false} className="space-y-4">
          <div>
            <h2 className="text-h3 font-bold tracking-tight text-foreground">
              CMS Creation Shortcuts
            </h2>
            <p className="text-caption text-muted">
              Direct links to author and publish content
            </p>
          </div>

          <Card className="liquid-glass-card space-y-2.5 p-5">
            <Button asChild className="w-full justify-start animate-btn-scale" variant="primary">
              <Link href="/admin/posts">
                <Plus className="mr-2.5 h-4 w-4" />
                Write New Article
              </Link>
            </Button>
            <Button asChild className="w-full justify-start animate-btn-scale" variant="secondary">
              <Link href="/admin/projects">
                <Plus className="mr-2.5 h-4 w-4" />
                Publish Project Case Study
              </Link>
            </Button>
            <Button asChild className="w-full justify-start animate-btn-scale" variant="secondary">
              <Link href="/admin/services">
                <Plus className="mr-2.5 h-4 w-4" />
                Add Service Offering
              </Link>
            </Button>
            <Button asChild className="w-full justify-start animate-btn-scale" variant="secondary">
              <Link href="/admin/testimonials">
                <Plus className="mr-2.5 h-4 w-4" />
                Add Client Testimonial
              </Link>
            </Button>
            <Button asChild className="w-full justify-start animate-btn-scale" variant="secondary">
              <Link href="/admin/notifications">
                <Zap className="mr-2.5 h-4 w-4" />
                Broadcast Notification Banner
              </Link>
            </Button>
            <Button asChild className="w-full justify-start animate-btn-scale" variant="ghost">
              <Link href="/admin/audit-logs">
                <ShieldCheck className="mr-2.5 h-4 w-4" />
                Review System Audit Logs
              </Link>
            </Button>
          </Card>
        </AnimateIn>
      </div>
    </div>
  );
}
