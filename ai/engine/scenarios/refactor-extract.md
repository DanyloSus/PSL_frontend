# Scenario: refactor-extract

> Split oversized files into smaller components/hooks while preserving behavior.

## Metadata

```yaml
id: refactor-extract
triggers: ["refactor", "extract component", "extract hook", "split file", "SRP"]
budget:
  max_skills: 2
  max_subagents: 0
  estimated_tokens: 4000
verified: false
```

## DAG

```
session-log ──→ discover ──→ extract ──→ skill-load ──→ gate ──→ transform ──→ verify ──→ session-log
```

## Steps

```yaml
nodes:
  - id: log_start
    node: session-log
    inputs:
      request_num: 1
      summary: "Scenario refactor-extract: {target_file}"
      mode: refactor
      scenario_id: refactor-extract
    outputs: [session_name]

  - id: read_target
    node: discover
    inputs:
      file_pattern: "{target_file}"
    outputs: [target_content]

  - id: analyze_structure
    node: extract
    inputs:
      content: $target_content
      extraction_type: components
    outputs: [structure]

  - id: load_presentation
    node: skill-load
    inputs:
      skill_id: react-presentation-layer
    outputs: [presentation_guide]

  - id: approve_plan
    node: gate
    inputs:
      message: "Proposed split: extract {N} sub-components and {M} hooks from {target_file}. Proceed?"
      options: ["Approve", "Modify", "Cancel"]
      show_diff: true
    outputs: [user_decision]

  - id: apply_refactor
    node: transform
    condition: "$user_decision.approved"
    inputs:
      input: [$target_content, $structure, $presentation_guide]
      operation: to-code
      params:
        template: "Split {target_file} per presentation-layer guide — keep behavior identical"
    outputs: [refactored_files]

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
      summary: "Scenario refactor-extract completed: {verification.status}"
      mode: refactor
      files_modified: $refactored_files
      scenario_id: refactor-extract
    outputs: []
```

## Token Estimate

| Node        | Cost | Instances | Total    |
| ----------- | ---- | --------- | -------- |
| session-log | 10   | 2         | 20       |
| discover    | 80   | 1         | 80       |
| extract     | 60   | 1         | 60       |
| skill-load  | 100  | 1         | 100      |
| gate        | 20   | 1         | 20       |
| transform   | 60   | 1         | 60       |
| verify      | 80   | 1         | 80       |
| **Total**   |      |           | **~420** |
