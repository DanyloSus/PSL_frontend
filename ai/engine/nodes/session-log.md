# Node: session-log

> Record scenario execution to the session tracker. MANDATORY first and last node in every scenario.

## Spec

```yaml
id: session-log
type: process
token_cost: 10
cacheable: false
```

## Purpose

Ensures every scenario execution is tracked: what ran, what changed, which files, which skills.

**Rule: 1 chat = 1 session. Every request = 1 log entry.**

In this template no session tracker script is shipped. Start with a simple append-only log file or replace with your team's tracker. The contract below is what scenarios depend on.

## Inputs

| Name             | Type   | Required | Description                                                                 |
| ---------------- | ------ | -------- | --------------------------------------------------------------------------- |
| `session_name`   | string | no       | Session ID (auto `YYYY-MM-DD_HHmm` if omitted)                              |
| `request_num`    | int    | yes      | Sequential request number within the session                                |
| `summary`        | string | yes      | What this step does                                                         |
| `mode`           | string | no       | `ask` / `edit` / `test` / `plan` / `debug` / `refactor` / `chat` / `review` |
| `tools`          | object | no       | Tool call counts                                                            |
| `files_read`     | list   | no       | `[{"path": "...", "lines": N}]`                                             |
| `files_modified` | list   | no       | `[{"path": "...", "added": N, "removed": N}]`                               |
| `skills`         | list   | no       | Skill IDs loaded                                                            |
| `subagents`      | int    | no       | Number of sub-agents spawned                                                |
| `scenario_id`    | string | no       | ID of the executing scenario                                                |

## Outputs

| Name           | Type   | Description                |
| -------------- | ------ | -------------------------- |
| `session_name` | string | The session name for reuse |

## Placement rules

1. **FIRST node** in every scenario — logs "Scenario X started"
2. **LAST node** in every scenario — logs completion with results
3. Between them: optional mid-scenario logging for long pipelines

## Example

```yaml
# First node
- id: log_start
  node: session-log
  inputs:
    request_num: 1
    summary: "Scenario batch-test-creation: tests for user feature"
    mode: test
    scenario_id: batch-test-creation
  outputs: [session_name]

# Last node
- id: log_end
  node: session-log
  inputs:
    session_name: $session_name
    request_num: 2
    summary: "Scenario batch-test-creation completed: {verification.status}"
    mode: test
    files_modified: $all_modified_files
    scenario_id: batch-test-creation
  outputs: []
```
