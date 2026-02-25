import type { Result } from '$lib/utils/result';
import type { PaginatedResponse } from '$lib/types/api';
import type { CreateProductPayload, Product, UpdateProductPayload } from '../types';
import { api } from '$lib/services/api';
import { toAppError } from '$lib/utils/error';

const STORAGE_KEY = 'saku_mock_products';

function getStorage(): Product[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function setStorage(data: Product[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function delay<T>(ms: number, value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

async function list(cursor?: string, limit = 50): Promise<Result<Product[]>> {
  try {
    const products = getStorage();
    return delay(300, [products, null]);
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function create(payload: CreateProductPayload): Promise<Result<Product>> {
  try {
    const products = getStorage();
    const newProduct: Product = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      user_id: 'local_user',
      name: payload.name,
      sku: payload.sku || null,
      price: payload.price,
      stock: payload.stock ?? null,
      category_id: payload.category_id || null,
      image_url: null,
      created_at: Date.now(),
      updated_at: Date.now()
    };
    
    products.unshift(newProduct);
    setStorage(products);
    return delay(300, [newProduct, null]);
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function update(id: string, payload: UpdateProductPayload): Promise<Result<Product>> {
  try {
    const products = getStorage();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) throw new Error('Product not found');
    
    products[index] = {
      ...products[index],
      ...payload,
      updated_at: Date.now()
    };
    
    setStorage(products);
    return delay(300, [products[index], null]);
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function remove(id: string): Promise<Result<void>> {
  try {
    let products = getStorage();
    products = products.filter(p => p.id !== id);
    setStorage(products);
    return delay(300, [undefined, null]);
  } catch (e) {
    return [null, toAppError(e)];
  }
}

export const productService = { list, create, update, remove };
