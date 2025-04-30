'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { useSelectedLayoutSegment } from 'next/navigation';
import { SideNav } from '@/components/stock-manager/layout/side-nav';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  // Get the current segment to determine which nav item is active
  const segment = useSelectedLayoutSegment();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        '--SideNav-width': '280px',
        '--SideNav-zIndex': 1100,
      }}
    >
      <SideNav />
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', pl: { lg: 'var(--SideNav-width)' } }}>
        {children}
      </Box>
    </Box>
  );
} 