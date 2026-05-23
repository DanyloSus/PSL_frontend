---
id: code-style
tier: 0
eslint-areas: [core, react, react-hooks]
enforcement: strict
---

# Code Style Rules

Core style rules. Most are enforced as ESLint errors; a few are warnings.

## Absolute Prohibitions (error)

### S1. NO `console.log`

**ESLint:** `no-console: ['warn', { allow: ['warn', 'error'] }]`

```ts
// ❌ FORBIDDEN
console.log("debug", value);

// ✅ Allowed for observable issues
console.warn("deprecated:", value);
console.error("failed to fetch:", err);
```

**Why:** `console.log` leaks into production builds. Use `warn`/`error` for things users (or Sentry) should see.

### S2. No nested ternary

**ESLint:** `no-nested-ternary: error`

```ts
// ❌ FORBIDDEN
const label = isLoading ? "Loading" : isError ? "Error" : "OK";

// ✅ Extract or use early returns
let label = "OK";
if (isError) label = "Error";
if (isLoading) label = "Loading";
```

### S3. Strict equality

**ESLint:** `eqeqeq: ['error', 'always', { null: 'ignore' }]`

```ts
// ❌
if (count == 0) {
}

// ✅
if (count === 0) {
}

// ✅ exception: null comparison allowed
if (value == null) {
} // matches null OR undefined
```

### S4. Boolean naming convention

**ESLint:** `@typescript-eslint/naming-convention` enforces it on variables and parameters.

```ts
// ❌
const loading = true;
function f(open: boolean) {}

// ✅
const isLoading = true;
const hasError = false;
function f(isOpen: boolean) {}
```

Allowed prefixes: `is`, `has`, `should`, `can`, `did`, `will`, `are`. Constants may be `IS_/HAS_/…` SCREAMING_SNAKE.

### S5. No `var`, prefer `const`

**ESLint:** `no-var: error`, `prefer-const: error`.

### S6. Blank line before `return`

**ESLint:** `padding-line-between-statements`.

```ts
// ❌
function f() {
  const x = 1;
  return x;
}

// ✅
function f() {
  const x = 1;

  return x;
}
```

### S7. id-length ≥ 2

**ESLint:** `id-length: ['warn', { min: 2, exceptions: [...] }]`

Single-letter identifiers allowed only for the listed exceptions (`i`, `j`, `t`, `m`, `p`, `r`, `x`, `y`, `z`, `_`).

### S8. JSX

- `react/jsx-key: error` — list items must have stable keys.
- `react/jsx-curly-brace-presence: ['error', { props: 'never', children: 'never' }]` — no `prop={"value"}`.
- `react/react-in-jsx-scope: off` — React 19 / new JSX transform.

### S9. No `default-case` slip-through

**ESLint:** `default-case: error`, `default-case-last: error`.

```ts
// ✅
switch (status) {
  case "idle":
    return "Idle";
  case "loading":
    return "Loading";
  default:
    return "Unknown";
}
```

## Warnings

- `no-unused-vars: warn` (`@typescript-eslint/no-unused-vars: error` for `_`-prefixed exception).
- `id-length: warn`.
- `no-template-curly-in-string: warn`.

## Verification

```bash
npm run lint
```
