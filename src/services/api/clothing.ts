import { coreApiClient as api } from './client';

// Interfaces
export interface ClothingCollection {
  id: string;
  store_id: string;
  season_id: string;
  name: string;
  release_date: string;
  description: string;
  store: string;
  season: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClothingCollectionDto {
  store_id: string;
  season_id: string;
  name: string;
  release_date: string;
  description: string;
}

export interface ClothingColor {
  id: string;
  store_id: string;
  name: string;
  color_code: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CreateClothingColorDto {
  store_id: string;
  name: string;
  color_code: string;
  is_active: boolean;
}

export interface ClothingSeason {
  id: string;
  store_id: string;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClothingSeasonDto {
  store_id: string;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
}

// Collections API
export const getClothingCollections = async (storeId: string): Promise<ClothingCollection[]> => {
  const response = await api.get(`/clothings/stores/${storeId}/collections/`);
  return response.data as ClothingCollection[];
};

export const getClothingCollection = async (storeId: string, id: string): Promise<ClothingCollection> => {
  const response = await api.get(`/clothings/stores/${storeId}/collections/${id}/`);
  return response.data as ClothingCollection;
};

export const createClothingCollection = async (data: CreateClothingCollectionDto): Promise<ClothingCollection> => {
  const response = await api.post(`/clothings/stores/${data.store_id}/collections/`, data);
  return response.data as ClothingCollection;
};

export const updateClothingCollection = async (storeId: string, id: string, data: CreateClothingCollectionDto): Promise<ClothingCollection> => {
  const response = await api.put(`/clothings/stores/${storeId}/collections/${id}/`, data);
  return response.data as ClothingCollection;
};

export const deleteClothingCollection = async (storeId: string, id: string): Promise<void> => {
  await api.delete(`/clothings/stores/${storeId}/collections/${id}/`);
};

// Colors API
export const getClothingColors = async (storeId: string): Promise<ClothingColor[]> => {
  const response = await api.get(`/clothings/stores/${storeId}/colors/`);
  return response.data as ClothingColor[];
};

export const getClothingColor = async (storeId: string, id: string): Promise<ClothingColor> => {
  const response = await api.get(`/clothings/stores/${storeId}/colors/${id}/`);
  return response.data as ClothingColor;
};

export const createClothingColor = async (data: CreateClothingColorDto): Promise<ClothingColor> => {
  const response = await api.post(`/clothings/stores/${data.store_id}/colors/`, data);
  return response.data as ClothingColor;
};

export const updateClothingColor = async (storeId: string, id: string, data: CreateClothingColorDto): Promise<ClothingColor> => {
  const response = await api.put(`/clothings/stores/${storeId}/colors/${id}/`, data);
  return response.data as ClothingColor;
};

export const deleteClothingColor = async (storeId: string, id: string): Promise<void> => {
  await api.delete(`/clothings/stores/${storeId}/colors/${id}/`);
};

// Seasons API
export const getClothingSeasons = async (storeId: string): Promise<ClothingSeason[]> => {
  const response = await api.get(`/clothings/stores/${storeId}/seasons/`);
  return response.data as ClothingSeason[];
};

export const getClothingSeason = async (storeId: string, id: string): Promise<ClothingSeason> => {
  const response = await api.get(`/clothings/stores/${storeId}/seasons/${id}/`);
  return response.data as ClothingSeason;
};

export const createClothingSeason = async (data: CreateClothingSeasonDto): Promise<ClothingSeason> => {
  const response = await api.post(`/clothings/stores/${data.store_id}/seasons/`, data);
  return response.data as ClothingSeason;
};

export const updateClothingSeason = async (storeId: string, id: string, data: CreateClothingSeasonDto): Promise<ClothingSeason> => {
  const response = await api.put(`/clothings/stores/${storeId}/seasons/${id}/`, data);
  return response.data as ClothingSeason;
};

export const deleteClothingSeason = async (storeId: string, id: string): Promise<void> => {
  await api.delete(`/clothings/stores/${storeId}/seasons/${id}/`);
}; 