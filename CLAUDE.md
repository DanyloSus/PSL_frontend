# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start dev server on port 3000
npm run build            # Type check + Vite production build → dist/
npm run lint             # ESLint checks
npm run lint:fix         # ESLint with auto-fix
npm run format           # Prettier formatting
npm test                 # Vitest in watch mode
npm test -- --run        # Vitest single run (for CI)
npm run test:coverage    # Vitest with V8 coverage
npx playwright test      # E2E tests (Chromium, Firefox, WebKit)
npm run storybook        # Storybook dev server on port 6006
```

## Architecture

**Feature-Sliced Design** with strict ESLint-enforced boundaries:

- `src/features/<name>/` — Self-contained feature modules with sub-folders: `api/`, `components/`, `hooks/`, `types/`, `utils/`, `assets/`
- `src/components/` — Shared presentational components (cannot import from features)
- `src/ui/` — Low-level UI primitives (shadcn/ui wrappers)
- `src/lib/` — Shared library instances: Axios (`api.ts`), React Query config (`react-query.ts`)
- `src/config/env.ts` — Zod-validated env vars at startup; app throws if `VITE_APP_API_URL` is missing
- `src/routes/` — TanStack Router file-based routes; `routeTree.gen.ts` is auto-generated — do not edit manually

**Import rule:** Always use `@/` alias (maps to `src/`). No relative imports across directories. ESLint reports violations as errors.

**File naming:** All files and folders use `kebab-case`.

## Key Stack Details

- **Routing:** TanStack Router (file-based, type-safe, auto code-splitting)
- **Server state:** TanStack Query — stale time 1 min, no refetch-on-focus, no retry
- **Client state:** Zustand
- **Forms:** React Hook Form + Zod (v4)
- **Styling:** Tailwind CSS v4 + shadcn/ui (Radix UI) + CVA for variants; use `cn()` from `@/utils/cn` for class merging
- **HTTP:** Axios instance in `src/lib/api.ts` — base URL from env, response interceptor unwraps `response.data`

## Git Hooks

- **pre-commit:** lint-staged runs ESLint on `*.{ts,tsx,js,jsx}`, Prettier on `*.{json,md,yml,yaml}`
- **commit-msg:** commitlint enforces Conventional Commits (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `deps`, `perf`, `revert`, `ci`, `build`)

## Environment Variables

Copy `.env.example` to `.env`. Required: `VITE_APP_API_URL`. Optional: `VITE_APP_APP_URL` (defaults to `http://localhost:3000`).
