import type { Result } from '$lib/utils/result';
import type { PaginatedResponse } from '$lib/types/api';
import type { CreateProductPayload, Product, UpdateProductPayload } from '../types';
import { api } from '$lib/services/api';
import { toAppError } from '$lib/utils/error';

async function list(cursor?: string, limit = 50): Promise<Result<Product[]>> {
  try {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) params.append('cursor', cursor);
    const data = await api.get<PaginatedResponse<Product>>(`/products?${params.toString()}`);
    return [data.data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function create(payload: CreateProductPayload): Promise<Result<Product>> {
  try {
    const data = await api.post<Product>('/products', payload);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function update(id: string, payload: UpdateProductPayload): Promise<Result<Product>> {
  try {
    const data = await api.put<Product>(`/products/${id}`, payload);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function remove(id: string): Promise<Result<void>> {
  try {
    await api.delete<void>(`/products/${id}`);
    return [null, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

export const productService = { list, create, update, remove };
