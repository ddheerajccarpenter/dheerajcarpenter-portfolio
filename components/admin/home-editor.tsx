"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { homeContentSchema, type HomeContentValues } from "@/lib/validators";
import { updateHomeContent } from "@/lib/data/actions";
import { Button, Input, Textarea, Label, Card } from "@/components/ui";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

import { useAdminToast } from "@/components/admin/admin-toast";

export function HomeEditor({ initialData }: { initialData: HomeContentValues }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useAdminToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HomeContentValues>({
    resolver: zodResolver(homeContentSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: HomeContentValues) => {
    setIsSubmitting(true);

    try {
      await updateHomeContent(data);
      toast.success("Home content saved successfully", "Hero & introduction updated");
    } catch (err) {
      const error = err as Error;
      toast.error("Failed to update home content", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-[800px]">

      {/* Hero configuration */}
      <Card className="space-y-6">
        <h2 className="text-h3 font-bold tracking-tight border-b border-border pb-2">
          Hero Copy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="hero_name">Display Name</Label>
            <Input id="hero_name" {...register("hero_name")} disabled={isSubmitting} />
            {errors.hero_name && <p className="text-caption text-foreground">{errors.hero_name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_role">Professional Role</Label>
            <Input id="hero_role" {...register("hero_role")} disabled={isSubmitting} />
            {errors.hero_role && <p className="text-caption text-foreground">{errors.hero_role.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero_intro">Short Introduction</Label>
          <Textarea id="hero_intro" rows={3} {...register("hero_intro")} disabled={isSubmitting} />
          {errors.hero_intro && <p className="text-caption text-foreground">{errors.hero_intro.message}</p>}
        </div>
      </Card>

      {/* Call to Actions configuration */}
      <Card className="space-y-6">
        <h2 className="text-h3 font-bold tracking-tight border-b border-border pb-2">
          Primary & Secondary Buttons
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-caption font-bold uppercase tracking-wider text-muted">Primary Button</h3>
            <div className="space-y-2">
              <Label htmlFor="primary_cta_label">Label</Label>
              <Input id="primary_cta_label" {...register("primary_cta_label")} disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary_cta_href">Link Destination (href)</Label>
              <Input id="primary_cta_href" {...register("primary_cta_href")} disabled={isSubmitting} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-caption font-bold uppercase tracking-wider text-muted">Secondary Button</h3>
            <div className="space-y-2">
              <Label htmlFor="secondary_cta_label">Label</Label>
              <Input id="secondary_cta_label" {...register("secondary_cta_label")} disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary_cta_href">Link Destination (href)</Label>
              <Input id="secondary_cta_href" {...register("secondary_cta_href")} disabled={isSubmitting} />
            </div>
          </div>
        </div>
      </Card>

      {/* Preview Section copy */}
      <Card className="space-y-6">
        <h2 className="text-h3 font-bold tracking-tight border-b border-border pb-2">
          Home Previews
        </h2>
        <div className="space-y-2">
          <Label htmlFor="about_preview">About Section Preview</Label>
          <Textarea id="about_preview" rows={4} {...register("about_preview")} disabled={isSubmitting} />
          {errors.about_preview && <p className="text-caption text-foreground">{errors.about_preview.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_cta">Contact CTA text</Label>
          <Textarea id="contact_cta" rows={3} {...register("contact_cta")} disabled={isSubmitting} />
          {errors.contact_cta && <p className="text-caption text-foreground">{errors.contact_cta.message}</p>}
        </div>
      </Card>

      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-10">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving changes...
          </>
        ) : (
          "Save Homepage Content"
        )}
      </Button>
    </form>
  );
}
