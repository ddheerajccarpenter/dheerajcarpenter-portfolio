"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateProfileRole, deleteProfile } from "@/lib/data/actions";
import { Button, Card, Label } from "@/components/ui";
import { Loader2, Users, Shield, Trash2, CheckCircle2, UserX } from "lucide-react";
import type { Profile } from "@/types/database";

export default function UserManagementPage() {
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      
      // Get current authenticated user session details
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setErrorMsg("Unauthorized session.");
        return;
      }

      // Fetch user profile to check role permissions
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", user.id)
        .single();

      if (!currentProfile) {
        setErrorMsg("User profile not found.");
        return;
      }

      setCurrentUser(currentProfile);

      if (currentProfile.role !== "super_admin" && currentProfile.role !== "admin") {
        setErrorMsg("Access Denied: Only Administrators can access user settings.");
        setLoading(false);
        return;
      }

      // Fetch all user profiles
      const { data: allProfiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setProfiles(allProfiles || []);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to load user profiles from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async (profileId: string, newRole: string) => {
    setUpdatingId(profileId);
    setSuccess(null);
    try {
      await updateProfileRole(profileId, newRole);
      setProfiles((prev) =>
        prev.map((p) => (p.id === profileId ? { ...p, role: newRole as Profile["role"] } : p))
      );
      setSuccess("User role updated successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const error = err as Error;
      alert(`Failed to update role: ${error.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteProfile = async (profileId: string, profileEmail: string) => {
    if (profileId === currentUser?.id) {
      alert("Security Violation: You cannot delete your own Administrator account.");
      return;
    }

    if (!confirm(`Are you sure you want to remove the user "${profileEmail}"? This will delete their CMS profile access.`)) {
      return;
    }

    setUpdatingId(profileId);
    try {
      await deleteProfile(profileId);
      setProfiles(profiles.filter((p) => p.id !== profileId));
      setSuccess("User profile deleted successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const error = err as Error;
      alert(`Failed to delete profile: ${error.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
        <p className="text-caption text-muted mt-2">Verifying credentials and loading profiles...</p>
      </div>
    );
  }

  if (currentUser?.role !== "super_admin" && currentUser?.role !== "admin") {
    return (
      <div className="border border-border border-dashed p-12 text-center text-muted rounded-sm max-w-[600px] mx-auto mt-12">
        <UserX className="h-10 w-10 mx-auto mb-3 text-muted" />
        <h3 className="text-body font-bold text-foreground">Access Restricted</h3>
        <p className="text-caption mt-1">
          Only users with the role <span className="font-semibold text-foreground">Admin</span> can manage administrative profiles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-bold tracking-tight">User Accounts</h1>
        <p className="text-small text-muted">
          Manage system administrators, editors, and assign roles for page mutations.
        </p>
      </div>

      {success && (
        <div className="border border-border p-3 rounded-sm bg-surface flex items-center space-x-2 text-caption max-w-[600px]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <Card className="max-w-[800px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-small">
            <thead>
              <tr className="border-b border-border bg-surface text-muted font-bold text-[10px] uppercase tracking-wider">
                <th className="p-4">Name / Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {profiles.map((profile) => {
                const isSelf = profile.id === currentUser.id;
                const isUpdating = updatingId === profile.id;

                return (
                  <tr key={profile.id} className="hover:bg-surface/30 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-foreground flex items-center space-x-1.5">
                        <span>{profile.name || "—"}</span>
                        {isSelf && (
                          <span className="text-[9px] font-bold bg-foreground text-background px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-caption text-muted">{profile.email}</div>
                    </td>

                    <td className="p-4">
                      {isUpdating ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin text-muted" />
                          <span className="text-caption text-muted">Updating...</span>
                        </div>
                      ) : (
                        <select
                          value={profile.role}
                          onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                          className="h-8 border border-border bg-background px-2 py-1 text-caption text-foreground rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                          disabled={isSelf} // Self role check is locked to prevent locking yourself out of super_admin!
                        >
                          <option value="super_admin">Super Admin</option>
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                        </select>
                      )}
                    </td>

                    <td className="p-4 text-muted whitespace-nowrap">
                      {new Date(profile.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    <td className="p-4 text-right">
                      <Button
                        onClick={() => handleDeleteProfile(profile.id, profile.email)}
                        disabled={isSelf || isUpdating}
                        variant="secondary"
                        size="sm"
                        className="h-8 p-2"
                        title={isSelf ? "Cannot delete yourself" : "Delete Profile"}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
