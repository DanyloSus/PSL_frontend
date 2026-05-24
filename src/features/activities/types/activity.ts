export type ActivityInputType = "BINARY" | "QUANTITY";

export interface ActivityEffectOut {
  stat_id: string;
  xp_change: number;
}

export interface ActivityTemplateOut {
  id: string;
  title: string;
  description: string;
  input_type: ActivityInputType;
  is_enabled: boolean;
  effects: ActivityEffectOut[];
}

export interface LogActivityRequest {
  activityTemplateId: string;
  quantity?: number;
}

export interface AppliedStat {
  id: string;
  key: string;
  display_name: string;
  icon: string;
}

export interface AppliedEffect {
  stat: AppliedStat;
  xp_applied: number;
  xp: number;
  level: number;
  leveled_up: boolean;
}

export interface LogActivityResponse {
  log_id: string;
  total_xp_applied: number;
  applied: AppliedEffect[];
  global_xp: number;
  global_level: number;
  global_leveled_up: boolean;
}
