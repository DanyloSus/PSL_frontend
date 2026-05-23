---
name: react-feature-sliced-design
description: Feature-Sliced Design layout for this project. Each feature is a self-contained module under src/features/, with its own api, components, hooks, stores, types, utils, and assets.
metadata:
  version: "1.0"
  framework: react
  related-skills:
    - react-presentation-layer
    - react-tanstack-query
tier: 1
triggers:
  - feature
  - scaffold
  - FSD
  - feature-sliced
  - structure
  - new feature
summary: |
  Features live at src/features/<name>/ and contain only the subfolders they need
  (api/components/hooks/stores/types/utils/assets). Boundary rules from
  eslint-plugin-boundaries: features cannot import other features, and shared
  layers (components/hooks/lib/types/utils) cannot import features or app.
  No barrel files unless they aid tree-shaking.
---

# React — Feature-Sliced Design

## Overview

| Aspect       | Details                                                               |
| ------------ | --------------------------------------------------------------------- |
| Goal         | Self-contained features that can be removed without breaking the rest |
| When         | Any new domain functionality (auth, billing, dashboard, …)            |
| Enforced by  | `eslint-plugin-boundaries` in `eslint.config.js`                      |
| Verification | `npm run lint`                                                        |

## Critical rules

**Features may NOT import from other features. Shared layers may NOT import from features or app.**

## Layer map

```
src/
├── app/              # composition root, providers
├── features/<name>/  # self-contained feature
├── components/       # shared dumb components
├── ui/               # shadcn/ui primitives
├── hooks/            # cross-feature hooks
├── lib/              # singletons (api, react-query)
├── config/           # env
├── types/            # cross-feature types
├── utils/            # pure helpers (cn, formatters)
└── routes/           # TanStack Router file-based routes
```

## Feature folder layout

A feature contains only the subfolders it needs:

```
src/features/<name>/
├── api/
│   ├── get-<resource>.ts
│   ├── create-<resource>.ts
│   └── <resource>-keys.ts        # query key factory
├── components/
│   ├── <name>-list.tsx           # smart
│   └── <name>-row.tsx            # dumb
├── hooks/
│   └── use-<name>.ts
├── stores/
│   └── <name>-store.ts           # zustand (optional)
├── types/
│   ├── <name>.types.ts
│   └── <name>.schema.ts          # Zod schema
├── utils/
│   └── format-<x>.ts
└── assets/
    └── icon.svg
```

Don't invent new top-level folders (`services/`, `helpers/`). If it doesn't fit, lift it to a shared layer.

## Where things go

| Question                                            | Answer                                                     |
| --------------------------------------------------- | ---------------------------------------------------------- |
| Where do I put a Zustand store used by one feature? | `src/features/<f>/stores/`                                 |
| Where do I put a Zustand store used by 3 features?  | `src/stores/` (create the folder if missing) or `src/lib/` |
| Where do I put a hook used by one feature?          | `src/features/<f>/hooks/`                                  |
| Where do I put a hook used by 3 features?           | `src/hooks/`                                               |
| Where do I put a Zod schema?                        | `src/features/<f>/types/<x>.schema.ts`                     |
| Where do I put the Axios call?                      | `src/features/<f>/api/<verb>-<resource>.ts`                |
| Where does a query key factory live?                | `src/features/<f>/api/<resource>-keys.ts`                  |

## Common mistakes

| Mistake                                              | Fix                                             |
| ---------------------------------------------------- | ----------------------------------------------- |
| Importing `@/features/auth/...` from another feature | Lift to `src/hooks/` or `src/lib/`              |
| Adding a barrel `index.ts` to a feature              | Use direct imports — barrels break tree-shaking |
| Putting a feature-only hook in `src/hooks/`          | Move to `src/features/<f>/hooks/`               |
| Importing `@/app/providers` from a feature           | Inject via props or use a shared hook           |

## Checklist

- [ ] Folder name is kebab-case
- [ ] Feature contains only the subfolders it actually needs
- [ ] No imports from other features
- [ ] No imports from `@/app/...`
- [ ] All cross-dir imports use `@/` alias
- [ ] `npm run lint` passes
