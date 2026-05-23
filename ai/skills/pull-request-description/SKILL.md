---
name: pull-request-description
description: Generate a PR description from branch diff. Title under 70 chars, sections for summary and test plan.
metadata:
  version: "1.0"
tier: 2
triggers:
  - PR
  - pull request
  - branch summary
  - PR description
summary: |
  Read `git log main..HEAD` and `git diff main...HEAD`. Generate a title
  (≤70 chars, imperative) and body (Summary + Test plan sections). Output
  as a HEREDOC-friendly string for `gh pr create`.
---

# Pull Request Description

## Workflow

1. Check branch state:
   ```bash
   git status
   git log main..HEAD --oneline
   git diff main...HEAD --stat
   ```
2. Analyze ALL commits on the branch, not just the latest.
3. Draft the title: ≤70 chars, imperative ("add", not "added"), no prefix emoji.
4. Draft the body with sections below.
5. Create the PR:
   ```bash
   gh pr create --title "..." --body "$(cat <<'EOF'
   ...
   EOF
   )"
   ```

## Template

```markdown
## Summary

- <1-3 bullets describing what changed and why>

## Test plan

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `npm test -- --run` passes
- [ ] <scenario 1 verified manually>
- [ ] <scenario 2 verified manually>

## Screenshots

<optional: before/after for UI changes>
```

## Title rules

| Good                                       | Bad                                                              |
| ------------------------------------------ | ---------------------------------------------------------------- |
| `feat(user): add profile page`             | `Added profile page with edit form, avatar upload, and settings` |
| `fix(router): handle missing params`       | `fix`                                                            |
| `refactor(api): extract axios interceptor` | `updates`                                                        |

## Body rules

- Summary bullets describe the **why**, not just the **what**.
- Test plan is a real checklist of how you verified it — not a template.
- Screenshots required for any visual change.
- Link related issues: `Closes #123`.

## Checklist

- [ ] Title ≤70 chars
- [ ] Summary has 1-3 bullets
- [ ] Test plan is specific (not boilerplate)
- [ ] Screenshots if visual
- [ ] Issue links in footer
