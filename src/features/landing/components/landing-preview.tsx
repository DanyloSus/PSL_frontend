import { Book, Brain, Heart, Sword } from "lucide-react";

import { CornerFrame } from "@/components/corner-frame";
import { LevelOrb } from "@/components/level-orb";
import { StatCard } from "@/components/stat-card";

const SAMPLE_STATS = [
  {
    id: "str",
    icon: Sword,
    shortName: "STR",
    displayName: "Strength",
    level: 3,
    xpInto: 145,
    xpForNext: 182
  },
  {
    id: "hlt",
    icon: Heart,
    shortName: "HLT",
    displayName: "Health",
    level: 3,
    xpInto: 10,
    xpForNext: 182
  },
  {
    id: "int",
    icon: Book,
    shortName: "INT",
    displayName: "Intelligence",
    level: 4,
    xpInto: 93,
    xpForNext: 246
  },
  {
    id: "mnt",
    icon: Brain,
    shortName: "MNT",
    displayName: "Mental",
    level: 2,
    xpInto: 80,
    xpForNext: 135
  }
] as const;

export function LandingPreview() {
  return (
    <CornerFrame
      size={14}
      className="bg-card border-border relative overflow-hidden rounded-lg border p-5 backdrop-blur-xl"
    >
      <span className="bg-primary text-primary-foreground shadow-glow animate-float absolute top-5 right-5 rounded-sm px-2 py-1 font-mono text-[10px] font-bold tracking-[1px]">
        +12 STR
      </span>
      <div className="flex items-center gap-4">
        <LevelOrb
          level={12}
          into={240}
          need={420}
          size={120}
        />
        <div>
          <div className="text-muted-foreground font-mono text-[9px] tracking-[1.5px]">
            OPERATIVE
          </div>
          <div className="text-foreground text-[24px] leading-tight font-bold">
            YOU<span className="text-primary">.</span>
          </div>
          <div className="text-muted-foreground mt-1.5 font-mono text-[10px] tracking-[1px]">
            OPERATIVE · ACTIVE
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {SAMPLE_STATS.map(stat => (
          <StatCard
            key={stat.id}
            icon={stat.icon}
            shortName={stat.shortName}
            displayName={stat.displayName}
            level={stat.level}
            xpInto={stat.xpInto}
            xpForNext={stat.xpForNext}
          />
        ))}
      </div>
    </CornerFrame>
  );
}
