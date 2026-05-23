---
id: architecture
tier: 0
eslint-areas: [eslint-plugin-boundaries]
enforcement: strict
---

# Architecture Rules

Enforces Feature-Sliced Design boundaries via `eslint-plugin-boundaries`.

## Layer map

| Layer        | Path                   | May import from                                         |
| ------------ | ---------------------- | ------------------------------------------------------- |
| `app`        | `src/app/`             | anything                                                |
| `feature`    | `src/features/<name>/` | own feature, shared layers, NOT other features, NOT app |
| `components` | `src/components/`      | shared layers only                                      |
| `hooks`      | `src/hooks/`           | shared layers only                                      |
| `lib`        | `src/lib/`             | shared layers only                                      |
| `types`      | `src/types/`           | shared layers only                                      |
| `utils`      | `src/utils/`           | shared layers only                                      |

## Rules

### A1. Feature isolation

**ESLint:** `boundaries/dependencies` rule blocks `feature → other feature`.

```ts
// ❌ FORBIDDEN — feature importing another feature
import { useAlarm } from "@/features/alarm/hooks/use-alarm";

// ✅ Lift shared logic to src/hooks/, src/lib/, or src/components/
import { useAlarm } from "@/hooks/use-alarm";
```

**Why:** Features are deliverable units. If A imports from B, you cannot ship A without B.

### A2. Features cannot import from `app/`

**ESLint:** `boundaries/dependencies` blocks `feature → app`.

```ts
// ❌ FORBIDDEN
import { providers } from "@/app/providers";

// ✅ Inject what you need via props or hooks
```

**Why:** `app/` composes features. Reverse imports create cycles.

### A3. Shared layers stay pure

**Pattern:** `components/`, `hooks/`, `lib/`, `types/`, `utils/` MUST NOT import from `features/` or `app/`.

```ts
// ❌ FORBIDDEN in src/components/header.tsx
import { useExample } from "@/features/example/hooks/use-example";

// ✅ Pass data via props
type HeaderProps = { user: User };
```

**Why:** Shared = reusable. As soon as a shared component reaches into a feature, it's no longer shared.

### A4. No import cycles

**ESLint:** `import/no-cycle: error`.

```ts
// ❌ FORBIDDEN
// a.ts → imports b.ts
// b.ts → imports a.ts
```

**Why:** Cycles break tree-shaking and create undefined-at-init bugs.

### A5. `routeTree.gen.ts` is generated — never edit

The TanStack Router plugin (`@tanstack/router-plugin`) writes this file from `src/routes/`. Manual edits will be wiped.

## Verification

```bash
npm run lint
```
