import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ClothingCollection,
  ClothingColor,
  ClothingSeason,
  CreateClothingCollectionDto,
  CreateClothingColorDto,
  CreateClothingSeasonDto,
  createClothingCollection,
  createClothingColor,
  createClothingSeason,
  deleteClothingCollection,
  deleteClothingColor,
  deleteClothingSeason,
  getClothingCollection,
  getClothingCollections,
  getClothingColor,
  getClothingColors,
  getClothingSeason,
  getClothingSeasons,
  updateClothingCollection,
  updateClothingColor,
  updateClothingSeason
} from '@/services/api/clothing';

// Collection Hooks
export const useClothingCollections = (storeId: string) => {
  return useQuery({
    queryKey: ['clothingCollections', storeId],
    queryFn: () => getClothingCollections(storeId),
    enabled: !!storeId
  });
};

export const useClothingCollection = (storeId: string, collectionId: string) => {
  return useQuery({
    queryKey: ['clothingCollection', storeId, collectionId],
    queryFn: () => getClothingCollection(storeId, collectionId),
    enabled: !!storeId && !!collectionId
  });
};

export const useCreateClothingCollection = (storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateClothingCollectionDto) => createClothingCollection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clothingCollections', storeId] });
    }
  });
};

export const useUpdateClothingCollection = (storeId: string, collectionId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateClothingCollectionDto) => updateClothingCollection(storeId, collectionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clothingCollections', storeId] });
      queryClient.invalidateQueries({ queryKey: ['clothingCollection', storeId, collectionId] });
    }
  });
};

export const useDeleteClothingCollection = (storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (collectionId: string) => deleteClothingCollection(storeId, collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clothingCollections', storeId] });
    }
  });
};

// Color Hooks
export const useClothingColors = (storeId: string) => {
  return useQuery({
    queryKey: ['clothingColors', storeId],
    queryFn: () => getClothingColors(storeId),
    enabled: !!storeId
  });
};

export const useClothingColor = (storeId: string, colorId: string) => {
  return useQuery({
    queryKey: ['clothingColor', storeId, colorId],
    queryFn: () => getClothingColor(storeId, colorId),
    enabled: !!storeId && !!colorId
  });
};

export const useCreateClothingColor = (storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateClothingColorDto) => createClothingColor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clothingColors', storeId] });
    }
  });
};

export const useUpdateClothingColor = (storeId: string, colorId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateClothingColorDto) => updateClothingColor(storeId, colorId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clothingColors', storeId] });
      queryClient.invalidateQueries({ queryKey: ['clothingColor', storeId, colorId] });
    }
  });
};

export const useDeleteClothingColor = (storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (colorId: string) => deleteClothingColor(storeId, colorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clothingColors', storeId] });
    }
  });
};

// Season Hooks
export const useClothingSeasons = (storeId: string) => {
  return useQuery({
    queryKey: ['clothingSeasons', storeId],
    queryFn: () => getClothingSeasons(storeId),
    enabled: !!storeId
  });
};

export const useClothingSeason = (storeId: string, seasonId: string) => {
  return useQuery({
    queryKey: ['clothingSeason', storeId, seasonId],
    queryFn: () => getClothingSeason(storeId, seasonId),
    enabled: !!storeId && !!seasonId
  });
};

export const useCreateClothingSeason = (storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateClothingSeasonDto) => createClothingSeason(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clothingSeasons', storeId] });
    }
  });
};

export const useUpdateClothingSeason = (storeId: string, seasonId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateClothingSeasonDto) => updateClothingSeason(storeId, seasonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clothingSeasons', storeId] });
      queryClient.invalidateQueries({ queryKey: ['clothingSeason', storeId, seasonId] });
    }
  });
};

export const useDeleteClothingSeason = (storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (seasonId: string) => deleteClothingSeason(storeId, seasonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clothingSeasons', storeId] });
    }
  });
}; 