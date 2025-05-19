import { coreApiClient } from './client';
import { Company } from './companies';

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

// Stores API - Note: This is now a wrapper around the companies API for backward compatibility
export const storesApi = {
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
  
  // Get stores by company ID - This is a helper method as the API doesn't directly support this
  getStoresByCompany: async (companyId: string): Promise<Store[]> => {
    const allStores = await storesApi.getStores();
    return allStores.filter(store => store.company && store.company.id === companyId);
  },
  
  // Toggle store active status
  toggleStoreStatus: async (id: string, isActive: boolean): Promise<Store> => {
    const store = await storesApi.getStore(id);
    const response = await coreApiClient.put<Store>(`/companies/stores/${id}/`, {
      ...store,
      company_id: store.company.id,
      is_active: isActive ? "active" : "inactive"
    });
    return response.data;
  }
}; 