import { cn } from "@/lib/utils";
import { type LabelHTMLAttributes, forwardRef } from "react";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

/**
 * Accessible label — pairs with Input/Textarea via htmlFor.
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "block text-small font-medium text-foreground",
        className,
      )}
      {...props}
    />
  ),
);
Label.displayName = "Label";
