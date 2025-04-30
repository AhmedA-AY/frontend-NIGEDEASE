'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { AuthGuard } from '@/components/auth/auth-guard';
import { SideNav } from '@/components/salesman/layout/side-nav';
import { MobileNav } from '@/components/salesman/layout/mobile-nav';
import { salesmanNavItems } from '@/components/dashboard/layout/config';

export default function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);

  return (
    <AuthGuard>
      <Box
        sx={{
          '--SideNav-width': '280px',
          '--SideNav-zIndex': 1200,
          '--TopNav-zIndex': 1100,
          '--MobileNav-width': '320px',
          '--MobileNav-zIndex': 1100,
          display: 'flex',
          minHeight: '100vh',
        }}
      >
        <SideNav />
        <MobileNav
          onClose={() => setOpenNav(false)}
          open={openNav}
          items={salesmanNavItems}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: { lg: '280px' },
            position: 'relative',
            pt: { xs: 'calc(64px + 24px)', lg: '24px' },
            px: { xs: 2, lg: 3 },
          }}
        >
          {children}
        </Box>
      </Box>
    </AuthGuard>
  );
} 