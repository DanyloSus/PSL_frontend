---
id: modularity
tier: 1
eslint-areas: [eslint-plugin-boundaries]
enforcement: strict
---

# Modularity Rules

## Rules

### M1. Feature folder layout

A feature lives at `src/features/<name>/` and may contain only these subfolders (only the ones it needs):

```
src/features/<name>/
├── api/         # axios calls + queryOptions
├── components/  # smart components
├── hooks/       # feature-local hooks
├── stores/      # zustand stores (optional)
├── types/       # types + Zod schemas
├── utils/       # feature-local pure helpers
└── assets/      # feature-local images / svgs
```

Do not invent new top-level folders (`services/`, `helpers/`, `models/` …) — pick the existing one that fits.

### M2. No barrel files unless they help tree-shaking

Barrel `index.ts` files are tempting but they:

- defeat tree-shaking when re-exporting from many modules
- create circular-import landmines
- hide where code lives

Prefer direct imports: `@/features/user/api/get-user` over `@/features/user`.

### M3. No circular feature dependencies

Already enforced by `import/no-cycle: error` and `eslint-plugin-boundaries`. If you reach for a circular import, you're missing a layer — extract to `src/lib/` or `src/hooks/`.

### M4. Sub-foldering at 10+ files

When a feature's `components/` or `hooks/` folder grows past ~10 files, group them into sub-folders by domain (e.g., `components/profile/`, `components/settings/`).

### M5. Cross-cutting concerns belong in shared layers

If two features want the same hook, the hook moves to `src/hooks/`. If two features want the same constant, it moves to `src/lib/` or `src/types/`.

## Verification

```bash
npm run lint
```
