import { useApiQuery, useApiMutation } from '@/utils/api';
import { useQueryClient } from '@tanstack/react-query';

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitCost: number;
  totalValue: number;
  reorderLevel: number;
  location: string;
  lastRestocked: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  createdAt: string;
  updatedAt: string;
}

export interface InventoryResponse {
  data: InventoryItem[];
  total: number;
  page: number;
  limit: number;
}

export interface InventoryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  location?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface InventoryInput {
  productId: string;
  sku: string;
  quantity: number;
  unitCost: number;
  reorderLevel: number;
  location: string;
}

export interface InventoryAdjustment {
  quantity: number;
  reason: string;
  type: 'increase' | 'decrease';
}

// Get inventory with pagination and filters
export function useInventory(params: InventoryParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.status) queryParams.append('status', params.status);
  if (params.location) queryParams.append('location', params.location);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

  const endpoint = `/inventory?${queryParams.toString()}`;
  
  return useApiQuery<InventoryResponse>(
    ['inventory', JSON.stringify(params)], 
    endpoint
  );
}

// Get a single inventory item by ID
export function useInventoryItem(id: string) {
  return useApiQuery<InventoryItem>(
    ['inventory-item', id], 
    `/inventory/${id}`,
    {
      enabled: !!id, // Only run query if id is provided
    }
  );
}

// Create a new inventory item
export function useCreateInventoryItem() {
  const queryClient = useQueryClient();
  
  return useApiMutation<InventoryItem, InventoryInput>(
    '/inventory',
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['inventory'] });
      },
    }
  );
}

// Update an inventory item
export function useUpdateInventoryItem(id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<InventoryItem, Partial<InventoryInput>>(
    `/inventory/${id}`,
    'PATCH',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['inventory-item', id] });
        queryClient.invalidateQueries({ queryKey: ['inventory'] });
      },
    }
  );
}

// Delete an inventory item
export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, string>(
    '/inventory',
    'DELETE',
    {
      onSuccess: (_, itemId) => {
        queryClient.invalidateQueries({ queryKey: ['inventory'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-item', itemId] });
      },
    }
  );
}

// Adjust inventory quantity (increase/decrease)
export function useAdjustInventory(id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<InventoryItem, InventoryAdjustment>(
    `/inventory/${id}/adjust`,
    'PATCH',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['inventory-item', id] });
        queryClient.invalidateQueries({ queryKey: ['inventory'] });
      },
    }
  );
}

// Get inventory statistics
export function useInventoryStats() {
  return useApiQuery<{
    totalItems: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
  }>(
    ['inventory-stats'], 
    '/inventory/stats'
  );
} 