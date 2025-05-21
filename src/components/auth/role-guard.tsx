'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';

import { paths } from '@/paths';
import { useAuth } from '@/providers/auth-provider';

export type AllowedRole = 'super_admin' | 'admin' | 'sales' | 'stock_manager';

export interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: AllowedRole[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { isAuthenticated, userRole } = useAuth();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const checkPermissions = React.useCallback(() => {
    if (!isAuthenticated) {
      console.log('[RoleGuard]: User is not authenticated, redirecting to sign in');
      router.replace(paths.auth.signIn);
      return;
    }

    if (!userRole) {
      setError('Unable to verify user role. Please try logging in again.');
      setIsChecking(false);
      return;
    }

    if (!allowedRoles.includes(userRole as AllowedRole)) {
      console.log(`[RoleGuard]: User role ${userRole} is not allowed, redirecting to appropriate dashboard`);
      
      // Redirect based on role
      if (userRole === 'super_admin') {
        router.replace(paths.superAdmin.dashboard);
      } else if (userRole === 'admin') {
        router.replace(paths.admin.dashboard);
      } else if (userRole === 'sales') {
        router.replace(paths.salesman.dashboard);
      } else if (userRole === 'stock_manager') {
        router.replace(paths.stockManager.dashboard);
      } else {
        router.replace(paths.dashboard.overview);
      }
      return;
    }

    setIsChecking(false);
  }, [isAuthenticated, userRole, allowedRoles, router]);

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