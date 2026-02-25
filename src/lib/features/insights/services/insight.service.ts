import type { Result } from '$lib/utils/result';
import type { InsightsData, InsightPeriod } from '../types';
import { api } from '$lib/services/api';
import { toAppError } from '$lib/utils/error';

async function getInsights(period: InsightPeriod = 'month'): Promise<Result<InsightsData>> {
  try {
    const data = await api.get<InsightsData>(`/insights?period=${period}`);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

export const insightService = { getInsights };
