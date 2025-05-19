// Constants for token keys
const ACCESS_TOKEN_KEY = 'niged_ease_access_token';
const REFRESH_TOKEN_KEY = 'niged_ease_refresh_token';
const USER_ROLE_KEY = 'niged_ease_user_role';
const USER_EMAIL_KEY = 'niged_ease_user_email';
const USER_ID_KEY = 'niged_ease_user_id';

// Helper to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Helper to decode JWT token
const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

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
    
    // Extract user ID from token and store it
    const decodedToken = decodeToken(accessToken);
    if (decodedToken && decodedToken.user_id) {
      localStorage.setItem(USER_ID_KEY, decodedToken.user_id);
    }
  },
  
  // Save user info separately
  saveUserInfo: (userId: string, email: string, role: string): void => {
    if (!isBrowser) return;
    
    localStorage.setItem(USER_ID_KEY, userId);
    localStorage.setItem(USER_EMAIL_KEY, email);
    localStorage.setItem(USER_ROLE_KEY, role);
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
  
  // Get user ID
  getUserId: (): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(USER_ID_KEY);
  },
  
  // Get user info from token
  getUserInfo: (): { id?: string; email?: string; role?: string; company_id?: string } => {
    if (!isBrowser) return {};
    
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!accessToken) return {};
    
    const decodedToken = decodeToken(accessToken);
    const email = localStorage.getItem(USER_EMAIL_KEY);
    const role = localStorage.getItem(USER_ROLE_KEY);
    
    return {
      id: decodedToken?.user_id || decodedToken?.sub,
      email: email || decodedToken?.email,
      role: role || decodedToken?.role,
      company_id: decodedToken?.company_id
    };
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
    localStorage.removeItem(USER_ID_KEY);
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (!isBrowser) return false;
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  }
}; 