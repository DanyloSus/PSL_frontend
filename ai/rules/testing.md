---
id: testing
tier: 1
eslint-areas: [@vitest/eslint-plugin, eslint-plugin-testing-library, eslint-plugin-jest-dom]
enforcement: strict
---

# Testing Rules

## Rules

### TS1. Test files: `*.test.ts(x)` co-located

```
src/components/user-card.tsx
src/components/user-card.test.tsx
```

### TS2. Use Vitest + React Testing Library

```ts
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { UserCard } from './user-card'

describe('<UserCard />', () => {
  it('renders the user name', () => {
    render(<UserCard user={{ id: '1', name: 'Ada' }} />)

    expect(screen.getByText('Ada')).toBeInTheDocument()
  })
})
```

### TS3. Use `@testing-library/jest-dom` matchers

`toBeInTheDocument`, `toHaveAttribute`, `toHaveTextContent`, `toBeVisible` …

Set up in `src/testing/setup.ts` (extending `expect`).

### TS4. Hook tests via `renderHook`

```ts
import { act, renderHook } from "@testing-library/react";

import { useCounter } from "./use-counter";

it("increments", () => {
  const { result } = renderHook(() => useCounter());

  act(() => result.current.increment());

  expect(result.current.count).toBe(1);
});
```

### TS5. Query user-facing first

Prefer `getByRole`, `getByLabelText`, `getByText`. Fall back to `getByTestId` only as a last resort.

### TS6. Async: `findBy*` over `waitFor(getBy*)`

```ts
// ✅
const button = await screen.findByRole("button", { name: /save/i });

// ❌ — slower, more boilerplate
await waitFor(() =>
  expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument()
);
```

### TS7. E2E with Playwright in `e2e/`

```ts
import { test, expect } from "@playwright/test";

test("renders home", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /welcome/i })).toBeVisible();
});
```

Three browsers: Chromium, Firefox, WebKit (configured in `playwright.config.ts`).

### TS8. No `render` leaks

`@testing-library/react` auto-cleans between tests via the Vitest setup. Never call `render` outside a test.

## Verification

```bash
npm test -- --run
npx playwright test
```
