import { forwardRef } from "react";
import { cn } from "@/lib/cn";

const variantClasses = {
  primary:
    "bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-900",
  secondary:
    "bg-stone-100 text-stone-900 hover:bg-stone-200 active:bg-stone-300",
  outline:
    "border border-border text-foreground hover:bg-stone-50 active:bg-stone-100",
  ghost:
    "text-foreground hover:bg-stone-100 active:bg-stone-200",
  destructive:
    "bg-error text-white hover:bg-error/90 active:bg-error/80",
} as const;

const sizeClasses = {
  sm: "h-8 px-3 text-sm gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2 rounded-md",
  lg: "h-12 px-6 text-base gap-2.5 rounded-lg",
} as const;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          "cursor-pointer",
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

export { Button };
export type { ButtonProps };
