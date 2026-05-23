import { useRouter } from "@tanstack/react-router";

import { Button } from "@/ui/button";

export const MainErrorFallback = () => {
  const router = useRouter();

  const handleRefresh = () => {
    router.invalidate();
  };

  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center text-red-500"
      role="alert"
    >
      <h2 className="text-lg font-semibold">Ooops, something went wrong :( </h2>

      <Button
        className="mt-4"
        onClick={handleRefresh}
      >
        Refresh
      </Button>
    </div>
  );
};
