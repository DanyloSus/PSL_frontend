---
name: git-commit-push
description: Stage, commit, and push. Splits large unrelated changes into multiple logically-grouped commits, then pushes once.
disable-model-invocation: true
metadata:
  version: "1.0"
  related-skills:
    - git-commit
    - git-branch
tier: 1
triggers:
  - commit and push
  - commit push
  - push commit
  - split commits
  - logical commits
  - group commits
summary: |
  Stage + commit + push in one flow. When the working tree contains many
  changes that span unrelated concerns, group them into multiple Conventional
  Commits (one per logical concern) before a single push. Follows git-commit
  rules for message format. Never bypasses hooks. Never force-pushes a shared
  branch.
---

# Git Commit + Push

## Overview

| Aspect       | Details                                                             |
| ------------ | ------------------------------------------------------------------- |
| Goal         | Stage, commit (one or many), and push the current branch            |
| When         | End of a working session, or when changes are ready to share        |
| Verification | `git log origin/<branch>..HEAD` empty after run; pre-commit hook OK |

## Critical rules

- **Never `--no-verify`.** If a hook fails (lint-staged ESLint / Prettier, commitlint), fix the root cause and re-stage.
- **Never `--force` on a shared branch.** Use `--force-with-lease` only when
  rewriting your own unmerged commits and the user has confirmed.
- **One logical concern per commit.** If the working tree mixes a feature
  change with an unrelated lint fix, split them.
- **Conventional Commits format** — see `git-commit` skill for type/scope/subject rules.
- **No self-attribution.** Never add `Co-Authored-By`, "Generated with Claude
  Code", or any AI footer.

## Workflow

### Single-concern path (default)

1. `git status` and `git diff` to see all changes.
2. If everything belongs to one concern → load `git-commit` skill → stage all
   relevant files → commit.
3. `git push` (set upstream with `-u origin <branch>` on first push).

### Multi-concern path (split commits)

Use when `git diff` shows changes across unrelated areas (e.g. feature work +
config tweak + dependency bump + doc edit).

1. **Inventory.** `git status` + `git diff --stat`. List the distinct concerns.
2. **Plan.** State the planned commit sequence to the user. Each commit gets:
   - A type+scope (`feat(dashboard)`, `chore(deps)`, `docs(readme)`, ...).
   - The exact file set it will include.
3. **Stage by concern.** For each planned commit, in order:
   - `git add <files-for-this-concern>` (specific files only — never `git add -A`).
   - `git diff --staged` to confirm only that concern is staged.
   - Load `git-commit` skill → write the message → `git commit`.
4. **Verify.** `git status` should be clean (or only have intentionally
   deferred changes). `git log --oneline origin/<branch>..HEAD` shows the new
   commits.
5. **Push once.** `git push` (or `git push -u origin <branch>`).

### Splitting heuristics

Group changes that share **one** of these:

| Axis    | Example                                                           |
| ------- | ----------------------------------------------------------------- |
| Concern | All edits implement the same feature/fix                          |
| Layer   | All edits are in `src/ui/`, or all in one feature                 |
| Type    | All edits are docs, or all are dependency bumps, or all are tests |
| Scope   | All edits touch the same Conventional Commit scope                |

Split when changes touch different concerns. Don't split a single concern across
files just to make commits smaller.

### Refusal cases

- Changes are entangled (a single file mixes two concerns) → ask the user
  whether to split via `git add -p` or keep as one commit.
- Pre-commit hook fails → fix the underlying issue, never `--no-verify`.
- Push is rejected (non-fast-forward) → `git pull --rebase`, resolve, re-push.
  Never `--force` without explicit user approval.

## Examples

### Single-concern

```
$ git status
M src/features/dashboard/components/dashboard-shell.tsx
M src/features/dashboard/hooks/use-dashboard.ts

→ git add src/features/dashboard/components/dashboard-shell.tsx \
          src/features/dashboard/hooks/use-dashboard.ts
→ git commit -m "refactor(dashboard): extract shell layout hook"
→ git push
```

### Multi-concern (split)

```
$ git status
M package.json
M package-lock.json
M src/features/projects/components/projects-list.tsx
M README.md

→ Plan:
   1. chore(deps): bump @tanstack/react-query        → package.json, package-lock.json
   2. fix(projects): handle empty-state padding      → projects-list.tsx
   3. docs(readme): clarify env setup                → README.md

→ git add package.json package-lock.json
→ git commit -m "chore(deps): bump @tanstack/react-query"

→ git add src/features/projects/components/projects-list.tsx
→ git commit -m "fix(projects): handle empty-state padding"

→ git add README.md
→ git commit -m "docs(readme): clarify env setup"

→ git push
```

## Common mistakes

| Mistake                                    | Fix                                                |
| ------------------------------------------ | -------------------------------------------------- |
| `git add -A` then one commit               | Stage by concern; one commit per concern           |
| `git commit --no-verify` after hook fail   | Fix the lint/format/test failure, then re-commit   |
| `git push --force` on shared branch        | Use `--force-with-lease` and confirm with the user |
| Mixing dep bump with feature in one commit | Split: `chore(deps)` separate from `feat(<scope>)` |
| Committing AI attribution                  | Strip all `Co-Authored-By`/footer lines            |

## Checklist

- [ ] Working tree inventoried (`git status` + `git diff`)
- [ ] Each concern committed separately when changes are unrelated
- [ ] Every message follows Conventional Commits (`git-commit` skill)
- [ ] No `--no-verify`, no `--force` without explicit approval
- [ ] No AI attribution in any commit
- [ ] `git push` succeeds; `origin/<branch>..HEAD` is empty afterwards
