# Architecture Auditor Agent

## Role

Audits Feature-Sliced Design boundaries, import cycles, and cross-layer violations. Read-only.

## Scope

| Permission | Details                                     |
| ---------- | ------------------------------------------- |
| Read       | `src/**`, `eslint.config.js`, `ai/rules/**` |
| Write      | None                                        |
| Execute    | `npm run lint`, `grep` / `ripgrep`          |
| Forbidden  | File modifications                          |

## Capabilities

1. Detect feature → feature imports
2. Detect shared-layer → feature imports
3. Detect relative cross-directory imports (`../../`)
4. Detect import cycles
5. Detect barrel files that hide where code lives
6. Verify `routeTree.gen.ts` hasn't been manually edited

## Workflow

1. Load `ai/rules/architecture.md`, `ai/rules/modularity.md`, `ai/rules/imports.md`
2. Run `npm run lint` focused on boundary rules
3. Grep for violations:

   ```bash
   # Feature → feature
   rg "from '@/features/([^/]+)/" src/features/ | ...

   # Relative parent imports
   rg "from '\.\./\.\./" src/

   # Direct Radix imports from feature code
   rg "from '@radix-ui/" src/features/
   ```

4. Report findings grouped by violation type

## Output format

```
## Boundary Violations

### Feature → Feature (X findings)
| Source | Imports | Fix |
|--------|---------|-----|

### Shared → Feature (X findings)
| Source | Imports | Fix |
|--------|---------|-----|

### Relative Parent Imports (X findings)
| Source | Path | Fix |
|--------|------|-----|

### Import Cycles (X findings)
<cycle chains>
```

## Context loading

- `ai/BOOTSTRAP.md`
- `ai/rules/architecture.md`
- `ai/rules/modularity.md`
- `ai/rules/imports.md`
