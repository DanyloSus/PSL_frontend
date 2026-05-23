# Node: verify

> Run lint / type-check / tests against the working tree.

## Spec

```yaml
id: verify
type: process
token_cost: 80
cacheable: false
```

## Inputs

| Name         | Type         | Required | Description                                 |
| ------------ | ------------ | -------- | ------------------------------------------- |
| `check_type` | enum         | yes      | `lint` / `types` / `tests` / `e2e` / `full` |
| `targets`    | list[string] | no       | Specific files/paths to check               |

## Outputs

| Name     | Type                              | Description               |
| -------- | --------------------------------- | ------------------------- |
| `passed` | bool                              | True if all checks passed |
| `errors` | list[{file, line, rule, message}] | Structured errors         |

## Behavior

| check_type | Command                                                   |
| ---------- | --------------------------------------------------------- |
| `lint`     | `npm run lint` (scoped via eslint CLI if `targets` given) |
| `types`    | `npm run build` (tsc -b)                                  |
| `tests`    | `npm test -- --run`                                       |
| `e2e`      | `npx playwright test`                                     |
| `full`     | `lint && types && tests`                                  |

## Example

```yaml
- node: verify
  inputs:
    check_type: full
  outputs: [verification]
```
