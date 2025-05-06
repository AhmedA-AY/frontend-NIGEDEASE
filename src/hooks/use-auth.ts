import { useState, useEffect } from 'react';
import { useAuth as useBaseAuth } from '@/providers/auth-provider';
import { authApi } from '@/services/api/auth';

interface UserInfo {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_id: string;
  role: string;
}

export function useAuth() {
  return useBaseAuth();
}

export function useCurrentUser() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isAuthenticated } = useBaseAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchUserInfo = async () => {
      if (!isAuthenticated) {
        console.log("User is not authenticated, skipping profile fetch");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching user profile...");
        setIsLoading(true);
        const userData = await authApi.getProfile();
        console.log("User profile received:", userData);
        
        if (isMounted) {
          // Force cast to UserInfo to avoid TS errors
          setUserInfo(userData as unknown as UserInfo);
          console.log("UserInfo set:", userData);
        }
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        
        if (err.response) {
          console.error("API response error:", err.response.status, err.response.data);
        }
        
        if (isMounted) {
          setError(err as Error);
          console.log("Error set in useCurrentUser");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          console.log("Loading finished in useCurrentUser");
        }
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  return { userInfo, isLoading, error };
} 