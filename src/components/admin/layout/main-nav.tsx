'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';

import { usePopover } from '@/hooks/use-popover';
import { useAuth } from '@/providers/auth-provider';

import { MobileNav } from './mobile-nav';
import { UserPopover } from '@/components/dashboard/layout/user-popover';

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
    <>
      <Box
        component="header"
        sx={{
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderBottomColor: 'var(--mui-palette-divider)',
          borderBottomStyle: 'solid',
          borderBottomWidth: 1,
          color: 'var(--mui-palette-text-primary)',
          height: 'var(--MainNav-height)',
          left: {
            lg: 'var(--SideNav-width)',
          },
          position: 'fixed',
          right: 0,
          top: 0,
          zIndex: 'var(--MainNav-zIndex)',
        }}
      >
        <Stack direction="row" spacing={2} sx={{ height: '100%', px: 3 }}>
          <Box sx={{ alignItems: 'center', display: { lg: 'none', xs: 'flex' } }}>
            <IconButton onClick={(): void => setOpenNav(true)}>
              <ListIcon />
            </IconButton>
          </Box>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            sx={{ alignItems: 'center', flex: '1 1 auto', justifyContent: 'flex-end' }}
          >
            <Box ref={userPopover.anchorRef}>
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
            </Box>
          </Stack>
        </Stack>
      </Box>
      <MobileNav onClose={(): void => setOpenNav(false)} open={openNav} />
      <UserPopover
        anchorEl={userPopover.anchorRef.current}
        onClose={userPopover.handleClose}
        open={userPopover.open}
      />
    </>
  );
} 