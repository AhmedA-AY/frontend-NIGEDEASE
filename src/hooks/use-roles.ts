import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rolesApi, Role, CreateRoleData, UpdateRoleData } from '@/services/api/roles';

// Hook to get all roles
export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesApi.getRoles(),
  });
};

// Hook to get a specific role
export const useRole = (id: string) => {
  return useQuery({
    queryKey: ['roles', id],
    queryFn: () => rolesApi.getRole(id),
    enabled: !!id,
  });
};

// Hook to create a new role
export const useCreateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (roleData: CreateRoleData) => rolesApi.createRole(roleData),
    onSuccess: () => {
      // Invalidate the roles query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

// Hook to update a role
export const useUpdateRole = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (roleData: UpdateRoleData) => rolesApi.updateRole(id, roleData),
    onSuccess: () => {
      // Invalidate the specific role query and the roles list
      queryClient.invalidateQueries({ queryKey: ['roles', id] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

// Hook to delete a role
export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => rolesApi.deleteRole(id),
    onSuccess: () => {
      // Invalidate the roles query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}; 