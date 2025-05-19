import { coreApiClient } from './client';
import { usersApi } from './users';
import { inventoryApi } from './inventory';

export interface Currency {
  id: string;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
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
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  is_subscribed: string;
  subscription_plan: string; // ID of the subscription plan
  created_at: string;
  updated_at: string;
}

export interface CompanyCreateData {
  name: string;
  description: string;
  is_active: boolean;
  subscription_plan: string; // ID of the subscription plan
}

export interface CompanyUpdateData extends CompanyCreateData {}

export interface Store {
  id: string;
  company: Company;
  name: string;
  location: string;
  created_at: string;
  updated_at: string;
  is_active: "active" | "inactive";
}

export interface StoreCreateData {
  company_id: string;
  name: string;
  location: string;
  is_active: "active" | "inactive";
}

export interface StoreUpdateData extends StoreCreateData {}

// Companies API
export const companiesApi = {
  // Get all companies
  getCompanies: async (): Promise<Company[]> => {
    const response = await coreApiClient.get<Company[]>('/companies/companies/');
    return response.data;
  },
  
  // Get company by ID
  getCompany: async (id: string): Promise<Company> => {
    const response = await coreApiClient.get<Company>(`/companies/companies/${id}/`);
    return response.data;
  },
  
  // Create a new company
  createCompany: async (data: CompanyCreateData): Promise<Company> => {
    const response = await coreApiClient.post<Company>('/companies/companies/', data);
    return response.data;
  },
  
  // Update a company
  updateCompany: async (id: string, data: CompanyUpdateData): Promise<Company> => {
    const response = await coreApiClient.put<Company>(`/companies/companies/${id}/`, data);
    return response.data;
  },
  
  // Delete a company
  deleteCompany: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/companies/companies/${id}/`);
  },
  
  // Check company subscription status
  checkSubscription: async (id: string): Promise<any> => {
    const response = await coreApiClient.get(`/companies/companies/${id}/subscription/check/`);
    return response.data;
  },
  
  // Renew company subscription
  renewSubscription: async (id: string, data: any): Promise<any> => {
    const response = await coreApiClient.post(`/companies/companies/${id}/subscription/renew/`, data);
    return response.data;
  },
  
  // Get all currencies
  getCurrencies: async (): Promise<Currency[]> => {
    const response = await coreApiClient.get<Currency[]>('/companies/currencies/');
    return response.data;
  },
  
  // Get currency by ID
  getCurrency: async (id: string): Promise<Currency> => {
    const response = await coreApiClient.get<Currency>(`/companies/currencies/${id}/`);
    return response.data;
  },
  
  // Create a new currency
  createCurrency: async (data: { name: string; code: string }): Promise<Currency> => {
    const response = await coreApiClient.post<Currency>('/companies/currencies/', data);
    return response.data;
  },
  
  // Update a currency
  updateCurrency: async (id: string, data: { name: string; code: string }): Promise<Currency> => {
    const response = await coreApiClient.put<Currency>(`/companies/currencies/${id}/`, data);
    return response.data;
  },
  
  // Delete a currency
  deleteCurrency: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/companies/currencies/${id}/`);
  },
  
  // Get all subscription plans
  getSubscriptionPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await coreApiClient.get<SubscriptionPlan[]>('/companies/subscription-plans/');
    return response.data;
  },
  
  // Get subscription plan by ID
  getSubscriptionPlan: async (id: string): Promise<SubscriptionPlan> => {
    const response = await coreApiClient.get<SubscriptionPlan>(`/companies/subscription-plans/${id}/`);
    return response.data;
  },
  
  // Create a new subscription plan
  createSubscriptionPlan: async (data: {
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
  }): Promise<SubscriptionPlan> => {
    const response = await coreApiClient.post<SubscriptionPlan>('/companies/subscription-plans/', data);
    return response.data;
  },
  
  // Update a subscription plan
  updateSubscriptionPlan: async (
    id: string,
    data: {
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
  ): Promise<SubscriptionPlan> => {
    const response = await coreApiClient.put<SubscriptionPlan>(`/companies/subscription-plans/${id}/`, data);
    return response.data;
  },
  
  // Partially update a subscription plan
  partialUpdateSubscriptionPlan: async (
    id: string,
    data: Partial<{
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
    }>
  ): Promise<SubscriptionPlan> => {
    const response = await coreApiClient.patch<SubscriptionPlan>(`/companies/subscription-plans/${id}/`, data);
    return response.data;
  },
  
  // Delete a subscription plan
  deleteSubscriptionPlan: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/companies/subscription-plans/${id}/`);
  },

  // Get all stores
  getStores: async (): Promise<Store[]> => {
    const response = await coreApiClient.get<Store[]>('/companies/stores/');
    return response.data;
  },
  
  // Get store by ID
  getStore: async (id: string): Promise<Store> => {
    const response = await coreApiClient.get<Store>(`/companies/stores/${id}/`);
    return response.data;
  },
  
  // Create a new store
  createStore: async (data: StoreCreateData): Promise<Store> => {
    const response = await coreApiClient.post<Store>('/companies/stores/', data);
    return response.data;
  },
  
  // Update a store
  updateStore: async (id: string, data: StoreUpdateData): Promise<Store> => {
    const response = await coreApiClient.put<Store>(`/companies/stores/${id}/`, data);
    return response.data;
  },
  
  // Delete a store
  deleteStore: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/companies/stores/${id}/`);
  },

  // Delete a company and all related data
  deleteCompanyWithRelatedData: async (id: string): Promise<void> => {
    try {
      // 1. Get all users for this company
      const users = await usersApi.getUsers();
      const companyUsers = users.filter(user => user.company_id === id);
      
      // 2. Delete all users associated with the company
      await Promise.all(companyUsers.map(user => usersApi.deleteUser(user.id)));
      
      // 3. Get all stores for this company
      const stores = await companiesApi.getStores();
      const companyStores = stores.filter(store => store.company && store.company.id === id);
      
      // 4. Delete all stores associated with the company
      await Promise.all(companyStores.map(store => companiesApi.deleteStore(store.id)));
      
      // 5. Finally delete the company
      await coreApiClient.delete(`/companies/companies/${id}/`);
    } catch (error) {
      console.error('Error in cascade deletion:', error);
      throw error;
    }
  },
}; 