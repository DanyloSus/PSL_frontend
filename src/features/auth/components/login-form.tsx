import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";

import { useLogin } from "@/features/auth/api/auth";
import {
  loginSchema,
  type LoginValues
} from "@/features/auth/types/auth.schema";
import { Button } from "@/ui/button";

import { CyberField } from "./cyber-field";
import { FormError } from "./form-error";

export function LoginForm() {
  const navigate = useNavigate();
  const login = useLogin();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = form.handleSubmit(async values => {
    setSubmitError(null);
    try {
      await login.mutateAsync(values);
      await navigate({ to: "/dashboard" });
    } catch {
      setSubmitError("Authentication failed. Check your credentials.");
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-4"
    >
      <CyberField
        label="IDENTIFIER"
        type="email"
        autoComplete="email"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        placeholder="you@psl.io"
        error={form.formState.errors.email?.message}
        {...form.register("email")}
      />
      <CyberField
        label="PASSPHRASE"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={form.formState.errors.password?.message}
        {...form.register("password")}
      />
      <FormError message={submitError} />
      <Button
        type="submit"
        disabled={login.isPending}
        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow h-12 w-full text-sm font-bold tracking-[2px]"
      >
        {login.isPending ? "AUTHENTICATING…" : "ACCESS"}
        {!login.isPending && <ChevronRight className="size-4" />}
      </Button>
    </form>
  );
}
