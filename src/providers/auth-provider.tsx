'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { tokenStorage } from '@/utils/token-storage';
import { paths } from '@/paths';
import { authApi } from '@/services/api/auth';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      retry: 1,
    },
  },
});

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  userRole: string | null;
  login: (accessToken: string, refreshToken: string, role: string, email?: string) => void;
  logout: () => void;
  saveEmail: (email: string) => void;
  refreshTokenIfNeeded: () => Promise<string | null>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [userRole, setUserRole] = React.useState<string | null>(null);

  // Initialize auth state from storage on client-side
  React.useEffect(() => {
    const isAuthenticatedFromStorage = tokenStorage.isAuthenticated();
    const emailFromStorage = tokenStorage.getUserEmail();
    const roleFromStorage = tokenStorage.getUserRole();
    
    setIsAuthenticated(isAuthenticatedFromStorage);
    setUserEmail(emailFromStorage);
    setUserRole(roleFromStorage);
  }, []);

  const login = React.useCallback(
    (accessToken: string, refreshToken: string, role: string, email?: string) => {
      tokenStorage.saveTokens(accessToken, refreshToken, role, email);
      setIsAuthenticated(true);
      setUserRole(role);
      
      if (email) {
        setUserEmail(email);
      }
      
      // Redirect based on role - ensure the role is properly set to lowercase for comparison
      const userRole = role.toLowerCase();
      console.log('Redirecting user with role:', userRole);
      
      if (userRole === 'super_admin') {
        router.push(paths.superAdmin.dashboard);
      } else if (userRole === 'admin') {
        router.push(paths.admin.dashboard);
      } else if (userRole === 'salesman') {
        router.push(paths.salesman.dashboard);
      } else if (userRole === 'stock_manager') {
        router.push(paths.stockManager.dashboard);
      } else {
        router.push(paths.dashboard.overview);
      }
    },
    [router]
  );

  const logout = React.useCallback(async () => {
    try {
      // Call logout API
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Regardless of API success, clear tokens and state
      tokenStorage.clearTokens();
      setIsAuthenticated(false);
      setUserEmail(null);
      setUserRole(null);
      
      // Clear React Query cache
      queryClient.clear();
      
      // Redirect to login page
      router.push(paths.auth.signIn);
    }
  }, [router]);

  const saveEmail = React.useCallback((email: string) => {
    tokenStorage.saveEmail(email);
    setUserEmail(email);
  }, []);

  // New function to refresh token if needed
  const refreshTokenIfNeeded = React.useCallback(async (): Promise<string | null> => {
    try {
      // Check if access token exists
      const accessToken = tokenStorage.getAccessToken();
      
      if (!accessToken) {
        return null;
      }
      
      // Verify if the token is valid using the new endpoint
      const isValid = await authApi.verifyToken(accessToken);
      
      if (isValid) {
        return accessToken;
      }
      
      // If not valid, try to refresh
      const refreshToken = tokenStorage.getRefreshToken();
      
      if (!refreshToken) {
        // No refresh token available
        tokenStorage.clearTokens();
        setIsAuthenticated(false);
        router.push(paths.auth.signIn);
        return null;
      }
      
      try {
        // Refresh token
        const tokenResponse = await authApi.refreshToken(refreshToken);
        
        // Save new tokens
        tokenStorage.saveTokens(
          tokenResponse.access,
          tokenResponse.refresh,
          tokenStorage.getUserRole() || '',
          tokenStorage.getUserEmail() || undefined
        );
        
        return tokenResponse.access;
      } catch (refreshError: any) {
        // Specifically handle invalid or expired refresh token errors
        if (refreshError.response && 
            (refreshError.response.status === 401 || refreshError.response.status === 400) &&
            (refreshError.response.data?.detail === "Invalid or expired token" || 
             refreshError.response.data?.error === "Invalid token" ||
             refreshError.response.data?.error?.includes("expired"))) {
          console.error('Refresh token expired or invalid. Logging out.');
          // Force logout and redirect to login
          await logout();
        } else {
          // For other errors, also logout but with different logging
          console.error('Error during token refresh:', refreshError);
          await logout();
        }
        return null;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      
      // Clear auth state on failure
      tokenStorage.clearTokens();
      setIsAuthenticated(false);
      router.push(paths.auth.signIn);
      return null;
    }
  }, [router, logout]);

  const contextValue = React.useMemo(
    () => ({
      isAuthenticated,
      userEmail,
      userRole,
      login,
      logout,
      saveEmail,
      refreshTokenIfNeeded,
    }),
    [isAuthenticated, userEmail, userRole, login, logout, saveEmail, refreshTokenIfNeeded]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    </QueryClientProvider>
  );
} 