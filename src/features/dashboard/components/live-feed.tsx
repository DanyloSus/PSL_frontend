import { cn } from "@/utils/cn";

import { FeedEntry } from "./feed-entry";
import type { FeedEntry as FeedEntryData } from "../utils/to-feed-entries";

const TAG_NO_ACTIVITY = "// NO ACTIVITY YET";

interface Props {
  entries: FeedEntryData[];
  title?: string;
  className?: string;
}

export function LiveFeed({ entries, title = "LIVE FEED", className }: Props) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-foreground font-mono text-[11px] font-semibold tracking-[2px]">
          {`// ${title}`}
        </span>
        <span className="text-danger animate-blink font-mono text-[9px] tracking-[1px]">
          ● REC
        </span>
      </div>
      {entries.length === 0 ? (
        <p className="text-faint font-mono text-[11px] tracking-[1px]">
          {TAG_NO_ACTIVITY}
        </p>
      ) : (
        <ul className="space-y-2">
          {entries.map(entry => (
            <FeedEntry
              key={entry.id}
              entry={entry}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
