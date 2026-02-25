export type InsightPeriod = 'week' | 'month' | 'year';

export type CategoryInsight = {
  category_id: string;
  category_name: string;
  amount: number;
  percentage: number;
  color: string;
};

export type DailyTrend = {
  date: string; // YYYY-MM-DD
  income: number;
  expense: number;
};

export type InsightsData = {
  period: InsightPeriod;
  total_income: number;
  total_expense: number;
  net_savings: number;
  savings_rate: number; // percentage
  top_expenses: CategoryInsight[];
  trend: DailyTrend[];
  ai_recommendation: string | null;
};
