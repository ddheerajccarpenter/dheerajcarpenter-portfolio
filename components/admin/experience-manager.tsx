"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceSchema, type ExperienceValues } from "@/lib/validators";
import { createExperience, updateExperience, deleteExperience } from "@/lib/data/actions";
import { normalizeUrl } from "@/lib/utils";
import { Button, Input, Textarea, Label, Card } from "@/components/ui";
import { Loader2, Edit2, Trash2, X, CheckCircle2, Calendar, Briefcase, GraduationCap, Award } from "lucide-react";

interface Experience {
  id: string;
  type: string;
  role: string;
  organization: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string;
  url: string | null;
  order: number;
  published: boolean;
}

export function ExperienceManager({ initialExperience }: { initialExperience: Experience[] }) {
  const router = useRouter();
  const [experiences, setExperiences] = useState<Experience[]>(initialExperience);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setExperiences(initialExperience);
  }, [initialExperience]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExperienceValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      type: "work",
      role: "",
      organization: "",
      location: "",
      start_date: "",
      end_date: "",
      current: false,
      description: "",
      url: "",
      order: 0,
      published: true,
    },
  });

  const isCurrent = watch("current");

  const onSubmit = async (data: ExperienceValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccess(null);

    // Format dates to fit database constraints
    const formattedData = {
      ...data,
      end_date: data.current ? null : data.end_date || null,
      location: data.location || null,
      url: data.url || null,
    };

    try {
      if (editingExp) {
        await updateExperience(editingExp.id, formattedData);
        setExperiences((prev) =>
          prev.map((e) => (e.id === editingExp.id ? { ...e, ...formattedData } : e))
        );
        setSuccess("Experience entry updated successfully!");
        setEditingExp(null);
      } else {
        const created = await createExperience(formattedData);
        if (created) {
          setExperiences((prev) => [...prev, created as Experience]);
        }
        setSuccess("Experience entry created successfully!");
      }
      reset({
        type: "work",
        role: "",
        organization: "",
        location: "",
        start_date: "",
        end_date: "",
        current: false,
        description: "",
        url: "",
        order: 0,
        published: true,
      });
      router.refresh();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || "Failed to save experience.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditingExp(exp);
    setValue("type", exp.type as "work" | "education" | "certification");
    setValue("role", exp.role);
    setValue("organization", exp.organization);
    setValue("location", exp.location || "");
    setValue("start_date", exp.start_date);
    setValue("end_date", exp.end_date || "");
    setValue("current", exp.current);
    setValue("description", exp.description);
    setValue("url", exp.url || "");
    setValue("order", exp.order);
    setValue("published", exp.published);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingExp(null);
    reset({
      type: "work",
      role: "",
      organization: "",
      location: "",
      start_date: "",
      end_date: "",
      current: false,
      description: "",
      url: "",
      order: 0,
      published: true,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;
    setIsSubmitting(true);
    try {
      await deleteExperience(id);
      setExperiences((prev) => prev.filter((e) => e.id !== id));
      setSuccess("Experience entry deleted successfully!");
      router.refresh();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || "Failed to delete experience.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "education":
        return GraduationCap;
      case "certification":
        return Award;
      default:
        return Briefcase;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Editor Panel */}
      <div>
        <Card className="space-y-6 sticky top-24">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <h2 className="text-h3 font-bold tracking-tight">
              {editingExp ? "Edit Entry" : "Add Entry"}
            </h2>
            {editingExp && (
              <Button onClick={handleCancelEdit} variant="ghost" size="sm" className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {success && (
            <div className="border border-border p-3 rounded-sm bg-surface flex items-center space-x-2 text-caption">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {errorMsg && (
            <div className="border border-border p-3 rounded-sm bg-surface text-caption text-foreground">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="type">Entry Type</Label>
              <select
                id="type"
                {...register("type")}
                className="h-10 w-full rounded-sm border border-border bg-background px-3 text-body text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                disabled={isSubmitting}
              >
                <option value="work">Work Experience</option>
                <option value="education">Education</option>
                <option value="certification">Certification</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role">Role / Degree / Certificate</Label>
              <Input id="role" placeholder="e.g. Senior Software Engineer" {...register("role")} disabled={isSubmitting} />
              {errors.role && <p className="text-caption text-foreground">{errors.role.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="organization">Organization / School / Issuer</Label>
              <Input id="organization" placeholder="e.g. Google" {...register("organization")} disabled={isSubmitting} />
              {errors.organization && <p className="text-caption text-foreground">{errors.organization.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Location (optional)</Label>
              <Input id="location" placeholder="e.g. San Francisco, CA" {...register("location")} disabled={isSubmitting} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="start_date">Start Date</Label>
                <Input id="start_date" type="date" {...register("start_date")} disabled={isSubmitting} />
                {errors.start_date && <p className="text-caption text-foreground">{errors.start_date.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  {...register("end_date")}
                  disabled={isSubmitting || isCurrent}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 py-1">
              <input
                id="current"
                type="checkbox"
                {...register("current")}
                disabled={isSubmitting}
                className="h-4 w-4 rounded-sm border-border bg-background text-foreground focus:ring-focus"
              />
              <Label htmlFor="current" className="cursor-pointer">I currently work / study here</Label>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description (Markdown)</Label>
              <Textarea id="description" rows={5} placeholder="Describe your achievements..." {...register("description")} disabled={isSubmitting} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="url">Link URL (optional)</Label>
              <Input
                id="url"
                placeholder="e.g. company.com or https://..."
                {...register("url")}
                onBlur={(e) => {
                  if (e.target.value) {
                    setValue("url", normalizeUrl(e.target.value));
                  }
                }}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="order">Order (weight)</Label>
                <Input id="order" type="number" {...register("order", { valueAsNumber: true })} disabled={isSubmitting} />
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  id="published"
                  type="checkbox"
                  {...register("published")}
                  disabled={isSubmitting}
                  className="h-4 w-4 rounded-sm border-border bg-background text-foreground focus:ring-focus"
                />
                <Label htmlFor="published" className="cursor-pointer">Published</Label>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingExp ? (
                  "Update Entry"
                ) : (
                  "Add Entry"
                )}
              </Button>
              {editingExp && (
                <Button onClick={handleCancelEdit} variant="secondary" type="button">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>

      {/* Experience list */}
      <div className="lg:col-span-2 space-y-4">
        {experiences.length === 0 ? (
          <div className="border border-dashed border-border p-16 text-center text-muted rounded-sm">
            No timeline entries. Add your first job, degree, or cert.
          </div>
        ) : (
          experiences.map((exp) => {
            const Icon = getIcon(exp.type);
            return (
              <Card
                key={exp.id}
                className={cn(
                  "flex justify-between items-start gap-4 hover:border-border-strong transition-colors",
                  !exp.published && "opacity-60 border-dashed"
                )}
              >
                <div className="flex gap-4">
                  <div className="p-2 bg-surface border border-border rounded-sm shrink-0">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-body font-bold text-foreground leading-tight">
                      {exp.role}
                    </h3>
                    <p className="text-small font-semibold text-foreground">
                      {exp.organization}
                    </p>
                    <span className="text-caption text-muted flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(exp.start_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                      {" — "}
                      {exp.current
                        ? "Present"
                        : exp.end_date
                        ? new Date(exp.end_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(exp)}
                    disabled={isSubmitting}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(exp.id)}
                    disabled={isSubmitting}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
