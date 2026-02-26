import type { Result } from '$lib/utils/result';
import type { PaginatedResponse } from '$lib/types/api';
import type { CreateProductPayload, Product, UpdateProductPayload } from '../types';
import { api } from '$lib/services/api';
import { toAppError } from '$lib/utils/error';

async function list(cursor?: string, limit = 50): Promise<Result<Product[]>> {
  try {
    const params = new URLSearchParams();
    if (cursor) params.set('cursor', cursor);
    if (limit) params.set('limit', limit.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    const data = await api.get<Product[]>(`/products${query}`);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function get(id: string): Promise<Result<Product>> {
  try {
    const data = await api.get<Product>(`/products/${id}`);
    return [data, null];
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
    const data = await api.patch<Product>(`/products/${id}`, payload);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function uploadPhoto(id: string, file: File): Promise<Result<{ photo_url: string }>> {
  try {
    const formData = new FormData();
    formData.append('photo', file);
    const data = await api.upload<{ photo_url: string }>(`/products/${id}/photo`, formData);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function remove(id: string): Promise<Result<void>> {
  try {
    await api.delete<void>(`/products/${id}`);
    return [undefined, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

export const productService = { list, get, create, update, uploadPhoto, remove };
