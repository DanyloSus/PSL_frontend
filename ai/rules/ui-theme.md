---
id: ui-theme
tier: 1
eslint-areas: []
enforcement: convention
---

# UI / Theme Rules

Conventions for Tailwind v4, shadcn/ui, and CVA usage.

## Rules

### U1. Use `cn()` for class merging

Always import from `@/utils/cn`. It wraps `clsx` + `tailwind-merge` so later utilities override earlier ones.

```tsx
import { cn } from '@/utils/cn'

// ✅
<button className={cn('rounded px-4', isActive && 'bg-primary', className)} />

// ❌
<button className={`rounded px-4 ${isActive ? 'bg-primary' : ''} ${className}`} />
```

### U2. Variants via CVA

Reach for `class-variance-authority` when a component has 2+ variant axes (e.g., `variant`, `size`).

```ts
import { cva } from "class-variance-authority";

export const buttonVariants = cva("inline-flex items-center", {
  variants: {
    variant: { default: "bg-primary text-white", ghost: "bg-transparent" },
    size: { sm: "h-8 px-3", md: "h-10 px-4", lg: "h-12 px-6" }
  },
  defaultVariants: { variant: "default", size: "md" }
});
```

### U3. Theme tokens via Tailwind v4 CSS variables

Defined in `src/index.css` with `@theme`. Never hardcode hex values inside components.

```tsx
// ❌
<div className="bg-[#2563eb]" />

// ✅ — uses theme token
<div className="bg-primary" />
```

### U4. shadcn primitives in `src/ui/`

Wrap and re-export Radix UI primitives in `src/ui/`. Application code imports from `@/ui/<primitive>`. Do not import Radix directly from feature code.

### U5. Use `lucide-react` for icons

Already a dependency. Import individual icons (tree-shakable):

```tsx
import { ChevronRight } from "lucide-react";
```

### U6. No inline styles unless dynamic

Tailwind covers static styling. Use `style={{ … }}` only for runtime-computed values (e.g., a dynamic offset).

## Verification

Visual review + Storybook (`npm run storybook`).
