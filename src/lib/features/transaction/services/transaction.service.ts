import type { Result } from '$lib/utils/result';
import type {
  CreateTransactionPayload,
  PaginatedTransaction,
  Transaction,
  TransactionSummary,
  UpdateTransactionPayload,
} from '../types';
import { api } from '$lib/services/api';
import { toAppError } from '$lib/utils/error';
import type { Period } from '$lib/types/common';

// Backend response shape for paginated transactions
type BackendPaginatedResponse = {
  data: Transaction[];
  meta: {
    next_cursor: string | null;
    has_more: boolean;
  };
};

async function list(cursor?: string, limit = 20): Promise<Result<PaginatedTransaction>> {
  try {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) params.set('cursor', cursor);

    // api.get returns json.data — but for paginated, backend wraps in
    // { success: true, data: [...], meta: {...} }
    // Our api.ts returns json.data, so we must fetch the raw envelope here.
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('saku_token') : null;
    const res = await fetch(
      `${api.baseUrl}/transactions?${params.toString()}`,
      { headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } }
    );
    const json = await res.json();
    if (!json.success) throw { message: json.message ?? 'Gagal memuat transaksi', code: json.error, status: res.status };

    return [{
      transactions: json.data as Transaction[],
      next_cursor: json.meta?.next_cursor ?? null,
      has_more: json.meta?.has_more ?? false,
    }, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function get(id: string): Promise<Result<Transaction>> {
  try {
    const data = await api.get<Transaction>(`/transactions/${id}`);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function create(payload: CreateTransactionPayload): Promise<Result<Transaction>> {
  try {
    const data = await api.post<Transaction>('/transactions', payload);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function update(id: string, payload: UpdateTransactionPayload): Promise<Result<{ message: string }>> {
  try {
    const data = await api.put<{ message: string }>(`/transactions/${id}`, payload);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function remove(id: string): Promise<Result<void>> {
  try {
    await api.delete<void>(`/transactions/${id}`);
    return [undefined, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function getSummary(period: Period = 'month'): Promise<Result<TransactionSummary>> {
  try {
    const data = await api.get<TransactionSummary>(`/transactions/summary?period=${period}`);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

/**
 * Upload receipt for a specific transaction.
 * Uses multipart/form-data with key "receipt". Max 5MB.
 */
async function uploadReceipt(
  transactionId: string,
  file: File
): Promise<Result<{ message: string; url: string }>> {
  try {
    const formData = new FormData();
    formData.append('receipt', file);
    const data = await api.upload<{ message: string; url: string }>(
      `/transactions/${transactionId}/receipt`,
      formData
    );
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

export const transactionService = {
  list,
  get,
  create,
  update,
  remove,
  getSummary,
  uploadReceipt,
};
