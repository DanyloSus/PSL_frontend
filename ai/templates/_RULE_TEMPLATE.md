---
id: <rule-id>
tier: <0|1|2>
eslint-areas: [<eslint-area-1>, <eslint-area-2>]
enforcement: <strict|warning|convention>
---

# <Rule Title>

One-sentence description of what this rule enforces and why.

## Rules

### <Check ID>. <Check Name>

**ESLint:** `<rule-name>: <severity>` (or `pattern: ...` for grep-based checks)

Explanation of the rule intent.

```ts
// ❌ FORBIDDEN / AVOID
<bad example>

// ✅ CORRECT / PREFER
<good example>
```

**Why:** Reasoning for this rule.

<!-- Repeat ### block for each check in this rule file -->

## Verification

```bash
npm run lint
```
