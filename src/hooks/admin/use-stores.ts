import { useApiQuery, useApiMutation } from '@/utils/api';
import { useQueryClient } from '@tanstack/react-query';
import { Store, StoreCreateData, StoreUpdateData } from '@/services/api/companies';

export interface StoresResponse {
  data: Store[];
  total: number;
  page: number;
  limit: number;
}

export interface StoreParams {
  page?: number;
  limit?: number;
  search?: string;
  company_id?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Get all stores with pagination and filters
export function useStores(params: StoreParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.company_id) queryParams.append('company_id', params.company_id);
  if (params.status) queryParams.append('status', params.status);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

  const endpoint = `/companies/stores?${queryParams.toString()}`;
  
  return useApiQuery<StoresResponse>(
    ['stores', JSON.stringify(params)], 
    endpoint
  );
}

// Get a single store by ID
export function useStore(id: string) {
  return useApiQuery<Store>(
    ['store', id], 
    `/companies/stores/${id}`,
    {
      enabled: !!id,
    }
  );
}

// Create a new store
export function useCreateStore() {
  const queryClient = useQueryClient();
  
  return useApiMutation<Store, StoreCreateData>(
    '/companies/stores',
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['stores'] });
      },
    }
  );
}

// Update an existing store
export function useUpdateStore(id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Store, StoreUpdateData>(
    `/companies/stores/${id}`,
    'PUT',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['store', id] });
        queryClient.invalidateQueries({ queryKey: ['stores'] });
      },
    }
  );
}

// Delete a store
export function useDeleteStore() {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, string>(
    '/companies/stores',
    'DELETE',
    {
      onSuccess: (_, storeId) => {
        queryClient.invalidateQueries({ queryKey: ['stores'] });
        queryClient.invalidateQueries({ queryKey: ['store', storeId] });
      },
    }
  );
}

// Toggle store status
export function useToggleStoreStatus(id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Store, { is_active: "active" | "inactive" }>(
    `/companies/stores/${id}`,
    'PATCH',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['store', id] });
        queryClient.invalidateQueries({ queryKey: ['stores'] });
      },
    }
  );
} 