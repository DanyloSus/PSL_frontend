---
id: naming
tier: 0
eslint-areas: [check-file]
enforcement: strict
---

# Naming Conventions

## Rules

### N1. Files = kebab-case

**ESLint:** `check-file/filename-naming-convention: ['error', { '**/*.{ts,tsx}': 'KEBAB_CASE' }]`.

```
✅ user-profile.tsx
✅ use-debounce.ts
✅ button.tsx
❌ UserProfile.tsx
❌ useDebounce.ts
❌ Button.tsx
```

**Exception:** `__root.tsx` (TanStack Router convention) is exempt — see `eslint.config.js` override.

### N2. Folders = kebab-case

**ESLint:** `check-file/folder-naming-convention: ['error', { '**/*': 'KEBAB_CASE' }]`.

```
✅ src/features/user-profile/
✅ src/components/data-table/
❌ src/features/UserProfile/
```

### N3. React components = PascalCase exports in kebab-case files

```tsx
// File: src/components/user-card.tsx
export function UserCard({ user }: Props) {
  return <div>{user.name}</div>;
}
```

### N4. Hooks start with `use*`

```ts
// File: src/hooks/use-debounce.ts
export function useDebounce<T>(value: T, delay = 200): T {
  /* … */
}
```

### N5. Tests: `*.test.ts(x)` co-located

```
src/components/user-card.tsx
src/components/user-card.test.tsx
```

### N6. Stories: `*.stories.tsx` co-located

```
src/ui/button.tsx
src/ui/button.stories.tsx
```

### N7. Schemas: `*.schema.ts`

Zod schemas live in dedicated `*.schema.ts` files inside `features/<f>/types/` so the type can be re-exported via `z.infer`.

### N8. Constants: `SCREAMING_SNAKE_CASE` only at module top-level

```ts
const MAX_RETRIES = 3;
```

Inside functions, prefer `const camelCase`.

## Verification

```bash
npm run lint
```
