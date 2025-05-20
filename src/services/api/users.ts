import { userManagementApiClient } from './client';
import { CreateUserData, UserResponse } from './auth';

// Extended UserResponse type with assigned_store
export interface ExtendedUserResponse extends UserResponse {
  assigned_store?: {
    id: string;
    name: string;
    location?: string;
    is_active?: string;
    [key: string]: any;
  } | null;
}

// User API
export const usersApi = {
  // Get all users
  getUsers: async (company_id?: string | null): Promise<UserResponse[]> => {
    let url = '/users/';
    if (company_id) {
      url += `?company_id=${company_id}`;
    }
    const response = await userManagementApiClient.get<UserResponse[]>(url);
    return response.data;
  },

  // Get user by ID
  getUser: async (id: string): Promise<ExtendedUserResponse> => {
    const response = await userManagementApiClient.get<ExtendedUserResponse>(`/users/${id}/`);
    return response.data;
  },

  // Create a new user
  createUser: async (userData: CreateUserData): Promise<UserResponse> => {
    const response = await userManagementApiClient.post<UserResponse>('/users/', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, userData: Partial<CreateUserData>): Promise<UserResponse> => {
    const response = await userManagementApiClient.put<UserResponse>(`/users/${id}/`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await userManagementApiClient.delete(`/users/${id}/`);
  }
}; 