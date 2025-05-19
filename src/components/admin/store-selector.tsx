'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/contexts/store-context';
import { FormControl, InputLabel, Select, MenuItem, Box, Tooltip, Typography, Chip } from '@mui/material';
import { Storefront } from '@phosphor-icons/react';

export const StoreSelector = () => {
  const { stores, selectedStore, setSelectedStore, loading, fetchStores, isStoreSelectionLocked } = useStore();

  useEffect(() => {
    // Ensure we have stores data
    if (stores.length === 0 && !loading) {
      fetchStores();
    }
  }, [stores.length, loading, fetchStores]);

  const handleStoreChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const storeId = event.target.value as string;
    const store = stores.find(s => s.id === storeId);
    if (store) {
      setSelectedStore(store);
    }
  };

  if (loading) {
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
  if (isStoreSelectionLocked && selectedStore) {
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
        <Chip 
          label="Assigned Store" 
          size="small"
          variant="outlined"
          sx={{ 
            fontSize: '0.7rem', 
            height: '20px',
            ml: 0.5
          }}
        />
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
        value={selectedStore?.id || ''}
        onChange={handleStoreChange as any}
        label="Select Store"
        startAdornment={
          <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
            <Storefront size={20} />
          </Box>
        }
      >
        {stores.map((store) => (
          <MenuItem key={store.id} value={store.id}>
            {store.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}; 