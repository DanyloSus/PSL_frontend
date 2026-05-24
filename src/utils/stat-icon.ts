import {
  Book,
  Brain,
  Coins,
  Dumbbell,
  Heart,
  HelpCircle,
  Sparkles,
  Sword,
  Users,
  Waves,
  type LucideIcon
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  sword: Sword,
  heart: Heart,
  book: Book,
  mind: Brain,
  wave: Waves,
  coin: Coins,
  people: Users,
  dumbbell: Dumbbell,
  sparkles: Sparkles
};

export function statIcon(key: string): LucideIcon {
  return ICONS[key.toLowerCase()] ?? HelpCircle;
}
