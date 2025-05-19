import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ExpenseCategory,
  ExpenseCategoryCreateData,
  ExpenseCategoryUpdateData,
  Expense,
  ExpenseCreateData,
  ExpenseUpdateData,
  Payable,
  PayableCreateData,
  PayableUpdateData,
  PaymentIn,
  PaymentInCreateData,
  PaymentInUpdateData,
  PaymentOut,
  PaymentOutCreateData,
  PaymentOutUpdateData,
  Receivable,
  ReceivableCreateData,
  ReceivableUpdateData,
  financialsApi
} from '@/services/api/financials';

// Query keys
export const financialsKeys = {
  all: ['financials'] as const,
  
  expenseCategories: {
    all: ['expense-categories'] as const,
    lists: (storeId: string) => [...financialsKeys.expenseCategories.all, 'list', storeId] as const,
    detail: (storeId: string, id: string) => [...financialsKeys.expenseCategories.all, 'detail', storeId, id] as const,
  },
  
  expenses: {
    all: ['expenses'] as const,
    lists: (storeId: string) => [...financialsKeys.expenses.all, 'list', storeId] as const,
    detail: (storeId: string, id: string) => [...financialsKeys.expenses.all, 'detail', storeId, id] as const,
  },
  
  payables: {
    all: ['payables'] as const,
    lists: (storeId: string) => [...financialsKeys.payables.all, 'list', storeId] as const,
    detail: (storeId: string, id: string) => [...financialsKeys.payables.all, 'detail', storeId, id] as const,
  },
  
  paymentsIn: {
    all: ['payments-in'] as const,
    lists: (storeId: string) => [...financialsKeys.paymentsIn.all, 'list', storeId] as const,
    detail: (storeId: string, id: string) => [...financialsKeys.paymentsIn.all, 'detail', storeId, id] as const,
  },
  
  paymentsOut: {
    all: ['payments-out'] as const,
    lists: (storeId: string) => [...financialsKeys.paymentsOut.all, 'list', storeId] as const,
    detail: (storeId: string, id: string) => [...financialsKeys.paymentsOut.all, 'detail', storeId, id] as const,
  },
  
  receivables: {
    all: ['receivables'] as const,
    lists: (storeId: string) => [...financialsKeys.receivables.all, 'list', storeId] as const,
    detail: (storeId: string, id: string) => [...financialsKeys.receivables.all, 'detail', storeId, id] as const,
  },
};

// Expense Categories hooks
export function useExpenseCategories(storeId: string) {
  return useQuery<ExpenseCategory[], Error>({
    queryKey: financialsKeys.expenseCategories.lists(storeId),
    queryFn: () => financialsApi.getExpenseCategories(storeId),
    enabled: !!storeId,
  });
}

export function useExpenseCategory(storeId: string, id: string) {
  return useQuery<ExpenseCategory, Error>({
    queryKey: financialsKeys.expenseCategories.detail(storeId, id),
    queryFn: () => financialsApi.getExpenseCategory(storeId, id),
    enabled: !!storeId && !!id,
  });
}

export function useCreateExpenseCategory() {
  const queryClient = useQueryClient();
  
  return useMutation<ExpenseCategory, Error, ExpenseCategoryCreateData>({
    mutationFn: (data) => financialsApi.createExpenseCategory(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financialsKeys.expenseCategories.lists(variables.store_id) });
    },
  });
}

export function useUpdateExpenseCategory() {
  const queryClient = useQueryClient();
  
  return useMutation<ExpenseCategory, Error, { storeId: string; id: string; data: ExpenseCategoryUpdateData }>({
    mutationFn: ({ storeId, id, data }) => financialsApi.updateExpenseCategory(storeId, id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(financialsKeys.expenseCategories.detail(variables.storeId, variables.id), data);
      queryClient.invalidateQueries({ queryKey: financialsKeys.expenseCategories.lists(variables.storeId) });
    },
  });
}

export function useDeleteExpenseCategory() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { storeId: string; id: string }>({
    mutationFn: ({ storeId, id }) => financialsApi.deleteExpenseCategory(storeId, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financialsKeys.expenseCategories.lists(variables.storeId) });
    },
  });
}

// Expenses hooks
export function useExpenses(storeId: string) {
  return useQuery<Expense[], Error>({
    queryKey: financialsKeys.expenses.lists(storeId),
    queryFn: () => financialsApi.getExpenses(storeId),
    enabled: !!storeId,
  });
}

export function useExpense(storeId: string, id: string) {
  return useQuery<Expense, Error>({
    queryKey: financialsKeys.expenses.detail(storeId, id),
    queryFn: () => financialsApi.getExpense(storeId, id),
    enabled: !!storeId && !!id,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  
  return useMutation<Expense, Error, ExpenseCreateData>({
    mutationFn: (data) => financialsApi.createExpense(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financialsKeys.expenses.lists(variables.store_id) });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  
  return useMutation<Expense, Error, { storeId: string; id: string; data: ExpenseUpdateData }>({
    mutationFn: ({ storeId, id, data }) => financialsApi.updateExpense(storeId, id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(financialsKeys.expenses.detail(variables.storeId, variables.id), data);
      queryClient.invalidateQueries({ queryKey: financialsKeys.expenses.lists(variables.storeId) });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { storeId: string; id: string }>({
    mutationFn: ({ storeId, id }) => financialsApi.deleteExpense(storeId, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financialsKeys.expenses.lists(variables.storeId) });
    },
  });
}

// Payables hooks
export function usePayables(storeId: string) {
  return useQuery<Payable[], Error>({
    queryKey: financialsKeys.payables.lists(storeId),
    queryFn: () => financialsApi.getPayables(storeId),
    enabled: !!storeId,
  });
}

export function usePayable(storeId: string, id: string) {
  return useQuery<Payable, Error>({
    queryKey: financialsKeys.payables.detail(storeId, id),
    queryFn: () => financialsApi.getPayable(storeId, id),
    enabled: !!storeId && !!id,
  });
}

export function useCreatePayable() {
  const queryClient = useQueryClient();
  
  return useMutation<Payable, Error, PayableCreateData>({
    mutationFn: (data) => financialsApi.createPayable(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financialsKeys.payables.lists(variables.store_id) });
    },
  });
}

export function useUpdatePayable() {
  const queryClient = useQueryClient();
  
  return useMutation<Payable, Error, { storeId: string; id: string; data: PayableUpdateData }>({
    mutationFn: ({ storeId, id, data }) => financialsApi.updatePayable(storeId, id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(financialsKeys.payables.detail(variables.storeId, variables.id), data);
      queryClient.invalidateQueries({ queryKey: financialsKeys.payables.lists(variables.storeId) });
    },
  });
}

export function useDeletePayable() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { storeId: string; id: string }>({
    mutationFn: ({ storeId, id }) => financialsApi.deletePayable(storeId, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financialsKeys.payables.lists(variables.storeId) });
    },
  });
}

// Payments In hooks
export function usePaymentsIn(storeId: string) {
  return useQuery<PaymentIn[], Error>({
    queryKey: financialsKeys.paymentsIn.lists(storeId),
    queryFn: () => financialsApi.getPaymentsIn(storeId),
    enabled: !!storeId,
  });
}

export function usePaymentIn(storeId: string, id: string) {
  return useQuery<PaymentIn, Error>({
    queryKey: financialsKeys.paymentsIn.detail(storeId, id),
    queryFn: () => financialsApi.getPaymentIn(storeId, id),
    enabled: !!storeId && !!id,
  });
}

export function useCreatePaymentIn() {
  const queryClient = useQueryClient();
  
  return useMutation<PaymentIn, Error, PaymentInCreateData>({
    mutationFn: (data) => financialsApi.createPaymentIn(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financialsKeys.paymentsIn.lists(variables.store_id) });
    },
  });
}

export function useUpdatePaymentIn() {
  const queryClient = useQueryClient();
  
  return useMutation<PaymentIn, Error, { storeId: string; id: string; data: PaymentInUpdateData }>({
    mutationFn: ({ storeId, id, data }) => financialsApi.updatePaymentIn(storeId, id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(financialsKeys.paymentsIn.detail(variables.storeId, variables.id), data);
      queryClient.invalidateQueries({ queryKey: financialsKeys.paymentsIn.lists(variables.storeId) });
    },
  });
}

export function useDeletePaymentIn() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { storeId: string; id: string }>({
    mutationFn: ({ storeId, id }) => financialsApi.deletePaymentIn(storeId, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financialsKeys.paymentsIn.lists(variables.storeId) });
    },
  });
}

// Payments Out hooks
export function usePaymentsOut(storeId: string) {
  return useQuery<PaymentOut[], Error>({
    queryKey: financialsKeys.paymentsOut.lists(storeId),
    queryFn: () => financialsApi.getPaymentsOut(storeId),
    enabled: !!storeId,
  });
}

export function usePaymentOut(storeId: string, id: string) {
  return useQuery<PaymentOut, Error>({
    queryKey: financialsKeys.paymentsOut.detail(storeId, id),
    queryFn: () => financialsApi.getPaymentOut(storeId, id),
    enabled: !!storeId && !!id,
  });
}

export function useCreatePaymentOut() {
  const queryClient = useQueryClient();
  
  return useMutation<PaymentOut, Error, PaymentOutCreateData>({
    mutationFn: (data) => financialsApi.createPaymentOut(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financialsKeys.paymentsOut.lists(variables.store_id) });
    },
  });
}

export function useUpdatePaymentOut() {
  const queryClient = useQueryClient();
  
  return useMutation<PaymentOut, Error, { storeId: string; id: string; data: PaymentOutUpdateData }>({
    mutationFn: ({ storeId, id, data }) => financialsApi.updatePaymentOut(storeId, id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(financialsKeys.paymentsOut.detail(variables.storeId, variables.id), data);
      queryClient.invalidateQueries({ queryKey: financialsKeys.paymentsOut.lists(variables.storeId) });
    },
  });
}

export function useDeletePaymentOut() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { storeId: string; id: string }>({
    mutationFn: ({ storeId, id }) => financialsApi.deletePaymentOut(storeId, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financialsKeys.paymentsOut.lists(variables.storeId) });
    },
  });
}

// Receivables hooks
export function useReceivables(storeId: string) {
  return useQuery<Receivable[], Error>({
    queryKey: financialsKeys.receivables.lists(storeId),
    queryFn: () => financialsApi.getReceivables(storeId),
    enabled: !!storeId,
  });
}

export function useReceivable(storeId: string, id: string) {
  return useQuery<Receivable, Error>({
    queryKey: financialsKeys.receivables.detail(storeId, id),
    queryFn: () => financialsApi.getReceivable(storeId, id),
    enabled: !!storeId && !!id,
  });
}

export function useCreateReceivable() {
  const queryClient = useQueryClient();
  
  return useMutation<Receivable, Error, ReceivableCreateData>({
    mutationFn: (data) => financialsApi.createReceivable(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financialsKeys.receivables.lists(variables.store_id) });
    },
  });
}

export function useUpdateReceivable() {
  const queryClient = useQueryClient();
  
  return useMutation<Receivable, Error, { storeId: string; id: string; data: ReceivableUpdateData }>({
    mutationFn: ({ storeId, id, data }) => financialsApi.updateReceivable(storeId, id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(financialsKeys.receivables.detail(variables.storeId, variables.id), data);
      queryClient.invalidateQueries({ queryKey: financialsKeys.receivables.lists(variables.storeId) });
    },
  });
}

export function useDeleteReceivable() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { storeId: string; id: string }>({
    mutationFn: ({ storeId, id }) => financialsApi.deleteReceivable(storeId, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: financialsKeys.receivables.lists(variables.storeId) });
    },
  });
} 