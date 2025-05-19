import { userManagementApiClient } from './client';
import { Permission } from './roles';

export interface CreatePermissionData {
  name: string;
  description: string;
}

export interface UpdatePermissionData {
  name?: string;
  description?: string;
}

// Permissions API
export const permissionsApi = {
  // Get all permissions
  getPermissions: async (): Promise<Permission[]> => {
    const response = await userManagementApiClient.get<Permission[]>('/permissions/');
    return response.data;
  },

  // Get permission by ID
  getPermission: async (id: string): Promise<Permission> => {
    const response = await userManagementApiClient.get<Permission>(`/permissions/${id}/`);
    return response.data;
  },

  // Create a new permission
  createPermission: async (permissionData: CreatePermissionData): Promise<Permission> => {
    const response = await userManagementApiClient.post<Permission>('/permissions/', permissionData);
    return response.data;
  },

  // Update permission
  updatePermission: async (id: string, permissionData: UpdatePermissionData): Promise<Permission> => {
    const response = await userManagementApiClient.put<Permission>(`/permissions/${id}/`, permissionData);
    return response.data;
  },

  // Delete permission
  deletePermission: async (id: string): Promise<void> => {
    await userManagementApiClient.delete(`/permissions/${id}/`);
  }
}; 