import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';
import { Metadata } from 'next';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MainNav } from '@/components/admin/layout/main-nav';
import { SideNav } from '@/components/admin/layout/side-nav';
import { AdminProvider } from '@/contexts/admin-context';

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | Nigedease Admin',
  },
  description: 'Nigedease Admin Dashboard and Management System',
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <AuthGuard>
      <AdminProvider>
        <GlobalStyles
          styles={{
            body: {
              '--MainNav-height': '56px',
              '--MainNav-zIndex': 1000,
              '--SideNav-width': '280px',
              '--SideNav-zIndex': 1100,
              '--MobileNav-width': '320px',
              '--MobileNav-zIndex': 1100,
            },
          }}
        />
        <Box
          sx={{
            bgcolor: 'var(--mui-palette-background-default)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            minHeight: '100%',
          }}
        >
          <SideNav />
          <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', pl: { lg: 'var(--SideNav-width)' } }}>
            <MainNav />
            <main>
              <Container maxWidth="xl" sx={{ py: '64px' }}>
                {children}
              </Container>
            </main>
          </Box>
        </Box>
      </AdminProvider>
    </AuthGuard>
  );
} 