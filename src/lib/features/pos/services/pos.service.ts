import type { Result } from '$lib/utils/result';
import type { CheckoutPayload, CheckoutResponse, EditTransactionPayload, PosSummaryToday } from '../types';
import { api } from '$lib/services/api';
import { toAppError } from '$lib/utils/error';

async function checkout(payload: CheckoutPayload): Promise<Result<CheckoutResponse>> {
  try {
    const data = await api.post<CheckoutResponse>('/pos/checkout', payload);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function editTransaction(transactionId: string, payload: EditTransactionPayload): Promise<Result<void>> {
  try {
    await api.patch<void>(`/pos/transactions/${transactionId}`, payload);
    return [undefined, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function cancelTransaction(transactionId: string, reason: string): Promise<Result<void>> {
  try {
    await api.post<void>(`/pos/transactions/${transactionId}/cancel`, { reason });
    return [undefined, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function getSummaryToday(): Promise<Result<PosSummaryToday>> {
  try {
    const data = await api.get<PosSummaryToday>('/pos/summary/today');
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

export const posService = {
  checkout,
  editTransaction,
  cancelTransaction,
  getSummaryToday
};
