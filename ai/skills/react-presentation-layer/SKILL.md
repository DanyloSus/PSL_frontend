---
name: react-presentation-layer
description: How to write components, pages, and hooks. Smart vs dumb components, the ≤150-line rule, hook conventions, and composition patterns.
metadata:
  version: "1.0"
  framework: react
tier: 1
triggers:
  - component
  - page
  - smart
  - dumb
  - hook
  - useX
  - presentation
  - UI
summary: |
  Smart components live in src/features/<f>/components/ and read from queries/stores.
  Dumb components live in src/components/ or src/ui/ and only take props.
  Components ≤150 lines (eslint-enforced as warning). Hooks start with use*,
  one responsibility, ≤80 lines (guideline). React 19 + new JSX transform —
  no need to import React.
---

# React — Presentation Layer

## Overview

| Aspect       | Details                                  |
| ------------ | ---------------------------------------- |
| Goal         | Maintainable, testable presentation code |
| When         | Any UI work — components, pages, hooks   |
| Verification | `npm run lint && npm test -- --run`      |

## Critical rules

**Smart components own state. Dumb components only take props. Hooks own logic.**

## Smart vs dumb

| Smart (`features/<f>/components/`) | Dumb (`src/components/`, `src/ui/`) |
| ---------------------------------- | ----------------------------------- |
| Reads from `useQuery` / `useStore` | Only props                          |
| Calls mutations                    | Calls callbacks via props           |
| Knows the feature domain           | Reusable across features            |
| May trigger navigation             | Renders only                        |

```tsx
// ✅ Smart — features/user/components/user-list.tsx
export function UserList() {
  const { data: users, isLoading } = useUsersQuery();
  const navigate = useNavigate();

  if (isLoading) return <Spinner />;

  return (
    <ul>
      {users?.map(user => (
        <UserRow
          key={user.id}
          user={user}
          onClick={() => navigate({ to: `/users/${user.id}` })}
        />
      ))}
    </ul>
  );
}

// ✅ Dumb — features/user/components/user-row.tsx
type UserRowProps = { user: User; onClick: () => void };

export function UserRow({ user, onClick }: UserRowProps) {
  return (
    <li>
      <button onClick={onClick}>{user.name}</button>
    </li>
  );
}
```

## Component file structure

```tsx
// 1. Imports (sorted by ESLint)
import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { Button } from "@/ui/button";

// 2. Types
type Props = { id: string };

// 3. Component
export function UserCard({ id }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useQuery(userQueryOptions(id));

  if (!data) return null;

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>{data.name}</Button>
    </div>
  );
}
```

- One component per file.
- Named export — default exports allowed only for route files.
- ≤150 lines (`max-lines: warn`).

## Hooks

```ts
// src/hooks/use-debounce.ts
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
```

- Name starts with `use*`.
- Single responsibility.
- ≤80 lines (guideline).
- Pure logic, no JSX.

## Composition over conditionals

```tsx
// ❌ Conditional rendering with branches inside one component
function Card({ variant }: { variant: "simple" | "detailed" }) {
  if (variant === "simple") return <div>{/* … */}</div>;

  return <div>{/* … much more … */}</div>;
}

// ✅ Two components, one composer
export function SimpleCard() {
  /* … */
}
export function DetailedCard() {
  /* … */
}
```

## React 19 specifics

- No need to `import React` for JSX (`react-in-jsx-scope: off`).
- Prefer `use()` for unwrapping promises/contexts when appropriate.
- Server components are NOT used (Vite SPA, not Next.js).
- `useTransition` for non-urgent updates.

## Common mistakes

| Mistake                       | Fix                                               |
| ----------------------------- | ------------------------------------------------- |
| Component over 150 lines      | Split into sub-components or extract a hook       |
| `useEffect` for derived state | Compute it during render                          |
| Inline `<>` Fragment with key | Use a `<Fragment key>` component                  |
| Single-letter prop names      | id-length warns — use `name`, `value`, `onChange` |

## Checklist

- [ ] Component is ≤150 lines
- [ ] Smart components live under `features/<f>/components/`
- [ ] Dumb components are pure prop-driven
- [ ] Hooks start with `use*` and do one thing
- [ ] No `console.log`, no `any`, no nested ternary
- [ ] `npm run lint` passes
