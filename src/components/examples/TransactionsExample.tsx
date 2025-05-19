import { useState, useEffect } from 'react';
import StoreSelector from '../common/StoreSelector';
import { 
  useCustomers, 
  useCreateCustomer, 
  useUpdateCustomer, 
  useDeleteCustomer,
  useSuppliers,
  usePaymentModes,
  usePurchases,
  useCreatePurchase
} from '@/hooks/stock-manager/use-transactions';

export default function TransactionsExample() {
  const [storeId, setStoreId] = useState<string>('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    credit_limit: '0'
  });

  // Handle store change
  const handleStoreChange = (newStoreId: string) => {
    setStoreId(newStoreId);
    // Reset selections when store changes
    setSelectedCustomerId('');
  };

  // Get store from localStorage on initial load
  useEffect(() => {
    const storedStoreId = localStorage.getItem('current_store_id');
    if (storedStoreId) {
      setStoreId(storedStoreId);
    }
  }, []);

  // Customer hooks
  const { 
    data: customers, 
    isLoading: isLoadingCustomers 
  } = useCustomers(storeId);
  
  const { 
    mutate: createCustomer, 
    isPending: isCreatingCustomer 
  } = useCreateCustomer(storeId);
  
  const { 
    mutate: updateCustomer, 
    isPending: isUpdatingCustomer 
  } = useUpdateCustomer(storeId, selectedCustomerId);
  
  const { 
    mutate: deleteCustomer, 
    isPending: isDeletingCustomer 
  } = useDeleteCustomer(storeId);

  // Other hooks for demonstration
  const { data: suppliers } = useSuppliers(storeId);
  const { data: paymentModes } = usePaymentModes(storeId);
  const { data: purchases } = usePurchases(storeId);
  const { mutate: createPurchase } = useCreatePurchase(storeId);

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    createCustomer({
      store_id: storeId,
      ...customerForm
    });
  };

  const handleUpdateCustomer = () => {
    if (selectedCustomerId) {
      updateCustomer({
        store_id: storeId,
        ...customerForm
      });
    }
  };

  const handleDeleteCustomer = () => {
    if (selectedCustomerId) {
      deleteCustomer(selectedCustomerId);
      setSelectedCustomerId('');
    }
  };

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomerId(customer.id);
    setCustomerForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      credit_limit: customer.credit_limit
    });
  };

  // Example of creating a purchase
  const handleCreatePurchase = () => {
    if (suppliers?.length && paymentModes?.length) {
      createPurchase({
        store_id: storeId,
        supplier_id: suppliers[0].id,
        total_amount: "100",
        currency_id: "some-currency-id", // This would come from your app state
        payment_mode_id: paymentModes[0].id,
        is_credit: false,
        items: [
          {
            product_id: "some-product-id", // This would come from your app state
            quantity: "1"
          }
        ]
      });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Transactions Example</h1>
      
      {/* Store Selector */}
      <div className="mb-6">
        <StoreSelector 
          currentStoreId={storeId}
          onStoreChange={handleStoreChange}
          className="mb-2"
        />
        {!storeId && <p className="text-red-500">Please select a store to continue</p>}
      </div>
      
      {/* Only show content if a store is selected */}
      {storeId && (
        <>
          {/* Customers Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Customers</h2>
            
            {/* Customer Form */}
            <form onSubmit={handleCreateCustomer} className="mb-4 p-4 border rounded">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block mb-1">Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={customerForm.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    aria-label="Customer name"
                    title="Customer name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={customerForm.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    aria-label="Customer email"
                    title="Customer email"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block mb-1">Phone</label>
                  <input
                    id="phone"
                    type="text"
                    name="phone"
                    value={customerForm.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    aria-label="Customer phone"
                    title="Customer phone"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block mb-1">Address</label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={customerForm.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    aria-label="Customer address"
                    title="Customer address"
                  />
                </div>
                <div>
                  <label htmlFor="credit_limit" className="block mb-1">Credit Limit</label>
                  <input
                    id="credit_limit"
                    type="text"
                    name="credit_limit"
                    value={customerForm.credit_limit}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    aria-label="Customer credit limit"
                    title="Customer credit limit"
                  />
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  disabled={isCreatingCustomer}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  {isCreatingCustomer ? 'Creating...' : 'Create Customer'}
                </button>
                
                <button
                  type="button"
                  disabled={!selectedCustomerId || isUpdatingCustomer}
                  onClick={handleUpdateCustomer}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  {isUpdatingCustomer ? 'Updating...' : 'Update Customer'}
                </button>
                
                <button
                  type="button"
                  disabled={!selectedCustomerId || isDeletingCustomer}
                  onClick={handleDeleteCustomer}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  {isDeletingCustomer ? 'Deleting...' : 'Delete Customer'}
                </button>
              </div>
            </form>
            
            {/* Customer List */}
            <div>
              <h3 className="text-lg font-medium mb-2">Customer List</h3>
              {isLoadingCustomers ? (
                <p>Loading customers...</p>
              ) : customers?.length ? (
                <ul className="border rounded divide-y">
                  {customers.map(customer => (
                    <li
                      key={customer.id}
                      onClick={() => handleSelectCustomer(customer)}
                      className={`p-3 cursor-pointer hover:bg-gray-50 ${
                        selectedCustomerId === customer.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-600">{customer.email}</div>
                      <div className="text-sm text-gray-600">{customer.phone}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No customers found</p>
              )}
            </div>
          </div>
          
          {/* Purchases Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Purchases</h2>
            <button
              onClick={handleCreatePurchase}
              disabled={!suppliers?.length || !paymentModes?.length}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Create Sample Purchase
            </button>
            
            {/* Purchase List */}
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Purchase List</h3>
              {purchases?.length ? (
                <ul className="border rounded divide-y">
                  {purchases.map(purchase => (
                    <li key={purchase.id} className="p-3">
                      <div className="font-medium">
                        Supplier: {purchase.supplier.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Amount: {purchase.total_amount}
                      </div>
                      <div className="text-sm text-gray-600">
                        Date: {new Date(purchase.created_at).toLocaleDateString()}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No purchases found</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 