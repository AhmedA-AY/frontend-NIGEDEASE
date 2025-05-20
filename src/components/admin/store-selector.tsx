'use client';

import React from 'react';
import { useStore, Store } from '@/contexts/store-context';
import { FormControl, InputLabel, Select, MenuItem, Box, Tooltip, Typography, SelectChangeEvent, IconButton } from '@mui/material';
import { Storefront, ArrowsClockwise } from '@phosphor-icons/react/dist/ssr';

export const StoreSelector = () => {
  const { stores, selectedStore, selectStore, refreshStores, isLoading } = useStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleStoreChange = (event: SelectChangeEvent<string>) => {
    const storeId = event.target.value;
    const store = stores.find((s) => s.id === storeId);
    if (store) {
      selectStore(store);
    }
  };

  // Function to manually refresh the store list
  const handleRefresh = () => {
    setRefreshing(true);
    refreshStores();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Storefront size={20} />
        <Typography variant="body2">Loading stores...</Typography>
      </Box>
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
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <FormControl
        size="small"
        sx={{
          minWidth: 180,
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 1,
        }}
      >
        <InputLabel id="store-select-label">Select Store</InputLabel>
        <Select
          labelId="store-select-label"
          id="store-select"
          value={selectedStore?.id || ''}
          onChange={handleStoreChange}
          label="Select Store"
          startAdornment={
            <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
              <Storefront size={20} />
            </Box>
          }
        >
          {stores.map((store: any) => (
            <MenuItem key={store.id} value={store.id}>
              {store.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Tooltip title="Refresh stores">
        <IconButton 
          size="small" 
          onClick={handleRefresh}
          sx={{
            animation: refreshing ? 'spin 1s linear infinite' : 'none',
          }}
        >
          <ArrowsClockwise size={18} />
        </IconButton>
      </Tooltip>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
}; 