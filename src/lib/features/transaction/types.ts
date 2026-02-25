import type { TransactionType } from '$lib/types/common';

export type { TransactionType };

export type TransactionItem = {
  id: string;
  transaction_id: string;
  product_id: string | null;
  name: string;
  quantity: number;
  price: number; // per-unit
  created_at: number;
};

export type Transaction = {
  id: string;
  user_id: string;
  category_id: string;
  type: TransactionType;
  amount: number; // integer Rupiah
  date: number;   // timestamp ms (actual transaction date)
  note: string | null;
  source: 'manual' | 'ai_parsed';
  receipt_file_url: string | null; // internal R2 key — NOT a public URL
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
  items: TransactionItem[]; // always array, never undefined
};

// Matches backend GET /transactions/summary response
export type TransactionSummary = {
  total_income: number;
  total_expense: number;
  net: number;              // income - expense (can be negative)
  transaction_count: number;
};

export type CreateTransactionItemPayload = {
  product_id?: string;
  name: string;
  quantity: number;
  price: number; // per-unit integer
};

export type CreateTransactionPayload = {
  category_id: string; // required
  type: TransactionType;
  amount: number;      // integer Rupiah
  date: number;        // timestamp ms
  note?: string;
  source?: 'manual' | 'ai_parsed';
  items?: CreateTransactionItemPayload[];
};

// Items cannot be updated after creation
export type UpdateTransactionPayload = {
  category_id?: string;
  type?: TransactionType;
  amount?: number;
  date?: number;
  note?: string;
};

// Paginated list response (mapped from backend envelope)
export type PaginatedTransaction = {
  transactions: Transaction[];
  next_cursor: string | null;
  has_more: boolean;
};
