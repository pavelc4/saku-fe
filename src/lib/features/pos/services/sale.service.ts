import type { Result } from '$lib/utils/result';
import type { Sale, SalePayload } from '../types';
import { toAppError } from '$lib/utils/error';

const STORAGE_KEY = 'saku_mock_sales';

function getStorage(): Sale[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function setStorage(data: Sale[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function delay<T>(ms: number, value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

async function create(payload: SalePayload): Promise<Result<Sale>> {
  try {
    const sales = getStorage();
    
    // Calculate total amount
    const total_amount = payload.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    
    const newSale: Sale = {
      id: `sale_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      user_id: 'local_user',
      total_amount,
      payment_amount: payload.payment_amount,
      change_amount: payload.payment_amount - total_amount,
      note: payload.note || null,
      items: payload.items.map(item => ({
        id: `sitem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        product_id: item.product_id,
        name: `Product ${item.product_id.split('_').pop()}`, // Mock name
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.quantity * item.unit_price
      })),
      created_at: Date.now()
    };
    
    sales.unshift(newSale);
    setStorage(sales);
    
    return delay(300, [newSale, null]);
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function list(): Promise<Result<Sale[]>> {
  try {
    const sales = getStorage();
    return delay(300, [sales, null]);
  } catch (e) {
    return [null, toAppError(e)];
  }
}

export const saleService = { create, list };
