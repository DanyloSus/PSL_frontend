import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AuthShell } from "@/features/auth/components/auth-shell";

export const Route = createFileRoute("/_public")({
  component: PublicLayout
});

function PublicLayout() {
  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  );
}
