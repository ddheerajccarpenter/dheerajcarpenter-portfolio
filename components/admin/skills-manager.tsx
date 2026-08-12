"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillSchema, type SkillValues } from "@/lib/validators";
import { createSkill, updateSkill, deleteSkill } from "@/lib/data/actions";
import { Button, Input, Label, Card } from "@/components/ui";
import { Loader2, Edit2, Trash2, X, CheckCircle2 } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number | null;
  order: number;
}

export function SkillsManager({ initialSkills }: { initialSkills: Skill[] }) {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setSkills(initialSkills);
  }, [initialSkills]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SkillValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      category: "Frontend",
      proficiency: null,
      order: 0,
    },
  });

  const onSubmit = async (data: SkillValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccess(null);

    // Convert proficiency string to number or null
    const formattedData = {
      ...data,
      proficiency: data.proficiency !== null ? Number(data.proficiency) : null,
    };

    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, formattedData);
        setSkills((prev) =>
          prev.map((s) => (s.id === editingSkill.id ? { ...s, ...formattedData } : s))
        );
        setSuccess("Skill updated successfully!");
        setEditingSkill(null);
      } else {
        const created = await createSkill(formattedData);
        if (created) {
          setSkills((prev) => [...prev, created as Skill]);
        }
        setSuccess("Skill created successfully!");
      }
      reset({
        name: "",
        category: "Frontend",
        proficiency: null,
        order: 0,
      });
      router.refresh();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || "Failed to save skill.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setValue("name", skill.name);
    setValue("category", skill.category);
    setValue("proficiency", skill.proficiency);
    setValue("order", skill.order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingSkill(null);
    reset({
      name: "",
      category: "Frontend",
      proficiency: null,
      order: 0,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    setIsSubmitting(true);
    try {
      await deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      setSuccess("Skill deleted successfully!");
      router.refresh();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || "Failed to delete skill.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Add / Edit Form Panel */}
      <div>
        <Card className="space-y-6 sticky top-24">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <h2 className="text-h3 font-bold tracking-tight">
              {editingSkill ? "Edit Skill" : "Add New Skill"}
            </h2>
            {editingSkill && (
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
              <Label htmlFor="name">Skill Name</Label>
              <Input id="name" placeholder="e.g. TypeScript" {...register("name")} disabled={isSubmitting} />
              {errors.name && <p className="text-caption text-foreground">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="e.g. Frontend, Backend, Tools" {...register("category")} disabled={isSubmitting} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="proficiency">Proficiency (%, optional)</Label>
              <Input
                id="proficiency"
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 85"
                {...register("proficiency")}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="order">Display Order (weight)</Label>
              <Input
                id="order"
                type="number"
                placeholder="e.g. 0"
                {...register("order", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
            </div>

            <div className="pt-2 flex gap-3">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingSkill ? (
                  "Update Skill"
                ) : (
                  "Add Skill"
                )}
              </Button>
              {editingSkill && (
                <Button onClick={handleCancelEdit} variant="secondary" type="button">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>

      {/* Grid list of skills */}
      <div className="lg:col-span-2 space-y-8">
        {Object.keys(skillsByCategory).length === 0 ? (
          <div className="border border-dashed border-border p-16 text-center text-muted rounded-sm">
            No skills cataloged yet. Use the form to add some.
          </div>
        ) : (
          Object.entries(skillsByCategory).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-caption font-bold uppercase tracking-wider text-muted border-b border-border pb-1">
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((skill) => (
                  <Card
                    key={skill.id}
                    className="flex justify-between items-center py-3 px-4 hover:border-border-strong transition-colors"
                  >
                    <div className="space-y-1">
                      <span className="text-body font-semibold text-foreground">{skill.name}</span>
                      {skill.proficiency !== null && (
                        <span className="text-caption text-muted block">
                          Proficiency: {skill.proficiency}%
                        </span>
                      )}
                    </div>

                    <div className="flex space-x-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(skill)}
                        disabled={isSubmitting}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(skill.id)}
                        disabled={isSubmitting}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
