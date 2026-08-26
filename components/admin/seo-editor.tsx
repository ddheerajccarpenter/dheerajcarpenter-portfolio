"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { seoMetadataSchema, type SeoMetadataValues } from "@/lib/validators";
import { upsertSeoMetadata } from "@/lib/data/actions";
import { normalizeUrl } from "@/lib/utils";
import { Button, Input, Textarea, Label, Card } from "@/components/ui";
import { MediaUpload } from "./media-upload";
import { Loader2, CheckCircle2, AlertCircle, Search } from "lucide-react";

interface SeoRecord {
  page_key: string;
  title: string;
  description: string;
  keywords: string[];
  og_image_url: string | null;
  canonical_url: string | null;
}

import { useAdminToast } from "@/components/admin/admin-toast";

export function SeoEditor({ initialRecords }: { initialRecords: SeoRecord[] }) {
  const [selectedKey, setSelectedKey] = useState("home");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useAdminToast();

  // Temporary keywords comma-separated string
  const [keywordsInput, setKeywordsInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SeoMetadataValues>({
    resolver: zodResolver(seoMetadataSchema),
    defaultValues: {
      page_key: "home",
      title: "",
      description: "",
      keywords: [],
      og_image_url: null,
      canonical_url: null,
    },
  });

  const ogImageUrl = watch("og_image_url");

  // Load selected page's SEO records
  useEffect(() => {
    const record = initialRecords.find((r) => r.page_key === selectedKey);
    if (record) {
      reset({
        page_key: selectedKey,
        title: record.title || "",
        description: record.description || "",
        keywords: record.keywords || [],
        og_image_url: record.og_image_url || null,
        canonical_url: record.canonical_url || null,
      });
      setKeywordsInput(record.keywords ? record.keywords.join(", ") : "");
    } else {
      reset({
        page_key: selectedKey,
        title: "",
        description: "",
        keywords: [],
        og_image_url: null,
        canonical_url: null,
      });
      setKeywordsInput("");
    }
  }, [selectedKey, initialRecords, reset]);

  const onSubmit = async (data: SeoMetadataValues) => {
    setIsSubmitting(true);

    const formattedData = {
      ...data,
      og_image_url: data.og_image_url || null,
      canonical_url: data.canonical_url || null,
    };

    try {
      await upsertSeoMetadata(formattedData);
      toast.success("SEO metadata saved", `Updated metadata for ${selectedKey}`);
      const idx = initialRecords.findIndex((r) => r.page_key === selectedKey);
      if (idx !== -1) {
        initialRecords[idx] = {
          page_key: selectedKey,
          title: formattedData.title,
          description: formattedData.description,
          keywords: formattedData.keywords,
          og_image_url: formattedData.og_image_url,
          canonical_url: formattedData.canonical_url,
        };
      } else {
        initialRecords.push({
          page_key: selectedKey,
          title: formattedData.title,
          description: formattedData.description,
          keywords: formattedData.keywords,
          og_image_url: formattedData.og_image_url,
          canonical_url: formattedData.canonical_url,
        });
      }
    } catch (err) {
      const error = err as Error;
      toast.error("Failed to save SEO metadata", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeywordsBlur = () => {
    const list = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
    setValue("keywords", list);
  };

  return (
    <div className="space-y-8 max-w-[600px]">
      <Card className="space-y-4">
        <Label htmlFor="page_select">Select Page to Configure</Label>
        <select
          id="page_select"
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
          className="h-10 w-full rounded-sm border border-border bg-background px-3 text-body text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          disabled={isSubmitting}
        >
          <option value="home">Homepage ( / )</option>
          <option value="about">About ( /about )</option>
          <option value="projects">Projects Listing ( /projects )</option>
          <option value="experience">Experience Timeline ( /experience )</option>
          <option value="contact">Contact ( /contact )</option>
        </select>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <h2 className="text-h3 font-bold tracking-tight capitalize">
              {selectedKey} Page SEO
            </h2>
            <Search className="h-4 w-4 text-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Meta Title Tag</Label>
            <Input id="title" {...register("title")} disabled={isSubmitting} />
            {errors.title && <p className="text-caption text-foreground">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Meta Description Tag</Label>
            <Textarea id="description" rows={4} {...register("description")} disabled={isSubmitting} />
            {errors.description && <p className="text-caption text-foreground">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywordsInput">Keywords (comma-separated)</Label>
            <Input
              id="keywordsInput"
              placeholder="portfolio, web developer, software engineer"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              onBlur={handleKeywordsBlur}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="canonical_url">Canonical URL</Label>
            <Input
              id="canonical_url"
              placeholder="e.g. yourdomain.com/path or https://..."
              {...register("canonical_url")}
              onBlur={(e) => {
                if (e.target.value) {
                  setValue("canonical_url", normalizeUrl(e.target.value));
                }
              }}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label>Open Graph Image (Social Share Card)</Label>
            <MediaUpload
              bucket="images"
              value={ogImageUrl}
              onChange={(url) => setValue("og_image_url", url)}
            />
          </div>
        </Card>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving settings...
            </>
          ) : (
            "Save SEO Metadata"
          )}
        </Button>
      </form>
    </div>
  );
}
