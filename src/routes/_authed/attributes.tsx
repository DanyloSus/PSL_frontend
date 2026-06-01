import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { SectionTitle } from "@/components/section-title";
import { StatCard } from "@/components/stat-card";
import { useLogSheetStore } from "@/features/activities/stores/use-log-sheet-store";
import { toStatRows } from "@/features/dashboard/utils/to-stat-rows";
import { statsQueryOptions } from "@/features/users/api/stats";

export const Route = createFileRoute("/_authed/attributes")({
  component: AttributesPage
});

function AttributesPage() {
  const { data: stats } = useSuspenseQuery(statsQueryOptions());
  const open = useLogSheetStore(state => state.open);

  const rows = toStatRows(stats);

  return (
    <div className="p-4">
      <SectionTitle
        label="ATTRIBUTES"
        sub={`${stats.length} TRACKED`}
      />
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(row => (
          <StatCard
            key={row.id}
            icon={row.icon}
            shortName={row.shortName}
            displayName={row.displayName}
            level={row.level}
            xpInto={row.xpInto}
            xpForNext={row.xpForNext}
            onClick={open}
          />
        ))}
      </div>
    </div>
  );
}
