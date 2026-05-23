---
id: imports
tier: 0
eslint-areas: [eslint-plugin-import, no-restricted-imports]
enforcement: strict
---

# Import Rules

Enforces alias usage, import order, no cycles.

## Rules

### I1. Always use `@/` alias

**ESLint:** `no-restricted-imports` blocks `../../*`.

```ts
// ❌ FORBIDDEN
import { Button } from "../../ui/button";

// ✅
import { Button } from "@/ui/button";
```

`@/` maps to `src/` (configured in `tsconfig.json` and `vite.config.ts`).

### I2. Strict import order

**ESLint:** `import/order` with these groups (alphabetized within each):

1. `builtin` — Node builtins, plus `react` (`pathGroups: react → builtin`)
2. `external` — npm deps
3. `internal` — `@/`, with `components/**` and `ui/**` first
4. `parent` / `sibling` — relative
5. `index`
6. `object` — `**/styles` last

```ts
// ✅
import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import { Button } from "@/ui/button";
import { Header } from "@/components/header";
import { api } from "@/lib/api";

import { localHelper } from "./local-helper";

import "./styles.css";
```

A blank line MUST separate each group (`newlines-between: always`).

### I3. No import cycles

**ESLint:** `import/no-cycle: error`.

If you hit a cycle, the right fix is almost always to extract the shared piece into a third module — not to break the import.

### I4. No duplicate imports

**ESLint:** `import/no-duplicates: error`, `no-duplicate-imports: error`.

```ts
// ❌
import { useState } from "react";
import { useEffect } from "react";

// ✅
import { useEffect, useState } from "react";
```

### I5. Newline after import block

**ESLint:** `import/newline-after-import: ['error', { count: 1 }]`.

## Verification

```bash
npm run lint
```
