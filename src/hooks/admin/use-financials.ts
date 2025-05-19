import { useApiQuery, useApiMutation } from '@/utils/api';
import { useQueryClient } from '@tanstack/react-query';
import { 
  ExpenseCategory, 
  Expense, 
  Payable, 
  PaymentIn, 
  PaymentOut, 
  Receivable 
} from '@/services/api/financials';

// Expense Categories
export interface ExpenseCategoryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export function useExpenseCategories(storeId: string, params: ExpenseCategoryParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

  const endpoint = `/financials/stores/${storeId}/expense-categories?${queryParams.toString()}`;
  
  return useApiQuery<ExpenseCategory[]>(
    ['expense-categories', storeId, JSON.stringify(params)], 
    endpoint,
    {
      enabled: !!storeId,
    }
  );
}

export function useExpenseCategory(storeId: string, id: string) {
  return useApiQuery<ExpenseCategory>(
    ['expense-category', storeId, id], 
    `/financials/stores/${storeId}/expense-categories/${id}`,
    {
      enabled: !!storeId && !!id,
    }
  );
}

export function useCreateExpenseCategory(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<ExpenseCategory, { name: string; description: string }>(
    `/financials/stores/${storeId}/expense-categories`,
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['expense-categories', storeId] });
      },
    }
  );
}

export function useUpdateExpenseCategory(storeId: string, id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<ExpenseCategory, { name: string; description: string }>(
    `/financials/stores/${storeId}/expense-categories/${id}`,
    'PUT',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['expense-category', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['expense-categories', storeId] });
      },
    }
  );
}

export function useDeleteExpenseCategory(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, string>(
    `/financials/stores/${storeId}/expense-categories`,
    'DELETE',
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['expense-categories', storeId] });
        queryClient.invalidateQueries({ queryKey: ['expense-category', storeId, id] });
      },
    }
  );
}

// Expenses
export interface ExpenseParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: string;
  date_from?: string;
  date_to?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export function useExpenses(storeId: string, params: ExpenseParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.category_id) queryParams.append('category_id', params.category_id);
  if (params.date_from) queryParams.append('date_from', params.date_from);
  if (params.date_to) queryParams.append('date_to', params.date_to);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

  const endpoint = `/financials/stores/${storeId}/expenses?${queryParams.toString()}`;
  
  return useApiQuery<Expense[]>(
    ['expenses', storeId, JSON.stringify(params)], 
    endpoint,
    {
      enabled: !!storeId,
    }
  );
}

export function useExpense(storeId: string, id: string) {
  return useApiQuery<Expense>(
    ['expense', storeId, id], 
    `/financials/stores/${storeId}/expenses/${id}`,
    {
      enabled: !!storeId && !!id,
    }
  );
}

export interface ExpenseCreateData {
  expense_category: string;
  amount: string;
  description: string;
  currency: string;
  payment_mode: string;
}

export function useCreateExpense(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Expense, ExpenseCreateData>(
    `/financials/stores/${storeId}/expenses`,
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['expenses', storeId] });
      },
    }
  );
}

export function useUpdateExpense(storeId: string, id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Expense, ExpenseCreateData>(
    `/financials/stores/${storeId}/expenses/${id}`,
    'PUT',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['expense', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['expenses', storeId] });
      },
    }
  );
}

export function useDeleteExpense(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, string>(
    `/financials/stores/${storeId}/expenses`,
    'DELETE',
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['expenses', storeId] });
        queryClient.invalidateQueries({ queryKey: ['expense', storeId, id] });
      },
    }
  );
}

// Payables
export interface PayableParams {
  page?: number;
  limit?: number;
  search?: string;
  date_from?: string;
  date_to?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export function usePayables(storeId: string, params: PayableParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.date_from) queryParams.append('date_from', params.date_from);
  if (params.date_to) queryParams.append('date_to', params.date_to);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

  const endpoint = `/financials/stores/${storeId}/payables?${queryParams.toString()}`;
  
  return useApiQuery<Payable[]>(
    ['payables', storeId, JSON.stringify(params)], 
    endpoint,
    {
      enabled: !!storeId,
    }
  );
}

export function usePayable(storeId: string, id: string) {
  return useApiQuery<Payable>(
    ['payable', storeId, id], 
    `/financials/stores/${storeId}/payables/${id}`,
    {
      enabled: !!storeId && !!id,
    }
  );
}

export interface PayableCreateData {
  purchase: string;
  amount: string;
  currency: string;
}

export function useCreatePayable(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Payable, PayableCreateData>(
    `/financials/stores/${storeId}/payables`,
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['payables', storeId] });
      },
    }
  );
}

export function useUpdatePayable(storeId: string, id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Payable, PayableCreateData>(
    `/financials/stores/${storeId}/payables/${id}`,
    'PUT',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['payable', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['payables', storeId] });
      },
    }
  );
}

export function useDeletePayable(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, string>(
    `/financials/stores/${storeId}/payables`,
    'DELETE',
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['payables', storeId] });
        queryClient.invalidateQueries({ queryKey: ['payable', storeId, id] });
      },
    }
  );
}

// Payments In
export interface PaymentInParams {
  page?: number;
  limit?: number;
  search?: string;
  date_from?: string;
  date_to?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export function usePaymentsIn(storeId: string, params: PaymentInParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.date_from) queryParams.append('date_from', params.date_from);
  if (params.date_to) queryParams.append('date_to', params.date_to);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

  const endpoint = `/financials/stores/${storeId}/payments-in?${queryParams.toString()}`;
  
  return useApiQuery<PaymentIn[]>(
    ['payments-in', storeId, JSON.stringify(params)], 
    endpoint,
    {
      enabled: !!storeId,
    }
  );
}

export function usePaymentIn(storeId: string, id: string) {
  return useApiQuery<PaymentIn>(
    ['payment-in', storeId, id], 
    `/financials/stores/${storeId}/payments-in/${id}`,
    {
      enabled: !!storeId && !!id,
    }
  );
}

export interface PaymentInCreateData {
  receivable: string;
  sale: string;
  amount: string;
  currency: string;
  payment_mode_id: string;
}

export function useCreatePaymentIn(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<PaymentIn, PaymentInCreateData>(
    `/financials/stores/${storeId}/payments-in`,
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['payments-in', storeId] });
      },
    }
  );
}

export function useUpdatePaymentIn(storeId: string, id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<PaymentIn, PaymentInCreateData>(
    `/financials/stores/${storeId}/payments-in/${id}`,
    'PUT',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['payment-in', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['payments-in', storeId] });
      },
    }
  );
}

export function useDeletePaymentIn(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, string>(
    `/financials/stores/${storeId}/payments-in`,
    'DELETE',
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['payments-in', storeId] });
        queryClient.invalidateQueries({ queryKey: ['payment-in', storeId, id] });
      },
    }
  );
}

// Payments Out
export interface PaymentOutParams {
  page?: number;
  limit?: number;
  search?: string;
  date_from?: string;
  date_to?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export function usePaymentsOut(storeId: string, params: PaymentOutParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.date_from) queryParams.append('date_from', params.date_from);
  if (params.date_to) queryParams.append('date_to', params.date_to);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

  const endpoint = `/financials/stores/${storeId}/payments-out?${queryParams.toString()}`;
  
  return useApiQuery<PaymentOut[]>(
    ['payments-out', storeId, JSON.stringify(params)], 
    endpoint,
    {
      enabled: !!storeId,
    }
  );
}

export function usePaymentOut(storeId: string, id: string) {
  return useApiQuery<PaymentOut>(
    ['payment-out', storeId, id], 
    `/financials/stores/${storeId}/payments-out/${id}`,
    {
      enabled: !!storeId && !!id,
    }
  );
}

export interface PaymentOutCreateData {
  payable: string;
  purchase: string;
  amount: string;
  currency: string;
  payment_mode_id: string;
}

export function useCreatePaymentOut(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<PaymentOut, PaymentOutCreateData>(
    `/financials/stores/${storeId}/payments-out`,
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['payments-out', storeId] });
      },
    }
  );
}

export function useUpdatePaymentOut(storeId: string, id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<PaymentOut, PaymentOutCreateData>(
    `/financials/stores/${storeId}/payments-out/${id}`,
    'PUT',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['payment-out', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['payments-out', storeId] });
      },
    }
  );
}

export function useDeletePaymentOut(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, string>(
    `/financials/stores/${storeId}/payments-out`,
    'DELETE',
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['payments-out', storeId] });
        queryClient.invalidateQueries({ queryKey: ['payment-out', storeId, id] });
      },
    }
  );
}

// Receivables
export interface ReceivableParams {
  page?: number;
  limit?: number;
  search?: string;
  date_from?: string;
  date_to?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export function useReceivables(storeId: string, params: ReceivableParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.date_from) queryParams.append('date_from', params.date_from);
  if (params.date_to) queryParams.append('date_to', params.date_to);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

  const endpoint = `/financials/stores/${storeId}/receivables?${queryParams.toString()}`;
  
  return useApiQuery<Receivable[]>(
    ['receivables', storeId, JSON.stringify(params)], 
    endpoint,
    {
      enabled: !!storeId,
    }
  );
}

export function useReceivable(storeId: string, id: string) {
  return useApiQuery<Receivable>(
    ['receivable', storeId, id], 
    `/financials/stores/${storeId}/receivables/${id}`,
    {
      enabled: !!storeId && !!id,
    }
  );
}

export interface ReceivableCreateData {
  sale: string;
  amount: string;
  currency: string;
}

export function useCreateReceivable(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Receivable, ReceivableCreateData>(
    `/financials/stores/${storeId}/receivables`,
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['receivables', storeId] });
      },
    }
  );
}

export function useUpdateReceivable(storeId: string, id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Receivable, ReceivableCreateData>(
    `/financials/stores/${storeId}/receivables/${id}`,
    'PUT',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['receivable', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['receivables', storeId] });
      },
    }
  );
}

export function useDeleteReceivable(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, string>(
    `/financials/stores/${storeId}/receivables`,
    'DELETE',
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['receivables', storeId] });
        queryClient.invalidateQueries({ queryKey: ['receivable', storeId, id] });
      },
    }
  );
} 