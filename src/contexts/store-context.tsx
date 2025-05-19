'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Store, storesApi } from '@/services/api/stores';
import { useAuth } from '@/providers/auth-provider';

interface StoreContextType {
  stores: Store[];
  selectedStore: Store | null;
  setSelectedStore: (store: Store | null) => void;
  loading: boolean;
  error: string | null;
  fetchStores: () => Promise<void>;
  isStoreSelectionLocked: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { userRole, assignedStore } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Determine if the user can select a store or is locked to their assigned store
  const isStoreSelectionLocked = userRole === 'salesman' || userRole === 'stock_manager';

  const fetchStores = async () => {
    setLoading(true);
    try {
      const storesData = await storesApi.getStores();
      setStores(storesData);
      
      // If user has an assigned store and their role restricts selection, use that
      if (assignedStore && isStoreSelectionLocked) {
        setSelectedStore(assignedStore);
      }
      // Otherwise select the first store by default if no store is selected yet
      else if (storesData.length > 0 && !selectedStore) {
        setSelectedStore(storesData[0]);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch stores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Set assigned store when it becomes available
  useEffect(() => {
    if (assignedStore && isStoreSelectionLocked) {
      setSelectedStore(assignedStore);
    }
  }, [assignedStore, isStoreSelectionLocked]);

  // Load stores on first render
  useEffect(() => {
    fetchStores();
  }, []);

  // Only save selected store to localStorage if the user isn't restricted
  useEffect(() => {
    if (selectedStore && !isStoreSelectionLocked) {
      localStorage.setItem('selectedStore', JSON.stringify(selectedStore));
    }
  }, [selectedStore, isStoreSelectionLocked]);

  // Load selected store from localStorage on mount - only for non-restricted users
  useEffect(() => {
    if (!isStoreSelectionLocked) {
      const storedStore = localStorage.getItem('selectedStore');
      if (storedStore) {
        try {
          const parsedStore = JSON.parse(storedStore);
          setSelectedStore(parsedStore);
        } catch (err) {
          console.error('Failed to parse stored store:', err);
        }
      }
    }
  }, [isStoreSelectionLocked]);

  return (
    <StoreContext.Provider
      value={{
        stores,
        selectedStore,
        setSelectedStore,
        loading,
        error,
        fetchStores,
        isStoreSelectionLocked,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  
  return context;
} 