---
name: react-shadcn-tailwind
description: shadcn/ui primitives + Tailwind v4 + CVA variants. Class merging via cn(), theme tokens via CSS variables.
metadata:
  version: "1.0"
  framework: react
tier: 1
triggers:
  - shadcn
  - tailwind
  - button
  - variant
  - CVA
  - theme
  - radix
summary: |
  shadcn/ui primitives live in src/ui/. Wrap Radix components and expose CVA
  variants. Use cn() from @/utils/cn for merging classes (clsx + tailwind-merge).
  Theme tokens are CSS variables defined in src/index.css with @theme.
  Tailwind v4 — no tailwind.config.js, configuration is in CSS.
---

# React — shadcn/ui + Tailwind v4

## Overview

| Aspect   | Details                                                      |
| -------- | ------------------------------------------------------------ |
| Goal     | Reusable, themeable, accessible UI primitives                |
| When     | New button, input, dialog, dropdown, …                       |
| Versions | tailwindcss v4, shadcn 4, radix-ui, class-variance-authority |

## Critical rules

**Always merge classes with `cn()`. Always define variants with CVA when there are 2+ variant axes.**

## `cn()` helper

```ts
// src/utils/cn.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```tsx
import { cn } from "@/utils/cn";

<button
  className={cn("rounded px-4 py-2", isActive && "bg-primary", className)}
/>;
```

`tailwind-merge` ensures later utilities win when they conflict (e.g., `px-4 px-6` → `px-6`).

## CVA primitive

```tsx
// src/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-destructive-foreground"
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-6"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
```

## Theme tokens (Tailwind v4)

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.55 0.2 260);
  --color-primary-foreground: oklch(0.98 0 0);
  --color-destructive: oklch(0.55 0.2 25);
  --radius: 0.5rem;
}
```

Refer to tokens via Tailwind classes: `bg-primary`, `text-primary-foreground`. Never hardcode hex inside JSX.

## Radix integration

```tsx
// src/ui/dialog.tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/utils/cn";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogContent({
  className,
  children,
  ...props
}: DialogPrimitive.DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50" />
      <DialogPrimitive.Content
        className={cn(
          "bg-background fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md p-6",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
```

Application code imports from `@/ui/dialog`, never from `@radix-ui/*` directly.

## Icons

```tsx
import { ChevronRight } from "lucide-react";

<ChevronRight className="size-4" />;
```

## Common mistakes

| Mistake                                    | Fix                                      |
| ------------------------------------------ | ---------------------------------------- |
| String concatenation for classes           | Use `cn()`                               |
| Hardcoded hex (`bg-[#2563eb]`)             | Define as token in `index.css`           |
| If/else for variants inside JSX            | CVA                                      |
| Importing Radix primitives in feature code | Wrap in `src/ui/` first                  |
| Looking for `tailwind.config.js`           | Tailwind v4 — config is CSS via `@theme` |

## Checklist

- [ ] Component uses `cn()` for classes
- [ ] Variants are CVA-based
- [ ] No hardcoded colors / sizes
- [ ] Radix primitives wrapped in `src/ui/`
- [ ] Story file added (`*.stories.tsx`)
