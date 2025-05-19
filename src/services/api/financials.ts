import { coreApiClient } from './client';

// Interfaces
export interface ExpenseCategory {
  id: string;
  company: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCategoryCreateData {
  company: string;
  name: string;
  description: string;
}

export interface ExpenseCategoryUpdateData extends ExpenseCategoryCreateData {}

export interface Expense {
  id: string;
  company: string;
  expense_category: string;
  amount: string;
  description: string;
  currency: string;
  payment_mode: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCreateData {
  company: string;
  expense_category: string;
  amount: string;
  description: string;
  currency: string;
  payment_mode: string;
}

export interface ExpenseUpdateData extends ExpenseCreateData {}

export interface Payable {
  id: string;
  company: string;
  purchase: string;
  amount: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface PayableCreateData {
  company: string;
  purchase: string;
  amount: string;
  currency: string;
}

export interface PayableUpdateData extends PayableCreateData {}

export interface PaymentMode {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentIn {
  id: string;
  company: string;
  receivable: string;
  sale: string;
  amount: string;
  currency: string;
  payment_mode: PaymentMode;
  created_at: string;
  updated_at: string;
}

export interface PaymentInCreateData {
  company: string;
  receivable: string;
  sale: string;
  amount: string;
  currency: string;
  payment_mode_id: string;
}

export interface PaymentInUpdateData extends PaymentInCreateData {}

export interface PaymentOut {
  id: string;
  company: string;
  payable: string;
  purchase: string;
  amount: string;
  currency: string;
  payment_mode: PaymentMode;
  created_at: string;
  updated_at: string;
}

export interface PaymentOutCreateData {
  company: string;
  payable: string;
  purchase: string;
  amount: string;
  currency: string;
  payment_mode_id: string;
}

export interface PaymentOutUpdateData extends PaymentOutCreateData {}

export interface Receivable {
  id: string;
  company: string;
  sale: string;
  amount: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface ReceivableCreateData {
  company: string;
  sale: string;
  amount: string;
  currency: string;
}

export interface ReceivableUpdateData extends ReceivableCreateData {}

// API client
export const financialsApi = {
  // Expense Categories
  getExpenseCategories: async (): Promise<ExpenseCategory[]> => {
    const response = await coreApiClient.get<ExpenseCategory[]>('/financials/expense-categories/');
    return response.data;
  },
  
  getExpenseCategory: async (id: string): Promise<ExpenseCategory> => {
    const response = await coreApiClient.get<ExpenseCategory>(`/financials/expense-categories/${id}/`);
    return response.data;
  },
  
  createExpenseCategory: async (data: ExpenseCategoryCreateData): Promise<ExpenseCategory> => {
    const response = await coreApiClient.post<ExpenseCategory>('/financials/expense-categories/', data);
    return response.data;
  },
  
  updateExpenseCategory: async (id: string, data: ExpenseCategoryUpdateData): Promise<ExpenseCategory> => {
    const response = await coreApiClient.put<ExpenseCategory>(`/financials/expense-categories/${id}/`, data);
    return response.data;
  },
  
  deleteExpenseCategory: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/financials/expense-categories/${id}/`);
  },

  // Expenses
  getExpenses: async (): Promise<Expense[]> => {
    const response = await coreApiClient.get<Expense[]>('/financials/expenses/');
    return response.data;
  },
  
  getExpense: async (id: string): Promise<Expense> => {
    const response = await coreApiClient.get<Expense>(`/financials/expenses/${id}/`);
    return response.data;
  },
  
  createExpense: async (data: ExpenseCreateData): Promise<Expense> => {
    const response = await coreApiClient.post<Expense>('/financials/expenses/', data);
    return response.data;
  },
  
  updateExpense: async (id: string, data: ExpenseUpdateData): Promise<Expense> => {
    const response = await coreApiClient.put<Expense>(`/financials/expenses/${id}/`, data);
    return response.data;
  },
  
  deleteExpense: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/financials/expenses/${id}/`);
  },

  // Payables
  getPayables: async (): Promise<Payable[]> => {
    const response = await coreApiClient.get<Payable[]>('/financials/payables/');
    return response.data;
  },
  
  getPayable: async (id: string): Promise<Payable> => {
    const response = await coreApiClient.get<Payable>(`/financials/payables/${id}/`);
    return response.data;
  },
  
  createPayable: async (data: PayableCreateData): Promise<Payable> => {
    const response = await coreApiClient.post<Payable>('/financials/payables/', data);
    return response.data;
  },
  
  updatePayable: async (id: string, data: PayableUpdateData): Promise<Payable> => {
    const response = await coreApiClient.put<Payable>(`/financials/payables/${id}/`, data);
    return response.data;
  },
  
  deletePayable: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/financials/payables/${id}/`);
  },

  // Payments In
  getPaymentsIn: async (): Promise<PaymentIn[]> => {
    const response = await coreApiClient.get<PaymentIn[]>('/financials/payments-in/');
    return response.data;
  },
  
  getPaymentIn: async (id: string): Promise<PaymentIn> => {
    const response = await coreApiClient.get<PaymentIn>(`/financials/payments-in/${id}/`);
    return response.data;
  },
  
  createPaymentIn: async (data: PaymentInCreateData): Promise<PaymentIn> => {
    const response = await coreApiClient.post<PaymentIn>('/financials/payments-in/', data);
    return response.data;
  },
  
  updatePaymentIn: async (id: string, data: PaymentInUpdateData): Promise<PaymentIn> => {
    const response = await coreApiClient.put<PaymentIn>(`/financials/payments-in/${id}/`, data);
    return response.data;
  },
  
  deletePaymentIn: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/financials/payments-in/${id}/`);
  },

  // Payments Out
  getPaymentsOut: async (): Promise<PaymentOut[]> => {
    const response = await coreApiClient.get<PaymentOut[]>('/financials/payments-out/');
    return response.data;
  },
  
  getPaymentOut: async (id: string): Promise<PaymentOut> => {
    const response = await coreApiClient.get<PaymentOut>(`/financials/payments-out/${id}/`);
    return response.data;
  },
  
  createPaymentOut: async (data: PaymentOutCreateData): Promise<PaymentOut> => {
    const response = await coreApiClient.post<PaymentOut>('/financials/payments-out/', data);
    return response.data;
  },
  
  updatePaymentOut: async (id: string, data: PaymentOutUpdateData): Promise<PaymentOut> => {
    const response = await coreApiClient.put<PaymentOut>(`/financials/payments-out/${id}/`, data);
    return response.data;
  },
  
  deletePaymentOut: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/financials/payments-out/${id}/`);
  },

  // Receivables
  getReceivables: async (): Promise<Receivable[]> => {
    const response = await coreApiClient.get<Receivable[]>('/financials/receivables/');
    return response.data;
  },
  
  getReceivable: async (id: string): Promise<Receivable> => {
    const response = await coreApiClient.get<Receivable>(`/financials/receivables/${id}/`);
    return response.data;
  },
  
  createReceivable: async (data: ReceivableCreateData): Promise<Receivable> => {
    const response = await coreApiClient.post<Receivable>('/financials/receivables/', data);
    return response.data;
  },
  
  updateReceivable: async (id: string, data: ReceivableUpdateData): Promise<Receivable> => {
    const response = await coreApiClient.put<Receivable>(`/financials/receivables/${id}/`, data);
    return response.data;
  },
  
  deleteReceivable: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/financials/receivables/${id}/`);
  },
}; 