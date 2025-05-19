import { useApiQuery, useApiMutation } from '@/utils/api';
import { useQueryClient } from '@tanstack/react-query';
import { Inventory, InventoryStore, Product, ProductCategory, ProductUnit } from '@/services/api/inventory';

export interface InventoryResponse {
  data: Inventory[];
  total: number;
  page: number;
  limit: number;
}

export interface InventoryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Get all inventory items for a specific store
export function useInventory(storeId: string, params: InventoryParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.category) queryParams.append('category', params.category);
  if (params.status) queryParams.append('status', params.status);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

  const endpoint = `/inventory/stores/${storeId}/inventories?${queryParams.toString()}`;
  
  return useApiQuery<Inventory[]>(
    ['inventory', storeId, JSON.stringify(params)], 
    endpoint,
    {
      enabled: !!storeId,
    }
  );
}

// Get a single inventory item by ID for a specific store
export function useInventoryItem(storeId: string, id: string) {
  return useApiQuery<Inventory>(
    ['inventory-item', storeId, id], 
    `/inventory/stores/${storeId}/inventories/${id}`,
    {
      enabled: !!storeId && !!id,
    }
  );
}

// Create a new inventory item for a specific store
export function useCreateInventoryItem(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Inventory, { product_id: string; store_id: string; quantity: string }>(
    `/inventory/stores/${storeId}/inventories`,
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['inventory', storeId] });
      },
    }
  );
}

// Update an inventory item for a specific store
export function useUpdateInventoryItem(storeId: string, id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Inventory, { product_id: string; store_id: string; quantity: string }>(
    `/inventory/stores/${storeId}/inventories/${id}`,
    'PUT',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['inventory-item', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['inventory', storeId] });
      },
    }
  );
}

// Delete an inventory item for a specific store
export function useDeleteInventoryItem(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, string>(
    `/inventory/stores/${storeId}/inventories`,
    'DELETE',
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['inventory-item', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['inventory', storeId] });
      },
    }
  );
}

// Product Categories
export function useProductCategories(storeId: string) {
  return useApiQuery<ProductCategory[]>(
    ['product-categories', storeId], 
    `/inventory/stores/${storeId}/product-categories`,
    {
      enabled: !!storeId,
    }
  );
}

export function useProductCategory(storeId: string, id: string) {
  return useApiQuery<ProductCategory>(
    ['product-category', storeId, id], 
    `/inventory/stores/${storeId}/product-categories/${id}`,
    {
      enabled: !!storeId && !!id,
    }
  );
}

export function useCreateProductCategory(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<ProductCategory, { store_id: string; name: string; description: string }>(
    `/inventory/stores/${storeId}/product-categories`,
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['product-categories', storeId] });
      },
    }
  );
}

export function useUpdateProductCategory(storeId: string, id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<ProductCategory, { store_id: string; name: string; description: string }>(
    `/inventory/stores/${storeId}/product-categories/${id}`,
    'PUT',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['product-category', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['product-categories', storeId] });
      },
    }
  );
}

export function useDeleteProductCategory(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, string>(
    `/inventory/stores/${storeId}/product-categories`,
    'DELETE',
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['product-category', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['product-categories', storeId] });
      },
    }
  );
}

// Product Units
export function useProductUnits(storeId: string) {
  return useApiQuery<ProductUnit[]>(
    ['product-units', storeId], 
    `/inventory/stores/${storeId}/product-units`,
    {
      enabled: !!storeId,
    }
  );
}

export function useProductUnit(storeId: string, id: string) {
  return useApiQuery<ProductUnit>(
    ['product-unit', storeId, id], 
    `/inventory/stores/${storeId}/product-units/${id}`,
    {
      enabled: !!storeId && !!id,
    }
  );
}

export function useCreateProductUnit(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<ProductUnit, { store_id: string; name: string; description: string }>(
    `/inventory/stores/${storeId}/product-units`,
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['product-units', storeId] });
      },
    }
  );
}

export function useUpdateProductUnit(storeId: string, id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<ProductUnit, { store_id: string; name: string; description: string }>(
    `/inventory/stores/${storeId}/product-units/${id}`,
    'PUT',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['product-unit', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['product-units', storeId] });
      },
    }
  );
}

export function useDeleteProductUnit(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, string>(
    `/inventory/stores/${storeId}/product-units`,
    'DELETE',
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['product-unit', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['product-units', storeId] });
      },
    }
  );
}

// Products
export function useProducts(storeId: string) {
  return useApiQuery<Product[]>(
    ['products', storeId], 
    `/inventory/stores/${storeId}/products`,
    {
      enabled: !!storeId,
    }
  );
}

export function useProduct(storeId: string, id: string) {
  return useApiQuery<Product>(
    ['product', storeId, id], 
    `/inventory/stores/${storeId}/products/${id}`,
    {
      enabled: !!storeId && !!id,
    }
  );
}

export interface ProductCreateData {
  store_id: string;
  name: string;
  description: string;
  image: string;
  product_unit_id: string;
  product_category_id: string;
  purchase_price?: string;
  sale_price?: string;
  color_id?: string;
  collection_id?: string;
}

export function useCreateProduct(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Product, ProductCreateData>(
    `/inventory/stores/${storeId}/products`,
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products', storeId] });
      },
    }
  );
}

export function useUpdateProduct(storeId: string, id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Product, ProductCreateData>(
    `/inventory/stores/${storeId}/products/${id}`,
    'PUT',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['product', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['products', storeId] });
      },
    }
  );
}

export function useDeleteProduct(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, string>(
    `/inventory/stores/${storeId}/products`,
    'DELETE',
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['product', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['products', storeId] });
      },
    }
  );
}

// Get inventory statistics
export function useInventoryStats(storeId: string) {
  return useApiQuery<{
    total_items: number;
    low_stock_items: number;
    out_of_stock_items: number;
    total_value: number;
    category_distribution: { category: string; count: number }[];
    recent_movements: any[];
  }>(
    ['inventory-stats', storeId], 
    `/inventory/stores/${storeId}/stats`,
    {
      enabled: !!storeId,
    }
  );
} 