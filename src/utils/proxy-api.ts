import axios from 'axios';
import tokenStorage from '@/utils/token-storage';

// Base URL for the API proxy
const API_PROXY_URL = typeof window !== 'undefined' ? 
  window.location.origin + '/api/proxy' : 
  process.env.NEXT_PUBLIC_VERCEL_URL ? 
    `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/proxy` : 
    'https://nigedease-git-main-ahmeda-ays-projects.vercel.app/api/proxy';

// Create axios instance for the proxy
export const proxyApiClient = axios.create({
  baseURL: API_PROXY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
proxyApiClient.interceptors.request.use(
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

/**
 * Call the core API through the proxy
 * @param path - API endpoint path
 * @param method - HTTP method
 * @param data - Request data (for POST/PUT)
 * @returns Promise with response data
 */
export async function coreApiProxy(path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) {
  try {
    // Build the query parameters
    const params = new URLSearchParams();
    params.append('target', 'core');
    params.append('path', path);
    
    // Make the request through the proxy
    const response = await proxyApiClient({
      url: `?${params.toString()}`,
      method: method,
      data: method !== 'GET' ? data : undefined,
    });
    
    return response.data;
  } catch (error) {
    console.error('API proxy error:', error);
    throw error;
  }
}

/**
 * Call the user management API through the proxy
 * @param path - API endpoint path
 * @param method - HTTP method
 * @param data - Request data (for POST/PUT)
 * @returns Promise with response data
 */
export async function userApiProxy(path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) {
  try {
    // Build the query parameters
    const params = new URLSearchParams();
    params.append('target', 'users');
    params.append('path', path);
    
    // Make the request through the proxy
    const response = await proxyApiClient({
      url: `?${params.toString()}`,
      method: method,
      data: method !== 'GET' ? data : undefined,
    });
    
    return response.data;
  } catch (error) {
    console.error('API proxy error:', error);
    throw error;
  }
}

// Example usage:
// Login through the proxy
export async function loginProxy(email: string, password: string) {
  return userApiProxy('/auth/login/', 'POST', { email, password });
}

// Get user profile through the proxy
export async function getUserProfileProxy() {
  return userApiProxy('/auth/user/');
}

// Generic fetcher function for SWR
export const proxyFetcher = async (url: string) => {
  // Determine if this is a user or core API call
  const isUserApi = url.startsWith('/auth') || url.startsWith('/users');
  
  if (isUserApi) {
    return userApiProxy(url);
  } else {
    return coreApiProxy(url);
  }
}; 