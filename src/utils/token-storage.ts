// Constants for token keys
const ACCESS_TOKEN_KEY = 'niged_ease_access_token';
const REFRESH_TOKEN_KEY = 'niged_ease_refresh_token';
const USER_ROLE_KEY = 'niged_ease_user_role';
const USER_EMAIL_KEY = 'niged_ease_user_email';

// Helper to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Token storage utility
export const tokenStorage = {
  // Save tokens and user info
  saveTokens: (accessToken: string, refreshToken: string, role: string, email?: string): void => {
    if (!isBrowser) return;
    
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_ROLE_KEY, role);
    
    if (email) {
      localStorage.setItem(USER_EMAIL_KEY, email);
    }
  },
  
  // Get access token
  getAccessToken: (): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  
  // Get refresh token
  getRefreshToken: (): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  
  // Get user role
  getUserRole: (): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(USER_ROLE_KEY);
  },
  
  // Get user email
  getUserEmail: (): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(USER_EMAIL_KEY);
  },
  
  // Save email temporarily (for OTP flow)
  saveEmail: (email: string): void => {
    if (!isBrowser) return;
    localStorage.setItem(USER_EMAIL_KEY, email);
  },
  
  // Clear all tokens and user info
  clearTokens: (): void => {
    if (!isBrowser) return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (!isBrowser) return false;
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  }
}; 