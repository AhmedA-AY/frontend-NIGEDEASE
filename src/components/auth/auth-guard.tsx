'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';

import { paths } from '@/paths';
import { useAuth } from '@/providers/auth-provider';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { isAuthenticated, userRole } = useAuth();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const checkPermissions = React.useCallback(() => {
    if (!isAuthenticated) {
      console.log('[AuthGuard]: User is not authenticated, redirecting to sign in');
      router.replace(paths.auth.signIn);
      return;
    }

    setIsChecking(false);
  }, [isAuthenticated, router]);

  React.useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  if (isChecking) {
    return null;
  }

  if (error) {
    return <Alert color="error" severity="error">{error}</Alert>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
