import type { Period } from '$lib/types/common';

export type Budget = {
  id: string;
  user_id: string;
  category_id: string;
  period: Period;
  amount: number;
  spent: number;
  created_at: number;
  updated_at: number;
};

export type CreateBudgetPayload = {
  category_id: string;
  period: Period;
  amount: number;
};

export type UpdateBudgetPayload = Partial<CreateBudgetPayload>;
