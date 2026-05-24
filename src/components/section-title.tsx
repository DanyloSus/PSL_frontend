import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

interface Props {
  label: string;
  sub?: string;
  right?: ReactNode;
  className?: string;
}

export function SectionTitle({ label, sub, right, className }: Props) {
  return (
    <div className={cn("mt-2 flex items-baseline justify-between", className)}>
      <div className="flex items-baseline gap-2">
        <span className="bg-primary inline-block h-px w-3 self-center" />
        <span className="text-foreground font-mono text-[11px] font-semibold tracking-[2px]">
          {label}
        </span>
        {sub && (
          <span className="text-muted-foreground font-mono text-[9px] tracking-[1px]">
            {`// ${sub}`}
          </span>
        )}
      </div>
      {right}
    </div>
  );
}
