import type { Result } from '$lib/utils/result';
import type { Budget, CreateBudgetPayload, UpdateBudgetPayload } from '../types';
import { api } from '$lib/services/api';
import { toAppError } from '$lib/utils/error';

const STORAGE_KEY = 'saku_mock_budgets';

function getStorage(): Budget[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function setStorage(data: Budget[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function delay<T>(ms: number, value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

async function list(): Promise<Result<Budget[]>> {
  try {
    const budgets = getStorage();
    return delay(300, [budgets, null]);
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function create(payload: CreateBudgetPayload): Promise<Result<Budget>> {
  try {
    const budgets = getStorage();
    const newBudget: Budget = {
      id: `budg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      user_id: 'local_user',
      category_id: payload.category_id,
      amount: payload.amount,
      period: payload.period || { month: new Date().getMonth() + 1, year: new Date().getFullYear() },
      spent: 0,
      created_at: Date.now(),
      updated_at: Date.now()
    };
    
    budgets.unshift(newBudget);
    setStorage(budgets);
    return delay(300, [newBudget, null]);
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function update(id: string, payload: UpdateBudgetPayload): Promise<Result<Budget>> {
  try {
    const budgets = getStorage();
    const index = budgets.findIndex(b => b.id === id);
    
    if (index === -1) throw new Error('Budget not found');
    
    budgets[index] = {
      ...budgets[index],
      ...payload,
      updated_at: Date.now()
    };
    
    setStorage(budgets);
    return delay(300, [budgets[index], null]);
  } catch (e) {
    return [null, toAppError(e)];
  }
}

async function remove(id: string): Promise<Result<void>> {
  try {
    let budgets = getStorage();
    budgets = budgets.filter(b => b.id !== id);
    setStorage(budgets);
    return delay(300, [undefined, null]);
  } catch (e) {
    return [null, toAppError(e)];
  }
}

export const budgetService = { list, create, update, remove };
