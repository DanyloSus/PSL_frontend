import { forwardRef, useId } from "react";

import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { cn } from "@/utils/cn";

interface Props extends React.ComponentProps<"input"> {
  label: string;
  hint?: string;
  error?: string;
}

export const CyberField = forwardRef<HTMLInputElement, Props>(
  ({ label, hint, error, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor={inputId}
          className="text-muted-foreground font-mono text-[10px] tracking-[2px]"
        >
          {label}
        </Label>
        <Input
          ref={ref}
          id={inputId}
          aria-invalid={hasError || undefined}
          className={cn(
            "border-border-soft focus-visible:border-primary focus-visible:ring-primary/30 h-11 rounded-sm bg-white/[0.03] text-sm focus-visible:ring-2",
            hasError && "border-destructive ring-destructive/30",
            className
          )}
          {...props}
        />
        {(error ?? hint) && (
          <p
            className={cn(
              "font-mono text-[10px] tracking-[0.5px]",
              hasError ? "text-destructive" : "text-faint"
            )}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    );
  }
);

CyberField.displayName = "CyberField";
