---
name: git-branch
description: Branch naming + branch-per-feature + stacking PR conventions. Ticket-aware (optional).
metadata:
  version: "1.0"
tier: 1
triggers:
  - branch
  - new branch
  - create branch
  - stack pr
  - stacking
  - checkout -b
summary: |
  Branch format: `(feature|bugfix|refactor)/<ticket>/<short-desc>`. Drop the
  `<ticket>` segment when there's no ticket. Prefer one branch per feature; stack
  dependent PRs by branching from the parent feature branch (not develop).
---

# Git Branch

## Naming format

```
<type>/<ticket>/<short-description>
<type>/<short-description>             # when no ticket
```

- **type**: `feature` | `bugfix` | `refactor`
- **ticket**: tracker id (e.g. `PSL-123`), lowercase. If no ticket visible, drop the whole `<ticket>/` segment.
- **short-description**: kebab-case, ≤5 words, imperative-ish noun phrase.

### Examples

```
feature/psl-123/dashboard-shell
bugfix/psl-204/fix-token-refresh-loop
refactor/psl-88/extract-axios-interceptor
feature/add-darkmode-toggle              # no ticket
bugfix/handle-null-tenant                # no ticket
```

### Anti-patterns

| Bad                                                        | Why                                                   |
| ---------------------------------------------------------- | ----------------------------------------------------- |
| `psl-123-dashboard-shell`                                  | missing `<type>/` prefix                              |
| `feature/dashboard-shell-landing-page-and-sidebar-and-nav` | too long                                              |
| `feat/psl-123/...`                                         | use `feature`, not `feat` (commit type ≠ branch type) |
| `Feature/PSL-123/Dashboard_Shell`                          | not lowercase / kebab-case                            |

## Branch-per-feature

One branch = one feature/fix/refactor. Don't pile unrelated work onto a single branch — keep PRs reviewable.

If scope grows mid-branch:

1. Commit current work.
2. Cut a follow-up branch from current one (see Stacking).
3. Open the next PR on top.

## Stacking PRs

When feature B depends on unmerged feature A:

```bash
git checkout feature/parent
git pull
git checkout -b feature/child                 # base = parent, NOT develop
# work…
git push -u origin feature/child
gh pr create --base feature/parent ...
```

Rules:

- Child PR's **base** is the parent branch, not `develop`.
- After parent merges, rebase the child onto `develop` (or use `gh pr update-branch`) and switch its base to `develop`.
- Order merges parent→child. Never squash a parent that has open children without rebasing them first.

## Workflow

```bash
# Start from a fresh develop
git checkout develop && git pull

# Cut new branch
git checkout -b feature/dashboard-shell

# When stacking
git checkout feature/dashboard-shell
git checkout -b feature/dashboard-widgets
```

## Verification

- Branch name matches regex: `^(feature|bugfix|refactor)/([a-z]+-[0-9]+/)?[a-z0-9][a-z0-9-]*$`
- For stacked PRs, `gh pr view` shows correct `baseRefName`.
