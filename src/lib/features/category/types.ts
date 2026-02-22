import type { CategoryType } from '$lib/types/common';

export type Category = {
  id: string;
  user_id: string;
  name: string;
  type: CategoryType;
  icon: string | null;
  color: string | null;
  created_at: number;
  updated_at: number;
};

export type CreateCategoryPayload = {
  name: string;
  type: CategoryType;
  icon?: string;
  color?: string;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
