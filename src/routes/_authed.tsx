import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { meQueryOptions } from "@/features/auth/api/auth";

export const Route = createFileRoute("/_authed")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(meQueryOptions());
    if (!user) {
      throw redirect({ to: "/login" });
    }

    return { user };
  },
  component: AuthedLayout
});

function AuthedLayout() {
  return <Outlet />;
}
