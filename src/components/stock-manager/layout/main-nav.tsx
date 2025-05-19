'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';

import { usePopover } from '@/hooks/use-popover';
import { UserPopover } from '@/components/dashboard/layout/user-popover';
import { MobileNav } from './mobile-nav';
import { useAuth } from '@/providers/auth-provider';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const { userEmail } = useAuth();
  const userPopover = usePopover<HTMLDivElement>();

  // Generate user initials from email
  const userInitials = React.useMemo(() => {
    if (!userEmail) return '';
    
    const namePart = userEmail.split('@')[0];
    if (namePart) {
      // Get initials from name parts
      return namePart
        .split(/[._-]/)
        .map(part => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
    }
    
    return userEmail.substring(0, 2).toUpperCase();
  }, [userEmail]);

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
              onClick={(): void => {
                setOpenNav(true);
              }}
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
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
} 