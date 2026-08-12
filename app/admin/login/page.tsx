import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-24 transition-colors duration-200">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-small font-medium text-muted hover:text-foreground transition-colors underline underline-offset-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to website
          </Link>
        </div>

        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-h2 font-bold tracking-tight">
            CMS Admin Access
          </h1>
          <p className="text-small text-muted">
            Enter your admin credentials to manage portfolio content.
          </p>
        </div>

        <div className="border border-border p-6 rounded-sm bg-background">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
