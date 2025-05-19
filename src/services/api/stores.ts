import { coreApiClient } from './client';

export interface Store {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  email: string;
  company_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoreCreateData {
  name: string;
  address: string;
  phone_number: string;
  email: string;
  company_id: string;
  is_active: boolean;
  location: string;
}

export interface StoreUpdateData extends Partial<StoreCreateData> {}

// Stores API
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
  

  // Toggle store active status
  toggleStoreStatus: async (id: string, isActive: boolean): Promise<Store> => {
    const response = await coreApiClient.put<Store>(`/companies/stores/${id}/`, { is_active: isActive ? "active" : "inactive" });
    return response.data;
  }
}; 