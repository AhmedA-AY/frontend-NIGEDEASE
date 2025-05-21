import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Company, 
  CompanyCreateData, 
  CompanyUpdateData, 
  Currency, 
  CurrencyCreateData,
  CurrencyUpdateData,
  SubscriptionPlan, 
  companiesApi 
} from '@/services/api/companies';

// Query keys
export const companiesKeys = {
  all: ['companies'] as const,
  lists: () => [...companiesKeys.all, 'list'] as const,
  list: (filters: string) => [...companiesKeys.lists(), { filters }] as const,
  details: () => [...companiesKeys.all, 'detail'] as const,
  detail: (id: string) => [...companiesKeys.details(), id] as const,
  
  currencies: {
    all: ['currencies'] as const,
    lists: () => [...companiesKeys.currencies.all, 'list'] as const,
    list: (filters: string) => [...companiesKeys.currencies.lists(), { filters }] as const,
    details: () => [...companiesKeys.currencies.all, 'detail'] as const,
    detail: (id: string) => [...companiesKeys.currencies.details(), id] as const,
  },
  
  subscriptionPlans: {
    all: ['subscription-plans'] as const,
    lists: () => [...companiesKeys.subscriptionPlans.all, 'list'] as const,
    list: (filters: string) => [...companiesKeys.subscriptionPlans.lists(), { filters }] as const,
    details: () => [...companiesKeys.subscriptionPlans.all, 'detail'] as const,
    detail: (id: string) => [...companiesKeys.subscriptionPlans.details(), id] as const,
  },
};

// Companies hooks
export function useCompanies() {
  return useQuery<Company[], Error>({
    queryKey: companiesKeys.lists(),
    queryFn: () => companiesApi.getCompanies(),
  });
}

export function useCompany(id: string) {
  return useQuery<Company, Error>({
    queryKey: companiesKeys.detail(id),
    queryFn: () => companiesApi.getCompany(id),
    enabled: !!id,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  
  return useMutation<Company, Error, CompanyCreateData>({
    mutationFn: (data) => companiesApi.createCompany(data),
    onSuccess: () => {
      // Invalidate the companies list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.lists() });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  
  return useMutation<Company, Error, { id: string; data: CompanyUpdateData }>({
    mutationFn: ({ id, data }) => companiesApi.updateCompany(id, data),
    onSuccess: (data) => {
      // Update the cache for this specific company
      queryClient.setQueryData(companiesKeys.detail(data.id), data);
      // Invalidate the companies list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.lists() });
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => companiesApi.deleteCompanyWithRelatedData(id),
    onSuccess: () => {
      // Invalidate and refetch companies list
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    }
  });
}

// Currencies hooks
export function useCurrencies() {
  return useQuery<Currency[], Error>({
    queryKey: companiesKeys.currencies.lists(),
    queryFn: () => companiesApi.getCurrencies(),
  });
}

export function useCurrency(id: string) {
  return useQuery<Currency, Error>({
    queryKey: companiesKeys.currencies.detail(id),
    queryFn: () => companiesApi.getCurrency(id),
    enabled: !!id,
  });
}

export function useCreateCurrency() {
  const queryClient = useQueryClient();
  
  return useMutation<Currency, Error, CurrencyCreateData>({
    mutationFn: (data) => companiesApi.createCurrency(data),
    onSuccess: () => {
      // Invalidate the currencies list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.currencies.lists() });
    },
  });
}

export function useUpdateCurrency() {
  const queryClient = useQueryClient();
  
  return useMutation<Currency, Error, { id: string; data: CurrencyUpdateData }>({
    mutationFn: ({ id, data }) => companiesApi.updateCurrency(id, data),
    onSuccess: (data) => {
      // Update the cache for this specific currency
      queryClient.setQueryData(companiesKeys.currencies.detail(data.id), data);
      // Invalidate the currencies list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.currencies.lists() });
    },
  });
}

export function usePatchCurrency() {
  const queryClient = useQueryClient();
  
  return useMutation<Currency, Error, { id: string; data: CurrencyUpdateData }>({
    mutationFn: ({ id, data }) => companiesApi.patchCurrency(id, data),
    onSuccess: (data) => {
      // Update the cache for this specific currency
      queryClient.setQueryData(companiesKeys.currencies.detail(data.id), data);
      // Invalidate the currencies list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.currencies.lists() });
    },
  });
}

export function useDeleteCurrency() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: (id) => companiesApi.deleteCurrency(id),
    onSuccess: () => {
      // Invalidate the currencies list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.currencies.lists() });
    },
  });
}

// Subscription Plans hooks
export function useSubscriptionPlans() {
  return useQuery<SubscriptionPlan[], Error>({
    queryKey: companiesKeys.subscriptionPlans.lists(),
    queryFn: () => companiesApi.getSubscriptionPlans(),
  });
}

export function useSubscriptionPlan(id: string) {
  return useQuery<SubscriptionPlan, Error>({
    queryKey: companiesKeys.subscriptionPlans.detail(id),
    queryFn: () => companiesApi.getSubscriptionPlan(id),
    enabled: !!id,
  });
}

export interface SubscriptionPlanData {
  name: string;
  description: string;
  price: string;
  billing_cycle: 'monthly' | 'yearly';
  duration_in_months: number;
  features: string;
  is_active: boolean;
  storage_limit_gb: number;
  max_products: number;
  max_stores: number;
  max_users: number;
}

export function useCreateSubscriptionPlan() {
  const queryClient = useQueryClient();
  
  return useMutation<SubscriptionPlan, Error, SubscriptionPlanData>({
    mutationFn: (data) => companiesApi.createSubscriptionPlan(data),
    onSuccess: () => {
      // Invalidate the subscription plans list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.subscriptionPlans.lists() });
    },
  });
}

export function useUpdateSubscriptionPlan() {
  const queryClient = useQueryClient();
  
  return useMutation<SubscriptionPlan, Error, { id: string; data: SubscriptionPlanData }>({
    mutationFn: ({ id, data }) => companiesApi.updateSubscriptionPlan(id, data),
    onSuccess: (data) => {
      // Update the cache for this specific subscription plan
      queryClient.setQueryData(companiesKeys.subscriptionPlans.detail(data.id), data);
      // Invalidate the subscription plans list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.subscriptionPlans.lists() });
    },
  });
}

export function useDeleteSubscriptionPlan() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: (id) => companiesApi.deleteSubscriptionPlan(id),
    onSuccess: () => {
      // Invalidate the subscription plans list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.subscriptionPlans.lists() });
    },
  });
}

export function usePatchSubscriptionPlan() {
  const queryClient = useQueryClient();
  
  return useMutation<SubscriptionPlan, Error, { id: string; data: Partial<SubscriptionPlanData> }>({
    mutationFn: ({ id, data }) => companiesApi.patchSubscriptionPlan(id, data),
    onSuccess: (data) => {
      // Update the cache for this specific subscription plan
      queryClient.setQueryData(companiesKeys.subscriptionPlans.detail(data.id), data);
      // Invalidate the subscription plans list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.subscriptionPlans.lists() });
    },
  });
}

// Hook to check company subscription details
export function useCheckCompanySubscription(companyId?: string) {
  return useQuery<any, Error>({
    queryKey: ['company-subscription', companyId],
    queryFn: () => {
      if (!companyId) throw new Error('Company ID is required');
      return companiesApi.checkCompanySubscription(companyId);
    },
    enabled: !!companyId,
  });
} 