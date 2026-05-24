import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api";

import { userKeys } from "./stats";
import type { ActivityHistoryEntry, ActivityHistoryQuery } from "../types/user";

function fetchHistory(params: ActivityHistoryQuery) {
  return api.get<ActivityHistoryEntry[], ActivityHistoryEntry[]>(
    "/users/me/activity-history",
    { params }
  );
}

export const historyQueryOptions = (params: ActivityHistoryQuery = {}) =>
  queryOptions({
    queryKey: userKeys.history(params.limit, params.before),
    queryFn: () => fetchHistory(params)
  });
