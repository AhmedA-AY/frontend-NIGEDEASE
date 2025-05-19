'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import tokenStorage from '@/utils/token-storage';

export type Store = {
  id: string;
  name: string;
  location: string;
  created_at: string;
  updated_at: string;
  is_active: string;
};

export type StoreContextType = {
  stores: Store[];
  selectedStore: Store | null;
  selectStore: (store: Store) => void;
  isLoading: boolean;
};

// Create context
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Store provider component
export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load stores from storage
    const loadStores = () => {
      const storesFromStorage = tokenStorage.getCompanyStores();
      setStores(storesFromStorage);

      // If admin has access to stores, select the first one
      if (storesFromStorage.length > 0 && !selectedStore) {
        setSelectedStore(storesFromStorage[0]);
        localStorage.setItem('lastSelectedStore', JSON.stringify(storesFromStorage[0]));
      }

      // For non-admin roles, check if there's an assigned store
      const assignedStore = tokenStorage.getAssignedStore();
      if (assignedStore) {
        setSelectedStore(assignedStore);
      } else {
        // Try to get last selected store from local storage
        const lastSelectedStore = localStorage.getItem('lastSelectedStore');
        if (lastSelectedStore) {
          try {
            setSelectedStore(JSON.parse(lastSelectedStore));
          } catch (e) {
            console.error('Failed to parse last selected store', e);
          }
        }
      }

      setIsLoading(false);
    };

    loadStores();
  }, []);

  const selectStore = (store: Store) => {
    setSelectedStore(store);
    localStorage.setItem('lastSelectedStore', JSON.stringify(store));
  };

  return (
    <StoreContext.Provider value={{ stores, selectedStore, selectStore, isLoading }}>
      {children}
    </StoreContext.Provider>
  );
};

// Custom hook to use the store context
export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}; 