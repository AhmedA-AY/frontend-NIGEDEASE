import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clothingsApi, Color, ColorCreateData, ColorUpdateData, Collection, CollectionCreateData, CollectionUpdateData, Season, SeasonCreateData, SeasonUpdateData, Size, SizeCreateData, SizeUpdateData, Material, MaterialCreateData, MaterialUpdateData } from '@/services/api/clothings';
import { toast } from 'sonner';

// Colors hooks
export const useColors = () => {
  return useQuery({
    queryKey: ['colors'],
    queryFn: clothingsApi.getColors,
  });
};

export const useColor = (id: string) => {
  return useQuery({
    queryKey: ['colors', id],
    queryFn: () => clothingsApi.getColor(id),
    enabled: !!id,
  });
};

export const useCreateColor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ColorCreateData) => clothingsApi.createColor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
      toast.success('Color created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating color:', error);
      toast.error(error?.response?.data?.detail || 'Failed to create color');
    },
  });
};

export const useUpdateColor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ColorUpdateData }) => clothingsApi.updateColor(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
      queryClient.invalidateQueries({ queryKey: ['colors', id] });
      toast.success('Color updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating color:', error);
      toast.error(error?.response?.data?.detail || 'Failed to update color');
    },
  });
};

export const useDeleteColor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => clothingsApi.deleteColor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
      toast.success('Color deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting color:', error);
      toast.error(error?.response?.data?.detail || 'Failed to delete color');
    },
  });
};

// Seasons hooks
export const useSeasons = () => {
  return useQuery({
    queryKey: ['seasons'],
    queryFn: clothingsApi.getSeasons,
  });
};

export const useSeason = (id: string) => {
  return useQuery({
    queryKey: ['seasons', id],
    queryFn: () => clothingsApi.getSeason(id),
    enabled: !!id,
  });
};

export const useCreateSeason = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SeasonCreateData) => clothingsApi.createSeason(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
      toast.success('Season created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating season:', error);
      toast.error(error?.response?.data?.detail || 'Failed to create season');
    },
  });
};

export const useUpdateSeason = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SeasonUpdateData }) => clothingsApi.updateSeason(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
      queryClient.invalidateQueries({ queryKey: ['seasons', id] });
      toast.success('Season updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating season:', error);
      toast.error(error?.response?.data?.detail || 'Failed to update season');
    },
  });
};

export const useDeleteSeason = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => clothingsApi.deleteSeason(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
      toast.success('Season deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting season:', error);
      toast.error(error?.response?.data?.detail || 'Failed to delete season');
    },
  });
};

// Collections hooks
export const useCollections = () => {
  return useQuery({
    queryKey: ['collections'],
    queryFn: clothingsApi.getCollections,
  });
};

export const useCollection = (id: string) => {
  return useQuery({
    queryKey: ['collections', id],
    queryFn: () => clothingsApi.getCollection(id),
    enabled: !!id,
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CollectionCreateData) => clothingsApi.createCollection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast.success('Collection created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating collection:', error);
      toast.error(error?.response?.data?.detail || 'Failed to create collection');
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CollectionUpdateData }) => clothingsApi.updateCollection(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collections', id] });
      toast.success('Collection updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating collection:', error);
      toast.error(error?.response?.data?.detail || 'Failed to update collection');
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => clothingsApi.deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast.success('Collection deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting collection:', error);
      toast.error(error?.response?.data?.detail || 'Failed to delete collection');
    },
  });
};

// Sizes hooks
export const useSizes = () => {
  return useQuery({
    queryKey: ['sizes'],
    queryFn: clothingsApi.getSizes,
  });
};

export const useSize = (id: string) => {
  return useQuery({
    queryKey: ['sizes', id],
    queryFn: () => clothingsApi.getSize(id),
    enabled: !!id,
  });
};

export const useCreateSize = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SizeCreateData) => clothingsApi.createSize(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sizes'] });
      toast.success('Size created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating size:', error);
      toast.error(error?.response?.data?.detail || 'Failed to create size');
    },
  });
};

export const useUpdateSize = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SizeUpdateData }) => clothingsApi.updateSize(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['sizes'] });
      queryClient.invalidateQueries({ queryKey: ['sizes', id] });
      toast.success('Size updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating size:', error);
      toast.error(error?.response?.data?.detail || 'Failed to update size');
    },
  });
};

export const useDeleteSize = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => clothingsApi.deleteSize(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sizes'] });
      toast.success('Size deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting size:', error);
      toast.error(error?.response?.data?.detail || 'Failed to delete size');
    },
  });
};

// Materials hooks
export const useMaterials = () => {
  return useQuery({
    queryKey: ['materials'],
    queryFn: clothingsApi.getMaterials,
  });
};

export const useMaterial = (id: string) => {
  return useQuery({
    queryKey: ['materials', id],
    queryFn: () => clothingsApi.getMaterial(id),
    enabled: !!id,
  });
};

export const useCreateMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: MaterialCreateData) => clothingsApi.createMaterial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast.success('Material created successfully');
    },
    onError: (error: any) => {
      console.error('Error creating material:', error);
      toast.error(error?.response?.data?.detail || 'Failed to create material');
    },
  });
};

export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MaterialUpdateData }) => clothingsApi.updateMaterial(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['materials', id] });
      toast.success('Material updated successfully');
    },
    onError: (error: any) => {
      console.error('Error updating material:', error);
      toast.error(error?.response?.data?.detail || 'Failed to update material');
    },
  });
};

export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => clothingsApi.deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast.success('Material deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting material:', error);
      toast.error(error?.response?.data?.detail || 'Failed to delete material');
    },
  });
}; 