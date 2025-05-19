import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { permissionsApi, CreatePermissionData, UpdatePermissionData } from '@/services/api/permissions';

// Hook to get all permissions
export const usePermissions = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: () => permissionsApi.getPermissions(),
  });
};

// Hook to get a specific permission
export const usePermission = (id: string) => {
  return useQuery({
    queryKey: ['permissions', id],
    queryFn: () => permissionsApi.getPermission(id),
    enabled: !!id,
  });
};

// Hook to create a new permission
export const useCreatePermission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (permissionData: CreatePermissionData) => permissionsApi.createPermission(permissionData),
    onSuccess: () => {
      // Invalidate the permissions query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
};

// Hook to update a permission
export const useUpdatePermission = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (permissionData: UpdatePermissionData) => permissionsApi.updatePermission(id, permissionData),
    onSuccess: () => {
      // Invalidate the specific permission query and the permissions list
      queryClient.invalidateQueries({ queryKey: ['permissions', id] });
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
};

// Hook to delete a permission
export const useDeletePermission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => permissionsApi.deletePermission(id),
    onSuccess: () => {
      // Invalidate the permissions query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
}; 