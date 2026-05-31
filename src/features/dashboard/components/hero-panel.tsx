import { Bolt, Flame } from "lucide-react";

import { CornerFrame } from "@/components/corner-frame";
import { LevelOrb } from "@/components/level-orb";
import { Pill } from "@/components/pill";

import { globalProgress } from "../utils/global-progress";

interface Props {
  username: string;
  globalLevel: number;
  globalXp: number;
  totalLogs: number;
  streak?: number;
}

export function HeroPanel({
  username,
  globalLevel,
  globalXp,
  totalLogs,
  streak = 0
}: Props) {
  const { into, need } = globalProgress(globalXp, globalLevel);

  return (
    <CornerFrame
      size={12}
      className="bg-card border-border relative mb-3.5 overflow-hidden rounded-md border px-4 py-5 backdrop-blur-xl"
    >
      <div className="text-muted-foreground absolute top-3.5 left-3.5 font-mono text-[9px] tracking-[1.5px]">
        <span className="text-primary animate-blink mr-1">●</span>
        ONLINE / SECTOR-01
      </div>
      <div className="text-muted-foreground absolute top-3.5 right-3.5 font-mono text-[9px] tracking-[1.5px]">
        OPERATIVE
      </div>
      <div className="mt-5 flex items-center gap-4">
        <LevelOrb
          level={globalLevel}
          into={into}
          need={need}
          size={120}
        />
        <div className="flex-1">
          <div className="text-muted-foreground font-mono text-[9px] tracking-[1.5px]">
            OPERATIVE
          </div>
          <div className="text-foreground mt-0.5 text-[22px] leading-tight font-bold">
            {username}
            <span className="text-primary">.</span>
          </div>
          <div className="text-muted-foreground mt-1.5 font-mono text-[10px] tracking-[1px]">
            STATUS · ACTIVE
          </div>
          <div className="mt-3 flex gap-2">
            <Pill
              icon={Flame}
              label={`${streak}d`}
              sub="STREAK"
            />
            <Pill
              icon={Bolt}
              label={totalLogs}
              sub="LOGS"
            />
          </div>
        </div>
      </div>
    </CornerFrame>
  );
}
