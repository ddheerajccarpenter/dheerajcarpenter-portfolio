"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { certificationSchema, type CertificationValues } from "@/lib/validators";
import { createCertification, updateCertification, deleteCertification } from "@/lib/data/actions";
import { Button, Input, Label, Card, Badge } from "@/components/ui";
import { MediaUpload } from "./media-upload";
import { Loader2, Edit2, Trash2, X, CheckCircle2, Award, ExternalLink, Calendar, Download } from "lucide-react";

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string | null;
  credential_link: string | null;
  certificate_path: string | null;
  published: boolean;
  order: number;
}

export function CertificationsManager({ initialCertifications }: { initialCertifications: Certification[] }) {
  const router = useRouter();
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setCertifications(initialCertifications);
  }, [initialCertifications]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CertificationValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      title: "",
      issuer: "",
      issue_date: "",
      credential_link: "",
      certificate_path: "",
      published: true,
      order: 0,
    },
  });

  const certificatePath = watch("certificate_path");

  const onSubmit = async (data: CertificationValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccess(null);

    const formattedData = {
      ...data,
      issue_date: data.issue_date || null,
      credential_link: data.credential_link || null,
      certificate_path: data.certificate_path || null,
    };

    try {
      if (editingCert) {
        await updateCertification(editingCert.id, formattedData);
        setCertifications((prev) =>
          prev.map((c) => (c.id === editingCert.id ? { ...c, ...formattedData } : c))
        );
        setSuccess("Certification updated successfully!");
        setEditingCert(null);
      } else {
        const created = await createCertification(formattedData);
        if (created) {
          setCertifications((prev) => [...prev, created as Certification]);
        }
        setSuccess("Certification created successfully!");
      }
      reset({
        title: "",
        issuer: "",
        issue_date: "",
        credential_link: "",
        certificate_path: "",
        published: true,
        order: 0,
      });
      router.refresh();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || "Failed to save certification.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (cert: Certification) => {
    setEditingCert(cert);
    setValue("title", cert.title);
    setValue("issuer", cert.issuer);
    setValue("issue_date", cert.issue_date || "");
    setValue("credential_link", cert.credential_link || "");
    setValue("certificate_path", cert.certificate_path || "");
    setValue("published", cert.published);
    setValue("order", cert.order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingCert(null);
    reset({
      title: "",
      issuer: "",
      issue_date: "",
      credential_link: "",
      certificate_path: "",
      published: true,
      order: 0,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    setIsSubmitting(true);
    try {
      await deleteCertification(id);
      setCertifications((prev) => prev.filter((c) => c.id !== id));
      setSuccess("Certification deleted successfully!");
      router.refresh();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || "Failed to delete certification.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePublished = async (cert: Certification) => {
    try {
      const nextVal = !cert.published;
      await updateCertification(cert.id, { published: nextVal });
      setCertifications((prev) =>
        prev.map((c) => (c.id === cert.id ? { ...c, published: nextVal } : c))
      );
      setSuccess(`Certification ${nextVal ? "published" : "drafted"} successfully!`);
      router.refresh();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const error = err as Error;
      setErrorMsg(error.message || "Failed to update status.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form Panel */}
      <div>
        <Card className="space-y-6 sticky top-24">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <h2 className="text-h3 font-bold tracking-tight">
              {editingCert ? "Edit Certification" : "Add Certification"}
            </h2>
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
              <Label htmlFor="title">Title / Course Name</Label>
              <Input id="title" placeholder="e.g. AWS Certified Solutions Architect" {...register("title")} disabled={isSubmitting} />
              {errors.title && <p className="text-caption text-foreground">{errors.title.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="issuer">Issuer / Organisation</Label>
              <Input id="issuer" placeholder="e.g. Amazon Web Services" {...register("issuer")} disabled={isSubmitting} />
              {errors.issuer && <p className="text-caption text-foreground">{errors.issuer.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input id="issue_date" type="date" {...register("issue_date")} disabled={isSubmitting} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="credential_link">Credential Verification Link (optional)</Label>
              <Input id="credential_link" placeholder="https://..." {...register("credential_link")} disabled={isSubmitting} />
            </div>

            <div className="space-y-1.5">
              <Label>Certificate Image / PDF (optional)</Label>
              <MediaUpload
                bucket="images"
                value={certificatePath || null}
                onChange={(url) => setValue("certificate_path", url || "")}
                accept=".pdf,image/*"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="order">Display Order</Label>
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
                ) : editingCert ? (
                  "Update Certification"
                ) : (
                  "Add Certification"
                )}
              </Button>
              {editingCert && (
                <Button onClick={handleCancelEdit} variant="secondary" type="button">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>

      {/* List Panel */}
      <div className="lg:col-span-2 space-y-4">
        <div className="border border-border p-4 rounded-sm bg-surface">
          <h2 className="text-small font-bold uppercase tracking-wider text-muted">
            Certifications List
          </h2>
        </div>

        {certifications.length === 0 ? (
          <div className="border border-border border-dashed p-12 text-center rounded-sm bg-background text-muted">
            <Award className="h-8 w-8 mx-auto mb-3" />
            <p className="text-body font-medium">No certifications found</p>
            <p className="text-caption">Add one on the left to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {certifications.map((cert) => (
              <Card key={cert.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-body-lg font-bold">{cert.title}</h3>
                    {!cert.published && (
                      <Badge className="uppercase tracking-wider text-[9px] py-0.5 px-1.5">
                        Draft
                      </Badge>
                    )}
                  </div>
                  <p className="text-small text-muted">{cert.issuer}</p>
                  {cert.issue_date && (
                    <p className="text-[10px] text-muted">
                      Issued: {new Date(cert.issue_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                  {cert.credential_link && (
                    <a
                      href={cert.credential_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-border rounded-sm hover:bg-surface transition-colors"
                      title="Credential URL"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}

                  {cert.certificate_path && (
                    <a
                      href={cert.certificate_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-border rounded-sm hover:bg-surface transition-colors"
                      title="Download Certificate"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}

                  <Button
                    onClick={() => togglePublished(cert)}
                    variant="secondary"
                    size="sm"
                    className="h-8 text-[11px]"
                  >
                    {cert.published ? "Draft" : "Publish"}
                  </Button>

                  <Button
                    onClick={() => handleEdit(cert)}
                    variant="secondary"
                    size="sm"
                    className="h-8 p-2"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>

                  <Button
                    onClick={() => handleDelete(cert.id)}
                    variant="secondary"
                    size="sm"
                    className="h-8 p-2 text-foreground hover:bg-foreground hover:text-background"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
