import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { storesApi, Store } from '@/services/api/stores';

interface StoreSelectorProps {
  currentStoreId?: string;
  onStoreChange: (storeId: string) => void;
  className?: string;
}

export default function StoreSelector({ currentStoreId, onStoreChange, className = '' }: StoreSelectorProps) {
  const [selectedStoreId, setSelectedStoreId] = useState<string>(currentStoreId || '');

  // Fetch stores
  const { data: stores, isLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: () => storesApi.getStores(),
  });

  // Update selected store when currentStoreId prop changes
  useEffect(() => {
    if (currentStoreId) {
      setSelectedStoreId(currentStoreId);
    }
  }, [currentStoreId]);

  // Handle store selection
  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStoreId = e.target.value;
    setSelectedStoreId(newStoreId);
    onStoreChange(newStoreId);
    
    // Save to localStorage for persistence
    localStorage.setItem('current_store_id', newStoreId);
  };

  return (
    <div className={`flex items-center ${className}`}>
      <label htmlFor="store-selector" className="mr-2 text-sm font-medium">
        Store:
      </label>
      <select
        id="store-selector"
        value={selectedStoreId}
        onChange={handleStoreChange}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isLoading}
        aria-label="Select store"
        title="Select store"
      >
        <option value="">Select a store</option>
        {stores?.map((store: Store) => (
          <option key={store.id} value={store.id}>
            {store.name}
          </option>
        ))}
      </select>
    </div>
  );
} 