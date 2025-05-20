'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth, Store } from '@/providers/auth-provider';
import tokenStorage from '@/utils/token-storage';
import { enqueueSnackbar } from 'notistack';

interface StoreContextType {
  currentStore: Store | null;
  stores: Store[];
  isLoading: boolean;
  selectStore: (store: Store) => void;
  refreshStores: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, userRole, stores: authStores } = useAuth();
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize store state from auth context and localStorage
  useEffect(() => {
    const initializeStores = () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        // Get stores from auth context or localStorage
        const availableStores = authStores.length > 0
          ? authStores
          : tokenStorage.getCompanyStores();

        setStores(availableStores);

        // Get assigned store from localStorage
        const savedStore = tokenStorage.getAssignedStore();
        
        if (savedStore) {
          // Verify the saved store exists in available stores
          const storeExists = availableStores.some(store => store.id === savedStore.id);
          if (storeExists) {
            setCurrentStore(savedStore);
          } else if (availableStores.length > 0) {
            // If saved store doesn't exist anymore, select first available store
            setCurrentStore(availableStores[0]);
            tokenStorage.saveAssignedStore(availableStores[0]);
          }
        } else if (availableStores.length > 0) {
          // No saved store, select first available
          setCurrentStore(availableStores[0]);
          tokenStorage.saveAssignedStore(availableStores[0]);
        }
      } catch (error) {
        console.error('Error initializing stores:', error);
        enqueueSnackbar('Failed to load store information', { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    initializeStores();
  }, [isAuthenticated, authStores]);

  // Handle store selection
  const handleSelectStore = (store: Store) => {
    setCurrentStore(store);
    tokenStorage.saveAssignedStore(store);
  };

  // Force refresh stores from auth context
  const handleRefreshStores = () => {
    setIsLoading(true);
    const availableStores = authStores.length > 0
      ? authStores
      : tokenStorage.getCompanyStores();
    
    setStores(availableStores);
    setIsLoading(false);
  };

  const contextValue = useMemo(
    () => ({
      currentStore,
      stores,
      isLoading,
      selectStore: handleSelectStore,
      refreshStores: handleRefreshStores,
    }),
    [currentStore, stores, isLoading]
  );

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  
  return context;
}; 