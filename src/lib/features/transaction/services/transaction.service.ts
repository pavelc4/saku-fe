import type { Result } from '$lib/utils/result';
import type { PaginatedResponse } from '$lib/types/api';
import type { Period } from '$lib/types/common';
import type { 
  CreateTransactionPayload, 
  PaginatedTransaction, 
  Transaction, 
  TransactionSummary, 
  UpdateTransactionPayload 
} from '../types';
import { api } from '$lib/services/api';
import { toAppError } from '$lib/utils/error';

async function list(cursor?: string, limit = 20): Promise<Result<PaginatedTransaction>> {
  try {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) params.append('cursor', cursor);
    
    const data = await api.get<PaginatedResponse<Transaction>>(`/transactions?${params.toString()}`);
    return [{
      transactions: data.data,
      next_cursor: data.pagination.next_cursor,
      has_more: data.pagination.has_more
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

async function update(id: string, payload: UpdateTransactionPayload): Promise<Result<Transaction>> {
  try {
    const data = await api.put<Transaction>(`/transactions/${id}`, payload);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function remove(id: string): Promise<Result<void>> {
  try {
    await api.delete<void>(`/transactions/${id}`);
    return [null, null];
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

async function uploadReceipt(file: File): Promise<Result<string>> {
  try {
    const formData = new FormData();
    formData.append('receipt', file);
    
    // Asumsikan backend mengembalikan URL file yang diupload.
    // Jika backend mengembalikan object { url: string }, sesuaikan type return api.upload
    const data = await api.upload<{ url: string }>('/transactions/receipt', formData);
    return [data.url, null];
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
  uploadReceipt
};
