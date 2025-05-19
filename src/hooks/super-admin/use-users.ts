import { useApiQuery, useApiMutation } from '@/utils/api';
import { useQueryClient } from '@tanstack/react-query';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'stock-manager' | 'salesman';
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface UserInput {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'stock-manager' | 'salesman';
}

// Get all users with pagination and filters
export function useUsers(params: UserParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.role) queryParams.append('role', params.role);
  if (params.status) queryParams.append('status', params.status);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

  const endpoint = `/users?${queryParams.toString()}`;
  
  return useApiQuery<UsersResponse>(
    ['users', JSON.stringify(params)], 
    endpoint
  );
}

// Get a single user by ID
export function useUser(id: string) {
  return useApiQuery<User>(
    ['user', id], 
    `/users/${id}`,
    {
      enabled: !!id, // Only run query if id is provided
    }
  );
}

// Create a new user
export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useApiMutation<User, UserInput>(
    '/users',
    'POST',
    {
      onSuccess: () => {
        // Invalidate users list to refresh data
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    }
  );
}

// Update an existing user
export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<User, Partial<UserInput>>(
    `/users/${id}`,
    'PATCH',
    {
      onSuccess: () => {
        // Invalidate specific user and users list
        queryClient.invalidateQueries({ queryKey: ['user', id] });
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    }
  );
}

// Delete a user
export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, string>(
    '/users',
    'DELETE',
    {
      onSuccess: (_, userId) => {
        // Invalidate users list to refresh data
        queryClient.invalidateQueries({ queryKey: ['users'] });
        queryClient.invalidateQueries({ queryKey: ['user', userId] });
      },
    }
  );
}

// Activate/Deactivate a user
export function useToggleUserStatus(id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<User, { status: 'active' | 'inactive' }>(
    `/users/${id}/status`,
    'PATCH',
    {
      onSuccess: () => {
        // Invalidate specific user and users list
        queryClient.invalidateQueries({ queryKey: ['user', id] });
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    }
  );
} 