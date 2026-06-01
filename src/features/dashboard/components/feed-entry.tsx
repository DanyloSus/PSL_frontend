import { cn } from "@/utils/cn";
import { timeAgo } from "@/utils/time-ago";

import type { FeedEntry as FeedEntryData } from "../utils/to-feed-entries";

function formatEffect(xp: number, shortName: string): string {
  const sign = xp >= 0 ? "+" : "";

  return `${sign}${xp} ${shortName}`;
}

export function FeedEntry({ entry }: { entry: FeedEntryData }) {
  const accent = entry.isPositive ? "border-l-primary" : "border-l-danger";
  const tagColor = entry.isPositive ? "text-acid-2" : "text-danger";

  return (
    <li
      className={cn(
        "border-border-soft bg-card relative rounded-sm border border-l-2 px-3 py-2.5",
        accent
      )}
    >
      <div className="text-muted-foreground flex items-center justify-between font-mono text-[9px] tracking-[1px]">
        <span>{timeAgo(entry.createdAt)} AGO</span>
        <span className={cn("font-semibold", tagColor)}>
          {entry.isPositive ? "POS" : "NEG"}
        </span>
      </div>
      <p className="text-foreground mt-1 text-[13px] font-semibold">
        {entry.title}
        {entry.quantity > 1 ? ` · ${entry.quantity}` : ""}
      </p>
      <div
        className={cn(
          "mt-1 flex flex-wrap gap-x-2 font-mono text-[10px]",
          tagColor
        )}
      >
        {entry.effects.map(effect => (
          <span key={effect.statId}>
            {formatEffect(effect.xp, effect.shortName)}
          </span>
        ))}
      </div>
    </li>
  );
}
