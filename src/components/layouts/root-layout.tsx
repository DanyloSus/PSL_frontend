import { Suspense, useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ErrorBoundary } from "react-error-boundary";

import { queryConfig } from "@/lib/react-query";
import { Spinner } from "@/ui/spinner";

import { MainErrorFallback } from "../errors";

export const RootLayout = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig
      })
  );

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner className="size-xl" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <QueryClientProvider client={queryClient}>
          <Outlet />

          <TanStackRouterDevtools />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ErrorBoundary>
    </Suspense>
  );
};
