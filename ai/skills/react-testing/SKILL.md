---
name: react-testing
description: Vitest + React Testing Library for component/hook tests. Playwright for E2E. Co-located *.test.ts(x) files.
metadata:
  version: "1.0"
  framework: react
tier: 1
triggers:
  - test
  - vitest
  - RTL
  - render
  - renderHook
  - e2e
  - playwright
  - spec
summary: |
  Component tests via Vitest + React Testing Library. Use jest-dom matchers
  (toBeInTheDocument, etc). Hook tests via renderHook from RTL. E2E via
  Playwright in three browsers (Chromium/Firefox/WebKit). Test files are
  co-located: *.test.ts(x) next to the source.
---

# React — Testing

## Overview

| Aspect | Details                                                          |
| ------ | ---------------------------------------------------------------- |
| Goal   | Fast, reliable, behavior-focused tests                           |
| When   | Every new component, hook, or utility                            |
| Stack  | Vitest 4, @testing-library/react 16, jest-dom 6, playwright 1.58 |
| Setup  | `src/testing/setup.ts`                                           |

## Critical rules

**Test behavior, not implementation. Query by role. Use `findBy*` for async.**

## Component test

```tsx
// src/components/user-card.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { UserCard } from "./user-card";

describe("<UserCard />", () => {
  it("renders the user name", () => {
    render(<UserCard user={{ id: "1", name: "Ada" }} />);

    expect(screen.getByText("Ada")).toBeInTheDocument();
  });

  it("calls onSelect when the row is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<UserCard user={{ id: "1", name: "Ada" }} onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: /ada/i }));

    expect(onSelect).toHaveBeenCalledWith("1");
  });
});
```

## Hook test

```ts
// src/hooks/use-counter.test.ts
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useCounter } from "./use-counter";

describe("useCounter", () => {
  it("starts at 0", () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);
  });

  it("increments", () => {
    const { result } = renderHook(() => useCounter());

    act(() => result.current.increment());

    expect(result.current.count).toBe(1);
  });
});
```

## Testing components that use queries

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

function renderWithQuery(ui: React.ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });

  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
}
```

Mock `api` (or use MSW handlers in `src/testing/`).

## Async assertions

```ts
// ✅
const button = await screen.findByRole("button", { name: /save/i });

// ❌
await waitFor(() => {
  expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
});
```

## E2E (Playwright)

```ts
// e2e/home.spec.ts
import { expect, test } from "@playwright/test";

test("renders home", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /welcome/i })).toBeVisible();
});
```

Run: `npx playwright test` (Chromium / Firefox / WebKit).

## Patterns

| Need            | Pattern                                             |
| --------------- | --------------------------------------------------- |
| Fake timers     | `vi.useFakeTimers()` + `vi.advanceTimersByTime(ms)` |
| Mock module     | `vi.mock('@/lib/api')`                              |
| Spy on function | `vi.fn()`                                           |
| Snapshot (rare) | `expect(...).toMatchInlineSnapshot()`               |
| Coverage        | `npm run test:coverage` (V8 provider)               |

## Common mistakes

| Mistake                    | Fix                                              |
| -------------------------- | ------------------------------------------------ |
| `getByTestId` everywhere   | Prefer role/label/text                           |
| `act` warnings             | Use `userEvent` (auto-wraps in act)              |
| Sleeping with `setTimeout` | Use `findBy*` or fake timers                     |
| `await waitFor(getBy*)`    | Use `findBy*`                                    |
| Not cleaning up            | RTL auto-cleans; don't call `cleanup()` manually |

## Checklist

- [ ] Test file is `*.test.ts(x)` next to source
- [ ] Uses `getByRole` / `getByLabelText` / `getByText` first
- [ ] Async checks use `findBy*`
- [ ] User interactions via `userEvent`
- [ ] Each test has arrange / act / assert
