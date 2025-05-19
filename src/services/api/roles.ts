import { userManagementApiClient } from './client';

export interface Permission {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export interface CreateRoleData {
  name: string;
  description: string;
  permission_ids: string[];
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  permission_ids?: string[];
}

// Roles API
export const rolesApi = {
  // Get all roles
  getRoles: async (): Promise<Role[]> => {
    const response = await userManagementApiClient.get<Role[]>('/roles/');
    return response.data;
  },

  // Get role by ID
  getRole: async (id: string): Promise<Role> => {
    const response = await userManagementApiClient.get<Role>(`/roles/${id}/`);
    return response.data;
  },

  // Create a new role
  createRole: async (roleData: CreateRoleData): Promise<Role> => {
    const response = await userManagementApiClient.post<Role>('/roles/', roleData);
    return response.data;
  },

  // Update role
  updateRole: async (id: string, roleData: UpdateRoleData): Promise<Role> => {
    const response = await userManagementApiClient.put<Role>(`/roles/${id}/`, roleData);
    return response.data;
  },

  // Delete role
  deleteRole: async (id: string): Promise<void> => {
    await userManagementApiClient.delete(`/roles/${id}/`);
  }
}; 