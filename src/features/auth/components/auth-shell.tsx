import type { ReactNode } from "react";

import { GridBg } from "@/components/grid-bg";
import { Scanlines } from "@/components/scanlines";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background relative min-h-dvh w-full overflow-auto">
      <GridBg />
      <Scanlines />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md items-center justify-center px-5 py-16">
        {children}
      </div>
    </div>
  );
}
