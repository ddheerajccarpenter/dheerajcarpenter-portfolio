"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { siteSettingsSchema, type SiteSettingsValues } from "@/lib/validators";
import { updateSiteSettings } from "@/lib/data/actions";
import { Button, Input, Textarea, Label, Card } from "@/components/ui";
import { Loader2, CheckCircle2, AlertCircle, Zap, Feather, Sparkles, Waves, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

import { useAdminToast } from "@/components/admin/admin-toast";

export function SettingsEditor({ initialData }: { initialData: SiteSettingsValues }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useAdminToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SiteSettingsValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      ...initialData,
      animation_style: initialData.animation_style ?? "new",
      ui_design: initialData.ui_design ?? "minimalist",
    },
  });

  const animStyle = watch("animation_style");

  const onSubmit = async (data: SiteSettingsValues) => {
    setIsSubmitting(true);

    try {
      await updateSiteSettings(data);
      toast.success("Settings saved successfully", "Global configurations updated");
    } catch (err) {
      const error = err as Error;
      toast.error("Failed to save settings", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-[600px]">
      <input type="hidden" {...register("ui_design")} />
      <input type="hidden" {...register("animation_style")} />

      <Card className="space-y-6">
        <h2 className="text-h3 font-bold tracking-tight border-b border-border pb-2">
          Global Settings
        </h2>

        <div className="space-y-2">
          <Label htmlFor="site_title">Site Title</Label>
          <Input id="site_title" {...register("site_title")} disabled={isSubmitting} />
          {errors.site_title && <p className="text-caption text-foreground">{errors.site_title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="site_description">Site Description (Meta Description)</Label>
          <Textarea id="site_description" rows={3} {...register("site_description")} disabled={isSubmitting} />
          {errors.site_description && <p className="text-caption text-foreground">{errors.site_description.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_email">Public Contact Email</Label>
          <Input id="contact_email" type="email" placeholder="hello@yourdomain.com" {...register("contact_email")} disabled={isSubmitting} />
          {errors.contact_email && <p className="text-caption text-foreground">{errors.contact_email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="default_theme">Default Site Theme</Label>
          <select
            id="default_theme"
            {...register("default_theme")}
            className="h-10 w-full rounded-sm border border-border bg-background px-3 text-body text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            disabled={isSubmitting}
          >
            <option value="system">System (Match browser settings)</option>
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>
      </Card>

      {/* ── UI/UX Design Themes (Admin Only Control) ────────────────────── */}
      <Card className="space-y-4">
        <div className="border-b border-border pb-2">
          <h2 className="text-h3 font-bold tracking-tight">Website UI/UX Design Theme</h2>
          <p className="text-caption text-muted mt-1">
            Choose the visual design theme for the entire website (Main Theme + 5 Exclusive Themes). This setting is strictly managed from the Admin Panel and 100% hidden from public visitors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* 1. Main Theme: Minimalist Blueprint */}
          <button
            type="button"
            onClick={() => setValue("ui_design", "minimalist", { shouldDirty: true })}
            disabled={isSubmitting}
            className={cn(
              "flex flex-col items-start gap-2 rounded-sm border p-4 text-left transition-colors relative",
              watch("ui_design") === "minimalist"
                ? "border-foreground bg-surface ring-1 ring-foreground"
                : "border-border hover:border-border-strong hover:bg-surface/50"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-small font-bold">1. Minimalist (Main)</span>
              {watch("ui_design") === "minimalist" && (
                <span className="text-[9px] font-bold uppercase tracking-wider border border-foreground px-1.5 py-0.5 rounded-sm">
                  Active
                </span>
              )}
            </div>
            <p className="text-caption text-muted leading-relaxed">
              Timeless black & white studio layout. Crisp 1px grid borders, high contrast, minimalist elegance.
            </p>
          </button>

          {/* 2. Cyber Emerald */}
          <button
            type="button"
            onClick={() => setValue("ui_design", "obsidian", { shouldDirty: true })}
            disabled={isSubmitting}
            className={cn(
              "flex flex-col items-start gap-2 rounded-sm border p-4 text-left transition-colors relative",
              watch("ui_design") === "obsidian"
                ? "border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500"
                : "border-border hover:border-emerald-500/50 hover:bg-surface/50"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-small font-bold text-emerald-600 dark:text-emerald-400">2. Cyber Emerald</span>
              {watch("ui_design") === "obsidian" && (
                <span className="text-[9px] font-bold uppercase tracking-wider border border-emerald-500 text-emerald-500 px-1.5 py-0.5 rounded-sm">
                  Active
                </span>
              )}
            </div>
            <p className="text-caption text-muted leading-relaxed">
              Deep dark obsidian background, electric emerald glowing accents, glassmorphic card borders.
            </p>
          </button>

          {/* 3. Nordic Atelier */}
          <button
            type="button"
            onClick={() => setValue("ui_design", "nordic", { shouldDirty: true })}
            disabled={isSubmitting}
            className={cn(
              "flex flex-col items-start gap-2 rounded-sm border p-4 text-left transition-colors relative",
              watch("ui_design") === "nordic"
                ? "border-amber-500 bg-amber-950/20 ring-1 ring-amber-500"
                : "border-border hover:border-amber-500/50 hover:bg-surface/50"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-small font-bold text-amber-600 dark:text-amber-400">3. Nordic Atelier</span>
              {watch("ui_design") === "nordic" && (
                <span className="text-[9px] font-bold uppercase tracking-wider border border-amber-500 text-amber-500 px-1.5 py-0.5 rounded-sm">
                  Active
                </span>
              )}
            </div>
            <p className="text-caption text-muted leading-relaxed">
              Warm linen background, organic typography, editorial warm terracotta & amber ambient glow.
            </p>
          </button>

          {/* 4. Tokyo Neon Sunset */}
          <button
            type="button"
            onClick={() => setValue("ui_design", "tokyo", { shouldDirty: true })}
            disabled={isSubmitting}
            className={cn(
              "flex flex-col items-start gap-2 rounded-sm border p-4 text-left transition-colors relative",
              watch("ui_design") === "tokyo"
                ? "border-pink-500 bg-pink-950/20 ring-1 ring-pink-500"
                : "border-border hover:border-pink-500/50 hover:bg-surface/50"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-small font-bold text-pink-600 dark:text-pink-400">4. Tokyo Neon</span>
              {watch("ui_design") === "tokyo" && (
                <span className="text-[9px] font-bold uppercase tracking-wider border border-pink-500 text-pink-500 px-1.5 py-0.5 rounded-sm">
                  Active
                </span>
              )}
            </div>
            <p className="text-caption text-muted leading-relaxed">
              Cyberpunk midnight violet, electric magenta-pink glow, neon cyan accents & high-tech energy.
            </p>
          </button>

          {/* 5. Industrial Monolith */}
          <button
            type="button"
            onClick={() => setValue("ui_design", "monolith", { shouldDirty: true })}
            disabled={isSubmitting}
            className={cn(
              "flex flex-col items-start gap-2 rounded-sm border p-4 text-left transition-colors relative",
              watch("ui_design") === "monolith"
                ? "border-indigo-500 bg-indigo-950/20 ring-1 ring-indigo-500"
                : "border-border hover:border-indigo-500/50 hover:bg-surface/50"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-small font-bold text-indigo-600 dark:text-indigo-400">5. Monolith Slate</span>
              {watch("ui_design") === "monolith" && (
                <span className="text-[9px] font-bold uppercase tracking-wider border border-indigo-500 text-indigo-500 px-1.5 py-0.5 rounded-sm">
                  Active
                </span>
              )}
            </div>
            <p className="text-caption text-muted leading-relaxed">
              Deep titanium slate background, royal indigo & cobalt highlights, sharp architectural precision.
            </p>
          </button>

          {/* 6. Champagne & Velvet Gold */}
          <button
            type="button"
            onClick={() => setValue("ui_design", "aurora", { shouldDirty: true })}
            disabled={isSubmitting}
            className={cn(
              "flex flex-col items-start gap-2 rounded-sm border p-4 text-left transition-colors relative",
              watch("ui_design") === "aurora"
                ? "border-yellow-500 bg-yellow-950/20 ring-1 ring-yellow-500"
                : "border-border hover:border-yellow-500/50 hover:bg-surface/50"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-small font-bold text-yellow-600 dark:text-yellow-400">6. Velvet Gold</span>
              {watch("ui_design") === "aurora" && (
                <span className="text-[9px] font-bold uppercase tracking-wider border border-yellow-500 text-yellow-500 px-1.5 py-0.5 rounded-sm">
                  Active
                </span>
              )}
            </div>
            <p className="text-caption text-muted leading-relaxed">
              Luxury champagne velvet dark tone, royal metallic gold glow, premium high-end aesthetics.
            </p>
          </button>
        </div>
      </Card>

      {/* ── Animation Style Control ─────────────────────────────── */}
      <Card className="space-y-4">
        <div className="border-b border-border pb-2">
          <h2 className="text-h3 font-bold tracking-tight">Visitor Animation Style</h2>
          <p className="text-caption text-muted mt-1">
            Controls the motion style shown to all visitors on the public site.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* 1. New — Cinematic */}
          <button
            type="button"
            onClick={() => setValue("animation_style", "new", { shouldDirty: true })}
            disabled={isSubmitting}
            className={cn(
              "flex flex-col items-start gap-2 rounded-sm border p-4 text-left transition-colors relative",
              animStyle === "new"
                ? "border-foreground bg-surface ring-1 ring-foreground"
                : "border-border hover:border-border-strong hover:bg-surface/50"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 shrink-0" />
                <span className="text-small font-bold">1. Cinematic</span>
              </div>
              {animStyle === "new" && (
                <span className="text-[9px] font-bold uppercase tracking-wider border border-foreground px-1.5 py-0.5 rounded-sm">
                  Active
                </span>
              )}
            </div>
            <p className="text-caption text-muted leading-relaxed">
              Smooth expo-out curves. Deliberate, luxurious timing. Telegram-style theme toggle with icon sync.
            </p>
          </button>

          {/* 2. Subtle Minimalist */}
          <button
            type="button"
            onClick={() => setValue("animation_style", "minimal", { shouldDirty: true })}
            disabled={isSubmitting}
            className={cn(
              "flex flex-col items-start gap-2 rounded-sm border p-4 text-left transition-colors relative",
              animStyle === "minimal"
                ? "border-foreground bg-surface ring-1 ring-foreground"
                : "border-border hover:border-border-strong hover:bg-surface/50"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 shrink-0" />
                <span className="text-small font-bold">2. Minimalist</span>
              </div>
              {animStyle === "minimal" && (
                <span className="text-[9px] font-bold uppercase tracking-wider border border-foreground px-1.5 py-0.5 rounded-sm">
                  Active
                </span>
              )}
            </div>
            <p className="text-caption text-muted leading-relaxed">
              Whisper-quiet micro-fades. Soft 1px lifts, zero noise, understated elegance and high focus.
            </p>
          </button>

          {/* 3. Organic Fluid */}
          <button
            type="button"
            onClick={() => setValue("animation_style", "fluid", { shouldDirty: true })}
            disabled={isSubmitting}
            className={cn(
              "flex flex-col items-start gap-2 rounded-sm border p-4 text-left transition-colors relative",
              animStyle === "fluid"
                ? "border-foreground bg-surface ring-1 ring-foreground"
                : "border-border hover:border-border-strong hover:bg-surface/50"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5">
                <Waves className="h-4 w-4 shrink-0" />
                <span className="text-small font-bold">3. Organic Fluid</span>
              </div>
              {animStyle === "fluid" && (
                <span className="text-[9px] font-bold uppercase tracking-wider border border-foreground px-1.5 py-0.5 rounded-sm">
                  Active
                </span>
              )}
            </div>
            <p className="text-caption text-muted leading-relaxed">
              Silky wave flows, gentle spring curves, continuous breathing micro-animations.
            </p>
          </button>

          {/* 4. Tactile Magnetic */}
          <button
            type="button"
            onClick={() => setValue("animation_style", "magnetic", { shouldDirty: true })}
            disabled={isSubmitting}
            className={cn(
              "flex flex-col items-start gap-2 rounded-sm border p-4 text-left transition-colors relative",
              animStyle === "magnetic"
                ? "border-foreground bg-surface ring-1 ring-foreground"
                : "border-border hover:border-border-strong hover:bg-surface/50"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5">
                <Compass className="h-4 w-4 shrink-0" />
                <span className="text-small font-bold">4. Magnetic</span>
              </div>
              {animStyle === "magnetic" && (
                <span className="text-[9px] font-bold uppercase tracking-wider border border-foreground px-1.5 py-0.5 rounded-sm">
                  Active
                </span>
              )}
            </div>
            <p className="text-caption text-muted leading-relaxed">
              Tactile hover magnetic pull, elastic spring feedback, dynamic click compression.
            </p>
          </button>

          {/* 5. Classic */}
          <button
            type="button"
            onClick={() => setValue("animation_style", "classic", { shouldDirty: true })}
            disabled={isSubmitting}
            className={cn(
              "flex flex-col items-start gap-2 rounded-sm border p-4 text-left transition-colors relative",
              animStyle === "classic"
                ? "border-foreground bg-surface ring-1 ring-foreground"
                : "border-border hover:border-border-strong hover:bg-surface/50"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5">
                <Feather className="h-4 w-4 shrink-0" />
                <span className="text-small font-bold">5. Classic Snappy</span>
              </div>
              {animStyle === "classic" && (
                <span className="text-[9px] font-bold uppercase tracking-wider border border-foreground px-1.5 py-0.5 rounded-sm">
                  Active
                </span>
              )}
            </div>
            <p className="text-caption text-muted leading-relaxed">
              Original traditional animation values. Slightly faster, familiar responsive feel.
            </p>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-caption text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Supabase database schema active & synced for global themes.</span>
        </div>
      </Card>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving changes...
          </>
        ) : (
          "Save Settings"
        )}
      </Button>
    </form>
  );
}
