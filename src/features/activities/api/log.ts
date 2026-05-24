import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

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
      void client.invalidateQueries({ queryKey: ["auth", "me"] });
      void client.invalidateQueries({ queryKey: ["users", "me", "stats"] });
      void client.invalidateQueries({
        queryKey: ["users", "me", "activity-history"]
      });
    }
  });
}
