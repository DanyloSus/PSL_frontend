# Scenario: <scenario-id>

> <One-line description of what this scenario does.>

## Metadata

```yaml
id: <scenario-id>
triggers: ["<trigger-1>", "<trigger-2>"]
budget:
  max_skills: <N>
  max_subagents: <N>
  estimated_tokens: <N>
verified: false
```

## DAG

```
session-log ──→ <nodes> ──→ session-log
```

## Steps

```yaml
nodes:
  - id: log_start
    node: session-log
    inputs:
      request_num: 1
      summary: "Scenario <id>: {param}"
      mode: <ask|edit|test|review>
      scenario_id: <id>
    outputs: [session_name]

  # ... scenario-specific nodes ...

  - id: log_end
    node: session-log
    inputs:
      session_name: $session_name
      request_num: 2
      summary: "Scenario <id> completed"
      scenario_id: <id>
    outputs: []
```

## Token Estimate

| Node      | Cost   | Instances | Total     |
| --------- | ------ | --------- | --------- |
| <node>    | <cost> | <n>       | <total>   |
| **Total** |        |           | **<sum>** |
