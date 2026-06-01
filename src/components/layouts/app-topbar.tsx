import { Plus, Search } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/ui/button";

interface Props {
  now: Date;
  sectorLabel?: string;
  onLogActivity: () => void;
}

function formatDate(now: Date): string {
  const weekday = now.toLocaleDateString("en-US", { weekday: "short" });
  const month = now.toLocaleDateString("en-US", { month: "short" });

  return `${weekday}, ${month} ${now.getDate()}`.toUpperCase();
}

function formatTime(now: Date): string {
  return now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

export function AppTopbar({
  now,
  sectorLabel = "SECTOR-01",
  onLogActivity
}: Props) {
  return (
    <header className="border-border-soft bg-background/70 sticky top-0 z-20 flex items-center justify-between gap-3 border-b px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <span className="lg:hidden">
          <BrandMark size="sm" />
        </span>
        <div className="hidden items-center gap-2 font-mono text-[10px] tracking-[1.5px] sm:flex">
          <span className="text-primary animate-blink">●</span>
          <span className="text-foreground font-semibold">
            {formatDate(now)}
          </span>
          <span className="text-primary">{formatTime(now)}</span>
          <span className="text-faint">{`// ${sectorLabel}`}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          className="border-border-soft text-muted-foreground hover:text-foreground bg-surface-subtle hidden h-auto gap-2 rounded-sm border px-3 py-1.5 font-mono text-[10px] tracking-[1px] sm:inline-flex"
        >
          <Search className="size-3.5" />
          SEARCH ACTIVITIES
          <span className="text-faint">⌘K</span>
        </Button>
        <Button
          type="button"
          size="icon-lg"
          onClick={onLogActivity}
          aria-label="Log activity"
          className="shadow-glow rounded-sm lg:hidden"
        >
          <Plus
            className="size-5"
            strokeWidth={2.4}
          />
        </Button>
      </div>
    </header>
  );
}
