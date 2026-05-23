---
name: git-squash
description: Squash all branch commits into one vs main. Preserves ticket refs. Asks user confirmation.
metadata:
  version: "1.0"
tier: 1
triggers:
  - squash
  - git squash
  - compress commits
summary: |
  Squash all commits on the current branch into one commit vs main. Lists the
  commits, generates a combined conventional commit message, uses
  `git reset --soft` + `git commit`. Always ask user confirmation before reset.
---

# Git Squash

## When to use

- Before merging a feature branch to main (keep history clean).
- When a branch has many "wip" / "fix typo" commits.

## Workflow

1. Ensure branch is clean: `git status`.
2. Fetch and check divergence:
   ```bash
   git fetch origin
   git log --oneline main..HEAD
   ```
3. List commits that will be squashed. Show the user.
4. Generate a combined commit message (one Conventional Commit that covers the work).
5. **Ask user confirmation.**
6. Soft-reset to main's HEAD:
   ```bash
   git reset --soft $(git merge-base HEAD main)
   ```
7. Commit:
   ```bash
   git commit -m "<combined message>"
   ```
8. Force-push with lease:
   ```bash
   git push --force-with-lease
   ```

## Safety rules

- NEVER squash on `main` or a shared branch without explicit approval.
- ALWAYS use `--force-with-lease`, not `--force`.
- If unsure, run `git branch backup/<name>` first.
- If there are merge commits from main, rebase first.

## Combined message pattern

```
feat(user): add profile page and edit form

Squashes:
- feat(user): add profile route
- feat(user): add edit form
- test(user): cover edit form
- fix(user): handle empty name

Closes #123
```

## What to avoid

| Don't                                | Do                            |
| ------------------------------------ | ----------------------------- |
| Squash without listing commits first | Show the user first           |
| `git push --force`                   | `git push --force-with-lease` |
| Squash on main                       | Only on feature branches      |
| Skip confirmation                    | Always confirm before reset   |
