import axios from 'axios';
import { tokenStorage } from '@/utils/token-storage';
import { paths } from '@/paths';

// API Base URLs
export const USER_MANAGEMENT_API = 'https://niged-ease-backend-1.onrender.com';
export const CORE_API = 'https://niged-ease-backend.onrender.com';

// Create axios instance for the user management service
export const userManagementApiClient = axios.create({
  baseURL: USER_MANAGEMENT_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for the core service
export const coreApiClient = axios.create({
  baseURL: CORE_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic API client (primarily for backward compatibility)
export const apiClient = coreApiClient;

interface TokenResponse {
  access: string;
  refresh?: string;
}

// Is token refresh in progress
let isRefreshing = false;
// Queue of failed requests to retry after token refresh
let failedQueue: {resolve: (value: unknown) => void; reject: (reason?: any) => void; config: any}[] = [];

// Process failed queue - either retry all requests or reject them all
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.config.headers['Authorization'] = `Bearer ${token}`;
      promise.resolve(axios(promise.config));
    }
  });
  
  failedQueue = [];
};

// Add a request interceptor to include auth token for user management service
userManagementApiClient.interceptors.request.use(
  (config) => {
    // Get access token from storage
    const token = tokenStorage.getAccessToken();
    
    // If token exists, add it to the headers
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a request interceptor to include auth token for core service
coreApiClient.interceptors.request.use(
  (config) => {
    // Get access token from storage (same token used for both services)
    const token = tokenStorage.getAccessToken();
    
    // If token exists, add it to the headers
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to refresh token
const refreshAuthToken = async () => {
  try {
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await axios.post<TokenResponse>(`${USER_MANAGEMENT_API}/auth/refresh-token/`, {
      refresh_token: refreshToken // Updated to match the API parameter name
    });
    
    if (response.data?.access) {
      // Save the new tokens
      tokenStorage.saveTokens(
        response.data.access,
        response.data.refresh || refreshToken,
        tokenStorage.getUserRole() || '',
        tokenStorage.getUserEmail() || undefined
      );
      
      return response.data.access;
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    // If refresh token is invalid or expired, redirect to login
    tokenStorage.clearTokens();
    
    // Handle client-side navigation
    if (typeof window !== 'undefined') {
      window.location.href = paths.auth.signIn;
    }
    
    throw error;
  }
};

// Add a response interceptor to handle token refresh for the user management service
userManagementApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the request already retried or doesn't have a config, reject immediately
    if (!originalRequest || originalRequest._retry === true) {
      return Promise.reject(error);
    }
    
    // If error is 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Set retry flag
      originalRequest._retry = true;
      
      // If refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }
      
      isRefreshing = true;
      
      try {
        // Try to refresh the token
        const newToken = await refreshAuthToken();
        
        // If successful, update the header and retry the request
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        }
        
        // Process any queued requests
        processQueue(null, newToken);
        
        isRefreshing = false;
        return userManagementApiClient(originalRequest);
      } catch (refreshError) {
        // Process queued requests with the error
        processQueue(refreshError);
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh for the core service
coreApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the request already retried or doesn't have a config, reject immediately
    if (!originalRequest || originalRequest._retry === true) {
      return Promise.reject(error);
    }
    
    // If error is 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Set retry flag
      originalRequest._retry = true;
      
      // If refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }
      
      isRefreshing = true;
      
      try {
        // Try to refresh the token
        const newToken = await refreshAuthToken();
        
        // If successful, update the header and retry the request
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        }
        
        // Process any queued requests
        processQueue(null, newToken);
        
        isRefreshing = false;
        return coreApiClient(originalRequest);
      } catch (refreshError) {
        // Process queued requests with the error
        processQueue(refreshError);
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
); 