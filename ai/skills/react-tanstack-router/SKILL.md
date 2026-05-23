---
name: react-tanstack-router
description: File-based routing with TanStack Router. Type-safe links, search params with Zod, loaders, and pendingComponent patterns.
metadata:
  version: "1.0"
  framework: react
tier: 1
triggers:
  - route
  - router
  - navigate
  - link
  - search params
  - tanstack router
  - createFileRoute
summary: |
  Routes live in src/routes/ as files. The router plugin generates routeTree.gen.ts
  on save — never edit it. Use createFileRoute() per file. Search params get
  Zod validation via validateSearch. Use Link for navigation, useNavigate for
  programmatic. The root layout is src/routes/__root.tsx.
---

# React — TanStack Router

## Overview

| Aspect       | Details                                                |
| ------------ | ------------------------------------------------------ |
| Goal         | Type-safe, file-based routing with auto code splitting |
| When         | Adding pages, links, navigation                        |
| Verification | `npm run dev` and click through; `npm run build`       |

## Critical rules

**`src/routes/routeTree.gen.ts` is auto-generated. NEVER edit it. The TanStack Router plugin regenerates it from `src/routes/`.**

## File-based routing

```
src/routes/
├── __root.tsx           # Root layout (devtools mounted here)
├── index.tsx            # /
├── about.tsx            # /about
├── users.tsx            # /users (layout for nested)
├── users.index.tsx      # /users (index)
└── users.$userId.tsx    # /users/:userId
```

## Defining a route

```tsx
// src/routes/users.$user-id.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users/$userId")({
  component: UserPage
});

function UserPage() {
  const { userId } = Route.useParams();

  return <div>User {userId}</div>;
}
```

The `createFileRoute('/users/$userId')` path is verified by the plugin against the file location.

## Search params with Zod

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  page: z.number().int().min(1).default(1),
  q: z.string().optional()
});

export const Route = createFileRoute("/users/")({
  validateSearch: searchSchema,
  component: UsersPage
});

function UsersPage() {
  const { page, q } = Route.useSearch();

  return (
    <div>
      Page {page}
      {q ? ` — search: ${q}` : ""}
    </div>
  );
}
```

## Loaders

```tsx
export const Route = createFileRoute("/users/$userId")({
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(userQueryOptions(params.userId)),
  component: UserPage,
  pendingComponent: () => <Spinner />
});
```

Wire `queryClient` into router context in `src/main.tsx`:

```tsx
const router = createRouter({
  routeTree,
  context: { queryClient }
});
```

## Links

```tsx
import { Link } from "@tanstack/react-router";

// ✅ Type-safe — `to` is autocompleted, params are required
<Link to="/users/$userId" params={{ userId: "42" }}>
  View user
</Link>;
```

## Programmatic navigation

```tsx
import { useNavigate } from "@tanstack/react-router";

const navigate = useNavigate();

navigate({ to: "/users/$userId", params: { userId: "42" } });
```

## Root layout

```tsx
// src/routes/__root.tsx
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: () => (
      <>
        <Outlet />
        <TanStackRouterDevtools />
      </>
    )
  }
);
```

`__root.tsx` is exempt from kebab-case naming (eslint override).

## Common mistakes

| Mistake                                     | Fix                                                          |
| ------------------------------------------- | ------------------------------------------------------------ |
| Editing `routeTree.gen.ts`                  | Touch the file in `src/routes/` instead — plugin regenerates |
| `<a href>` for internal links               | Use `<Link to>` for type safety                              |
| Skipping `validateSearch`                   | Search params will be `unknown`-typed                        |
| `useParams()` from react-router             | Wrong package — use `Route.useParams()`                      |
| Missing `pendingComponent` on a slow loader | UI flashes; add a pending state                              |

## Checklist

- [ ] File path matches `createFileRoute('/path')`
- [ ] Search params validated with Zod
- [ ] Loaders use the query client from context
- [ ] All links use `<Link>` with type-safe `to`
- [ ] `routeTree.gen.ts` not in your diff
