import { forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id: idProp, ...props }, ref) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "min-h-20 w-full resize-y rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            "placeholder:text-foreground-subtle",
            "transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-error focus:ring-error"
              : "border-border hover:border-border-strong",
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          {...props}
        />
        {hint && !error && (
          <p id={`${id}-hint`} className="text-xs text-foreground-muted">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${id}-error`} className="text-xs text-error">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
export type { TextareaProps };
