import { coreApiClient } from './client';
import { Company, Currency, SubscriptionPlan } from './companies';
import { Product } from './inventory';
import { InventoryStore } from './inventory';

// Transactions Interfaces
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  credit_limit: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerCreateData {
  name: string;
  email: string;
  phone: string;
  address: string;
  credit_limit: string;
}

export interface CustomerUpdateData extends CustomerCreateData {}

export interface TransactionPaymentMode {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionPaymentModeCreateData {
  name: string;
  description: string;
}

export interface TransactionPaymentModeUpdateData extends TransactionPaymentModeCreateData {}

export interface Supplier {
  id: string;
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
  company: Company;
  store: InventoryStore;
  supplier: Supplier;
  total_amount: string;
  currency: Currency;
  payment_mode: TransactionPaymentMode;
  is_credit: boolean;
  created_at: string;
  updated_at: string;
}

export interface PurchaseItemCreateData {
  product_id: string;
  quantity: string;
}

export interface PurchaseCreateData {
  company_id: string;
  store_id: string;
  supplier_id: string;
  total_amount: string;
  currency_id: string;
  payment_mode_id: string;
  is_credit: boolean;
  items: PurchaseItemCreateData[];
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
  company: Company;
  store: InventoryStore;
  customer: Customer;
  total_amount: string;
  currency: Currency;
  payment_mode: TransactionPaymentMode;
  is_credit: boolean;
  created_at: string;
  updated_at: string;
}

export interface SaleItemCreateData {
  product_id: string;
  quantity: string;
}

export interface SaleCreateData {
  company_id: string;
  store_id: string;
  customer_id: string;
  total_amount: string;
  currency_id: string;
  payment_mode_id: string;
  is_credit: boolean;
  items: SaleItemCreateData[];
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
  getCustomers: async (): Promise<Customer[]> => {
    const response = await coreApiClient.get<Customer[]>('/transactions/customers/');
    return response.data;
  },
  
  getCustomer: async (id: string): Promise<Customer> => {
    const response = await coreApiClient.get<Customer>(`/transactions/customers/${id}/`);
    return response.data;
  },
  
  createCustomer: async (data: CustomerCreateData): Promise<Customer> => {
    const response = await coreApiClient.post<Customer>('/transactions/customers/', data);
    return response.data;
  },
  
  updateCustomer: async (id: string, data: CustomerUpdateData): Promise<Customer> => {
    const response = await coreApiClient.put<Customer>(`/transactions/customers/${id}/`, data);
    return response.data;
  },
  
  deleteCustomer: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/transactions/customers/${id}/`);
  },

  // Payment Modes
  getPaymentModes: async (): Promise<TransactionPaymentMode[]> => {
    const response = await coreApiClient.get<TransactionPaymentMode[]>('/transactions/payment-modes/');
    return response.data;
  },
  
  getPaymentMode: async (id: string): Promise<TransactionPaymentMode> => {
    const response = await coreApiClient.get<TransactionPaymentMode>(`/transactions/payment-modes/${id}/`);
    return response.data;
  },
  
  createPaymentMode: async (data: TransactionPaymentModeCreateData): Promise<TransactionPaymentMode> => {
    const response = await coreApiClient.post<TransactionPaymentMode>('/transactions/payment-modes/', data);
    return response.data;
  },
  
  updatePaymentMode: async (id: string, data: TransactionPaymentModeUpdateData): Promise<TransactionPaymentMode> => {
    const response = await coreApiClient.put<TransactionPaymentMode>(`/transactions/payment-modes/${id}/`, data);
    return response.data;
  },
  
  deletePaymentMode: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/transactions/payment-modes/${id}/`);
  },

  // Suppliers
  getSuppliers: async (): Promise<Supplier[]> => {
    const response = await coreApiClient.get<Supplier[]>('/transactions/suppliers/');
    return response.data;
  },
  
  getSupplier: async (id: string): Promise<Supplier> => {
    const response = await coreApiClient.get<Supplier>(`/transactions/suppliers/${id}/`);
    return response.data;
  },
  
  createSupplier: async (data: SupplierCreateData): Promise<Supplier> => {
    const response = await coreApiClient.post<Supplier>('/transactions/suppliers/', data);
    return response.data;
  },
  
  updateSupplier: async (id: string, data: SupplierUpdateData): Promise<Supplier> => {
    const response = await coreApiClient.put<Supplier>(`/transactions/suppliers/${id}/`, data);
    return response.data;
  },
  
  deleteSupplier: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/transactions/suppliers/${id}/`);
  },

  // Purchases
  getPurchases: async (): Promise<Purchase[]> => {
    const response = await coreApiClient.get<Purchase[]>('/transactions/purchases/');
    return response.data;
  },
  
  getPurchase: async (id: string): Promise<Purchase> => {
    const response = await coreApiClient.get<Purchase>(`/transactions/purchases/${id}/`);
    return response.data;
  },
  
  createPurchase: async (data: PurchaseCreateData): Promise<Purchase> => {
    console.log('Creating purchase with data:', JSON.stringify(data, null, 2));
    const response = await coreApiClient.post<Purchase>('/transactions/purchases/', data);
    return response.data;
  },
  
  updatePurchase: async (id: string, data: PurchaseUpdateData): Promise<Purchase> => {
    const response = await coreApiClient.put<Purchase>(`/transactions/purchases/${id}/`, data);
    return response.data;
  },
  
  deletePurchase: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/transactions/purchases/${id}/`);
  },

  // Purchase Items
  getPurchaseItems: async (purchaseId: string): Promise<PurchaseItem[]> => {
    const response = await coreApiClient.get<PurchaseItem[]>(`/transactions/purchases/${purchaseId}/items/`);
    return response.data;
  },
  
  getPurchaseItem: async (purchaseId: string, itemId: string): Promise<PurchaseItem> => {
    const response = await coreApiClient.get<PurchaseItem>(`/transactions/purchases/${purchaseId}/items/${itemId}/`);
    return response.data;
  },
  
  createPurchaseItem: async (purchaseId: string, data: PurchaseItemCreateData): Promise<PurchaseItem> => {
    const response = await coreApiClient.post<PurchaseItem>(`/transactions/purchases/${purchaseId}/items/`, data);
    return response.data;
  },
  
  updatePurchaseItem: async (purchaseId: string, itemId: string, data: PurchaseItemUpdateData): Promise<PurchaseItem> => {
    const response = await coreApiClient.put<PurchaseItem>(`/transactions/purchases/${purchaseId}/items/${itemId}/`, data);
    return response.data;
  },
  
  deletePurchaseItem: async (purchaseId: string, itemId: string): Promise<void> => {
    await coreApiClient.delete(`/transactions/purchases/${purchaseId}/items/${itemId}/`);
  },

  // Sales
  getSales: async (): Promise<Sale[]> => {
    const response = await coreApiClient.get<Sale[]>('/transactions/sales/');
    return response.data;
  },
  
  getSale: async (id: string): Promise<Sale> => {
    const response = await coreApiClient.get<Sale>(`/transactions/sales/${id}/`);
    return response.data;
  },
  
  createSale: async (data: SaleCreateData): Promise<Sale> => {
    console.log('Creating sale with data:', JSON.stringify(data, null, 2));
    const response = await coreApiClient.post<Sale>('/transactions/sales/', data);
    return response.data;
  },
  
  updateSale: async (id: string, data: SaleUpdateData): Promise<Sale> => {
    const response = await coreApiClient.put<Sale>(`/transactions/sales/${id}/`, data);
    return response.data;
  },
  
  deleteSale: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/transactions/sales/${id}/`);
  },

  // Sale Items
  getSaleItems: async (saleId: string): Promise<SaleItem[]> => {
    const response = await coreApiClient.get<SaleItem[]>(`/transactions/sales/${saleId}/items/`);
    return response.data;
  },
  
  getSaleItem: async (saleId: string, itemId: string): Promise<SaleItem> => {
    const response = await coreApiClient.get<SaleItem>(`/transactions/sales/${saleId}/items/${itemId}/`);
    return response.data;
  },
  
  createSaleItem: async (saleId: string, data: SaleItemCreateData): Promise<SaleItem> => {
    const response = await coreApiClient.post<SaleItem>(`/transactions/sales/${saleId}/items/`, data);
    return response.data;
  },
  
  updateSaleItem: async (saleId: string, itemId: string, data: SaleItemUpdateData): Promise<SaleItem> => {
    const response = await coreApiClient.put<SaleItem>(`/transactions/sales/${saleId}/items/${itemId}/`, data);
    return response.data;
  },
  
  deleteSaleItem: async (saleId: string, itemId: string): Promise<void> => {
    await coreApiClient.delete(`/transactions/sales/${saleId}/items/${itemId}/`);
  },
}; 