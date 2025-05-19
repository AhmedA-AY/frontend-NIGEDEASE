import { useApiQuery, useApiMutation } from '@/utils/api';
import { useQueryClient } from '@tanstack/react-query';
import { 
  Customer, CustomerCreateData, CustomerUpdateData,
  TransactionPaymentMode, TransactionPaymentModeCreateData, TransactionPaymentModeUpdateData,
  Supplier, SupplierCreateData, SupplierUpdateData,
  Purchase, PurchaseCreateData, PurchaseUpdateData,
  PurchaseItem, PurchaseItemCreateData, PurchaseItemUpdateData,
  Sale, SaleCreateData, SaleUpdateData,
  SaleItem, SaleItemCreateData, SaleItemUpdateData
} from '@/services/api/transactions';

// Customers
export function useCustomers(storeId: string) {
  return useApiQuery<Customer[]>(
    ['customers', storeId], 
    `/transactions/stores/${storeId}/customers`,
    {
      enabled: !!storeId,
    }
  );
}

export function useCustomer(storeId: string, id: string) {
  return useApiQuery<Customer>(
    ['customer', storeId, id], 
    `/transactions/stores/${storeId}/customers/${id}`,
    {
      enabled: !!storeId && !!id,
    }
  );
}

export function useCreateCustomer(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Customer, CustomerCreateData>(
    `/transactions/stores/${storeId}/customers`,
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['customers', storeId] });
      },
    }
  );
}

export function useUpdateCustomer(storeId: string, id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Customer, CustomerUpdateData>(
    `/transactions/stores/${storeId}/customers/${id}`,
    'PUT',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['customer', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['customers', storeId] });
      },
    }
  );
}

export function useDeleteCustomer(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, string>(
    `/transactions/stores/${storeId}/customers`,
    'DELETE',
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['customer', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['customers', storeId] });
      },
    }
  );
}

// Payment Modes
export function usePaymentModes(storeId: string) {
  return useApiQuery<TransactionPaymentMode[]>(
    ['payment-modes', storeId], 
    `/transactions/stores/${storeId}/payment-modes`,
    {
      enabled: !!storeId,
    }
  );
}

export function usePaymentMode(storeId: string, id: string) {
  return useApiQuery<TransactionPaymentMode>(
    ['payment-mode', storeId, id], 
    `/transactions/stores/${storeId}/payment-modes/${id}`,
    {
      enabled: !!storeId && !!id,
    }
  );
}

export function useCreatePaymentMode(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<TransactionPaymentMode, TransactionPaymentModeCreateData>(
    `/transactions/stores/${storeId}/payment-modes`,
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['payment-modes', storeId] });
      },
    }
  );
}

export function useUpdatePaymentMode(storeId: string, id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<TransactionPaymentMode, TransactionPaymentModeUpdateData>(
    `/transactions/stores/${storeId}/payment-modes/${id}`,
    'PUT',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['payment-mode', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['payment-modes', storeId] });
      },
    }
  );
}

export function useDeletePaymentMode(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, string>(
    `/transactions/stores/${storeId}/payment-modes`,
    'DELETE',
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['payment-mode', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['payment-modes', storeId] });
      },
    }
  );
}

// Suppliers
export function useSuppliers(storeId: string) {
  return useApiQuery<Supplier[]>(
    ['suppliers', storeId], 
    `/transactions/stores/${storeId}/suppliers`,
    {
      enabled: !!storeId,
    }
  );
}

export function useSupplier(storeId: string, id: string) {
  return useApiQuery<Supplier>(
    ['supplier', storeId, id], 
    `/transactions/stores/${storeId}/suppliers/${id}`,
    {
      enabled: !!storeId && !!id,
    }
  );
}

export function useCreateSupplier(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Supplier, SupplierCreateData>(
    `/transactions/stores/${storeId}/suppliers`,
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['suppliers', storeId] });
      },
    }
  );
}

export function useUpdateSupplier(storeId: string, id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Supplier, SupplierUpdateData>(
    `/transactions/stores/${storeId}/suppliers/${id}`,
    'PUT',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['supplier', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['suppliers', storeId] });
      },
    }
  );
}

export function useDeleteSupplier(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, string>(
    `/transactions/stores/${storeId}/suppliers`,
    'DELETE',
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['supplier', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['suppliers', storeId] });
      },
    }
  );
}

// Purchases
export function usePurchases(storeId: string) {
  return useApiQuery<Purchase[]>(
    ['purchases', storeId], 
    `/transactions/stores/${storeId}/purchases`,
    {
      enabled: !!storeId,
    }
  );
}

export function usePurchase(storeId: string, id: string) {
  return useApiQuery<Purchase>(
    ['purchase', storeId, id], 
    `/transactions/stores/${storeId}/purchases/${id}`,
    {
      enabled: !!storeId && !!id,
    }
  );
}

export function useCreatePurchase(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Purchase, PurchaseCreateData>(
    `/transactions/stores/${storeId}/purchases`,
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['purchases', storeId] });
      },
    }
  );
}

export function useUpdatePurchase(storeId: string, id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Purchase, PurchaseUpdateData>(
    `/transactions/stores/${storeId}/purchases/${id}`,
    'PUT',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['purchase', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['purchases', storeId] });
      },
    }
  );
}

export function useDeletePurchase(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, string>(
    `/transactions/stores/${storeId}/purchases`,
    'DELETE',
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['purchase', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['purchases', storeId] });
      },
    }
  );
}

// Purchase Items
export function usePurchaseItems(storeId: string, purchaseId: string) {
  return useApiQuery<PurchaseItem[]>(
    ['purchase-items', storeId, purchaseId], 
    `/transactions/stores/${storeId}/purchases/${purchaseId}/items`,
    {
      enabled: !!storeId && !!purchaseId,
    }
  );
}

export function usePurchaseItem(storeId: string, purchaseId: string, itemId: number) {
  return useApiQuery<PurchaseItem>(
    ['purchase-item', storeId, purchaseId, itemId.toString()], 
    `/transactions/stores/${storeId}/purchases/${purchaseId}/items/${itemId}`,
    {
      enabled: !!storeId && !!purchaseId && !!itemId,
    }
  );
}

export function useCreatePurchaseItem(storeId: string, purchaseId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<PurchaseItem, PurchaseItemCreateData>(
    `/transactions/stores/${storeId}/purchases/${purchaseId}/items`,
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['purchase-items', storeId, purchaseId] });
        queryClient.invalidateQueries({ queryKey: ['purchase', storeId, purchaseId] });
        queryClient.invalidateQueries({ queryKey: ['purchases', storeId] });
      },
    }
  );
}

export function useUpdatePurchaseItem(storeId: string, purchaseId: string, itemId: number) {
  const queryClient = useQueryClient();
  
  return useApiMutation<PurchaseItem, PurchaseItemUpdateData>(
    `/transactions/stores/${storeId}/purchases/${purchaseId}/items/${itemId}`,
    'PUT',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['purchase-item', storeId, purchaseId, itemId.toString()] });
        queryClient.invalidateQueries({ queryKey: ['purchase-items', storeId, purchaseId] });
        queryClient.invalidateQueries({ queryKey: ['purchase', storeId, purchaseId] });
      },
    }
  );
}

export function useDeletePurchaseItem(storeId: string, purchaseId: string, itemId: number) {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, void>(
    `/transactions/stores/${storeId}/purchases/${purchaseId}/items/${itemId}`,
    'DELETE',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['purchase-item', storeId, purchaseId, itemId.toString()] });
        queryClient.invalidateQueries({ queryKey: ['purchase-items', storeId, purchaseId] });
        queryClient.invalidateQueries({ queryKey: ['purchase', storeId, purchaseId] });
      },
    }
  );
}

// Sales
export function useSales(storeId: string) {
  return useApiQuery<Sale[]>(
    ['sales', storeId], 
    `/transactions/stores/${storeId}/sales`,
    {
      enabled: !!storeId,
    }
  );
}

export function useSale(storeId: string, id: string) {
  return useApiQuery<Sale>(
    ['sale', storeId, id], 
    `/transactions/stores/${storeId}/sales/${id}`,
    {
      enabled: !!storeId && !!id,
    }
  );
}

export function useCreateSale(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Sale, SaleCreateData>(
    `/transactions/stores/${storeId}/sales`,
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sales', storeId] });
      },
    }
  );
}

export function useUpdateSale(storeId: string, id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Sale, SaleUpdateData>(
    `/transactions/stores/${storeId}/sales/${id}`,
    'PUT',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sale', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['sales', storeId] });
      },
    }
  );
}

export function useDeleteSale(storeId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, string>(
    `/transactions/stores/${storeId}/sales`,
    'DELETE',
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['sale', storeId, id] });
        queryClient.invalidateQueries({ queryKey: ['sales', storeId] });
      },
    }
  );
}

// Sale Items
export function useSaleItems(storeId: string, saleId: string) {
  return useApiQuery<SaleItem[]>(
    ['sale-items', storeId, saleId], 
    `/transactions/stores/${storeId}/sales/${saleId}/items`,
    {
      enabled: !!storeId && !!saleId,
    }
  );
}

export function useSaleItem(storeId: string, saleId: string, itemId: number) {
  return useApiQuery<SaleItem>(
    ['sale-item', storeId, saleId, itemId.toString()], 
    `/transactions/stores/${storeId}/sales/${saleId}/items/${itemId}`,
    {
      enabled: !!storeId && !!saleId && !!itemId,
    }
  );
}

export function useCreateSaleItem(storeId: string, saleId: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<SaleItem, SaleItemCreateData>(
    `/transactions/stores/${storeId}/sales/${saleId}/items`,
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sale-items', storeId, saleId] });
        queryClient.invalidateQueries({ queryKey: ['sale', storeId, saleId] });
        queryClient.invalidateQueries({ queryKey: ['sales', storeId] });
      },
    }
  );
}

export function useUpdateSaleItem(storeId: string, saleId: string, itemId: number) {
  const queryClient = useQueryClient();
  
  return useApiMutation<SaleItem, SaleItemUpdateData>(
    `/transactions/stores/${storeId}/sales/${saleId}/items/${itemId}`,
    'PUT',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sale-item', storeId, saleId, itemId.toString()] });
        queryClient.invalidateQueries({ queryKey: ['sale-items', storeId, saleId] });
        queryClient.invalidateQueries({ queryKey: ['sale', storeId, saleId] });
      },
    }
  );
}

export function useDeleteSaleItem(storeId: string, saleId: string, itemId: number) {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, void>(
    `/transactions/stores/${storeId}/sales/${saleId}/items/${itemId}`,
    'DELETE',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sale-item', storeId, saleId, itemId.toString()] });
        queryClient.invalidateQueries({ queryKey: ['sale-items', storeId, saleId] });
        queryClient.invalidateQueries({ queryKey: ['sale', storeId, saleId] });
      },
    }
  );
} 