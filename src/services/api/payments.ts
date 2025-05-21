import { apiCall } from '@/utils/api-call';

export interface Payment {
  id: string;
  amount: string;
  type: 'in' | 'out';
  reference: string;
  payment_date: string;
  created_at: string;
  updated_at: string;
  store_id: string;
  payment_mode_id: string;
  payment_mode?: {
    id: string;
    name: string;
  };
  user_id: string;
  notes?: string;
}

// Payments API service
export const paymentsApi = {
  // Get all payments for a store
  async getPayments(storeId: string): Promise<Payment[]> {
    const response = await apiCall({
      method: 'GET',
      url: `/payments?store_id=${storeId}`,
    });
    return response.data;
  },

  // Get payment by ID
  async getPaymentById(id: string): Promise<Payment> {
    const response = await apiCall({
      method: 'GET',
      url: `/payments/${id}`,
    });
    return response.data;
  },

  // Create a new payment
  async createPayment(paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at'>): Promise<Payment> {
    const response = await apiCall({
      method: 'POST',
      url: '/payments',
      data: paymentData,
    });
    return response.data;
  },

  // Update an existing payment
  async updatePayment(id: string, paymentData: Partial<Payment>): Promise<Payment> {
    const response = await apiCall({
      method: 'PUT',
      url: `/payments/${id}`,
      data: paymentData,
    });
    return response.data;
  },

  // Delete a payment
  async deletePayment(id: string): Promise<void> {
    await apiCall({
      method: 'DELETE',
      url: `/payments/${id}`,
    });
  },
}; 