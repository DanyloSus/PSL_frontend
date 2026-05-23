# Node: extract

> Pull structured data (exports, types, dependencies) from raw file content.

## Spec

```yaml
id: extract
type: process
token_cost: 60
cacheable: true
cache_key: "extract:{extraction_type}:{content_hash}"
```

## Inputs

| Name              | Type                  | Required | Description                                              |
| ----------------- | --------------------- | -------- | -------------------------------------------------------- |
| `content`         | list[{path, content}] | yes      | Output from `discover`                                   |
| `extraction_type` | enum                  | yes      | `exports` / `components` / `hooks` / `imports` / `types` |

## Outputs

| Name    | Type                           | Description        |
| ------- | ------------------------------ | ------------------ |
| `items` | list[{path, name, kind, meta}] | Extracted entities |

## Behavior

1. Parse each file (TS/TSX) with a light AST walk
2. Based on `extraction_type`, collect matching entities
3. Attach source path and line numbers

## Example

```yaml
- node: extract
  inputs:
    content: $user_feature_files
    extraction_type: components
  outputs: [user_components]
```
