import { coreApiClient } from './client';
import { Company, Currency, SubscriptionPlan, Store } from './companies';
import { Product } from './inventory';
import { InventoryStore } from './inventory';

// Transactions Interfaces
export interface Customer {
  id: string;
  store_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  credit_limit: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerCreateData {
  store_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  credit_limit: string;
}

export interface CustomerUpdateData extends CustomerCreateData {}

export interface TransactionPaymentMode {
  id: string;
  store_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionPaymentModeCreateData {
  store_id: string;
  name: string;
  description: string;
}

export interface TransactionPaymentModeUpdateData extends TransactionPaymentModeCreateData {}

export interface Supplier {
  id: string;
  store_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  credit_limit: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupplierCreateData {
  store_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  credit_limit: string;
  is_active: boolean;
}

export interface SupplierUpdateData extends SupplierCreateData {}

export interface Purchase {
  id: string;
  store: Store;
  supplier: Supplier;
  total_amount: string;
  currency: Currency;
  payment_mode: TransactionPaymentMode;
  is_credit: boolean;
  created_at: string;
  updated_at: string;
  status: string;
}

export interface PurchaseItemCreateData {
  purchase_id: string;
  product_id: string;
  quantity: string;
}

export interface PurchaseCreateData {
  store_id: string;
  supplier_id: string;
  total_amount: string;
  currency_id: string;
  payment_mode_id: string;
  is_credit: boolean;
  items: Array<Record<string, string>>;
}

export interface PurchaseUpdateData extends PurchaseCreateData {}

export interface PurchaseItem {
  id: string;
  purchase: Purchase;
  product: Product;
  quantity: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseItemUpdateData extends PurchaseItemCreateData {}

export interface Sale {
  id: string;
  store: Store;
  customer: Customer;
  total_amount: string;
  currency: Currency;
  payment_mode: TransactionPaymentMode;
  is_credit: boolean;
  created_at: string;
  updated_at: string;
  status: string;
}

export interface SaleItemCreateData {
  sale: string;
  product_id: string;
  quantity: string;
}

export interface SaleCreateData {
  store_id: string;
  customer_id: string;
  total_amount: string;
  currency_id: string;
  payment_mode_id: string;
  is_credit: boolean;
  items: Array<Record<string, string>>;
}

export interface SaleUpdateData extends SaleCreateData {}

export interface SaleItem {
  id: string;
  product: Product;
  quantity: string;
  created_at: string;
  updated_at: string;
}

export interface SaleItemUpdateData extends SaleItemCreateData {}

// API client
export const transactionsApi = {
  // Customers
  getCustomers: async (storeId: string): Promise<Customer[]> => {
    const response = await coreApiClient.get<Customer[]>(`/transactions/stores/${storeId}/customers/`);
    return response.data;
  },
  
  getCustomer: async (storeId: string, id: string): Promise<Customer> => {
    const response = await coreApiClient.get<Customer>(`/transactions/stores/${storeId}/customers/${id}/`);
    return response.data;
  },
  
  createCustomer: async (data: CustomerCreateData): Promise<Customer> => {
    const response = await coreApiClient.post<Customer>(`/transactions/stores/${data.store_id}/customers/`, data);
    return response.data;
  },
  
  updateCustomer: async (storeId: string, id: string, data: CustomerUpdateData): Promise<Customer> => {
    const response = await coreApiClient.put<Customer>(`/transactions/stores/${storeId}/customers/${id}/`, data);
    return response.data;
  },
  
  deleteCustomer: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/transactions/stores/${storeId}/customers/${id}/`);
  },

  // Payment Modes
  getPaymentModes: async (storeId: string): Promise<TransactionPaymentMode[]> => {
    const response = await coreApiClient.get<TransactionPaymentMode[]>(`/transactions/stores/${storeId}/payment-modes/`);
    return response.data;
  },
  
  getPaymentMode: async (storeId: string, id: string): Promise<TransactionPaymentMode> => {
    const response = await coreApiClient.get<TransactionPaymentMode>(`/transactions/stores/${storeId}/payment-modes/${id}/`);
    return response.data;
  },
  
  createPaymentMode: async (data: TransactionPaymentModeCreateData): Promise<TransactionPaymentMode> => {
    const response = await coreApiClient.post<TransactionPaymentMode>(`/transactions/stores/${data.store_id}/payment-modes/`, data);
    return response.data;
  },
  
  updatePaymentMode: async (storeId: string, id: string, data: TransactionPaymentModeUpdateData): Promise<TransactionPaymentMode> => {
    const response = await coreApiClient.put<TransactionPaymentMode>(`/transactions/stores/${storeId}/payment-modes/${id}/`, data);
    return response.data;
  },
  
  deletePaymentMode: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/transactions/stores/${storeId}/payment-modes/${id}/`);
  },

  // Suppliers
  getSuppliers: async (storeId: string): Promise<Supplier[]> => {
    const response = await coreApiClient.get<Supplier[]>(`/transactions/stores/${storeId}/suppliers/`);
    return response.data;
  },
  
  getSupplier: async (storeId: string, id: string): Promise<Supplier> => {
    const response = await coreApiClient.get<Supplier>(`/transactions/stores/${storeId}/suppliers/${id}/`);
    return response.data;
  },
  
  createSupplier: async (data: SupplierCreateData): Promise<Supplier> => {
    const response = await coreApiClient.post<Supplier>(`/transactions/stores/${data.store_id}/suppliers/`, data);
    return response.data;
  },
  
  updateSupplier: async (storeId: string, id: string, data: SupplierUpdateData): Promise<Supplier> => {
    const response = await coreApiClient.put<Supplier>(`/transactions/stores/${storeId}/suppliers/${id}/`, data);
    return response.data;
  },
  
  deleteSupplier: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/transactions/stores/${storeId}/suppliers/${id}/`);
  },

  // Purchases
  getPurchases: async (storeId: string): Promise<Purchase[]> => {
    const response = await coreApiClient.get<Purchase[]>(`/transactions/stores/${storeId}/purchases/`);
    return response.data;
  },
  
  getPurchase: async (storeId: string, id: string): Promise<Purchase> => {
    const response = await coreApiClient.get<Purchase>(`/transactions/stores/${storeId}/purchases/${id}/`);
    return response.data;
  },
  
  createPurchase: async (data: PurchaseCreateData): Promise<Purchase> => {
    const response = await coreApiClient.post<Purchase>(`/transactions/stores/${data.store_id}/purchases/`, data);
    return response.data;
  },
  
  updatePurchase: async (storeId: string, id: string, data: PurchaseUpdateData): Promise<Purchase> => {
    const response = await coreApiClient.put<Purchase>(`/transactions/stores/${storeId}/purchases/${id}/`, data);
    return response.data;
  },
  
  deletePurchase: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/transactions/stores/${storeId}/purchases/${id}/`);
  },

  // Purchase Items
  getPurchaseItems: async (storeId: string, purchaseId: string): Promise<PurchaseItem[]> => {
    const response = await coreApiClient.get<PurchaseItem[]>(`/transactions/stores/${storeId}/purchases/${purchaseId}/items/`);
    return response.data;
  },
  
  getPurchaseItem: async (storeId: string, purchaseId: string, itemId: number): Promise<PurchaseItem> => {
    const response = await coreApiClient.get<PurchaseItem>(`/transactions/stores/${storeId}/purchases/${purchaseId}/items/${itemId}/`);
    return response.data;
  },
  
  createPurchaseItem: async (storeId: string, purchaseId: string, data: PurchaseItemCreateData): Promise<PurchaseItem> => {
    const response = await coreApiClient.post<PurchaseItem>(`/transactions/stores/${storeId}/purchases/${purchaseId}/items/`, data);
    return response.data;
  },
  
  updatePurchaseItem: async (storeId: string, purchaseId: string, itemId: number, data: PurchaseItemUpdateData): Promise<PurchaseItem> => {
    const response = await coreApiClient.put<PurchaseItem>(`/transactions/stores/${storeId}/purchases/${purchaseId}/items/${itemId}/`, data);
    return response.data;
  },
  
  deletePurchaseItem: async (storeId: string, purchaseId: string, itemId: number): Promise<void> => {
    await coreApiClient.delete(`/transactions/stores/${storeId}/purchases/${purchaseId}/items/${itemId}/`);
  },

  // Sales
  getSales: async (storeId: string): Promise<Sale[]> => {
    const response = await coreApiClient.get<Sale[]>(`/transactions/stores/${storeId}/sales/`);
    return response.data;
  },
  
  getSale: async (storeId: string, id: string): Promise<Sale> => {
    const response = await coreApiClient.get<Sale>(`/transactions/stores/${storeId}/sales/${id}/`);
    return response.data;
  },
  
  createSale: async (data: SaleCreateData): Promise<Sale> => {
    const response = await coreApiClient.post<Sale>(`/transactions/stores/${data.store_id}/sales/`, data);
    return response.data;
  },
  
  updateSale: async (storeId: string, id: string, data: SaleUpdateData): Promise<Sale> => {
    const response = await coreApiClient.put<Sale>(`/transactions/stores/${storeId}/sales/${id}/`, data);
    return response.data;
  },
  
  deleteSale: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/transactions/stores/${storeId}/sales/${id}/`);
  },

  // Sale Items
  getSaleItems: async (storeId: string, saleId: string): Promise<SaleItem[]> => {
    const response = await coreApiClient.get<SaleItem[]>(`/transactions/stores/${storeId}/sales/${saleId}/items/`);
    return response.data;
  },
  
  getSaleItem: async (storeId: string, saleId: string, itemId: number): Promise<SaleItem> => {
    const response = await coreApiClient.get<SaleItem>(`/transactions/stores/${storeId}/sales/${saleId}/items/${itemId}/`);
    return response.data;
  },
  
  createSaleItem: async (storeId: string, saleId: string, data: SaleItemCreateData): Promise<SaleItem> => {
    const response = await coreApiClient.post<SaleItem>(`/transactions/stores/${storeId}/sales/${saleId}/items/`, data);
    return response.data;
  },
  
  updateSaleItem: async (storeId: string, saleId: string, itemId: number, data: SaleItemUpdateData): Promise<SaleItem> => {
    const response = await coreApiClient.put<SaleItem>(`/transactions/stores/${storeId}/sales/${saleId}/items/${itemId}/`, data);
    return response.data;
  },
  
  deleteSaleItem: async (storeId: string, saleId: string, itemId: number): Promise<void> => {
    await coreApiClient.delete(`/transactions/stores/${storeId}/sales/${saleId}/items/${itemId}/`);
  },
}; 