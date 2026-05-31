import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

import type { ActivityTemplateOut } from "../types/activity";

function fetchActivities() {
  return api.get<ActivityTemplateOut[], ActivityTemplateOut[]>("/activities");
}

export const activitiesQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.activities.list(),
    queryFn: fetchActivities,
    staleTime: 1000 * 60 * 5
  });
