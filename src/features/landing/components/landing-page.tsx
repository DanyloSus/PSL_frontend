import { GridBg } from "@/components/grid-bg";
import { Scanlines } from "@/components/scanlines";

import { LandingFeatures } from "./landing-features";
import { LandingHero } from "./landing-hero";
import { LandingNav } from "./landing-nav";
import { LandingPreview } from "./landing-preview";

const FOOTER_TAG = "PSL · v0.1.0 · BUILT FOR THE GROWTH OBSESSED";
const FOOTER_COPY = "© 2026 PSL SYSTEMS";

export function LandingPage() {
  return (
    <div className="bg-background relative min-h-dvh w-full overflow-x-hidden">
      <GridBg />
      <Scanlines />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-16 px-5 py-6">
        <LandingNav />
        <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <LandingHero />
          <LandingPreview />
        </section>
        <LandingFeatures />
        <footer className="border-border-soft text-faint mt-auto flex flex-col gap-1 border-t pt-5 font-mono text-[10px] tracking-[1.5px] sm:flex-row sm:justify-between">
          <span>{FOOTER_TAG}</span>
          <span>{FOOTER_COPY}</span>
        </footer>
      </div>
    </div>
  );
}
