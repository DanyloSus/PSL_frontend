---
id: typescript
tier: 0
eslint-areas: [typescript-eslint]
enforcement: strict
---

# TypeScript Rules

## Rules

### T1. NO `any`

**ESLint:** `@typescript-eslint/no-explicit-any: error`.

```ts
// ❌ FORBIDDEN
function parse(input: any) {
  return input.value;
}

// ✅ Use unknown + narrow
function parse(input: unknown) {
  if (typeof input === "object" && input !== null && "value" in input) {
    return (input as { value: string }).value;
  }
  throw new Error("invalid input");
}

// ✅ Or use Zod for runtime validation
const schema = z.object({ value: z.string() });
const parsed = schema.parse(input);
```

### T2. Prefer destructuring

**ESLint:** `@typescript-eslint/prefer-destructuring: error`.

```ts
// ❌
const name = props.name;

// ✅
const { name } = props;
```

### T3. Prefer optional chaining

**ESLint:** `@typescript-eslint/prefer-optional-chain: error`.

```ts
// ❌
const city = user && user.address && user.address.city;

// ✅
const city = user?.address?.city;
```

### T4. Boolean naming on variables AND parameters

**ESLint:** `@typescript-eslint/naming-convention` (boolean-typed only).

```ts
// ❌
const open = true;
function toggle(open: boolean) {}

// ✅
const isOpen = true;
function toggle(isOpen: boolean) {}
```

Allowed prefixes: `is`, `has`, `should`, `can`, `did`, `will`, `are`.

### T5. No mixed enums

**ESLint:** `@typescript-eslint/no-mixed-enums: error`. Don't mix string and numeric enum values.

### T6. No unused vars (with `_` escape hatch)

**ESLint:** `@typescript-eslint/no-unused-vars: ['error', { argsIgnorePattern: '^_' }]`.

```ts
// ✅
function handler(_event: Event, value: string) {
  return value;
}
```

### T7. Default param last

**ESLint:** `@typescript-eslint/default-param-last: error`.

```ts
// ❌
function f(a = 1, b: number) {}

// ✅
function f(b: number, a = 1) {}
```

## Verification

```bash
npm run lint && npm run build
```

`npm run build` runs `tsc -b` first — catches type errors ESLint cannot.
