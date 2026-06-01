import { Frown, Gauge, Zap } from "lucide-react";

import { FeatureCard } from "./feature-card";

const FEATURES = [
  {
    icon: Zap,
    title: "Log fast",
    description: "Pick an activity, set the amount, done in under 30 seconds."
  },
  {
    icon: Gauge,
    title: "Stats react instantly",
    description:
      "XP bars fill, levels climb, your character evolves with every entry."
  },
  {
    icon: Frown,
    title: "Negative actions count too",
    description: "No shame — just honest progression. Bad days affect bad days."
  }
] as const;

export function LandingFeatures() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {FEATURES.map(feature => (
        <FeatureCard
          key={feature.title}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </section>
  );
}
