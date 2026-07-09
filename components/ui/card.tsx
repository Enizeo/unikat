import { forwardRef } from "react";
import { cn } from "@/lib/cn";

const variantClasses = {
  default: "bg-surface rounded-lg p-6",
  elevated: "bg-surface-elevated rounded-lg p-6 shadow-md",
  outlined: "bg-surface rounded-lg p-6 border border-border",
} as const;

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variantClasses;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(variantClasses[variant], className)}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";

export { Card };
export type { CardProps };
