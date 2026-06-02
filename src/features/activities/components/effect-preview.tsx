import { cn } from "@/utils/cn";

import type { ActivityEffectOut } from "../types/activity";

function formatEffect(xp: number, shortName: string): string {
  const sign = xp >= 0 ? "+" : "";

  return `${sign}${xp} ${shortName}`;
}

interface Props {
  effects: ActivityEffectOut[];
  statShortById: Map<string, string>;
}

export function EffectPreview({ effects, statShortById }: Props) {
  if (effects.length === 0) return null;

  return (
    <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5 font-mono text-[9px]">
      {effects.map(effect => (
        <span
          key={effect.stat_id}
          className={cn(effect.xp_change >= 0 ? "text-acid-2" : "text-danger")}
        >
          {formatEffect(
            effect.xp_change,
            statShortById.get(effect.stat_id) ?? "—"
          )}
        </span>
      ))}
    </div>
  );
}
