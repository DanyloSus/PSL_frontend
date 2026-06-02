---
name: worktree-task
description: Spin up a git worktree from a given base branch, implement a ticket or described task, commit logically, push, and open a PR back into the base branch. Composes git-branch + git-commit-push + pull-request-description.
disable-model-invocation: true
metadata:
  version: "1.0"
  related-skills:
    - git-branch
    - git-commit-push
    - pull-request-description
tier: 2
triggers:
  - worktree task
  - new worktree
  - work in worktree
  - create worktree and pr
  - worktree from branch
summary: |
  End-to-end isolated-worktree workflow. Forks a worktree off a chosen base
  branch, implements work (ticket URL or freeform description), runs lint +
  tests, splits into logical Conventional Commits, pushes, and opens a draft PR
  back into the base branch with the project's default reviewers/assignee.
  Branch naming follows (feature|bugfix|refactor)/<ticket>/<kebab-desc> when a
  ticket is present, dropping the ticket segment otherwise.
---

# Worktree Task

## Invocation

```
/worktree-task <base-branch> <ticket-url-or-description>
```

| Arg                           | Description                             | Example                                             |
| ----------------------------- | --------------------------------------- | --------------------------------------------------- |
| `<base-branch>`               | Branch to fork from AND PR target       | `main`, `develop`, `feature/sidebar-admin-gating`   |
| `<ticket-url-or-description>` | Tracker issue URL or freeform task text | a ticket URL, or `add unit tests for hasRoleAccess` |

### Examples

```
/worktree-task develop add empty-state to projects list
/worktree-task feature/sidebar-admin-gating add unit tests for hasRoleAccess
/worktree-task develop fix race condition in useDashboard
```

## Critical rules

- Worktrees live **outside** main repo dir: `../PSL_frontend-worktrees/<flattened-branch-name>`. Never nest inside primary working tree.
- Never `--no-verify`. Fix root cause, re-stage.
- Never `--force` without explicit user approval.
- No self-attribution — no `Co-Authored-By`, no "Generated with Claude Code" footer.
- No `npm run build` after changes — the user runs builds.
- Branch naming MUST match `(feature|bugfix|refactor)/<ticket>/<kebab-desc>` when a ticket is present; drop the `<ticket>/` segment when none. See [`git-branch`](../git-branch/SKILL.md).
- PR base = branch passed by user. Supports stacking.
- Always pass the project's default reviewers (ask once if unknown, then reuse). Assignee = the project default.
- PR opened as **draft** — always pass `--draft`. The user flips to "Ready for review" after a sanity check.
- PR body MUST follow `.github/pull_request_template.md` exactly — sections `What was done` / `Related issue` / `How to test` / `Additional notes`.

## Workflow

### 1. Parse args

Extract `<base-branch>` + `<ticket-url-or-description>`. If the arg is a tracker URL, fetch the issue (via the available MCP / `gh`) → use its title for the kebab-desc, description for context, labels for the branch type. No URL → use the description verbatim; ticket = none.

### 2. Derive branch name

Convention: `(feature|bugfix|refactor)/<ticket>/<kebab-desc>` (see [`git-branch`](../git-branch/SKILL.md)).

| Condition                                                           | Branch name                      |
| ------------------------------------------------------------------- | -------------------------------- |
| Ticket present, label = `bug` or description contains fix/bug/patch | `bugfix/<ticket>/<kebab-desc>`   |
| Ticket present, description contains refactor/cleanup/reorganize    | `refactor/<ticket>/<kebab-desc>` |
| Ticket present, otherwise                                           | `feature/<ticket>/<kebab-desc>`  |
| No ticket, fix/bug verb                                             | `bugfix/<kebab-desc>`            |
| No ticket, refactor verb                                            | `refactor/<kebab-desc>`          |
| No ticket, otherwise                                                | `feature/<kebab-desc>`           |

`<kebab-desc>` = lowercase, hyphenated, ≤5 words.

### 3. Create worktree

Path: `../PSL_frontend-worktrees/<branch-flattened>` (`/` → `-`).

```bash
git fetch origin <base-branch>
git worktree add -b <new-branch> ../PSL_frontend-worktrees/<flattened> origin/<base-branch>

# node_modules not shared between worktrees
ls ../PSL_frontend-worktrees/<flattened>/node_modules || \
  npm install --prefix ../PSL_frontend-worktrees/<flattened>
```

Use absolute paths everywhere — each Bash call resets cwd. Use `git -C <path>` and `npm --prefix <path>` instead of `cd` chaining.

### 4. Implement

Read relevant files under `<worktree-root>/src/**` first. All project rules apply: no `any`, no `console.log`, kebab-case files, `@/` alias, Tailwind + `cn()` + CVA (theme tokens via CSS vars — no hardcoded hex), ≤150-line components, Feature-Sliced Design boundaries (no cross-feature imports), smart/dumb split + controller hook, HTTP-verb-prefixed API methods. See `.claude/rules/` for the full rule set.

Load relevant skills for non-trivial work: `react-presentation-layer`, `react-shadcn-tailwind`, `react-feature-sliced-design`, `react-zustand-state`, `react-hook-form-zod`, `react-axios-api`, `react-tanstack-query`, `react-tanstack-router`, `react-testing`.

### 5. Verify — lint changed files + run co-located tests

```bash
WT=../PSL_frontend-worktrees/<flattened>
CHANGED=$(git -C "$WT" diff --name-only --diff-filter=ACMR origin/<base-branch>...HEAD -- '*.ts' '*.tsx'; \
          git -C "$WT" diff --name-only --diff-filter=ACMR -- '*.ts' '*.tsx')
CHANGED=$(echo "$CHANGED" | sort -u | grep -v '^$')

npx eslint --fix $CHANGED

# Tests co-located beside changed files only
npx vitest run $(echo "$CHANGED" | sed 's/\.tsx\?$/.test.tsx/' | xargs -I{} sh -c 'test -f "{}" && echo "{}"')
```

Fix anything `--fix` leaves behind manually. Skip `npm run build` — the user runs it.

### 6. Commit logically

Use the [`git-commit-push`](../git-commit-push/SKILL.md) skill. One concern per commit, Conventional Commits, ticket in subject when present:

```
feat(sidebar): gate path builder behind admin role (PSL-974)
```

Stage specific files (`git add <paths>`), never `git add -A`. No AI attribution, no `Co-Authored-By`.

### 7. Push

```bash
git -C ../PSL_frontend-worktrees/<flattened> push -u origin <new-branch>
git -C ../PSL_frontend-worktrees/<flattened> log origin/<new-branch>..HEAD  # must be empty
```

### 8. Open PR

Body MUST mirror `.github/pull_request_template.md` exactly. All four sections, in order, even if empty (use `-` placeholder). Pass the project's default reviewers and assignee.

```bash
gh -C ../PSL_frontend-worktrees/<flattened> pr create \
  --draft \
  --base <base-branch> \
  --title "<title under 70 chars>" \
  --assignee <default-assignee> \
  --reviewer <default-reviewers> \
  --body "$(cat <<'EOF'
## What was done

- <bullet 1>
- <bullet 2>

## Related issue

Closes #<num>

## How to test

- <manual check 1>
- <automated test coverage>

## Additional notes

-
EOF
)"
```

Template fidelity:

- All four headers present, in order, even if empty.
- `Related issue`: `Closes #<num>` for a GitHub issue. Tracker-only ticket → reference it here; it also belongs in the title + commits.
- `Additional notes`: screenshots, follow-ups, risks, `-` if none.

Return the PR URL. Note the PR is a draft — the user marks it ready for review when satisfied.

## Anti-patterns

| Bad                                                  | Fix                                                                                    |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Worktree nested inside main repo (`src/worktrees/`)  | Use `../PSL_frontend-worktrees/` (sibling dir)                                         |
| `git add -A` in worktree                             | Stage specific files per concern                                                       |
| `npm run build` after changes                        | Skip — the user runs builds                                                            |
| `npm run lint` repo-wide for a small change          | Lint only `$CHANGED` files                                                             |
| Missing `-u` on first push                           | `git push -u origin <branch>`                                                          |
| PR base defaults to `main` when user said `develop`  | Pass `--base <base-branch>` explicitly                                                 |
| Missing `--reviewer` flag                            | Pass the project's default reviewers                                                   |
| Relative paths in Bash (cwd resets)                  | Absolute paths via `git -C` / `npm --prefix`                                           |
| Hardcoded hex / inline style in new component        | Theme tokens + `cn()` + Tailwind utilities                                             |
| PR body uses `Summary` / `Test plan` / `Screenshots` | Match template: `What was done` / `Related issue` / `How to test` / `Additional notes` |
| PR opened ready-for-review (non-draft)               | Always pass `--draft`; the user marks ready themselves                                 |

## Cleanup (optional, user-initiated)

After PR merge — or use the [`worktree-close`](../worktree-close/SKILL.md) skill:

```bash
git worktree remove ../PSL_frontend-worktrees/<flattened>
git branch -d <new-branch>
```

Never auto-run — the user decides.

## Verification

- Branch name matches `^(feature|bugfix|refactor)/([a-z]+-[0-9]+/)?[a-z0-9][a-z0-9-]*$`.
- `git log origin/<new-branch>..HEAD` empty after push.
- `gh pr view --json baseRefName,body,isDraft` shows correct base, template sections (`What was done`, `Related issue`, `How to test`, `Additional notes`), and `isDraft: true`.
- PR URL returned to the user.
