---
id: file-health
tier: 1
eslint-areas: [max-lines]
enforcement: warning
---

# File Health Rules

## Rules

### F1. Components ≤150 lines

**ESLint:** `max-lines: ['warn', { max: 150, skipBlankLines: true, skipComments: true }]` (scoped to `**/components/**/*.{tsx,jsx}`).

A component over 150 lines almost always violates Single Responsibility. Split into:

- Smaller dumb sub-components
- A custom hook for state/effects
- A helper module for pure logic

### F2. Hooks ≤80 lines (guideline)

Not enforced by ESLint, but a good ceiling. A hook should do one thing.

### F3. Single Responsibility

Each file should answer one question. If you're using "and" to describe it, split it.

```
❌ user-card-and-edit-modal.tsx
✅ user-card.tsx + user-edit-modal.tsx
```

### F4. One default export per file (or none)

Prefer named exports. Default exports are allowed only when an external API requires them (e.g., a route file).

## Verification

```bash
npm run lint
```
