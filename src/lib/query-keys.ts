export interface HistoryParams {
  limit?: number;
  before?: string;
}

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const
  },
  users: {
    stats: () => ["users", "me", "stats"] as const,
    history: (params: HistoryParams = {}) =>
      ["users", "me", "activity-history", params] as const,
    historyAll: ["users", "me", "activity-history"] as const
  },
  activities: {
    list: () => ["activities"] as const
  }
};
