import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { SectionTitle } from "@/components/section-title";
import { activitiesQueryOptions } from "@/features/activities/api/list";
import { LiveFeed } from "@/features/dashboard/components/live-feed";
import { toFeedEntries } from "@/features/dashboard/utils/to-feed-entries";
import { historyQueryOptions } from "@/features/users/api/history";
import { statsQueryOptions } from "@/features/users/api/stats";

const HISTORY_LIMIT = 50;

export const Route = createFileRoute("/_authed/activity-log")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      historyQueryOptions({ limit: HISTORY_LIMIT })
    ),
  component: ActivityLogPage
});

function ActivityLogPage() {
  const { data: stats } = useSuspenseQuery(statsQueryOptions());
  const { data: activities } = useSuspenseQuery(activitiesQueryOptions());
  const { data: history } = useSuspenseQuery(
    historyQueryOptions({ limit: HISTORY_LIMIT })
  );

  const feed = toFeedEntries(history, stats, activities);

  return (
    <div className="mx-auto max-w-2xl p-4">
      <SectionTitle
        label="ACTIVITY LOG"
        sub={`${history.length} ENTRIES`}
      />
      <div className="mt-4">
        <LiveFeed
          entries={feed}
          title="HISTORY"
        />
      </div>
    </div>
  );
}
