import type { LucideIcon } from "lucide-react";

import { StatCard } from "@/components/stat-card";

export interface StatRow {
  id: string;
  icon: LucideIcon;
  shortName: string;
  displayName: string;
  level: number;
  xpInto: number;
  xpForNext: number;
}

export function StatsGrid({ stats }: { stats: StatRow[] }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2.5">
      {stats.map(row => (
        <StatCard
          key={row.id}
          icon={row.icon}
          shortName={row.shortName}
          displayName={row.displayName}
          level={row.level}
          xpInto={row.xpInto}
          xpForNext={row.xpForNext}
        />
      ))}
    </div>
  );
}
