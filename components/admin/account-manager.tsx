"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button, Input, Label, Card } from "@/components/ui";
import { Loader2, CheckCircle2, ShieldAlert } from "lucide-react";

import { useAdminToast } from "@/components/admin/admin-toast";

interface AccountManagerProps {
  initialUser: {
    email?: string;
    name?: string;
  };
}

export function AccountManager({ initialUser }: AccountManagerProps) {
  const [name, setName] = useState(initialUser.name || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPass, setIsSubmittingPass] = useState(false);
  const toast = useAdminToast();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmittingProfile(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: name.trim() },
      });

      if (error) throw error;
      toast.success("Profile name updated", `Set to "${name.trim()}"`);
    } catch (err) {
      const error = err as Error;
      toast.error("Failed to update profile name", error.message);
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    if (password.length < 6) {
      toast.error("Password update failed", "Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password update failed", "Passwords do not match.");
      return;
    }

    setIsSubmittingPass(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;
      toast.success("Password updated", "Account credentials updated successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      const error = err as Error;
      toast.error("Failed to update password", error.message);
    } finally {
      setIsSubmittingPass(false);
    }
  };

  return (
    <div className="space-y-8 max-w-[600px]">
      {/* Profile info card */}
      <Card className="space-y-4">
        <h2 className="text-h3 font-bold tracking-tight border-b border-border pb-2">
          Admin Profile
        </h2>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Email Address (Read-only)</Label>
            <Input value={initialUser.email || ""} disabled className="bg-surface/50 opacity-80 cursor-not-allowed" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Administrator"
              disabled={isSubmittingProfile}
            />
          </div>

          <Button type="submit" disabled={isSubmittingProfile || !name.trim()}>
            {isSubmittingProfile ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Update Profile Name"
            )}
          </Button>
        </form>
      </Card>

      {/* Security credentials card */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-h3 font-bold tracking-tight">Security & Credentials</h2>
          <ShieldAlert className="h-4 w-4 text-muted" />
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="newPass">New Password</Label>
            <Input
              id="newPass"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmittingPass}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPass">Confirm Password</Label>
            <Input
              id="confirmPass"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmittingPass}
            />
          </div>

          <Button type="submit" disabled={isSubmittingPass || !password}>
            {isSubmittingPass ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Changing...
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
