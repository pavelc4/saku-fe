import apiClient from './client'

export const posApi = {
  openSession: (data: { opening_cash: number; cashier_name?: string }) =>
    apiClient.post('/pos/session/open', data),

  closeSession: (data: { closing_cash: number | null }) =>
    apiClient.post('/pos/session/close', data),

  getActiveSession: () =>
    apiClient.get('/pos/session'),

  createTransaction: (data: {
    items: { product_id: string; quantity: number; discount?: number }[];
    payment_method: 'cash' | 'transfer' | 'qris';
    note?: string;
    category_id?: string;
    discount?: number;
    discount_type?: 'none' | 'fixed' | 'percent';
    tax_rate?: number;
  }) => apiClient.post('/pos/checkout', data),

  getTransactions: (params?: { page?: number; limit?: number; session_id?: string }) =>
    apiClient.get('/pos/transactions', { params }),

  getSummaryToday: () =>
    apiClient.get('/pos/summary/today'),
}
