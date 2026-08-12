"use server";

import { createClient } from "@/lib/supabase/server";
import { contactFormSchema } from "@/lib/validators";
import { ZodError } from "zod";

export async function submitContactForm(formData: { name: string; email: string; subject?: string; message: string }) {
  try {
    // Validate inputs
    const validated = contactFormSchema.parse(formData);

    const supabase = await createClient();
    const { error } = await supabase
      .from("contact_submissions")
      .insert({
        name: validated.name,
        email: validated.email,
        subject: validated.subject || "",
        message: validated.message,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    if (err instanceof ZodError) {
      return { success: false, error: err.errors[0]?.message || "Validation error" };
    }
    if (err instanceof Error) {
      return { success: false, error: err.message };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}
