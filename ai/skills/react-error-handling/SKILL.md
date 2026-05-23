---
name: react-error-handling
description: Error handling with react-error-boundary, TanStack Query error states, and mutation error patterns.
metadata:
  version: "1.0"
  framework: react
tier: 1
triggers:
  - error
  - boundary
  - fallback
  - retry
  - ErrorBoundary
summary: |
  Wrap route trees in <ErrorBoundary> from react-error-boundary. Use isError /
  error from useQuery for inline UI errors. Use onError on mutations. Never
  swallow errors with try/catch in components — let them bubble to a boundary.
---

# React — Error Handling

## Overview

| Aspect | Details                                                           |
| ------ | ----------------------------------------------------------------- |
| Goal   | Predictable error UX, no silent failures                          |
| When   | Any place that can throw or return an error                       |
| Tools  | `react-error-boundary`, `useQuery.isError`, `useMutation.onError` |

## Critical rules

**Errors bubble. Boundaries catch. Components render.**

## Error boundary

```tsx
// src/components/error-fallback.tsx
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="border-destructive rounded border p-4">
      <p className="font-semibold">Something went wrong</p>
      <pre className="text-sm">{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary FallbackComponent={Fallback}>{children}</ErrorBoundary>;
}
```

Mount near the root or per route segment.

## Query error state

```tsx
function UserList() {
  const { data, isLoading, isError, error, refetch } = useUsersQuery();

  if (isLoading) return <Spinner />;
  if (isError) {
    return (
      <div>
        <p>Failed to load users: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <ul>
      {data.map(u => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

For boundary-driven errors, set `throwOnError: true` per query or in `queryConfig`.

## Mutation errors

```tsx
const { mutate } = useUpdateUser();

mutate(input, {
  onError: err => {
    // Show toast / setError on form field
    console.error(err);
  }
});
```

For form errors returned by the server, use `setError` from RHF:

```tsx
mutate(values, {
  onError: err => {
    if (isAxiosError(err) && err.response?.status === 422) {
      const fieldErrors = err.response.data.errors;
      Object.entries(fieldErrors).forEach(([field, message]) => {
        setError(field as keyof FormValues, { message: String(message) });
      });
    }
  }
});
```

## Patterns

| Scenario                 | Approach                                       |
| ------------------------ | ---------------------------------------------- |
| Unknown render error     | `<ErrorBoundary>` near root                    |
| Failed query             | Inline `isError` UI or `throwOnError`          |
| Failed mutation (form)   | RHF `setError`                                 |
| Failed mutation (action) | Toast + `console.error`                        |
| Network down             | TanStack Query retries off — show inline error |

## Common mistakes

| Mistake                                             | Fix                                              |
| --------------------------------------------------- | ------------------------------------------------ |
| `try/catch` swallowing errors in components         | Let them throw — boundaries catch                |
| `console.log` instead of `console.error` for errors | Use `console.error` (allowed by ESLint)          |
| Using `any` for caught errors                       | Narrow with `isAxiosError` or `instanceof Error` |
| No retry button after a failed query                | Always offer recovery                            |

## Checklist

- [ ] Top-level route is wrapped in an error boundary
- [ ] Queries surface errors with retry
- [ ] Mutation errors show user-visible feedback
- [ ] No silent `catch` blocks
