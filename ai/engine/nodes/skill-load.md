# Node: skill-load

> Load a skill (or one section) into agent context.

## Spec

```yaml
id: skill-load
type: input
token_cost: 100
cacheable: true
cache_key: "skill:{skill_id}:{section}"
```

## Inputs

| Name       | Type   | Required | Description                                           |
| ---------- | ------ | -------- | ----------------------------------------------------- |
| `skill_id` | string | yes      | Skill ID from `manifest.json` (e.g., `react-testing`) |
| `section`  | string | no       | Header to load only that section                      |

## Outputs

| Name      | Type   | Description            |
| --------- | ------ | ---------------------- |
| `content` | string | Skill markdown content |

## Behavior

1. Look up `path` in `manifest.json` skills array
2. Read the file
3. If `section` specified, extract only that `##` block
4. Cache result

## Example

```yaml
- node: skill-load
  inputs:
    skill_id: react-testing
  outputs: [testing_guide]
```
