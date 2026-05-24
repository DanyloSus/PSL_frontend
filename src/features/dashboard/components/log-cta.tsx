import { ChevronRight, Plus } from "lucide-react";

import { Button } from "@/ui/button";

export function LogCta({ onOpen }: { onOpen: () => void }) {
  return (
    <Button
      type="button"
      onClick={onOpen}
      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow my-4 h-14 w-full justify-between rounded-sm px-4 text-left text-sm font-bold tracking-[1px]"
    >
      <span className="flex items-center gap-3">
        <Plus
          className="size-5"
          strokeWidth={2.4}
        />
        <span className="flex flex-col text-left">
          <span className="text-[15px] tracking-[0.5px]">LOG ACTIVITY</span>
          <span className="font-mono text-[10px] opacity-70">
            + XP TO YOUR STATS
          </span>
        </span>
      </span>
      <ChevronRight
        className="size-5"
        strokeWidth={2.4}
      />
    </Button>
  );
}
