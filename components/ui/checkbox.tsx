import { forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id: idProp, ...props }, ref) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;

    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          className={cn(
            "h-4 w-4 rounded border-border-strong text-primary-700",
            "focus:ring-2 focus:ring-ring focus:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          style={{ accentColor: "var(--primary-600)" }}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "text-sm text-foreground select-none",
            props.disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          {label}
        </label>
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
export type { CheckboxProps };
