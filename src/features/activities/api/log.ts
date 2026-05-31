import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

import type {
  LogActivityRequest,
  LogActivityResponse
} from "../types/activity";

function logActivity(body: LogActivityRequest) {
  return api.post<LogActivityResponse, LogActivityResponse>(
    "/activities/log",
    body
  );
}

export function useLogActivity() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: logActivity,
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: queryKeys.auth.me });
      void client.invalidateQueries({ queryKey: queryKeys.users.stats() });
      void client.invalidateQueries({
        queryKey: queryKeys.users.historyAll
      });
    }
  });
}
