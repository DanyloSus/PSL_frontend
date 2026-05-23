# Node: fix

> Apply guided fixes to verification failures. Safer than a blind retry.

## Spec

```yaml
id: fix
type: process
token_cost: 100
cacheable: false
```

## Inputs

| Name       | Type | Required | Description                                |
| ---------- | ---- | -------- | ------------------------------------------ |
| `errors`   | list | yes      | Structured errors from `verify`            |
| `context`  | list | no       | Pre-loaded skills/files relevant to fixing |
| `strategy` | enum | yes      | `autofix` / `guided` / `retry`             |

## Outputs

| Name        | Type | Description            |
| ----------- | ---- | ---------------------- |
| `fixed`     | int  | Number of errors fixed |
| `remaining` | list | Errors still present   |

## Behavior

| strategy  | What it does                                        |
| --------- | --------------------------------------------------- |
| `autofix` | Run `npm run lint:fix` — only for ESLint errors     |
| `guided`  | Re-run the failing step with error context injected |
| `retry`   | Simple retry (last resort)                          |

After fixing, re-run the relevant `verify` step.

## Example

```yaml
- node: fix
  condition: "!$verification.passed"
  inputs:
    errors: $verification.errors
    context: [$testing_guide]
    strategy: guided
  outputs: [fix_result]
```
