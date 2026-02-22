export type Product = {
  id: string;
  user_id: string;
  name: string;
  price: number;
  stock: number | null;
  sku: string | null;
  image_url: string | null;
  category_id: string | null;
  created_at: number;
  updated_at: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type SalePayload = {
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
  }[];
  payment_amount: number;
  note?: string;
};

export type Sale = {
  id: string;
  user_id: string;
  total_amount: number;
  payment_amount: number;
  change_amount: number;
  note: string | null;
  items: {
    id: string;
    product_id: string;
    name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }[];
  created_at: number;
};

export type CreateProductPayload = {
  name: string;
  price: number;
  stock?: number;
  sku?: string;
  category_id?: string;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;
