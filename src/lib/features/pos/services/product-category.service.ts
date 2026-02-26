import type { Result } from '$lib/utils/result';
import type { ProductCategory, CreateProductCategoryPayload, UpdateProductCategoryPayload } from '../types';
import { api } from '$lib/services/api';
import { toAppError } from '$lib/utils/error';

async function list(): Promise<Result<ProductCategory[]>> {
  try {
    const data = await api.get<ProductCategory[]>('/product-categories');
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function get(id: string): Promise<Result<ProductCategory>> {
  try {
    const data = await api.get<ProductCategory>(`/product-categories/${id}`);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function create(payload: CreateProductCategoryPayload): Promise<Result<ProductCategory>> {
  try {
    const data = await api.post<ProductCategory>('/product-categories', payload);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function update(id: string, payload: UpdateProductCategoryPayload): Promise<Result<ProductCategory>> {
  try {
    const data = await api.patch<ProductCategory>(`/product-categories/${id}`, payload);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function remove(id: string): Promise<Result<void>> {
  try {
    await api.delete<void>(`/product-categories/${id}`);
    return [undefined, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

export const productCategoryService = {
  list,
  get,
  create,
  update,
  remove
};
