import type { Result } from '$lib/utils/result';
import type { Budget, CreateBudgetPayload, UpdateBudgetPayload } from '../types';
import { api } from '$lib/services/api';
import { toAppError } from '$lib/utils/error';

async function list(): Promise<Result<Budget[]>> {
  try {
    const data = await api.get<{ data: Budget[] }>('/budgets');
    return [data.data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function create(payload: CreateBudgetPayload): Promise<Result<Budget>> {
  try {
    const data = await api.post<Budget>('/budgets', payload);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function update(id: string, payload: UpdateBudgetPayload): Promise<Result<Budget>> {
  try {
    const data = await api.put<Budget>(`/budgets/${id}`, payload);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function remove(id: string): Promise<Result<void>> {
  try {
    await api.delete<void>(`/budgets/${id}`);
    return [null, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

export const budgetService = { list, create, update, remove };
