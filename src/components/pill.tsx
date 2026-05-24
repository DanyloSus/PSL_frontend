import type { LucideIcon } from "lucide-react";

import { cn } from "@/utils/cn";

interface Props {
  icon: LucideIcon;
  label: string | number;
  sub?: string;
  className?: string;
}

export function Pill({ icon: IconComp, label, sub, className }: Props) {
  return (
    <div
      className={cn(
        "bg-secondary/40 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5",
        className
      )}
    >
      <IconComp className="text-primary size-3" />
      <span className="text-foreground text-[13px] leading-none font-bold">
        {label}
      </span>
      {sub && (
        <span className="text-muted-foreground font-mono text-[9px] tracking-[1px]">
          {sub}
        </span>
      )}
    </div>
  );
}
