---
name: git-commit-squash
description: Commit current changes, then squash the branch into one. Orchestrates git-commit + git-squash.
metadata:
  version: "1.0"
  related-skills:
    - git-commit
    - git-squash
tier: 1
triggers:
  - commit and squash
  - full commit
  - commit then squash
summary: |
  Sequential orchestration: first load git-commit to stage+commit current
  changes, then load git-squash to compress the branch. Ask user confirmation
  at the squash step.
---

# Git Commit + Squash

## Workflow

1. Load `git-commit` skill → stage and commit current changes.
2. Load `git-squash` skill → list branch commits, generate combined message, confirm with user, reset + commit + force-push-with-lease.

## When to use

- End of a feature branch when you want a single commit before merging.

## Safety

All safety rules from `git-squash` apply:

- Never on shared branches.
- `--force-with-lease`, never `--force`.
- Always confirm before `reset --soft`.
