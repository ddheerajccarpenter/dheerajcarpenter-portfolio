"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { aboutContentSchema, type AboutContentValues } from "@/lib/validators";
import { updateAboutContent } from "@/lib/data/actions";
import { Button, Input, Textarea, Label, Card } from "@/components/ui";
import { MediaUpload } from "./media-upload";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

import { useAdminToast } from "@/components/admin/admin-toast";

export function AboutEditor({ initialData }: { initialData: AboutContentValues }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useAdminToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AboutContentValues>({
    resolver: zodResolver(aboutContentSchema),
    defaultValues: initialData,
  });

  const photoUrl = watch("photo_url");

  const onSubmit = async (data: AboutContentValues) => {
    setIsSubmitting(true);

    try {
      await updateAboutContent(data);
      toast.success("About content saved successfully", "Bio & overview updated");
    } catch (err) {
      const error = err as Error;
      toast.error("Failed to update about content", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-[800px]">

      {/* Main content card */}
      <Card className="space-y-6">
        <h2 className="text-h3 font-bold tracking-tight border-b border-border pb-2">
          Headline & Photo
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Photo upload */}
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <MediaUpload
              bucket="images"
              value={photoUrl}
              onChange={(url) => setValue("photo_url", url)}
            />
          </div>

          {/* Headline */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="headline">Biography Headline</Label>
            <Input id="headline" {...register("headline")} disabled={isSubmitting} />
            {errors.headline && <p className="text-caption text-foreground">{errors.headline.message}</p>}
          </div>
        </div>
      </Card>

      {/* Full Bio Markdown editor */}
      <Card className="space-y-6">
        <div className="flex justify-between items-center border-b border-border pb-2">
          <h2 className="text-h3 font-bold tracking-tight">Biography (Markdown)</h2>
          <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">Supports Markdown</span>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Detailed Biography</Label>
          <Textarea id="bio" rows={10} {...register("bio")} disabled={isSubmitting} className="font-mono text-small" />
          {errors.bio && <p className="text-caption text-foreground">{errors.bio.message}</p>}
        </div>
      </Card>

      {/* Personal overview Markdown editor */}
      <Card className="space-y-6">
        <div className="flex justify-between items-center border-b border-border pb-2">
          <h2 className="text-h3 font-bold tracking-tight">Personal Overview (Markdown)</h2>
          <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">Supports Markdown</span>
        </div>
        <div className="space-y-2">
          <Label htmlFor="overview">Professional & Personal Philosophy</Label>
          <Textarea id="overview" rows={8} {...register("overview")} disabled={isSubmitting} className="font-mono text-small" />
          {errors.overview && <p className="text-caption text-foreground">{errors.overview.message}</p>}
        </div>
      </Card>

      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-10">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving changes...
          </>
        ) : (
          "Save About Content"
        )}
      </Button>
    </form>
  );
}
