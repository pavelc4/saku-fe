import type { Result } from '$lib/utils/result';
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from '../types';
import { api } from '$lib/services/api';
import { toAppError } from '$lib/utils/error';

async function list(): Promise<Result<Category[]>> {
  try {
    const data = await api.get<{ data: Category[] }>('/categories');
    return [data.data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function get(id: string): Promise<Result<Category>> {
  try {
    const data = await api.get<Category>(`/categories/${id}`);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function create(payload: CreateCategoryPayload): Promise<Result<Category>> {
  try {
    const data = await api.post<Category>('/categories', payload);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function update(id: string, payload: UpdateCategoryPayload): Promise<Result<Category>> {
  try {
    const data = await api.put<Category>(`/categories/${id}`, payload);
    return [data, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function remove(id: string): Promise<Result<void>> {
  try {
    await api.delete<void>(`/categories/${id}`);
    return [null, null];
  } catch (e) {
    return [null, toAppError(e)];
  }
}

export const categoryService = {
  list,
  get,
  create,
  update,
  remove
};
