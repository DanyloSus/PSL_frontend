import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

import type { ActivityHistoryEntry, ActivityHistoryQuery } from "../types/user";

function fetchHistory(params: ActivityHistoryQuery) {
  return api.get<ActivityHistoryEntry[], ActivityHistoryEntry[]>(
    "/users/me/activity-history",
    { params }
  );
}

export const historyQueryOptions = (params: ActivityHistoryQuery = {}) =>
  queryOptions({
    queryKey: queryKeys.users.history(params),
    queryFn: () => fetchHistory(params)
  });
