import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { SectionTitle } from "@/components/section-title";
import { activitiesQueryOptions } from "@/features/activities/api/list";
import { useLogSheetStore } from "@/features/activities/stores/use-log-sheet-store";
import { meQueryOptions } from "@/features/auth/api/auth";
import { HeroPanel } from "@/features/dashboard/components/hero-panel";
import { LiveFeed } from "@/features/dashboard/components/live-feed";
import { LogCta } from "@/features/dashboard/components/log-cta";
import { StatsGrid } from "@/features/dashboard/components/stats-grid";
import { toFeedEntries } from "@/features/dashboard/utils/to-feed-entries";
import { toStatRows } from "@/features/dashboard/utils/to-stat-rows";
import { historyQueryOptions } from "@/features/users/api/history";
import { statsQueryOptions } from "@/features/users/api/stats";

const RECENT_LIMIT = 10;

export const Route = createFileRoute("/_authed/dashboard")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      historyQueryOptions({ limit: RECENT_LIMIT })
    ),
  component: DashboardPage
});

function DashboardPage() {
  const { data: user } = useSuspenseQuery(meQueryOptions());
  const { data: stats } = useSuspenseQuery(statsQueryOptions());
  const { data: activities } = useSuspenseQuery(activitiesQueryOptions());
  const { data: recent } = useSuspenseQuery(
    historyQueryOptions({ limit: RECENT_LIMIT })
  );
  const open = useLogSheetStore(state => state.open);

  if (!user) return null;

  const rows = toStatRows(stats);
  const feed = toFeedEntries(recent, stats, activities);
  const activeCount = stats.filter(entry => entry.level >= 1).length;

  return (
    <div className="grid grid-cols-1 gap-5 p-4 xl:grid-cols-[1fr_320px]">
      <div className="min-w-0">
        <HeroPanel
          username={user.username}
          globalLevel={user.global_level}
          globalXp={user.global_xp}
          recentLogs={recent.length}
        />
        <LogCta onOpen={open} />
        <SectionTitle
          label="ATTRIBUTES"
          sub={`${activeCount}/${stats.length} ACTIVE`}
        />
        <StatsGrid stats={rows} />
      </div>
      <aside className="xl:border-border-soft min-w-0 xl:border-l xl:pl-5">
        <LiveFeed entries={feed} />
      </aside>
    </div>
  );
}
