'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { UserCircle as UserCircleIcon } from '@phosphor-icons/react/dist/ssr/UserCircle';
import { Buildings as BuildingsIcon } from '@phosphor-icons/react/dist/ssr/Buildings';
import { useQuery } from '@tanstack/react-query';
import { storesApi } from '@/services/api/stores';
import { useRouter } from 'next/navigation';

interface TopNavProps {
  onNavOpen: () => void;
}

export function TopNav({ onNavOpen }: TopNavProps): React.JSX.Element {
  const [currentStoreId, setCurrentStoreId] = useState<string>('');
  const router = useRouter();

  // Fetch stores
  const { data: stores, isLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: () => storesApi.getStores(),
  });

  // Load current store ID from localStorage on component mount
  useEffect(() => {
    const storedStoreId = localStorage.getItem('current_store_id');
    if (storedStoreId) {
      setCurrentStoreId(storedStoreId);
    }
  }, []);

  // Handle store change
  const handleStoreChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const storeId = event.target.value as string;
    setCurrentStoreId(storeId);
    localStorage.setItem('current_store_id', storeId);
    // Refresh the page to apply the new store context
    router.refresh();
  };

  return (
    <Box
      component="header"
      sx={{
        backgroundColor: 'var(--mui-palette-background-paper)',
        borderBottom: '1px solid var(--mui-palette-divider)',
        position: 'fixed',
        width: '100%',
        zIndex: 'var(--TopNav-zIndex)',
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          minHeight: 64,
          px: 2,
          py: 1,
        }}
      >
        <Stack alignItems="center" direction="row" spacing={2}>
          <IconButton
            onClick={onNavOpen}
            sx={{
              display: {
                lg: 'none',
              },
            }}
          >
            <ListIcon />
          </IconButton>
        </Stack>
        <Stack alignItems="center" direction="row" spacing={3}>
          {/* Store Selector with MUI styling */}
          <FormControl 
            sx={{ 
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                backgroundColor: 'white',
              }
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <BuildingsIcon size={20} weight="fill" color="var(--mui-palette-primary-main)" />
              <Select
                value={currentStoreId}
                onChange={handleStoreChange as any}
                displayEmpty
                size="small"
                renderValue={(selected) => {
                  if (!selected) return <Typography color="text.secondary">Select Store</Typography>;
                  const selectedStore = stores?.find(store => store.id === selected);
                  return selectedStore?.name || "Select Store";
                }}
                sx={{ 
                  minWidth: 180,
                  '.MuiSelect-select': { 
                    display: 'flex', 
                    alignItems: 'center',
                    py: 1.2,
                    px: 1.5,
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em>Select a store</em>
                </MenuItem>
                {isLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Loading stores...
                  </MenuItem>
                ) : (
                  stores?.map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </Stack>
          </FormControl>
          <IconButton>
            <BellIcon />
          </IconButton>
          <IconButton>
            <UserCircleIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
} 