'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { UserCircle as UserCircleIcon } from '@phosphor-icons/react/dist/ssr/UserCircle';
import StoreSelector from '../common/StoreSelector';

export interface TopNavProps {
  onNavOpen?: () => void;
}

export function TopNav({ onNavOpen }: TopNavProps): React.JSX.Element {
  const [currentStoreId, setCurrentStoreId] = useState<string>('');

  // Load current store ID from localStorage on component mount
  useEffect(() => {
    const storedStoreId = localStorage.getItem('current_store_id');
    if (storedStoreId) {
      setCurrentStoreId(storedStoreId);
    }
  }, []);

  // Handle store change
  const handleStoreChange = (storeId: string) => {
    setCurrentStoreId(storeId);
    // You can add additional logic here if needed when store changes
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
          <StoreSelector 
            currentStoreId={currentStoreId}
            onStoreChange={handleStoreChange}
          />
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