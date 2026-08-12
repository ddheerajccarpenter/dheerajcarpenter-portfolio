import { getAllTestimonials } from "@/lib/data/public";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";

export const revalidate = 0;

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <div className="p-6 md:p-8">
      <TestimonialsManager initialTestimonials={testimonials} />
    </div>
  );
}
