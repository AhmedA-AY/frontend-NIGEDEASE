import axios from 'axios';
import { tokenStorage } from '@/utils/token-storage';

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

// Add a response interceptor to handle token refresh for the user management service
userManagementApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and we have a refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get refresh token
        const refreshToken = tokenStorage.getRefreshToken();
        
        if (!refreshToken) {
          // No refresh token, user needs to login again
          tokenStorage.clearTokens();
          return Promise.reject(error);
        }
        
        // Attempt to refresh the token
        const response = await axios.post<TokenResponse>(`${USER_MANAGEMENT_API}/auth/refresh-token/`, {
          refresh: refreshToken,
        });
        
        if (response.data?.access) {
          // Save the new tokens
          tokenStorage.saveTokens(
            response.data.access,
            response.data.refresh || refreshToken,
            tokenStorage.getUserRole() || '',
            tokenStorage.getUserEmail() || undefined
          );
          
          // Retry the original request with the new token
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          }
          return userManagementApiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token is invalid, clear tokens and redirect to login
        tokenStorage.clearTokens();
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
    
    // If error is 401 (Unauthorized) and we have a refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get refresh token
        const refreshToken = tokenStorage.getRefreshToken();
        
        if (!refreshToken) {
          // No refresh token, user needs to login again
          tokenStorage.clearTokens();
          return Promise.reject(error);
        }
        
        // Attempt to refresh the token using the user management service
        const response = await axios.post<TokenResponse>(`${USER_MANAGEMENT_API}/auth/refresh-token/`, {
          refresh: refreshToken,
        });
        
        if (response.data?.access) {
          // Save the new tokens
          tokenStorage.saveTokens(
            response.data.access,
            response.data.refresh || refreshToken,
            tokenStorage.getUserRole() || '',
            tokenStorage.getUserEmail() || undefined
          );
          
          // Retry the original request with the new token
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          }
          return coreApiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token is invalid, clear tokens and redirect to login
        tokenStorage.clearTokens();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
); 