# Node: merge

> Combine parallel branch results into a single output.

## Spec

```yaml
id: merge
type: output
token_cost: 40
cacheable: false
```

## Inputs

| Name       | Type | Required | Description                           |
| ---------- | ---- | -------- | ------------------------------------- |
| `branches` | list | yes      | Results from parallel branches        |
| `strategy` | enum | yes      | `concat` / `dedupe` / `group-by-file` |

## Outputs

| Name     | Type | Description     |
| -------- | ---- | --------------- |
| `merged` | any  | Combined result |

## Behavior

| strategy        | Description                       |
| --------------- | --------------------------------- |
| `concat`        | Flat-concatenate all branches     |
| `dedupe`        | Concat + remove duplicates by key |
| `group-by-file` | Group findings by file path       |

## Example

```yaml
- node: merge
  inputs:
    branches: $test_results
    strategy: concat
  outputs: [all_results]
```
