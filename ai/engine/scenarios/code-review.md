# Scenario: code-review

> Comprehensive code review against project rules, using parallel reviewers + architecture auditor.

## Metadata

```yaml
id: code-review
triggers: ["review", "code review", "audit", "check quality"]
budget:
  max_skills: 3
  max_subagents: 3
  estimated_tokens: 10000
verified: false
```

## DAG

```
session-log ──→ discover ──→ extract ──→ partition ──→ spawn(code-reviewer ×N) ──→ merge ──→ transform ──→ session-log
                                              │
                                              └── spawn(architecture-auditor) ─────────┘
```

## Steps

```yaml
nodes:
  - id: log_start
    node: session-log
    inputs:
      request_num: 1
      summary: "Scenario code-review: reviewing changed files"
      mode: review
      scenario_id: code-review
    outputs: [session_name]

  - id: find_changed
    node: discover
    inputs:
      query: "git diff --name-only main"
    outputs: [changed_files]

  - id: analyze_changes
    node: extract
    inputs:
      content: $changed_files
      extraction_type: exports
    outputs: [change_metadata]

  - id: split_review
    node: partition
    inputs:
      items: $change_metadata
      strategy: by-layer
      max_groups: 3
    outputs: [review_groups]

  - id: review_code
    node: spawn
    parallel: true
    for_each: $review_groups
    inputs:
      agent: code-reviewer
      task: "Review these files against ai/rules/: {group}"
      context: ["{group}"]
      scope: read-only
    outputs: [code_reviews]

  - id: audit_architecture
    node: spawn
    inputs:
      agent: architecture-auditor
      task: "Audit FSD boundaries, import cycles, feature isolation"
      context: [$change_metadata]
      scope: read-only
    outputs: [arch_review]

  - id: combine_reviews
    node: merge
    inputs:
      branches: [$code_reviews, $arch_review]
      strategy: concat
    outputs: [full_review]

  - id: format_report
    node: transform
    inputs:
      input: $full_review
      operation: to-markdown
      params:
        template: "## Code Review Report\n{findings}\n### Summary\n{summary}"
    outputs: [review_report]

  - id: log_end
    node: session-log
    inputs:
      session_name: $session_name
      request_num: 2
      summary: "Scenario code-review completed"
      mode: review
      scenario_id: code-review
    outputs: []
```

## Token Estimate

| Node           | Cost       | Instances    | Total       |
| -------------- | ---------- | ------------ | ----------- |
| session-log    | 10         | 2            | 20          |
| discover       | 80         | 1            | 80          |
| extract        | 60         | 1            | 60          |
| partition      | 40         | 1            | 40          |
| spawn (review) | 120 + 3000 | 3 (parallel) | ~9,360      |
| spawn (audit)  | 120 + 3000 | 1            | ~3,120      |
| merge          | 40         | 1            | 40          |
| transform      | 60         | 1            | 60          |
| **Total**      |            |              | **~12,800** |
