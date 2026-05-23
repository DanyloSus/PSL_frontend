---
name: git-commit
description: Conventional commit generator. Analyzes staged diff, picks type+scope, writes a concise message.
metadata:
  version: "1.0"
tier: 1
triggers:
  - commit
  - git commit
  - commit message
  - stage changes
summary: |
  Generate a Conventional Commit from the staged diff. Types: feat/fix/docs/
  refactor/test/chore/deps/perf/revert/ci/build. Scope is the affected area
  (feature name, lib name, or folder). Enforced by commitlint on commit-msg hook.
  Pre-commit runs lint-staged.
---

# Git Commit

## Workflow

1. `git status` + `git diff --staged` to see what will be committed.
2. Group changes by type/scope.
3. Pick ONE primary type (`feat`, `fix`, `refactor`, …).
4. Pick a scope (feature name, lib name, or folder).
5. Write a concise imperative subject ≤72 chars.
6. Add a body only if the "why" is non-obvious.
7. `git commit -m "<message>"`.

## Type selection

| Type       | When                                   |
| ---------- | -------------------------------------- |
| `feat`     | New feature or user-visible capability |
| `fix`      | Bug fix                                |
| `docs`     | Docs only                              |
| `refactor` | Internal change with no behavior delta |
| `test`     | Adding or changing tests               |
| `chore`    | Repo maintenance, tool config          |
| `deps`     | Dependency bump                        |
| `perf`     | Performance improvement                |
| `revert`   | Reverts a previous commit              |
| `ci`       | CI config change                       |
| `build`    | Build system change                    |

## Scope selection

- Feature change → feature name (`feat(user): ...`)
- Shared layer → layer name (`fix(lib): ...`, `chore(eslint): ...`)
- Repo-wide → no scope or `repo`

## Examples

```
feat(user): add profile edit form
fix(router): handle undefined search params
refactor(api): extract axios interceptor
test(user-card): cover click handler
chore(deps): bump react to 19.2.4
docs(readme): clarify env setup
```

## Rules

- Imperative mood ("add", not "added").
- No period at end of subject.
- No emojis unless repo convention says so.
- Body wraps at 72 chars.
- If commit fixes an issue: `Closes #123` in footer.

## What to avoid

| Don't                          | Do                             |
| ------------------------------ | ------------------------------ |
| `feat: stuff`                  | `feat(user): add profile page` |
| Long subject lines             | Break into subject + body      |
| Mixing unrelated changes       | Split into multiple commits    |
| Skipping hooks (`--no-verify`) | Fix the failure instead        |

## Verification

- `commitlint` runs automatically via Husky on `commit-msg`.
- Pre-commit runs `lint-staged` (ESLint on ts/tsx, Prettier on json/md/yml).
