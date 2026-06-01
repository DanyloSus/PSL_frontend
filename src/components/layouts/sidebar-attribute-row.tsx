import type { LucideIcon } from "lucide-react";

export interface AttributeItem {
  id: string;
  icon: LucideIcon;
  displayName: string;
  shortName: string;
  level: number;
}

export function SidebarAttributeRow({ item }: { item: AttributeItem }) {
  const { icon: IconComp, displayName, shortName, level } = item;

  return (
    <div className="flex items-center gap-2.5 px-3 py-1.5">
      <IconComp className="text-faint size-3.5" />
      <span className="text-muted-foreground flex-1 text-[12px]">
        {displayName}
      </span>
      <span className="text-faint font-mono text-[9px] tracking-[1px]">
        {shortName}
      </span>
      <span className="text-primary w-4 text-right font-mono text-[11px] font-bold">
        {level}
      </span>
    </div>
  );
}
