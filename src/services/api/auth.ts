import { userManagementApiClient, coreApiClient } from './client';
import tokenStorage from '@/utils/token-storage';
import { decodeToken } from '@/utils/token-helpers';
import { userApiProxy } from '@/utils/proxy-api';

export interface AuthResponse {
  access: string;
  refresh: string;
  role: string;
  company_id: string;
  stores: {
    id: string;
    name: string;
    location: string;
    created_at: string;
    updated_at: string;
    is_active: string;
  }[];
  user: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    role: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface VerifyResetTokenData {
  token: string;
}

export interface SetNewPasswordData {
  token: string;
  password: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_image?: string;
}

export type ApiError = {
  error: string;
  statusCode?: number;
};

export interface RegisterRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface CreateUserData {
  company_id: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  role: string;
  profile_image?: string;
  assigned_store?: string;
}

export interface UserResponse {
  id: string;
  company_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

// Auth API
export const authApi = {
  // Login with email and password
  login: async (email: string, password: string): Promise<{ message: string }> => {
    try {
      // Use the proxy function for authentication
      const response = await userApiProxy('/auth/login/', 'POST', { email, password });
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Verify OTP after login
  verifyOtp: async (email: string, otp: string): Promise<{ 
    access: string; 
    refresh: string; 
    role: string; 
    company_id: string;
    stores: any[];
    assigned_store?: any;
  }> => {
    try {
      // Use the proxy function for OTP verification
      const response = await userApiProxy('/auth/verify-otp/', 'POST', { email, otp });
      return response;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  },
  
  // Resend OTP
  resendOtp: async (email: string): Promise<{ message: string }> => {
    try {
      // Use the proxy function to resend OTP
      const response = await userApiProxy('/auth/resend-otp/', 'POST', { email });
      return response;
    } catch (error) {
      console.error('Error resending OTP:', error);
      throw error;
    }
  },
  
  // Verify token
  verifyToken: async (token: string): Promise<{
    is_valid: boolean;
    user_id?: string;
    email?: string;
    company_id?: string;
  }> => {
    try {
      // Use the proxy function to verify token
      const response = await userApiProxy('/auth/verify-token/', 'POST', { token });
      return response;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw error;
    }
  },
  
  // Register a new user
  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    try {
      // Use the proxy function for registration
      const response = await userApiProxy('/auth/register/', 'POST', data);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Create a user for a company
  createUser: async (userData: CreateUserData): Promise<UserResponse> => {
    try {
      // Use the proxy function to create user
      const response = await userApiProxy('/users/', 'POST', userData);
      return response;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },
  
  // Logout user
  logout: async (): Promise<void> => {
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (refreshToken) {
      try {
        // Use the proxy function for logout
        await userApiProxy('/auth/logout/', 'POST', { refresh: refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    // Clear tokens regardless of API call success
    tokenStorage.clearTokens();
  },
  
  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{ access: string; refresh: string }> => {
    try {
      // Use the proxy function for token refresh
      const response = await userApiProxy('/auth/refresh-token/', 'POST', { refresh_token: refreshToken });
      return response;
    } catch (error: any) {
      // Enhance error with more context to improve debugging and error handling
      if (error.response && 
          (error.response.status === 401 || error.response.status === 400) &&
          (error.response.data?.detail === "Invalid or expired token" || 
           error.response.data?.error === "Invalid token" ||
           error.response.data?.error?.includes("expired"))) {
        console.error('Refresh token is invalid or expired');
        // Create a more specific error to help with error handling
        const enhancedError = new Error('Refresh token expired');
        enhancedError.name = 'ExpiredRefreshTokenError';
        // Pass along the original response
        (enhancedError as any).response = error.response;
        throw enhancedError;
      }
      
      // For other errors, just rethrow
      throw error;
    }
  },
  
  // Request password reset
  requestPasswordReset: async (data: ResetPasswordData): Promise<{ success: boolean; message: string }> => {
    try {
      // Use the proxy function for password reset request
      const response = await userApiProxy('/auth/request-reset-password/', 'POST', data);
      return response;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  },
  
  // Verify reset token
  verifyResetToken: async (data: VerifyResetTokenData): Promise<{ success: boolean; message: string }> => {
    try {
      // Use the proxy function to verify reset token
      const response = await userApiProxy('/auth/verify-reset-token/', 'POST', data);
      return response;
    } catch (error) {
      console.error('Reset token verification error:', error);
      throw error;
    }
  },
  
  // Set new password
  setNewPassword: async (data: SetNewPasswordData): Promise<{ success: boolean; message: string }> => {
    try {
      // Use the proxy function to set new password
      const response = await userApiProxy('/auth/set-new-password/', 'POST', data);
      return response;
    } catch (error) {
      console.error('Set new password error:', error);
      throw error;
    }
  },
  
  // Change password
  changePassword: async (data: ChangePasswordData): Promise<{ success: boolean; message: string }> => {
    try {
      // Use the proxy function to change password
      const response = await userApiProxy('/auth/change-password/', 'POST', data);
      return response;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },
  
  // Get current user profile
  getProfile: async (): Promise<any> => {
    try {
      // First get the user's info from the token
      const userInfoFromToken = tokenStorage.getUserInfo();
      if (!userInfoFromToken || !userInfoFromToken.id) {
        throw new Error('No user ID available in token');
      }
      
      // Then fetch the full user details using the proxy
      const response = await userApiProxy(`/users/${userInfoFromToken.id}/`);
      return response;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (data: ProfileUpdateData): Promise<AuthResponse['user']> => {
    try {
      // Get the user ID from token
      const userInfo = tokenStorage.getUserInfo();
      if (!userInfo || !userInfo.id) {
        throw new Error('No user ID available in token');
      }
      
      // First get the current user data so we have all required fields
      const currentUserData = await authApi.getProfile();
      
      // Now update the user profile with all required fields plus the new data
      const response = await userApiProxy(
        `/users/${userInfo.id}/`, 
        'PUT',
        {
          company_id: currentUserData.company_id,
          email: data.email || currentUserData.email,
          first_name: data.first_name || currentUserData.first_name || '',
          last_name: data.last_name || currentUserData.last_name || '',
          role: currentUserData.role,
          profile_image: data.profile_image || currentUserData.profile_image || ''
        }
      );
      
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  
  // Upload and update profile image
  updateProfileImage: async (imageUrl: string): Promise<AuthResponse['user']> => {
    try {
      // First get the user ID
      const userInfo = tokenStorage.getUserInfo();
      if (!userInfo || !userInfo.id) {
        throw new Error('No user ID available in token');
      }
      
      // First get the current user data so we have all required fields
      const currentUserData = await authApi.getProfile();
      
      // Only validate URL if it's not empty (empty means remove the image)
      if (imageUrl) {
        // Validate URL format and length
        if (imageUrl.length > 255) {
          throw new Error('Image URL must be less than 255 characters');
        }
        
        try {
          new URL(imageUrl); // This will throw if the URL is invalid
        } catch (e) {
          throw new Error('Please enter a valid URL');
        }
      }
      
      console.log('Updating profile image with:', imageUrl === '' ? '[EMPTY STRING]' : imageUrl);
      
      // Now update the user profile with all required fields plus the new image URL using the proxy
      const response = await userApiProxy(
        `/users/${userInfo.id}/`, 
        'PUT',
        {
          company_id: currentUserData.company_id,
          email: currentUserData.email,
          first_name: currentUserData.first_name || '',
          last_name: currentUserData.last_name || '',
          role: currentUserData.role,
          profile_image: imageUrl // Empty string will remove the image
        }
      );
      
      console.log('Profile update response:', response);
      return response;
    } catch (error) {
      console.error('Error updating profile image:', error);
      throw error;
    }
  },
  
  // Check if authenticated (verifies token)
  checkAuth: async (): Promise<boolean> => {
    try {
      await userApiProxy('/auth/check/');
      return true;
    } catch (error) {
      return false;
    }
  }
}; 