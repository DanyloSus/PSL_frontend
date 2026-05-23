# Node: partition

> Split a list of work items into N groups for parallel processing.

## Spec

```yaml
id: partition
type: process
token_cost: 40
cacheable: false
```

## Inputs

| Name         | Type | Required | Description                                           |
| ------------ | ---- | -------- | ----------------------------------------------------- |
| `items`      | list | yes      | Items to partition                                    |
| `strategy`   | enum | yes      | `by-feature` / `by-file` / `by-layer` / `round-robin` |
| `max_groups` | int  | no       | Cap on parallelism (default: 4)                       |

## Outputs

| Name     | Type       | Description       |
| -------- | ---------- | ----------------- |
| `groups` | list[list] | Partitioned items |

## Behavior

1. Apply strategy:
   - `by-feature` → group by first path segment under `src/features/`
   - `by-file` → one item per group
   - `by-layer` → group by `components` / `hooks` / `api` / ...
   - `round-robin` → alternate assignment
2. Cap at `max_groups`

## Example

```yaml
- node: partition
  inputs:
    items: $target_components
    strategy: by-feature
    max_groups: 4
  outputs: [work_groups]
```
