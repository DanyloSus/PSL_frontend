import { statIcon } from "@/utils/stat-icon";
import { statShortName } from "@/utils/stat-short-name";

import type { StatRow } from "../components/stats-grid";

interface StatSource {
  stat: { id: string; key: string; display_name: string; icon: string };
  level: number;
  xp_into_level: number;
  xp_for_next: number;
}

export function toStatRows(stats: StatSource[]): StatRow[] {
  return stats.map(entry => ({
    id: entry.stat.id,
    icon: statIcon(entry.stat.icon),
    shortName: statShortName(entry.stat.key),
    displayName: entry.stat.display_name,
    level: entry.level,
    xpInto: entry.xp_into_level,
    xpForNext: entry.xp_for_next
  }));
}
