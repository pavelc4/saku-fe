// Product Category
export type ProductCategory = {
  id: string;
  user_id: string | null;
  name: string;
  color: string;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
};

export type CreateProductCategoryPayload = {
  name: string;
  color: string;
};

export type UpdateProductCategoryPayload = {
  name: string;
  color: string;
};

// Product
export type Product = {
  id: string;
  user_id: string;
  name: string;
  price: number;
  stock: number | null;
  sku: string | null;
  photo_url: string | null;
  product_category_id: string | null;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
};

export type CreateProductPayload = {
  name: string;
  price: number;
  stock?: number;
  sku?: string;
  product_category_id?: string;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

// Cart
export type CartItem = {
  product: Product;
  quantity: number;
};

// POS Session
export type PosSession = {
  id: string;
  user_id: string;
  opened_at: number;
  closed_at: number | null;
  initial_cash: number;
  final_cash: number | null;
  total_sales: number | null;
  transaction_count: number | null;
};

export type OpenSessionPayload = {
  initial_cash: number;
};

export type CloseSessionPayload = {
  final_cash: number;
};

// POS Checkout
export type CheckoutPayload = {
  items: {
    product_id: string;
    quantity: number;
    price: number;
  }[];
  payment_method: 'cash' | 'qris' | 'transfer' | 'debit' | 'credit';
  note?: string;
};

export type CheckoutResponse = {
  transaction_id: string;
  total_amount: number;
  items: {
    id: string;
    product_id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
};

// POS Edit/Cancel
export type EditTransactionPayload = {
  items: {
    product_id: string;
    quantity: number;
    price: number;
  }[];
  edit_reason: string;
};

// POS Summary
export type PosSummaryToday = {
  session_id: string | null;
  kasir_status: 'open' | 'closed';
  opened_at: number | null;
  total_transaksi: number;
  total_omzet: number;
  breakdown_payment: {
    cash: number;
    transfer: number;
    qris: number;
  };
  pending_count: number;
  confirmed_count: number;
};
