# Scenario: batch-fix-pattern

> Apply a pattern-based fix across many files (codemod-style).

## Metadata

```yaml
id: batch-fix-pattern
triggers: ["fix pattern", "replace across", "batch fix", "fix all"]
budget:
  max_skills: 1
  max_subagents: 0
  estimated_tokens: 2500
verified: false
```

## DAG

```
session-log ──→ discover ──→ extract ──→ gate ──→ partition ──→ fix ──→ merge ──→ verify ──→ session-log
```

## Steps

```yaml
nodes:
  - id: log_start
    node: session-log
    inputs:
      request_num: 1
      summary: "Scenario batch-fix-pattern: {pattern_description}"
      mode: edit
      scenario_id: batch-fix-pattern
    outputs: [session_name]

  - id: find_matches
    node: discover
    inputs:
      query: "{grep_pattern}"
    outputs: [matching_files]

  - id: analyze_matches
    node: extract
    inputs:
      content: $matching_files
      extraction_type: imports
    outputs: [match_metadata]

  - id: approve_plan
    node: gate
    inputs:
      message: "Found {count} matches in {file_count} files. Apply fix: '{fix_description}'?"
      options: ["Approve", "Show files", "Cancel"]
      show_diff: true
    outputs: [user_decision]

  - id: split_work
    node: partition
    condition: "$user_decision.approved"
    inputs:
      items: $match_metadata
      strategy: by-file
      max_groups: 10
    outputs: [fix_groups]

  - id: apply_fixes
    node: fix
    inputs:
      errors: $fix_groups
      strategy: autofix
    outputs: [fix_result]

  - id: combine
    node: merge
    inputs:
      branches: $fix_result
      strategy: concat
    outputs: [all_fixed]

  - id: validate
    node: verify
    inputs:
      check_type: full
    outputs: [verification]

  - id: log_end
    node: session-log
    inputs:
      session_name: $session_name
      request_num: 2
      summary: "Scenario batch-fix-pattern completed: {verification.status}"
      mode: edit
      files_modified: $all_fixed
      scenario_id: batch-fix-pattern
    outputs: []
```

## Example use cases

- Replace `import { X } from '../..'` with `@/` alias across src/
- Replace `console.log` with `console.warn` (or remove)
- Rename a hook across all call sites
- Migrate `<img>` to a shared `<Image>` component

## Token Estimate

| Node        | Cost | Instances | Total    |
| ----------- | ---- | --------- | -------- |
| session-log | 10   | 2         | 20       |
| discover    | 80   | 1         | 80       |
| extract     | 60   | 1         | 60       |
| gate        | 20   | 1         | 20       |
| partition   | 40   | 1         | 40       |
| fix         | 100  | 1         | 100      |
| merge       | 40   | 1         | 40       |
| verify      | 80   | 1         | 80       |
| **Total**   |      |           | **~440** |
