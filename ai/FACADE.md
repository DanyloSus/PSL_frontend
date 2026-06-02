# AI Facade — Task Router

> **Read this FIRST.** Single entry point for all AI agents working on this React project. Routes to the right skill or engine scenario. `BOOTSTRAP.md` is for reference only.
>
> Design pattern: [Facade](https://refactoring.guru/design-patterns/facade) — simplified interface hiding subsystem complexity.

## §A — UI / Presentation

**Rules:** code-style, ui-theme, file-health | **Skills:** `react-presentation-layer`, `react-shadcn-tailwind`

| Task                    | Load section | Notes                                                 |
| ----------------------- | ------------ | ----------------------------------------------------- |
| Page / Route            | §Routes      | TanStack Router file-based, `src/routes/`, kebab-case |
| Smart component         | §Components  | Reads stores/queries, uses hooks, ≤150 lines          |
| Dumb / shared component | §Shared      | `src/components/` — no feature imports                |
| UI primitive            | §UI          | `src/ui/` — shadcn wrappers, CVA variants             |
| Hook                    | §Hooks       | `useX` naming, single responsibility                  |
| Style                   | §Styling     | Tailwind classes via `cn()` from `@/utils/cn`         |

**Tokens:** Tailwind v4 CSS variables. `cn(...)` from `@/utils/cn` for class merging. CVA for variant components.

## §B — Data / Server State

**Rules:** architecture, imports | **Skills:** `react-tanstack-query`, `react-axios-api`

| Task        | Load                      | Notes                                                |
| ----------- | ------------------------- | ---------------------------------------------------- |
| Fetch query | tanstack-query §Queries   | `useQuery` + `queryOptions`, key factory per feature |
| Mutation    | tanstack-query §Mutations | `useMutation` + `onSuccess` invalidation             |
| API client  | axios-api §Client         | `src/lib/api.ts` instance — never re-create Axios    |
| Feature API | axios-api §Feature API    | `src/features/<feat>/api/<resource>.ts`              |
| Auth        | tanstack-query §Auth      | `react-query-auth` patterns                          |

## §C — Client State

**Rules:** architecture | **Skills:** `react-zustand-state`

| Task         | Load                 | Notes                                          |
| ------------ | -------------------- | ---------------------------------------------- |
| Global store | zustand §Stores      | `src/stores/` or `src/features/<feat>/stores/` |
| Selector     | zustand §Selectors   | Always select slices, never whole store        |
| Persistence  | zustand §Persistence | `persist` middleware with `partialize`         |

## §D — Forms & Validation

**Skills:** `react-hook-form-zod`

| Task       | Load             | Notes                                                    |
| ---------- | ---------------- | -------------------------------------------------------- |
| Form       | rhf-zod §Forms   | RHF + `@hookform/resolvers/zod`, schema in `*.schema.ts` |
| Validation | rhf-zod §Schemas | Zod v4, never duplicate schema in client/server          |

## §E — Tests

**Rules:** testing | **Skills:** `react-testing`

| Task             | Load                              | Notes                                              |
| ---------------- | --------------------------------- | -------------------------------------------------- |
| Unit / component | testing §Component                | Vitest + RTL, `@testing-library/jest-dom` matchers |
| Hook             | testing §Hooks                    | `renderHook` from RTL                              |
| E2E              | testing §E2E                      | Playwright in `e2e/`, three browsers               |
| Batch (>3)       | **Engine:** `batch-test-creation` | Parallel sub-agents                                |

## §F — New Feature

**Skills:** `react-feature-sliced-design` + `react-tanstack-query` + `react-presentation-layer`
**Engine:** `feature-scaffold` (full scaffold with approval gate)

Folder layout: `src/features/<name>/{api,components,hooks,stores,types,utils,assets}` — only what is needed.

## §G — Complex / Multi-file

**→ Check `ai/engine/registry.json` for matching pipeline scenario.**

| Pattern                  | Scenario              |
| ------------------------ | --------------------- |
| Batch tests              | `batch-test-creation` |
| Full feature             | `feature-scaffold`    |
| Code review              | `code-review`         |
| Refactor / SRP split     | `refactor-extract`    |
| Pattern fix across files | `batch-fix-pattern`   |

No match? → Compose from nodes (`ai/engine/nodes/`) with user approval gate.
See skill: `pipeline-orchestration`.

## §H — Git / PR

| Task                  | Skill                      |
| --------------------- | -------------------------- |
| Conventional commit   | `git-commit`               |
| Squash branch         | `git-squash`               |
| Commit + squash       | `git-commit-squash`        |
| Commit + push (split) | `git-commit-push`          |
| Branch naming         | `git-branch`               |
| PR description        | `pull-request-description` |
| Worktree → PR         | `worktree-task`            |
| Close worktree        | `worktree-close`           |

Conventional Commits required (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `deps`, `perf`, `revert`, `ci`, `build`).
Branch format: `(feature|bugfix|refactor)/<ticket>/<desc>` (drop ticket when none).

## §I — Storybook

**Skills:** `react-storybook`

`*.stories.tsx` next to component. Addons: a11y, docs, vitest, onboarding.

## §J — Quality / Review

| Task        | Skill                     | Command                    |
| ----------- | ------------------------- | -------------------------- |
| Lint        | `react-code-quality`      | `npm run lint`             |
| Type check  | `react-code-quality`      | `npm run build` (`tsc -b`) |
| Code review | **Engine:** `code-review` | Parallel agents            |

## §K — Architecture / Planning

| Task                               | Skill                           |
| ---------------------------------- | ------------------------------- |
| Find deepening/refactor candidates | `improve-codebase-architecture` |
| Stress-test a plan / design        | `grill-me`                      |

## Critical Rules (always enforced)

```
NO console.log    → console.warn/error    NO any          → unknown + narrow
NO ../../ imports → @/ alias              kebab-case      → files + folders
Features isolated → no cross-feature      Shared pure     → no feature imports
≤150 lines/comp   → split                 boolean naming  → is/has/should/can/will/did/are
No nested ternary → early return          === / !==       → strict equality
Import order      → ESLint enforced       No cycles       → import/no-cycle: error
```

## Imports Cheat Sheet

```ts
import { api } from "@/lib/api"; // Axios instance
import { queryConfig } from "@/lib/react-query"; // RQ config
import { env } from "@/config/env"; // Validated env
import { cn } from "@/utils/cn"; // class merger
import { Button } from "@/ui/button"; // shadcn primitive
import type { Route } from "@/routes/__root"; // type-safe router
```

## Reference

Full architecture, rules table, skill triggers → `ai/BOOTSTRAP.md`
Engine documentation → `ai/README.md` §4
