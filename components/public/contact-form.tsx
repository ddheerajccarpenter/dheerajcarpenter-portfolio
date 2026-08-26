"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormValues } from "@/lib/validators";
import { submitContactForm } from "@/app/(public)/contact/actions";
import { Button, Input, Textarea, Label } from "@/components/ui";
import { Loader2, CheckCircle2, AlertCircle, Send } from "lucide-react";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSuccess(null);
    setErrorMsg(null);

    const result = await submitContactForm(data);
    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      reset();
    } else {
      setSuccess(false);
      setErrorMsg(result.error || "Something went wrong. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="border border-border p-8 text-center space-y-4 rounded-2xl bg-surface animate-alert-scale">
        <CheckCircle2 className="h-10 w-10 mx-auto text-foreground animate-check-pop" />
        <h3 className="text-h3 font-bold">Message Sent</h3>
        <p className="text-small text-muted max-w-[36ch] mx-auto leading-relaxed">
          Thank you. Your submission was received and I will get back to you promptly.
        </p>
        <div className="pt-2">
          <Button onClick={() => setSuccess(null)} variant="secondary" size="sm">
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4.5">
      {errorMsg && (
        <div className="border border-border-strong p-4 rounded-xl bg-surface-overlay flex items-start space-x-3 text-small text-foreground animate-alert-scale">
          <AlertCircle className="h-5 w-5 shrink-0 text-muted" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="space-y-1.5 form-field-wrap">
        <Label htmlFor="name" className="text-caption font-semibold uppercase tracking-wider text-muted form-label">
          Name
        </Label>
        <Input
          id="name"
          placeholder="Your full name"
          {...register("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p id="name-error" className="text-caption text-muted font-medium">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5 form-field-wrap">
        <Label htmlFor="email" className="text-caption font-semibold uppercase tracking-wider text-muted form-label">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          {...register("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p id="email-error" className="text-caption text-muted font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5 form-field-wrap">
        <Label htmlFor="subject" className="text-caption font-semibold uppercase tracking-wider text-muted form-label">
          Subject
        </Label>
        <Input
          id="subject"
          placeholder="Project inquiry / greeting"
          {...register("subject")}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.subject && (
          <p id="subject-error" className="text-caption text-muted font-medium">
            {errors.subject.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5 form-field-wrap">
        <Label htmlFor="message" className="text-caption font-semibold uppercase tracking-wider text-muted form-label">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Tell me about your project, timeline, or idea..."
          rows={4}
          {...register("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p id="message-error" className="text-caption text-muted font-medium">
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting} className="w-full justify-center animate-arrow-slide">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <Send className="ml-2 h-4 w-4 arrow-icon" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
