import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api";

import type { ActivityTemplateOut } from "../types/activity";

export const activityKeys = {
  list: () => ["activities"] as const
};

function fetchActivities() {
  return api.get<ActivityTemplateOut[], ActivityTemplateOut[]>("/activities");
}

export const activitiesQueryOptions = () =>
  queryOptions({
    queryKey: activityKeys.list(),
    queryFn: fetchActivities,
    staleTime: 1000 * 60 * 5
  });
