---
name: react-code-quality
description: ESLint + Prettier + TypeScript as quality gates. Lint:fix, format, type-check via tsc -b.
metadata:
  version: "1.0"
  framework: react
tier: 2
triggers:
  - quality
  - lint
  - format
  - review
  - eslint
  - prettier
  - audit
summary: |
  Three gates: ESLint (`npm run lint`), Prettier (`npm run format`), TypeScript
  (`npm run build` which runs `tsc -b`). Pre-commit runs lint-staged. CI should
  run all three plus tests. Commit messages enforced by commitlint.
---

# React — Code Quality

## Overview

| Aspect     | Details                                                   |
| ---------- | --------------------------------------------------------- |
| Gates      | ESLint, Prettier, tsc, Vitest, Playwright                 |
| Pre-commit | `lint-staged` (ESLint on ts/tsx, Prettier on json/md/yml) |
| Commit msg | `commitlint` with Conventional Commits                    |

## Commands

```bash
npm run lint             # ESLint
npm run lint:fix         # ESLint --fix
npm run format           # Prettier write
npm run build            # tsc -b && vite build
npm test -- --run        # Vitest single run
npm run test:coverage    # V8 coverage
npx playwright test      # E2E
```

## Quality gate order

When verifying work, run in this order so fast gates fail fast:

1. `npm run lint` (seconds)
2. `npm run build` (seconds — incremental tsc)
3. `npm test -- --run` (tens of seconds)
4. `npx playwright test` (only if touching E2E)

## Fixing common lint errors

| Error                                   | Fix                                                   |
| --------------------------------------- | ----------------------------------------------------- |
| `no-console`                            | Replace with `console.warn`/`console.error` or remove |
| `@typescript-eslint/no-explicit-any`    | Use `unknown` + narrow, or a real type                |
| `import/order`                          | Run `npm run lint:fix` — autofixable                  |
| `no-restricted-imports` (`../../`)      | Replace with `@/…`                                    |
| `check-file/filename-naming-convention` | Rename file to kebab-case                             |
| `boundaries/dependencies`               | Lift the import to a shared layer                     |
| `max-lines`                             | Split the component                                   |

## Conventional Commits

```
feat(user): add profile page
fix(router): handle missing params
docs(readme): clarify env setup
refactor(auth): extract token helper
test(user-card): cover click handler
chore(deps): bump vite to 8.0.2
```

Types allowed: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `deps`, `perf`, `revert`, `ci`, `build`.

## Prettier config

Lives in `.prettierrc` (or equivalent). `prettier-plugin-tailwindcss` sorts Tailwind classes automatically.

## Checklist (pre-PR)

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `npm test -- --run` passes
- [ ] All files kebab-case
- [ ] No `any`, no `console.log`, no `../../` imports
- [ ] Commit messages follow Conventional Commits
