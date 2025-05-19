import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';
import { Metadata } from 'next';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MainNav } from '@/components/admin/layout/main-nav';
import { SideNav } from '@/components/admin/layout/side-nav';
import { AdminProvider } from '@/contexts/admin-context';
import { StoreProvider } from '@/contexts/store-context';

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
        <StoreProvider>
          <GlobalStyles
            styles={{
              body: {
                '--MainNav-height': '70px',
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
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            }}
          >
            <SideNav />
            <Box 
              sx={{ 
                display: 'flex', 
                flex: '1 1 auto', 
                flexDirection: 'column', 
                pl: { lg: 'var(--SideNav-width)' },
                transition: 'padding-left 0.3s ease-in-out',
              }}
            >
              <MainNav />
              <main>
                <Container 
                  maxWidth="xl" 
                  sx={{ 
                    py: { xs: '24px', md: '40px' },
                    px: { xs: '16px', md: '24px' },
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: '24px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      position: 'relative',
                      padding: { xs: '16px', md: '24px' },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        zIndex: -1,
                        margin: '-1px',
                        borderRadius: 'inherit',
                        background: 'linear-gradient(180deg, rgba(20, 184, 166, 0.15), rgba(99, 102, 241, 0.15))',
                      },
                    }}
                  >
                    {children}
                  </Box>
                </Container>
              </main>
            </Box>
          </Box>
        </StoreProvider>
      </AdminProvider>
    </AuthGuard>
  );
} 