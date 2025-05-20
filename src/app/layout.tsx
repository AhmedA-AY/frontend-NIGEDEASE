'use client';

import * as React from 'react';
import type { Viewport } from 'next';
import { SnackbarProvider } from 'notistack';

import '@/styles/global.css';

import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { StoreProvider } from '@/providers/store-provider';
import { QueryProvider } from '@/providers/query-provider';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <head>
        <title>NIGED-EASE | Business Management</title>
        <meta name="description" content="Modern business management solution for Ethiopian businesses" />
      </head>
      <body>
        <LocalizationProvider>
          <AuthProvider>
            <QueryProvider>
              <StoreProvider>
                <UserProvider>
                  <ThemeProvider>
                    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
                      {children}
                    </SnackbarProvider>
                  </ThemeProvider>
                </UserProvider>
              </StoreProvider>
            </QueryProvider>
          </AuthProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
