import { useQuery } from "@tanstack/react-query";

import { meQueryOptions } from "../api/auth";

export function useUser() {
  return useQuery(meQueryOptions());
}
