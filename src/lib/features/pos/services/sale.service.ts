import type { Result } from '$lib/utils/result';
import type { Sale, SalePayload } from '../types';
import { api } from '$lib/services/api';
import { toAppError } from '$lib/utils/error';

async function create(payload: SalePayload): Promise<Result<Sale>> {
  try {
    const data = await api.post<Sale>('/pos/sales', payload);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function list(): Promise<Result<Sale[]>> {
  try {
    const data = await api.get<{ data: Sale[] }>('/pos/sales');
    return [data.data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

export const saleService = { create, list };
