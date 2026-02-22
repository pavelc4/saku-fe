import type { Period, TransactionType } from '$lib/types/common';

export type TransactionItem = {
  id: string;
  transaction_id: string;
  product_id: string | null;
  name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

export type Transaction = {
  id: string;
  user_id: string;
  category_id: string | null;
  type: TransactionType;
  amount: number;
  date: number; // timestamp
  description: string;
  receipt_url: string | null;
  created_at: number;
  updated_at: number;
  items?: TransactionItem[];
};

export type TransactionSummary = {
  total_income: number;
  total_expense: number;
  balance: number;
  period: Period;
};

export type CreateTransactionPayload = {
  category_id?: string;
  type: TransactionType;
  amount: number;
  date: number;
  description?: string;
  receipt_url?: string;
  items?: Omit<TransactionItem, 'id' | 'transaction_id'>[];
};

export type UpdateTransactionPayload = Partial<CreateTransactionPayload>;

export type PaginatedTransaction = {
  transactions: Transaction[];
  next_cursor: string | null;
  has_more: boolean;
};
