---
name: react-tanstack-query
description: TanStack Query patterns. queryOptions factory, query key factories per feature, mutation invalidation, suspense queries, error handling.
metadata:
  version: "1.0"
  framework: react
tier: 1
triggers:
  - query
  - mutation
  - useQuery
  - useMutation
  - cache
  - invalidate
  - queryKey
  - tanstack query
summary: |
  Use queryOptions() to share query definitions between hooks and route loaders.
  Each feature has a query-key factory file. Mutations invalidate via the query
  client in onSuccess. Default config is in src/lib/react-query.ts (1-min stale,
  no refetch on focus, no retry).
---

# React — TanStack Query

## Overview

| Aspect       | Details                                                               |
| ------------ | --------------------------------------------------------------------- |
| Goal         | Server state cache with predictable invalidation                      |
| When         | Any HTTP fetch, mutation, or cached resource                          |
| Config       | `src/lib/react-query.ts` — 1 min stale, no refetch on focus, no retry |
| Verification | `npm run dev` + react-query devtools                                  |

## Critical rules

**Use a query key factory per feature. Use `queryOptions()` so the same definition can be used by hooks and route loaders.**

## Default config (do not change without reason)

```ts
// src/lib/react-query.ts
export const queryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60
  }
} satisfies DefaultOptions;
```

## Query key factory

```ts
// src/features/user/api/user-keys.ts
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: { q?: string }) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const
};
```

This gives you precise invalidation:

```ts
queryClient.invalidateQueries({ queryKey: userKeys.lists() }); // all lists
queryClient.invalidateQueries({ queryKey: userKeys.detail("42") }); // single
```

## queryOptions pattern

```ts
// src/features/user/api/get-user.ts
import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api";

import { userKeys } from "./user-keys";
import type { User } from "../types/user.types";

export const userQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: userKeys.detail(userId),
    queryFn: (): Promise<User> => api.get(`/users/${userId}`)
  });
```

Used by both hooks and route loaders:

```ts
// in a component
const { data } = useQuery(userQueryOptions(userId));

// in a route loader
loader: ({ params, context }) =>
  context.queryClient.ensureQueryData(userQueryOptions(params.userId));
```

## Mutations

```ts
// src/features/user/api/update-user.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

import { userKeys } from "./user-keys";
import type { User } from "../types/user.types";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: string; name: string }): Promise<User> =>
      api.patch(`/users/${input.id}`, { name: input.name }),
    onSuccess: updated => {
      queryClient.setQueryData(userKeys.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    }
  });
}
```

## Patterns

| Need              | Pattern                                             |
| ----------------- | --------------------------------------------------- |
| Optimistic update | `onMutate` snapshot + `onError` rollback            |
| Polling           | `refetchInterval: 5000`                             |
| Pagination        | `useQuery` with `placeholderData: keepPreviousData` |
| Infinite list     | `useInfiniteQuery`                                  |
| Suspense          | `useSuspenseQuery` (requires Suspense boundary)     |
| Prefetch          | `queryClient.prefetchQuery(opts)` in route loader   |

## Auth

`react-query-auth` is installed for auth flows. See its docs for `configureAuth({ userFn, loginFn, registerFn, logoutFn })`.

## Common mistakes

| Mistake                                   | Fix                                                         |
| ----------------------------------------- | ----------------------------------------------------------- |
| Inline query key strings (`['user', id]`) | Use the key factory                                         |
| Forgetting to invalidate after mutation   | Add `onSuccess` invalidation                                |
| Re-creating the API client                | Always use `@/lib/api`                                      |
| Using `enabled: !!id` to gate queries     | Fine, but consider `useSuspenseQuery` if `id` is guaranteed |
| `staleTime: Infinity` everywhere          | Defeats the cache — only for truly static data              |

## Checklist

- [ ] Query key factory exists for the feature
- [ ] `queryOptions()` used (not bare `useQuery({ queryKey, queryFn })`)
- [ ] Mutations invalidate or `setQueryData` after success
- [ ] No hardcoded query keys
- [ ] API call goes through `@/lib/api`
