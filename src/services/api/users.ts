import { userManagementApiClient } from './client';
import { CreateUserData, UserResponse } from './auth';

// User API
export const usersApi = {
  // Get all users
  getUsers: async (): Promise<UserResponse[]> => {
    const response = await userManagementApiClient.get<UserResponse[]>('/users/');
    return response.data;
  },

  // Get user by ID
  getUser: async (id: string): Promise<UserResponse> => {
    const response = await userManagementApiClient.get<UserResponse>(`/users/${id}/`);
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