'use client';

import React, { useState, useEffect } from 'react';
import { useStore, Store } from '@/contexts/store-context';
import { FormControl, InputLabel, Select, MenuItem, Box, Tooltip, Typography, SelectChangeEvent, IconButton, CircularProgress } from '@mui/material';
import { Storefront, ArrowsClockwise } from '@phosphor-icons/react/dist/ssr';

export default function StoreSelector() {
  const { stores, selectedStore, selectStore, refreshStores, isLoading } = useStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Refresh stores when component mounts to ensure fresh data
    refreshStores();
  }, [refreshStores]);

  const handleStoreChange = (event: SelectChangeEvent) => {
    const storeId = event.target.value;
    const store = stores.find((s) => s.id === storeId);
    if (store) {
      selectStore(store);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    refreshStores();
    // Add a delay to show the refresh animation
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2">
        <CircularProgress size={20} />
        <span>Loading stores...</span>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <Tooltip title="No stores available">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Storefront size={20} />
          <Typography variant="body2">No stores</Typography>
        </Box>
      </Tooltip>
    );
  }

  // Always show dropdown for switching between stores, even if user has a selectedStore
  return (
    <div className="flex items-center gap-2">
      <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
        <Select
          value={selectedStore?.id || ''}
          onChange={handleStoreChange}
          displayEmpty
          className="text-sm"
          sx={{ 
            borderRadius: '0.375rem',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--secondary-200)',
            },
          }}
        >
          <MenuItem value="" disabled>
            Select Store
          </MenuItem>
          {stores.map((store) => (
            <MenuItem key={store.id} value={store.id}>
              {store.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton 
        onClick={handleRefresh} 
        className={`transition-all duration-300 ${refreshing ? 'animate-spin' : ''}`}
        size="small"
      >
        <ArrowsClockwise size={18} />
      </IconButton>
    </div>
  );
} 