import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { SectionTitle } from "@/components/section-title";
import { meQueryOptions } from "@/features/auth/api/auth";
import { HeroPanel } from "@/features/dashboard/components/hero-panel";
import {
  StatsGrid,
  type StatRow
} from "@/features/dashboard/components/stats-grid";
import { statsQueryOptions } from "@/features/users/api/stats";
import { statIcon } from "@/utils/stat-icon";

export const Route = createFileRoute("/_authed/dashboard")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(meQueryOptions()),
      context.queryClient.ensureQueryData(statsQueryOptions())
    ]),
  component: DashboardPage
});

function DashboardPage() {
  const { data: user } = useSuspenseQuery(meQueryOptions());
  const { data: stats } = useSuspenseQuery(statsQueryOptions());

  if (!user) return null;

  const rows: StatRow[] = stats.map(entry => ({
    id: entry.stat.id,
    icon: statIcon(entry.stat.icon),
    shortName: entry.stat.key.toUpperCase().slice(0, 3),
    displayName: entry.stat.display_name,
    level: entry.level,
    xpInto: entry.xp_into_level,
    xpForNext: entry.xp_for_next
  }));

  return (
    <div className="min-h-dvh w-full px-4 pt-4 pb-32">
      <HeroPanel
        username={user.username}
        globalLevel={user.global_level}
        globalXp={user.global_xp}
        totalLogs={0}
      />
      <SectionTitle
        label="ATTRIBUTES"
        sub={`${stats.length}/${stats.length} ACTIVE`}
      />
      <StatsGrid stats={rows} />
    </div>
  );
}
