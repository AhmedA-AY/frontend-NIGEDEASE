'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';

import { usePopover } from '@/hooks/use-popover';
import { UserPopover } from '@/components/dashboard/layout/user-popover';
import { useAuth } from '@/providers/auth-provider';

export interface MainNavProps {
  onMobileNavOpen: () => void;
}

export function MainNav({ onMobileNavOpen }: MainNavProps): React.JSX.Element {
  const { userInfo } = useAuth();
  const userPopover = usePopover<HTMLDivElement>();

  // Generate user initials from email
  const userInitials = React.useMemo(() => {
    if (!userInfo?.email) return 'U';
    
    const namePart = userInfo.email.split('@')[0];
    if (!namePart) return 'U';
    
    // Format initials from name parts (e.g., john.doe -> JD)
    return namePart
      .split(/[._-]/)
      .map((part: string) => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  }, [userInfo?.email]);

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={onMobileNavOpen}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
          </Stack>
          <Avatar
            onClick={userPopover.handleOpen}
            ref={userPopover.anchorRef}
            src="/assets/profile.jpeg"
            sx={{
              cursor: 'pointer',
              height: 40,
              width: 40
            }}
          >
            {userInitials}
          </Avatar>
        </Stack>
      </Box>
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
    </React.Fragment>
  );
} 