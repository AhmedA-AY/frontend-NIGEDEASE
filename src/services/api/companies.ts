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
  features: string;
  is_active: boolean;
  storage_limit_gb: number;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  short_name: string;
  address: string;
  subscription_plan: SubscriptionPlan;
  currency: Currency;
  created_at: string;
  updated_at: string;
}

export interface CompanyCreateData {
  name: string;
  short_name: string;
  address: string;
  subscription_plan_id: string;
  currency_id: string;
}

export interface CompanyUpdateData extends CompanyCreateData {}

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
    features: string;
    is_active: boolean;
    storage_limit_gb: number;
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
      features: string;
      is_active: boolean;
      storage_limit_gb: number;
    }
  ): Promise<SubscriptionPlan> => {
    const response = await coreApiClient.put<SubscriptionPlan>(`/companies/subscription-plans/${id}/`, data);
    return response.data;
  },
  
  // Delete a subscription plan
  deleteSubscriptionPlan: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/companies/subscription-plans/${id}/`);
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
      const stores = await inventoryApi.getStores();
      const companyStores = stores.filter(store => store.company && store.company.id === id);
      
      // 4. Delete all stores associated with the company
      await Promise.all(companyStores.map(store => inventoryApi.deleteStore(store.id)));
      
      // 5. Finally delete the company
      await coreApiClient.delete(`/companies/companies/${id}/`);
    } catch (error) {
      console.error('Error in cascade deletion:', error);
      throw error;
    }
  },
}; 