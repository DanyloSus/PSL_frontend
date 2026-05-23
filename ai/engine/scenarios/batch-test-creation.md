# Scenario: batch-test-creation

> Create Vitest + RTL tests for multiple files/features in parallel.

## Metadata

```yaml
id: batch-test-creation
triggers:
  [
    "batch test",
    "test multiple",
    "coverage for",
    "write tests for",
    "tests for"
  ]
budget:
  max_skills: 2
  max_subagents: 4
  estimated_tokens: 13000
verified: false
```

## DAG

```
session-log ──→ discover ──→ extract ──→ skill-load ──→ partition ──→ spawn(×N) ──→ merge ──→ verify ──→ session-log
                                                                                        │
                                                                                  [if fail]
                                                                                        ↓
                                                                                      fix
```

## Steps

```yaml
nodes:
  - id: log_start
    node: session-log
    inputs:
      request_num: 1
      summary: "Scenario batch-test-creation: {user_provided_pattern}"
      mode: test
      scenario_id: batch-test-creation
    outputs: [session_name]

  - id: find_targets
    node: discover
    inputs:
      file_pattern: "{user_provided_pattern}"
    outputs: [target_files]

  - id: analyze_targets
    node: extract
    inputs:
      content: $target_files
      extraction_type: components
    outputs: [target_metadata]

  - id: load_testing_skill
    node: skill-load
    inputs:
      skill_id: react-testing
    outputs: [testing_guide]

  - id: split_work
    node: partition
    inputs:
      items: $target_metadata
      strategy: by-feature
      max_groups: 4
    outputs: [test_groups]

  - id: write_tests
    node: spawn
    parallel: true
    for_each: $test_groups
    inputs:
      agent: test-writer
      task: "Write Vitest + RTL tests for: {group}"
      context: [$testing_guide, "{group}"]
      scope: read-src-write-test
    outputs: [test_results]

  - id: combine
    node: merge
    inputs:
      branches: $test_results
      strategy: concat
    outputs: [all_results]

  - id: check
    node: verify
    inputs:
      check_type: tests
      targets: "{test_output_paths}"
    outputs: [verification]

  - id: fix_if_needed
    node: fix
    condition: "!$verification.passed"
    inputs:
      errors: $verification.errors
      context: [$testing_guide]
      strategy: guided
    outputs: [fix_result]

  - id: log_end
    node: session-log
    inputs:
      session_name: $session_name
      request_num: 2
      summary: "Scenario batch-test-creation completed: {verification.status}"
      mode: test
      files_modified: $all_results
      scenario_id: batch-test-creation
    outputs: []
```

## Token Estimate

| Node        | Cost       | Instances    | Total       |
| ----------- | ---------- | ------------ | ----------- |
| session-log | 10         | 2            | 20          |
| discover    | 80         | 1            | 80          |
| extract     | 60         | 1            | 60          |
| skill-load  | 100        | 1            | 100         |
| partition   | 40         | 1            | 40          |
| spawn       | 120 + 3000 | 4 (parallel) | ~12,500     |
| merge       | 40         | 1            | 40          |
| verify      | 80         | 1            | 80          |
| fix         | 100        | 0-1          | 0-100       |
| **Total**   |            |              | **~13,000** |

vs. ad-hoc: ~25-40k tokens (no sharing of loaded skill, no partitioning).
