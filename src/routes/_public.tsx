import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { meQueryOptions } from "@/features/auth/api/auth";
import { AuthShell } from "@/features/auth/components/auth-shell";

export const Route = createFileRoute("/_public")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(meQueryOptions());
    if (user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: PublicLayout
});

function PublicLayout() {
  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  );
}
