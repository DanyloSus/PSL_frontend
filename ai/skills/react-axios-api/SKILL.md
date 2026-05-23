---
name: react-axios-api
description: HTTP layer via the shared Axios instance. Feature API files, response interceptor pattern, env-based base URL.
metadata:
  version: "1.0"
  framework: react
tier: 1
triggers:
  - axios
  - api
  - http
  - request
  - interceptor
  - endpoint
summary: |
  Always use the shared `api` instance from @/lib/api. Base URL is read from
  env.API_URL (validated by Zod in @/config/env). The response interceptor
  unwraps response.data — your api functions return T, not AxiosResponse<T>.
  Feature API calls live in src/features/<f>/api/<verb>-<resource>.ts.
---

# React — Axios API Layer

## Overview

| Aspect | Details                                                         |
| ------ | --------------------------------------------------------------- |
| Goal   | One Axios instance, predictable response shape, type-safe calls |
| When   | Any HTTP call                                                   |
| Config | `src/lib/api.ts`                                                |

## Critical rules

**Never instantiate Axios elsewhere. Never read response.data — the interceptor already unwraps it.**

## The shared instance

```ts
// src/lib/api.ts
import Axios from "axios";

import { env } from "@/config/env";

export const api = Axios.create({ baseURL: env.API_URL });

api.interceptors.response.use(
  response => response.data, // unwrap
  error => Promise.reject(error)
);
```

Because the interceptor returns `response.data`, callers receive `T` directly:

```ts
// Type assertion is required because the interceptor changes the runtime shape
const user: User = await api.get(`/users/${id}`);
```

## Feature API file

```ts
// src/features/user/api/get-user.ts
import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api";

import { userKeys } from "./user-keys";
import type { User } from "../types/user.types";

export const getUser = (userId: string): Promise<User> =>
  api.get(`/users/${userId}`);

export const userQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUser(userId)
  });
```

## File naming

| Verb         | File                   |
| ------------ | ---------------------- |
| GET (single) | `get-<resource>.ts`    |
| GET (list)   | `list-<resource>.ts`   |
| POST         | `create-<resource>.ts` |
| PATCH/PUT    | `update-<resource>.ts` |
| DELETE       | `delete-<resource>.ts` |

## Adding an interceptor (e.g., auth header)

```ts
// src/lib/api.ts (extension)
import { useAuthStore } from "@/stores/auth-store";

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

## Error shape

By default Axios errors come as `AxiosError`. Narrow before reading:

```ts
import { isAxiosError } from "axios";

try {
  await api.post("/users", body);
} catch (err) {
  if (isAxiosError(err)) {
    console.error(err.response?.status, err.response?.data);
  }
  throw err;
}
```

In React Query, prefer letting errors bubble and using `error` from `useQuery`/`useMutation`.

## Common mistakes

| Mistake                                                 | Fix                         |
| ------------------------------------------------------- | --------------------------- |
| `import axios from 'axios'` and creating a new instance | Use `@/lib/api`             |
| Reading `response.data` after interceptor unwrap        | Just use the returned value |
| Hardcoding base URL                                     | Use `env.API_URL`           |
| Putting API calls in component files                    | Move to `features/<f>/api/` |

## Checklist

- [ ] Uses `api` from `@/lib/api`
- [ ] Returns the typed payload directly
- [ ] Lives in `features/<f>/api/<verb>-<resource>.ts`
- [ ] Has an accompanying `queryOptions` if used in React Query
