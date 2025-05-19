# Transactions API Changes

This document outlines the changes made to the transactions API to support the new store-based endpoints.

## Overview

The backend API has been updated to use store-based endpoints for all transaction-related operations. This means that all endpoints now require a `store_id` parameter as part of the URL path.

For example:
- Old: `/transactions/customers/`
- New: `/transactions/stores/{store_id}/customers/`

## Changes Made

### 1. API Service Layer (`src/services/api/transactions.ts`)

- Updated all API endpoints to include `store_id` in the URL path
- Modified interface definitions to include `store_id` property where needed
- Updated method signatures to accept `store_id` as a parameter
- Changed the data structure for `items` in purchase and sale operations to match the new API requirements

### 2. React Hooks (`src/hooks/stock-manager/use-transactions.ts`)

Created a new set of React hooks that work with the store-based API:

- All hooks now require a `store_id` parameter
- Query keys include the `store_id` to properly cache data per store
- Added `enabled: !!storeId` condition to prevent queries when store ID is not available
- Properly invalidate related queries when mutations occur

## Available Hooks

### Customers
- `useCustomers(storeId)` - Get all customers for a store
- `useCustomer(storeId, id)` - Get a specific customer
- `useCreateCustomer(storeId)` - Create a new customer
- `useUpdateCustomer(storeId, id)` - Update a customer
- `useDeleteCustomer(storeId)` - Delete a customer

### Payment Modes
- `usePaymentModes(storeId)` - Get all payment modes for a store
- `usePaymentMode(storeId, id)` - Get a specific payment mode
- `useCreatePaymentMode(storeId)` - Create a new payment mode
- `useUpdatePaymentMode(storeId, id)` - Update a payment mode
- `useDeletePaymentMode(storeId)` - Delete a payment mode

### Suppliers
- `useSuppliers(storeId)` - Get all suppliers for a store
- `useSupplier(storeId, id)` - Get a specific supplier
- `useCreateSupplier(storeId)` - Create a new supplier
- `useUpdateSupplier(storeId, id)` - Update a supplier
- `useDeleteSupplier(storeId)` - Delete a supplier

### Purchases
- `usePurchases(storeId)` - Get all purchases for a store
- `usePurchase(storeId, id)` - Get a specific purchase
- `useCreatePurchase(storeId)` - Create a new purchase
- `useUpdatePurchase(storeId, id)` - Update a purchase
- `useDeletePurchase(storeId)` - Delete a purchase

### Purchase Items
- `usePurchaseItems(storeId, purchaseId)` - Get all items for a purchase
- `usePurchaseItem(storeId, purchaseId, itemId)` - Get a specific purchase item
- `useCreatePurchaseItem(storeId, purchaseId)` - Create a new purchase item
- `useUpdatePurchaseItem(storeId, purchaseId, itemId)` - Update a purchase item
- `useDeletePurchaseItem(storeId, purchaseId, itemId)` - Delete a purchase item

### Sales
- `useSales(storeId)` - Get all sales for a store
- `useSale(storeId, id)` - Get a specific sale
- `useCreateSale(storeId)` - Create a new sale
- `useUpdateSale(storeId, id)` - Update a sale
- `useDeleteSale(storeId)` - Delete a sale

### Sale Items
- `useSaleItems(storeId, saleId)` - Get all items for a sale
- `useSaleItem(storeId, saleId, itemId)` - Get a specific sale item
- `useCreateSaleItem(storeId, saleId)` - Create a new sale item
- `useUpdateSaleItem(storeId, saleId, itemId)` - Update a sale item
- `useDeleteSaleItem(storeId, saleId, itemId)` - Delete a sale item

## Usage Example

```tsx
import { useCustomers, useCreateCustomer } from '@/hooks/stock-manager/use-transactions';

// In a component
const MyComponent = ({ storeId }) => {
  // Fetch customers for the store
  const { data: customers, isLoading } = useCustomers(storeId);
  
  // Create customer mutation
  const { mutate: createCustomer } = useCreateCustomer(storeId);
  
  const handleCreateCustomer = () => {
    createCustomer({
      store_id: storeId,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      address: '123 Main St',
      credit_limit: '1000'
    });
  };
  
  return (
    <div>
      {isLoading ? (
        <p>Loading customers...</p>
      ) : (
        <ul>
          {customers?.map(customer => (
            <li key={customer.id}>{customer.name}</li>
          ))}
        </ul>
      )}
      <button onClick={handleCreateCustomer}>Add Customer</button>
    </div>
  );
};
```

## Example: Working with Purchase Items

```tsx
import { 
  usePurchaseItems, 
  useCreatePurchaseItem, 
  useUpdatePurchaseItem, 
  useDeletePurchaseItem 
} from '@/hooks/stock-manager/use-transactions';
import { useState } from 'react';

const PurchaseItemsComponent = ({ storeId, purchaseId }) => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState('');
  
  // Fetch purchase items
  const { data: items, isLoading } = usePurchaseItems(storeId, purchaseId);
  
  // Create, update, delete mutations
  const { mutate: createItem } = useCreatePurchaseItem(storeId, purchaseId);
  const { mutate: updateItem } = useUpdatePurchaseItem(
    storeId, 
    purchaseId, 
    selectedItemId
  );
  const { mutate: deleteItem } = useDeletePurchaseItem(
    storeId, 
    purchaseId, 
    selectedItemId
  );
  
  // Handler functions
  const handleCreateItem = () => {
    createItem({
      purchase_id: purchaseId,
      product_id: selectedProductId,
      quantity: "10"
    });
  };
  
  const handleUpdateItem = () => {
    if (selectedItemId) {
      updateItem({
        purchase_id: purchaseId,
        product_id: selectedProductId,
        quantity: "20"
      });
    }
  };
  
  const handleDeleteItem = () => {
    if (selectedItemId) {
      deleteItem();
    }
  };
  
  return (
    <div>
      {/* Component UI */}
      <button onClick={handleCreateItem}>Add Item</button>
      <button onClick={handleUpdateItem} disabled={!selectedItemId}>
        Update Selected Item
      </button>
      <button onClick={handleDeleteItem} disabled={!selectedItemId}>
        Delete Selected Item
      </button>
    </div>
  );
}; 