'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { paths } from '@/paths';
import { authApi } from '@/services/api/auth';
import tokenStorage from '@/utils/token-storage';

// Types
export type Store = {
  id: string;
  name: string;
  location: string;
  created_at: string;
  updated_at: string;
  is_active: string;
};

export interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  userRole: string | null;
  userInfo: any;
  login: (email: string, password: string) => Promise<void>;
  verifyOtp: (email: string, otp: string, stores?: Store[], assignedStore?: Store) => Promise<void>;
  logout: () => void;
  stores: Store[];
  assignedStore: Store | null;
  saveEmail: (email: string) => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [assignedStore, setAssignedStore] = useState<Store | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = tokenStorage.getAccessToken();
        const role = tokenStorage.getUserRole();
        
        if (accessToken) {
          try {
            // Verify token with backend
            const tokenInfo = await authApi.verifyToken(accessToken);
            if (tokenInfo.is_valid) {
              setIsAuthenticated(true);
              setUserRole(role);
              
              // Set user info
              setUserInfo({
                id: tokenInfo.user_id,
                email: tokenInfo.email,
                role: role,
                company_id: tokenInfo.company_id,
              });
              
              // Load stores from storage
              const storedStores = tokenStorage.getCompanyStores();
              if (storedStores && storedStores.length > 0) {
                setStores(storedStores);
              }
              
              // Load assigned store for non-admin users
              const storedAssignedStore = tokenStorage.getAssignedStore();
              if (storedAssignedStore) {
                setAssignedStore(storedAssignedStore);
              }
            } else {
              // Token is invalid
              handleLogout();
            }
          } catch (error) {
            console.error('Error verifying token:', error);
            handleLogout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initAuth();
  }, []);

  // Check if user should be redirected based on role & path
  useEffect(() => {
    if (isInitialized) {
      const isAuthRoute = pathname?.includes('/auth');
      
      // Redirect to login if not authenticated and not on auth page
      if (!isAuthenticated && !isAuthRoute && pathname !== '/') {
        router.push(paths.auth.signIn);
      }
      
      // Redirect to dashboard if authenticated but on login page
      if (isAuthenticated && isAuthRoute) {
        if (userRole === 'super_admin') {
          router.push(paths.superAdmin.dashboard);
        } else if (userRole === 'admin') {
          router.push(paths.admin.dashboard);
        } else if (userRole === 'stock_manager') {
          router.push(paths.stockManager.dashboard);
        } else if (userRole === 'sales') {
          router.push(paths.salesman.dashboard);
        } else {
          // Default fallback
          router.push(paths.admin.dashboard);
        }
      }
    }
  }, [isAuthenticated, isInitialized, pathname, router, userRole]);

  // Login function - Step 1: Email/Password
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authApi.login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function - Step 2: Verify OTP
  const handleVerifyOtp = async (email: string, otp: string, stores?: Store[], assignedStore?: Store) => {
    setIsLoading(true);
    try {
      const response = await authApi.verifyOtp(email, otp);
      const { access, refresh, role } = response;
      
      // Store tokens
      tokenStorage.saveTokens(
        access, 
        refresh, 
        role, 
        assignedStore || response.assigned_store, 
        stores || response.stores
      );
      
      // Update state
      setIsAuthenticated(true);
      setUserRole(role);
      
      // Set user info
      const tokenInfo = await authApi.verifyToken(access);
      if (tokenInfo.is_valid) {
        setUserInfo({
          id: tokenInfo.user_id,
          email: tokenInfo.email,
          role: role,
          company_id: tokenInfo.company_id,
        });
      }
      
      // Set stores and assigned store
      if (response.stores) {
        setStores(response.stores);
      }
      
      if (response.assigned_store || assignedStore) {
        setAssignedStore(response.assigned_store || assignedStore);
      }
      
      // Redirect based on role
      if (role === 'super_admin') {
        router.push(paths.superAdmin.dashboard);
      } else if (role === 'admin') {
        router.push(paths.admin.dashboard);
      } else if (role === 'stock_manager') {
        router.push(paths.stockManager.dashboard);
      } else if (role === 'sales') {
        router.push(paths.salesman.dashboard);
      } else {
        // Default fallback
        router.push(paths.admin.dashboard);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    // Clear tokens
    tokenStorage.clearTokens();
    
    // Reset state
    setIsAuthenticated(false);
    setUserRole(null);
    setUserInfo(null);
    setStores([]);
    setAssignedStore(null);
    
    // Redirect to login
    router.push(paths.auth.signIn);
  };

  // Save email function for OTP flow
  const handleSaveEmail = (email: string) => {
    tokenStorage.saveEmail(email);
  };

  // Context value
  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      isInitialized,
      isLoading,
      userRole,
      userInfo,
      login: handleLogin,
      verifyOtp: handleVerifyOtp,
      logout: handleLogout,
      stores,
      assignedStore,
      saveEmail: handleSaveEmail
    }),
    [
      isAuthenticated,
      isInitialized,
      isLoading,
      userRole,
      userInfo,
      stores,
      assignedStore
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 