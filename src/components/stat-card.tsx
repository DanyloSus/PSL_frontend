import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";

import { XpBar } from "@/components/xp-bar";
import { cn } from "@/utils/cn";

interface Props {
  icon: LucideIcon;
  shortName: string;
  displayName: string;
  level: number;
  xpInto: number;
  xpForNext: number;
  recentDelta?: number;
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  icon: IconComp,
  shortName,
  displayName,
  level,
  xpInto,
  xpForNext,
  recentDelta = 0,
  onClick,
  className
}: Props) {
  const isPositive = recentDelta > 0;
  const DeltaIcon = isPositive ? ArrowUp : ArrowDown;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group border-border bg-card/85 hover:border-primary relative w-full overflow-hidden rounded-sm border px-3.5 pt-3.5 pb-3 text-left backdrop-blur-xl transition-colors",
        className
      )}
    >
      <div className="mb-2.5 flex items-center gap-2.5">
        <div className="border-primary/30 bg-primary/10 text-primary grid size-8 place-items-center rounded-sm border">
          <IconComp className="size-4" />
        </div>
        <div className="flex-1">
          <div className="text-muted-foreground font-mono text-[10px] tracking-[1.5px]">
            {shortName}
          </div>
          <div className="text-foreground text-[15px] font-semibold">
            {displayName}
          </div>
        </div>
        <div
          className="text-primary text-[22px] leading-none font-bold"
          style={{ textShadow: "0 0 12px rgba(214,255,0,0.4)" }}
        >
          {level}
        </div>
      </div>
      <XpBar
        value={xpInto}
        max={xpForNext}
        height={6}
      />
      <div className="text-muted-foreground mt-2 flex items-center justify-between font-mono text-[10px]">
        <span>
          {xpInto}/{xpForNext} XP
        </span>
        {recentDelta !== 0 && (
          <span
            className={cn(
              "flex items-center gap-0.5",
              isPositive ? "text-acid-2" : "text-danger"
            )}
          >
            <DeltaIcon className="size-3" />
            {Math.abs(recentDelta)}
          </span>
        )}
      </div>
    </button>
  );
}
