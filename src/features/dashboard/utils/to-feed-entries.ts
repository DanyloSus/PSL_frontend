import { statShortName } from "@/utils/stat-short-name";

export interface FeedHistorySource {
  id: string;
  activity_template_id: string;
  quantity: number;
  created_at: string;
  total_xp_applied: number;
  effects: { stat_id: string; xp_applied: number }[];
}

export interface FeedStatSource {
  stat: { id: string; key: string };
}

export interface FeedActivitySource {
  id: string;
  title: string;
}

export interface FeedEffect {
  statId: string;
  shortName: string;
  xp: number;
}

export interface FeedEntry {
  id: string;
  title: string;
  quantity: number;
  createdAt: string;
  totalXp: number;
  isPositive: boolean;
  effects: FeedEffect[];
}

export function toFeedEntries(
  history: FeedHistorySource[],
  stats: FeedStatSource[],
  activities: FeedActivitySource[]
): FeedEntry[] {
  const titleById = new Map(activities.map(item => [item.id, item.title]));
  const shortById = new Map(
    stats.map(entry => [entry.stat.id, statShortName(entry.stat.key)])
  );

  return history.map(entry => ({
    id: entry.id,
    title: titleById.get(entry.activity_template_id) ?? "Activity",
    quantity: entry.quantity,
    createdAt: entry.created_at,
    totalXp: entry.total_xp_applied,
    isPositive: entry.total_xp_applied >= 0,
    effects: entry.effects.map(effect => ({
      statId: effect.stat_id,
      shortName: shortById.get(effect.stat_id) ?? "—",
      xp: effect.xp_applied
    }))
  }));
}
