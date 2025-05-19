'use client';

import React from 'react';
import { useStore, Store } from '@/contexts/store-context';
import { FormControl, InputLabel, Select, MenuItem, Box, Tooltip, Typography, SelectChangeEvent } from '@mui/material';
import { Storefront } from '@phosphor-icons/react/dist/ssr';

export const StoreSelector = () => {
  const { stores, selectedStore, selectStore, isLoading } = useStore();

  const handleStoreChange = (event: SelectChangeEvent<string>) => {
    const storeId = event.target.value;
    const store = stores.find((s) => s.id === storeId);
    if (store) {
      selectStore(store);
    }
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

  // If user has a locked store selection, show a non-interactive component
  if (selectedStore) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 1,
        padding: '4px 8px',
        height: '40px'
      }}>
        <Storefront size={20} />
        <Typography variant="body2">{selectedStore.name}</Typography>
      </Box>
    );
  }

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: 150,
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 1,
      }}
    >
      <InputLabel id="store-select-label">Select Store</InputLabel>
      <Select
        labelId="store-select-label"
        id="store-select"
        value={(selectedStore as any)?.id || ''}
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
  );
}; 