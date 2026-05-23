---
name: react-zustand-state
description: Zustand 5 client state. Slice selectors, persist middleware, store organization.
metadata:
  version: "1.0"
  framework: react
tier: 1
triggers:
  - store
  - zustand
  - state
  - selector
  - persist
  - middleware
summary: |
  Use Zustand for client state (UI state, ephemeral filters, modals).
  Use TanStack Query for server state — never duplicate. Always select slices,
  never the whole store, to avoid unnecessary re-renders. Use persist middleware
  with partialize when only some keys should survive reload.
---

# React — Zustand

## Overview

| Aspect  | Details                                                     |
| ------- | ----------------------------------------------------------- |
| Goal    | Lightweight client state without context boilerplate        |
| When    | UI-only state: modals, filters, theme, sidebar collapsed, … |
| NOT for | Server data (use TanStack Query)                            |

## Critical rules

**Always select a slice. Selecting the whole store re-renders on every change.**

## Where stores live

| Scope             | Path                                                       |
| ----------------- | ---------------------------------------------------------- |
| One feature only  | `src/features/<f>/stores/<name>-store.ts`                  |
| Multiple features | `src/stores/<name>-store.ts` (create folder) or `src/lib/` |

## Basic store

```ts
// src/stores/sidebar-store.ts
import { create } from "zustand";

type SidebarState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useSidebarStore = create<SidebarState>(set => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set(state => ({ isOpen: !state.isOpen }))
}));
```

## Selecting slices

```tsx
// ❌ Re-renders on ANY store change
const store = useSidebarStore();

// ✅ Re-renders only when isOpen changes
const isOpen = useSidebarStore(s => s.isOpen);
const toggle = useSidebarStore(s => s.toggle);

// ✅ Multiple values via shallow
import { useShallow } from "zustand/react/shallow";
const { isOpen, toggle } = useSidebarStore(
  useShallow(s => ({ isOpen: s.isOpen, toggle: s.toggle }))
);
```

## Persist middleware

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeState = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      theme: "light",
      setTheme: theme => set({ theme })
    }),
    {
      name: "theme-store",
      partialize: state => ({ theme: state.theme }) // only persist theme
    }
  )
);
```

## Splitting actions and state

For larger stores, expose `actions` separately so `useStore.getState().actions.x()` is reachable from non-React code:

```ts
type Store = {
  count: number;
  actions: {
    increment: () => void;
    reset: () => void;
  };
};

export const useCounterStore = create<Store>(set => ({
  count: 0,
  actions: {
    increment: () => set(s => ({ count: s.count + 1 })),
    reset: () => set({ count: 0 })
  }
}));

export const useCount = () => useCounterStore(s => s.count);
export const useCounterActions = () => useCounterStore(s => s.actions);
```

## Common mistakes

| Mistake                                | Fix                                          |
| -------------------------------------- | -------------------------------------------- |
| Storing fetched server data in Zustand | Use TanStack Query                           |
| Selecting the whole store              | Select a slice                               |
| Not persisting derived values          | Use `partialize` to whitelist persisted keys |
| Reading store inside `useEffect` deps  | Subscribe via selector instead               |

## Checklist

- [ ] Store is for client state, not server state
- [ ] Selectors return slices, not the whole store
- [ ] `persist` uses `partialize` if not all keys should survive
- [ ] Store typed via generic, not `any`
