# Protocol: Self-Verification

> Post-task quality check. Three scopes — pick the right one based on task size.

## Scopes

### Quick (simple task, 1-2 files)

```bash
npm run lint
```

Runs in seconds. Catches style and import violations.

### Standard (feature task, 3-10 files)

```bash
npm run lint && npm run build
```

Adds TypeScript type check via `tsc -b`. Run after any type-affecting change.

### Full (audit, breaking changes, pre-PR)

```bash
npm run lint && npm run build && npm test -- --run
```

Adds Vitest single run. Run before any PR.

### E2E (when user-visible flows changed)

```bash
npm run lint && npm run build && npm test -- --run && npx playwright test
```

Runs the full Playwright suite (Chromium / Firefox / WebKit).

## Decision matrix

| Task                    | Scope                      |
| ----------------------- | -------------------------- |
| Rename one variable     | Quick                      |
| Edit a single component | Standard                   |
| Add a new feature       | Full                       |
| Refactor shared code    | Full                       |
| Touch routing / loader  | E2E                        |
| Pre-PR                  | Full (+ E2E if UI changed) |

## If a gate fails

1. Read the error — do NOT disable the rule.
2. Fix at the source — not by `--no-verify` or ESLint disable comments.
3. If the rule seems genuinely wrong, propose a change via the `self-expansion` skill and ask the user.
