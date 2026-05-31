import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

import type { UserStatOut } from "../types/user";

function fetchStats() {
  return api.get<UserStatOut[], UserStatOut[]>("/users/me/stats");
}

export const statsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.users.stats(),
    queryFn: fetchStats
  });
