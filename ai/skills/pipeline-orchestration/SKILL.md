---
name: pipeline-orchestration
description: DAG pipeline engine for complex multi-step tasks. 11 atomic nodes, composable scenarios, parallel sub-agents.
metadata:
  version: "1.0"
tier: 2
triggers:
  - pipeline
  - scenario
  - engine
  - DAG
  - batch
  - multi-step
  - parallel tasks
  - orchestrate
summary: |
  When a task touches >3 files or benefits from parallel sub-agents, use the
  engine. Check engine/registry.json for a matching scenario. If none matches,
  compose from nodes with an approval gate. Every scenario must start and end
  with session-log and have a gate before writes.
---

# Pipeline Orchestration

## When to use

- Task touches >3 files.
- Work can run in parallel across files/features.
- A recurring pattern exists (batch tests, batch fixes, code review).

## Decision tree

```
Task arrives
  │
  ├── Is it simple (1 file, 1 skill)? → Do it inline
  │
  ├── Is there a matching scenario in engine/registry.json?
  │   └── Yes → Run the scenario
  │
  └── No match → Compose from nodes with a gate for user approval
```

## Atomic nodes (11)

| Node          | Type    | Cost | Cacheable |
| ------------- | ------- | ---: | :-------: |
| `discover`    | input   |   80 |     ✓     |
| `extract`     | process |   60 |     ✓     |
| `skill-load`  | input   |  100 |     ✓     |
| `partition`   | process |   40 |           |
| `spawn`       | process |  120 |           |
| `verify`      | process |   80 |           |
| `fix`         | process |  100 |           |
| `gate`        | gate    |   20 |           |
| `merge`       | output  |   40 |           |
| `transform`   | process |   60 |     ✓     |
| `session-log` | process |   10 |           |

Read full specs in `ai/engine/nodes/`.

## Seed scenarios (5)

| Scenario              | Triggers                                   | Sub-agents |
| --------------------- | ------------------------------------------ | :--------: |
| `feature-scaffold`    | "new feature", "scaffold feature"          |     0      |
| `batch-test-creation` | "batch test", "tests for", "coverage for"  |  up to 4   |
| `code-review`         | "review", "audit"                          |     2      |
| `refactor-extract`    | "refactor", "extract", "SRP"               |     0      |
| `batch-fix-pattern`   | "fix pattern", "replace across", "fix all" |     0      |

Read full scenarios in `ai/engine/scenarios/`.

## Composition rules

Any new scenario MUST:

1. `session-log` as the **first and last** node.
2. A `gate` node before any write/spawn operations.
3. Reuse existing nodes — no inline operations.
4. Budget declared in metadata.
5. Start with `verified: false` until it runs successfully.

## Token math

A scenario's token cost ≈ Σ(node.cost × instances) + spawn overhead (~3k per sub-agent).

```
batch-test-creation (4 parallel sub-agents):
  discover(80) + extract(60) + skill-load(100) + partition(40)
  + spawn(120 × 4) + merge(40) + verify(80) + session-log(10 × 2)
  ≈ 900 + 4×3000 (sub-agents)
  ≈ 13k tokens
vs. ad-hoc: 25k-40k tokens (no sharing of loaded skill, no partitioning)
```

## Checklist

- [ ] Checked `registry.json` for a matching scenario
- [ ] If composing new: user approved via gate
- [ ] `session-log` at start and end
- [ ] `verified: false` in registry until first success
