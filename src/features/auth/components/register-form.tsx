import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";

import { useRegister } from "@/features/auth/api/auth";
import {
  registerSchema,
  type RegisterValues
} from "@/features/auth/types/auth.schema";
import { Button } from "@/ui/button";

import { CyberField } from "./cyber-field";

export function RegisterForm() {
  const navigate = useNavigate();
  const register = useRegister();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", username: "", password: "" }
  });

  const onSubmit = form.handleSubmit(async values => {
    setSubmitError(null);
    try {
      await register.mutateAsync(values);
      await navigate({ to: "/dashboard" });
    } catch {
      setSubmitError("Registration failed. Try a different handle or email.");
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-4"
    >
      <CyberField
        label="HANDLE"
        autoComplete="username"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        placeholder="davyd"
        error={form.formState.errors.username?.message}
        {...form.register("username")}
      />
      <CyberField
        label="IDENTIFIER"
        type="email"
        autoComplete="email"
        placeholder="you@domain.io"
        error={form.formState.errors.email?.message}
        {...form.register("email")}
      />
      <CyberField
        label="PASSPHRASE"
        type="password"
        autoComplete="new-password"
        placeholder="8+ characters"
        hint="8+ characters · stored encrypted"
        error={
          form.formState.errors.password?.message ?? submitError ?? undefined
        }
        {...form.register("password")}
      />
      <Button
        type="submit"
        disabled={register.isPending}
        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow h-12 w-full text-sm font-bold tracking-[2px]"
      >
        {register.isPending ? "CREATING…" : "BEGIN"}
        {!register.isPending && <ChevronRight className="size-4" />}
      </Button>
    </form>
  );
}
