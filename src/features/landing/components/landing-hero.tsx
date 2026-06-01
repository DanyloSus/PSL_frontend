import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

const STATS = ["7 ATTRIBUTES", "25+ ACTIVITIES", "∞ LEVELS"];

export function LandingHero() {
  return (
    <div>
      <div className="border-border-soft bg-primary/5 text-acid-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] tracking-[1.5px]">
        <span className="animate-blink">●</span>
        v0.1 EARLY ACCESS · INVITE ONLY
      </div>
      <h1 className="text-foreground mt-6 text-[44px] leading-[1.05] font-bold tracking-tight sm:text-[56px]">
        Turn your real life
        <br />
        into an <span className="text-primary">RPG.</span>
      </h1>
      <p className="text-muted-foreground mt-5 max-w-md text-[15px] leading-relaxed">
        Log real-world habits. Watch stats level up. Become your ideal self
        through visible, gamified progression — not another habit tracker.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          to="/register"
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow inline-flex h-12 items-center gap-2 rounded-sm px-6 text-sm font-bold tracking-[1px]"
        >
          REGISTER
          <ChevronRight
            className="size-4"
            strokeWidth={2.4}
          />
        </Link>
        <Link
          to="/login"
          className="border-border text-foreground hover:bg-surface-subtle inline-flex h-12 items-center rounded-sm border px-6 text-sm font-bold tracking-[1px]"
        >
          LOGIN
        </Link>
      </div>
      <div className="text-faint mt-8 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] tracking-[1.5px]">
        {STATS.map(stat => (
          <span key={stat}>{stat}</span>
        ))}
      </div>
    </div>
  );
}
