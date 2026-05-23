# Node: transform

> Apply a prompt template or formatter to turn structured data into a report or new code.

## Spec

```yaml
id: transform
type: process
token_cost: 60
cacheable: true
cache_key: "transform:{operation}:{input_hash}"
```

## Inputs

| Name        | Type   | Required | Description                                 |
| ----------- | ------ | -------- | ------------------------------------------- |
| `input`     | any    | yes      | Data to transform                           |
| `operation` | enum   | yes      | `to-prompt` / `to-markdown` / `to-code`     |
| `params`    | object | no       | Operation-specific options (template, etc.) |

## Outputs

| Name     | Type   | Description        |
| -------- | ------ | ------------------ |
| `output` | string | Transformed result |

## Example

```yaml
- node: transform
  inputs:
    input: $full_review
    operation: to-markdown
    params:
      template: "## Code Review\n{findings}\n### Summary\n{summary}"
  outputs: [review_report]
```
