// Matches GET /insights/monthly backend response exactly
export type InsightPeriod = 'week' | 'month' | 'year';
export type InsightResponse = {
  insight: string;   // AI narrative text (may contain \n — use white-space: pre-wrap)
  period: {
    month: number;   // 1–12
    year: number;
  };
};

export type InsightQueryParams = {
  month?: number;
  year?: number;
  lang?: 'id' | 'en';
  force_refresh?: boolean;
};
