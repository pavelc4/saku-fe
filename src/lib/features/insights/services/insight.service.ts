import type { Result } from '$lib/utils/result';
import type { InsightResponse, InsightQueryParams } from '../types';
import { api } from '$lib/services/api';
import { toAppError } from '$lib/utils/error';

/**
 * GET /insights/monthly
 * Returns AI-generated monthly financial analysis.
 * Results are cached in D1 — not every request triggers AI.
 * Response time: 1–3s on cache miss.
 */
async function getMonthlyInsight(params: InsightQueryParams = {}): Promise<Result<InsightResponse>> {
  try {
    const now = new Date();
    const query = new URLSearchParams({
      month: String(params.month ?? now.getMonth() + 1),
      year: String(params.year ?? now.getFullYear()),
      lang: params.lang ?? 'id',
      ...(params.force_refresh ? { force_refresh: 'true' } : {}),
    });
    const data = await api.get<InsightResponse>(`/insights/monthly?${query.toString()}`);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

export const insightService = { getMonthlyInsight };
