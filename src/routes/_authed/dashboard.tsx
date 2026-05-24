import { useState } from "react";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { SectionTitle } from "@/components/section-title";
import { activitiesQueryOptions } from "@/features/activities/api/list";
import { LogSheet } from "@/features/activities/components/log-sheet";
import { meQueryOptions } from "@/features/auth/api/auth";
import { HeroPanel } from "@/features/dashboard/components/hero-panel";
import { LogCta } from "@/features/dashboard/components/log-cta";
import {
  StatsGrid,
  type StatRow
} from "@/features/dashboard/components/stats-grid";
import { historyQueryOptions } from "@/features/users/api/history";
import { statsQueryOptions } from "@/features/users/api/stats";
import { statIcon } from "@/utils/stat-icon";
import { timeAgo } from "@/utils/time-ago";

const RECENT_LIMIT = 5;
const TAG_NO_ACTIVITY = "// NO ACTIVITY YET";

export const Route = createFileRoute("/_authed/dashboard")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(meQueryOptions()),
      context.queryClient.ensureQueryData(statsQueryOptions()),
      context.queryClient.ensureQueryData(activitiesQueryOptions()),
      context.queryClient.ensureQueryData(
        historyQueryOptions({ limit: RECENT_LIMIT })
      )
    ]),
  component: DashboardPage
});

function DashboardPage() {
  const { data: user } = useSuspenseQuery(meQueryOptions());
  const { data: stats } = useSuspenseQuery(statsQueryOptions());
  const history = useQuery(historyQueryOptions({ limit: RECENT_LIMIT }));
  const activities = useQuery(activitiesQueryOptions());
  const [isLogOpen, setIsLogOpen] = useState(false);

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

  const activityTitleById = new Map(
    activities.data?.map(item => [item.id, item.title])
  );
  const recent = history.data ?? [];

  return (
    <div className="min-h-dvh w-full px-4 pt-4 pb-32">
      <HeroPanel
        username={user.username}
        globalLevel={user.global_level}
        globalXp={user.global_xp}
        totalLogs={recent.length}
      />
      <LogCta onOpen={() => setIsLogOpen(true)} />
      <SectionTitle
        label="ATTRIBUTES"
        sub={`${stats.length}/${stats.length} ACTIVE`}
      />
      <StatsGrid stats={rows} />
      <div className="mt-6">
        <SectionTitle
          label="RECENT LOGS"
          sub={`${recent.length} ENTRIES`}
        />
        {recent.length === 0 && (
          <p className="text-faint mt-3 font-mono text-[11px] tracking-[1px]">
            {TAG_NO_ACTIVITY}
          </p>
        )}
        <ul className="mt-3 space-y-2">
          {recent.map(entry => {
            const title =
              activityTitleById.get(entry.activity_template_id) ?? "Activity";

            return (
              <li
                key={entry.id}
                className="border-border-soft bg-card border-l-primary flex items-center gap-3 rounded-sm border border-l-2 p-3"
              >
                <span className="text-muted-foreground w-12 font-mono text-[10px] tracking-[1px]">
                  {timeAgo(entry.created_at)}
                </span>
                <div className="flex-1">
                  <p className="text-foreground text-[13px] font-semibold">
                    {title}
                    {entry.quantity > 1 ? ` · ${entry.quantity}` : ""}
                  </p>
                  <p className="text-acid-2 mt-0.5 font-mono text-[10px]">
                    +{entry.total_xp_applied} XP
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <LogSheet
        isOpen={isLogOpen}
        onOpenChange={setIsLogOpen}
      />
    </div>
  );
}
