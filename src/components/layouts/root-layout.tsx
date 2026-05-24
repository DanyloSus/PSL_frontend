import { Suspense, useEffect } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, useRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ErrorBoundary } from "react-error-boundary";

import { authEvents } from "@/lib/auth-events";
import { Spinner } from "@/ui/spinner";

import { MainErrorFallback } from "../errors";

export const RootLayout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    return authEvents.onUnauthenticated(() => {
      queryClient.setQueryData(["auth", "me"], null);
      void router.navigate({ to: "/login" });
    });
  }, [queryClient, router]);

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner className="size-xl" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <Outlet />

        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </ErrorBoundary>
    </Suspense>
  );
};
