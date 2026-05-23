---
name: react-hook-form-zod
description: Forms with React Hook Form 7 + Zod 4. Schema-first validation via @hookform/resolvers/zod.
metadata:
  version: "1.0"
  framework: react
tier: 1
triggers:
  - form
  - validation
  - RHF
  - react-hook-form
  - Zod
  - resolver
  - schema
summary: |
  Define a Zod schema in features/<f>/types/<x>.schema.ts and infer the form
  type via z.infer. Pass the schema to useForm via zodResolver. Reuse the same
  schema for API request validation if possible.
---

# React — Hook Form + Zod

## Overview

| Aspect   | Details                                         |
| -------- | ----------------------------------------------- |
| Goal     | Type-safe forms with first-class validation     |
| When     | Any form with 2+ fields or any validation       |
| Versions | react-hook-form 7, zod 4, @hookform/resolvers 5 |

## Critical rules

**Schema is the source of truth. Type comes from `z.infer<typeof schema>`. Never duplicate.**

## File layout

```
src/features/user/
├── types/
│   └── user-form.schema.ts     # Zod schema + inferred type
└── components/
    └── user-form.tsx           # The form
```

## Schema

```ts
// src/features/user/types/user-form.schema.ts
import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  age: z.coerce.number().int().min(18, "Must be 18+").optional()
});

export type UserFormValues = z.infer<typeof userFormSchema>;
```

## Form component

```tsx
// src/features/user/components/user-form.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/ui/button";

import { userFormSchema, type UserFormValues } from "../types/user-form.schema";

type Props = {
  defaultValues?: Partial<UserFormValues>;
  onSubmit: (values: UserFormValues) => void;
};

export function UserForm({ defaultValues, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        Save
      </Button>
    </form>
  );
}
```

## Wiring the mutation

```tsx
function UserFormContainer() {
  const { mutate, isPending } = useUpdateUser();

  return (
    <UserForm
      onSubmit={values => mutate(values)}
      // disable form submit while pending if you want
    />
  );
}
```

## Patterns

| Need                   | Pattern                                                   |
| ---------------------- | --------------------------------------------------------- |
| Async validation       | `superRefine` in Zod or manual `setError` after mutation  |
| Conditional fields     | `z.discriminatedUnion` or `z.union`                       |
| File upload            | `z.instanceof(File)`                                      |
| Server-returned errors | `setError('field', { message })` after mutation `onError` |
| Watch a field          | `watch('fieldName')`                                      |
| Reset after submit     | `reset(values)` in `onSuccess`                            |

## Common mistakes

| Mistake                                                                    | Fix                             |
| -------------------------------------------------------------------------- | ------------------------------- |
| Defining a separate TS type alongside schema                               | Always `z.infer<typeof schema>` |
| Forgetting `zodResolver`                                                   | Validation never runs           |
| Validating in `onSubmit` manually                                          | The resolver does it for you    |
| Reusing form values type for API request without re-validating server-side | Server must validate too        |

## Checklist

- [ ] Schema lives in `features/<f>/types/<x>.schema.ts`
- [ ] Type comes from `z.infer`
- [ ] `useForm` uses `zodResolver(schema)`
- [ ] Errors rendered next to fields
- [ ] Submit button disabled while `isSubmitting` or `isPending`
