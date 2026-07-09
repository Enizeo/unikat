import { forwardRef } from "react";
import { cn } from "@/lib/cn";

const sizeClasses = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-none",
} as const;

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof sizeClasses;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "lg", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full px-4 sm:px-6 lg:px-8",
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Container.displayName = "Container";

export { Container };
export type { ContainerProps };
