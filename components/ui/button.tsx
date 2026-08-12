import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-small",
  md: "h-10 px-5 text-body",
  lg: "h-12 px-8 text-body-lg",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

/**
 * B&W button — primary fills foreground/background, secondary is bordered,
 * ghost is minimal. All sizes use consistent padding and height tokens.
 * Supports asChild to delegate rendering to slot components.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, disabled, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
      return (
        <Comp
          ref={ref}
          disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-sm font-medium transition-all duration-250 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
