export interface StatOut {
  id: string;
  key: string;
  display_name: string;
  icon: string;
}

export interface UserStatOut {
  stat: StatOut;
  xp: number;
  level: number;
  xp_into_level: number;
  xp_for_next: number;
}

export interface ActivityHistoryEffect {
  stat_id: string;
  xp_applied: number;
}

export interface ActivityHistoryEntry {
  id: string;
  activity_template_id: string;
  quantity: number;
  total_xp_applied: number;
  created_at: string;
  effects: ActivityHistoryEffect[];
}

export interface ActivityHistoryQuery {
  limit?: number;
  before?: string;
}
