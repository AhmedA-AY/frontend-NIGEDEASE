import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Company, 
  CompanyCreateData, 
  CompanyUpdateData, 
  Currency, 
  SubscriptionPlan,
  Store,
  StoreCreateData,
  StoreUpdateData,
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

  stores: {
    all: ['stores'] as const,
    lists: () => [...companiesKeys.stores.all, 'list'] as const,
    list: (filters: string) => [...companiesKeys.stores.lists(), { filters }] as const,
    details: () => [...companiesKeys.stores.all, 'detail'] as const,
    detail: (id: string) => [...companiesKeys.stores.details(), id] as const,
  },

  subscription: {
    check: (id: string) => [...companiesKeys.all, 'subscription', 'check', id] as const,
  }
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

// Company subscription hooks
export function useCheckCompanySubscription(id: string) {
  return useQuery({
    queryKey: companiesKeys.subscription.check(id),
    queryFn: () => companiesApi.checkSubscription(id),
    enabled: !!id,
  });
}

export function useRenewCompanySubscription() {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, { id: string; data: any }>({
    mutationFn: ({ id, data }) => companiesApi.renewSubscription(id, data),
    onSuccess: (_, variables) => {
      // Invalidate the subscription check query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.subscription.check(variables.id) });
      // Also invalidate the company detail to reflect updated subscription status
      queryClient.invalidateQueries({ queryKey: companiesKeys.detail(variables.id) });
    },
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
  
  return useMutation<Currency, Error, { name: string; code: string }>({
    mutationFn: (data) => companiesApi.createCurrency(data),
    onSuccess: () => {
      // Invalidate the currencies list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.currencies.lists() });
    },
  });
}

export function useUpdateCurrency() {
  const queryClient = useQueryClient();
  
  return useMutation<Currency, Error, { id: string; data: { name: string; code: string } }>({
    mutationFn: ({ id, data }) => companiesApi.updateCurrency(id, data),
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

export function usePartialUpdateSubscriptionPlan() {
  const queryClient = useQueryClient();
  
  return useMutation<SubscriptionPlan, Error, { id: string; data: Partial<SubscriptionPlanData> }>({
    mutationFn: ({ id, data }) => companiesApi.partialUpdateSubscriptionPlan(id, data),
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

// Store hooks
export function useStores() {
  return useQuery<Store[], Error>({
    queryKey: companiesKeys.stores.lists(),
    queryFn: () => companiesApi.getStores(),
  });
}

export function useStore(id: string) {
  return useQuery<Store, Error>({
    queryKey: companiesKeys.stores.detail(id),
    queryFn: () => companiesApi.getStore(id),
    enabled: !!id,
  });
}

export function useCreateStore() {
  const queryClient = useQueryClient();
  
  return useMutation<Store, Error, StoreCreateData>({
    mutationFn: (data) => companiesApi.createStore(data),
    onSuccess: () => {
      // Invalidate the stores list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.stores.lists() });
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();
  
  return useMutation<Store, Error, { id: string; data: StoreUpdateData }>({
    mutationFn: ({ id, data }) => companiesApi.updateStore(id, data),
    onSuccess: (data) => {
      // Update the cache for this specific store
      queryClient.setQueryData(companiesKeys.stores.detail(data.id), data);
      // Invalidate the stores list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.stores.lists() });
    },
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: (id) => companiesApi.deleteStore(id),
    onSuccess: () => {
      // Invalidate the stores list query to refetch
      queryClient.invalidateQueries({ queryKey: companiesKeys.stores.lists() });
    },
  });
} 