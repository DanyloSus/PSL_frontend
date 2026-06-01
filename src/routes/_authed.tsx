import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Outlet,
  createFileRoute,
  redirect,
  useNavigate
} from "@tanstack/react-router";

import { AppShell } from "@/components/layouts/app-shell";
import { activitiesQueryOptions } from "@/features/activities/api/list";
import { LogSheet } from "@/features/activities/components/log-sheet";
import { useLogSheetStore } from "@/features/activities/stores/use-log-sheet-store";
import { meQueryOptions, useLogout } from "@/features/auth/api/auth";
import { statsQueryOptions } from "@/features/users/api/stats";
import { useNow } from "@/hooks/use-now";
import { statIcon } from "@/utils/stat-icon";
import { statShortName } from "@/utils/stat-short-name";

export const Route = createFileRoute("/_authed")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(meQueryOptions());
    if (!user) {
      throw redirect({ to: "/login" });
    }

    return { user };
  },
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(statsQueryOptions()),
      context.queryClient.ensureQueryData(activitiesQueryOptions())
    ]),
  component: AuthedLayout
});

function AuthedLayout() {
  const { data: user } = useSuspenseQuery(meQueryOptions());
  const { data: stats } = useSuspenseQuery(statsQueryOptions());
  const { isOpen, open, setOpen } = useLogSheetStore();
  const logout = useLogout();
  const navigate = useNavigate();
  const now = useNow();

  if (!user) return null;

  const attributes = stats.map(entry => ({
    id: entry.stat.id,
    icon: statIcon(entry.stat.icon),
    displayName: entry.stat.display_name,
    shortName: statShortName(entry.stat.key),
    level: entry.level
  }));

  const onLogout = () =>
    logout.mutate(undefined, {
      onSuccess: () => navigate({ to: "/login" })
    });

  return (
    <AppShell
      username={user.username}
      email={user.email}
      attributes={attributes}
      now={now}
      onLogActivity={open}
      onLogout={onLogout}
    >
      <Outlet />
      <LogSheet
        isOpen={isOpen}
        onOpenChange={setOpen}
      />
    </AppShell>
  );
}
