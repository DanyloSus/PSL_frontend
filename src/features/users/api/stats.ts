import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api";

import type { UserStatOut } from "../types/user";

export const userKeys = {
  stats: () => ["users", "me", "stats"] as const,
  history: (limit?: number, before?: string) =>
    ["users", "me", "activity-history", { limit, before }] as const
};

function fetchStats() {
  return api.get<UserStatOut[], UserStatOut[]>("/users/me/stats");
}

export const statsQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.stats(),
    queryFn: fetchStats
  });
