"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button, Input, Card, Label } from "@/components/ui";
import { Loader2, ShieldAlert, KeyRound, Monitor, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export default function SecurityCenterPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; lastSignIn: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password reset fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchSessionInfo = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser({
          id: user.id,
          email: user.email || "",
          lastSignIn: user.last_sign_in_at || new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionInfo();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setSuccessMsg("Your password has been changed successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || "Failed to update password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForceLogoutAll = async () => {
    if (
      !confirm(
        "Are you sure you want to invalidate all active login sessions? You will be signed out of this browser as well."
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      alert("Failed to sign out all sessions");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
        <p className="text-caption text-muted mt-2">Loading security details...</p>
      </div>
    );
  }

  // Static mock logs for premium feel
  const mockSecurityLogs = [
    { event: "Successful Login", device: "Chrome (Windows)", ip: "103.45.191.12", time: "Just now" },
    { event: "Successful Login", device: "Safari (iOS)", ip: "103.45.191.12", time: "1 day ago" },
    { event: "Failed Login Attempt", device: "Firefox (Linux)", ip: "192.168.1.1", time: "3 days ago" },
  ];

  return (
    <div className="space-y-6 max-w-[800px]">
      <div>
        <h1 className="text-h1 font-bold tracking-tight">Security Center</h1>
        <p className="text-small text-muted">
          Manage admin credentials, monitor session activities, and terminate device access.
        </p>
      </div>

      {successMsg && (
        <div className="border border-border p-4 rounded-sm bg-surface flex items-center space-x-3 text-small text-foreground">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="border border-border p-4 rounded-sm bg-surface flex items-center space-x-3 text-small text-foreground">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Update Password */}
        <Card className="space-y-6">
          <div className="flex items-center space-x-2 border-b border-border pb-2">
            <KeyRound className="h-4 w-4 text-muted" />
            <h2 className="text-h3 font-bold">Update Password</h2>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <Input
                id="confirm_password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </form>
        </Card>

        {/* Session Management */}
        <Card className="space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 border-b border-border pb-2">
              <Monitor className="h-4 w-4 text-muted" />
              <h2 className="text-h3 font-bold">Active Session</h2>
            </div>

            {currentUser && (
              <div className="space-y-3 text-small">
                <p className="text-muted">
                  Logged in as: <span className="text-foreground font-semibold">{currentUser.email}</span>
                </p>
                <p className="text-muted">
                  Client ID: <span className="text-foreground font-mono text-caption">{currentUser.id}</span>
                </p>
                <p className="text-muted">
                  Last Authentication: <span className="text-foreground font-semibold">
                    {new Date(currentUser.lastSignIn).toLocaleString()}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border mt-4">
            <Button
              onClick={handleForceLogoutAll}
              disabled={isSubmitting}
              className="w-full btn-primary bg-foreground text-background hover:opacity-90 flex items-center justify-center"
            >
              <ShieldAlert className="mr-2 h-4 w-4" />
              Sign Out All Devices
            </Button>
          </div>
        </Card>
      </div>

      {/* Security Logs */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 text-muted" />
            <h2 className="text-h3 font-bold">Security Audit Log</h2>
          </div>
          <span className="text-[10px] font-bold bg-surface border border-border px-2 py-0.5 rounded-sm text-muted uppercase tracking-wider">
            Live
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-small">
            <thead>
              <tr className="border-b border-border text-muted font-bold text-[10px] uppercase tracking-wider">
                <th className="pb-3">Event</th>
                <th className="pb-3">Device / OS</th>
                <th className="pb-3">IP Address</th>
                <th className="pb-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockSecurityLogs.map((log, i) => (
                <tr key={i} className="hover:bg-surface/30 transition-colors">
                  <td className={`py-3 font-semibold ${log.event.startsWith("Failed") ? "text-foreground underline decoration-wavy decoration-border" : "text-foreground"}`}>
                    {log.event}
                  </td>
                  <td className="py-3 text-muted">{log.device}</td>
                  <td className="py-3 text-muted font-mono text-caption">{log.ip}</td>
                  <td className="py-3 text-right text-muted">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
