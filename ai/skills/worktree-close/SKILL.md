---
name: worktree-close
description: Close a git worktree spawned by worktree-task and check out its branch in the main repo. Verifies clean tree + pushed commits before removal.
disable-model-invocation: true
metadata:
  version: "1.0"
  related-skills:
    - worktree-task
    - git-branch
tier: 1
triggers:
  - close worktree
  - remove worktree
  - cleanup worktree
  - worktree close
  - finish worktree
  - checkout worktree branch
summary: |
  Counterpart to worktree-task. Resolves a worktree (from cwd or arg), checks
  it's clean and pushed, runs `git worktree remove`, then checks out the same
  branch in the main repo so the user can keep iterating on it without the
  worktree. Refuses to discard uncommitted/unpushed work without explicit
  `--force` from the user.
---

# Worktree Close

## Invocation

```
/worktree-close [<branch-or-path>] [--force]
```

| Arg                | Description                                                                                                      | Example                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `<branch-or-path>` | Optional. Branch name (`feature/...`) OR worktree path. Omit when invoked from inside the worktree — uses `pwd`. | `feature/hide-sort-columns-controls` |
| `--force`          | Allow removal with uncommitted/unpushed work. Requires explicit user approval.                                   | `--force`                            |

### Examples

```
/worktree-close                                           # infer from cwd
/worktree-close feature/hide-sort-columns-controls
/worktree-close ../PSL_frontend-worktrees/feature-hide-sort-columns-controls
```

## Critical rules

- **Never `--force` without explicit user approval.** Dirty/unpushed worktree → STOP, report state, ask. Don't silently discard work.
- Run `git worktree remove` from the main repo, not from inside the worktree (it will be gone after removal).
- Use absolute paths via `git -C <path>` — Bash cwd resets between calls.
- Don't delete the branch. Branch stays so the user can checkout + iterate. Branch deletion is a separate, explicit step.
- If the main repo has uncommitted changes blocking checkout, STOP and report — never stash/discard the user's main-repo work.

## Workflow

### 1. Resolve target worktree

Order of resolution:

1. If `<branch-or-path>` provided → match against `git -C <main-repo> worktree list --porcelain` (matches either `worktree <path>` or `branch refs/heads/<name>`).
2. Else → use `pwd`; verify it sits under `../PSL_frontend-worktrees/`.
3. Else → abort. Ask the user.

```bash
MAIN=<absolute-path-to-main-repo>      # e.g. the PSL_frontend checkout
git -C "$MAIN" worktree list --porcelain
```

Capture: `WT_PATH` (absolute path), `WT_BRANCH` (branch checked out in the worktree).

### 2. Verify worktree clean

```bash
git -C "$WT_PATH" status --porcelain        # must be empty
```

Non-empty → STOP. Print the dirty file list. Ask the user: commit / discard / `--force`.

### 3. Verify commits pushed

```bash
git -C "$WT_PATH" fetch origin "$WT_BRANCH"
AHEAD=$(git -C "$WT_PATH" rev-list --count "origin/$WT_BRANCH..HEAD")
[ "$AHEAD" -eq 0 ] || echo "$AHEAD unpushed commit(s)"
```

`AHEAD > 0` → STOP. Ask the user: push / `--force`.

If upstream doesn't exist (branch never pushed) → treat as unpushed. STOP unless `--force`.

### 4. Verify main repo can checkout the branch

```bash
git -C "$MAIN" status --porcelain    # uncommitted in main → STOP
git -C "$MAIN" branch --show-current  # informational
```

Main-repo working tree dirty → STOP. Print files. Ask the user — never auto-stash.

### 5. Remove the worktree

```bash
git -C "$MAIN" worktree remove "$WT_PATH"
# --force only if user explicitly approved AND --force was passed
```

`git worktree remove` refuses dirty trees by default — that's a feature, not a bug. Don't override blindly.

### 6. Checkout branch in main repo

```bash
git -C "$MAIN" checkout "$WT_BRANCH"
git -C "$MAIN" status
```

Report current branch + clean status to the user.

### 7. (Optional, never auto) Suggest branch cleanup

After the PR is merged, the user can delete the branch:

```bash
git -C "$MAIN" branch -d "$WT_BRANCH"
```

Never auto-run. The user decides.

## Anti-patterns

| Bad                                                  | Fix                                                        |
| ---------------------------------------------------- | ---------------------------------------------------------- |
| `git worktree remove --force` to silence dirty error | STOP, show the user the dirty files, ask                   |
| `cd <worktree> && git worktree remove .`             | Removal must run from the main repo                        |
| `git stash` in main repo to make checkout possible   | Never auto-stash user work — STOP and ask                  |
| `git branch -D` the branch after removal             | Leave branch alone; deletion is user-initiated, post-merge |
| Relative paths in Bash (cwd resets)                  | Use `git -C <abs-path>` everywhere                         |
| Skip the unpushed-commits check                      | Always `git rev-list --count origin/<branch>..HEAD`        |

## Verification

- `git -C $MAIN worktree list` no longer shows the closed worktree.
- `git -C $MAIN branch --show-current` returns `$WT_BRANCH`.
- Branch still exists locally (`git -C $MAIN branch | grep $WT_BRANCH`).
- Main-repo working tree state matches what the user had before (no surprise stashes).
