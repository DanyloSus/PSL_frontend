import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AuthShell } from "@/features/auth/components/auth-shell";

export const Route = createFileRoute("/_public/_auth")({
  component: AuthLayout
});

function AuthLayout() {
  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  );
}
