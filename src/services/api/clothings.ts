import { coreApiClient } from './client';

// Interfaces
export interface Color {
  id: string;
  name: string;
  color_code: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface ColorCreateData {
  name: string;
  color_code: string;
  is_active: boolean;
}

export interface ColorUpdateData extends ColorCreateData {}

export interface Season {
  id: string;
  company_id: string;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface SeasonCreateData {
  company_id: string;
  name: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface SeasonUpdateData extends SeasonCreateData {}

export interface Collection {
  id: string;
  company_id: string;
  season_id: string;
  name: string;
  release_date: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CollectionCreateData {
  company_id: string;
  season_id: string;
  name: string;
  release_date: string;
  description: string;
}

export interface CollectionUpdateData extends CollectionCreateData {}

export interface Size {
  id: string;
  company_id: string;
  name: string;
  code: string;
  type: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface SizeCreateData {
  company_id: string;
  name: string;
  code: string;
  type: string;
  order: number;
}

export interface SizeUpdateData extends SizeCreateData {}

export interface Material {
  id: string;
  company_id: string;
  name: string;
  description: string;
  composition: string;
  created_at: string;
  updated_at: string;
}

export interface MaterialCreateData {
  company_id: string;
  name: string;
  description: string;
  composition: string;
}

export interface MaterialUpdateData extends MaterialCreateData {}

// API client
export const clothingsApi = {
  // Colors
  getColors: async (): Promise<Color[]> => {
    console.log('Fetching colors from /clothings/colors/');
    try {
      const response = await coreApiClient.get<Color[]>('/clothings/colors/');
      console.log('Colors fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching colors:', error);
      throw error;
    }
  },
  
  getColor: async (id: string): Promise<Color> => {
    console.log(`Fetching color with ID ${id} from /clothings/colors/${id}/`);
    try {
      const response = await coreApiClient.get<Color>(`/clothings/colors/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching color with ID ${id}:`, error);
      throw error;
    }
  },
  
  createColor: async (data: ColorCreateData): Promise<Color> => {
    console.log('Creating color with data:', data);
    try {
      const response = await coreApiClient.post<Color>('/clothings/colors/', data);
      console.log('Color created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating color:', error);
      throw error;
    }
  },
  
  updateColor: async (id: string, data: ColorUpdateData): Promise<Color> => {
    console.log(`Updating color with ID ${id} with data:`, data);
    try {
      const response = await coreApiClient.put<Color>(`/clothings/colors/${id}/`, data);
      console.log('Color updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating color with ID ${id}:`, error);
      throw error;
    }
  },
  
  deleteColor: async (id: string): Promise<void> => {
    console.log(`Deleting color with ID ${id}`);
    try {
      await coreApiClient.delete(`/clothings/colors/${id}/`);
      console.log('Color deleted successfully');
    } catch (error) {
      console.error(`Error deleting color with ID ${id}:`, error);
      throw error;
    }
  },

  // Seasons
  getSeasons: async (): Promise<Season[]> => {
    console.log('Fetching seasons from /clothings/seasons/');
    try {
      const response = await coreApiClient.get<Season[]>('/clothings/seasons/');
      console.log('Seasons fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching seasons:', error);
      throw error;
    }
  },
  
  getSeason: async (id: string): Promise<Season> => {
    console.log(`Fetching season with ID ${id} from /clothings/seasons/${id}/`);
    try {
      const response = await coreApiClient.get<Season>(`/clothings/seasons/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching season with ID ${id}:`, error);
      throw error;
    }
  },
  
  createSeason: async (data: SeasonCreateData): Promise<Season> => {
    console.log('Creating season with data:', data);
    try {
      const response = await coreApiClient.post<Season>('/clothings/seasons/', data);
      console.log('Season created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating season:', error);
      throw error;
    }
  },
  
  updateSeason: async (id: string, data: SeasonUpdateData): Promise<Season> => {
    console.log(`Updating season with ID ${id} with data:`, data);
    try {
      const response = await coreApiClient.put<Season>(`/clothings/seasons/${id}/`, data);
      console.log('Season updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating season with ID ${id}:`, error);
      throw error;
    }
  },
  
  deleteSeason: async (id: string): Promise<void> => {
    console.log(`Deleting season with ID ${id}`);
    try {
      await coreApiClient.delete(`/clothings/seasons/${id}/`);
      console.log('Season deleted successfully');
    } catch (error) {
      console.error(`Error deleting season with ID ${id}:`, error);
      throw error;
    }
  },

  // Collections
  getCollections: async (): Promise<Collection[]> => {
    console.log('Fetching collections from /clothings/collections/');
    try {
      const response = await coreApiClient.get<Collection[]>('/clothings/collections/');
      console.log('Collections fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  },
  
  getCollection: async (id: string): Promise<Collection> => {
    console.log(`Fetching collection with ID ${id} from /clothings/collections/${id}/`);
    try {
      const response = await coreApiClient.get<Collection>(`/clothings/collections/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching collection with ID ${id}:`, error);
      throw error;
    }
  },
  
  createCollection: async (data: CollectionCreateData): Promise<Collection> => {
    console.log('Creating collection with data:', data);
    try {
      const response = await coreApiClient.post<Collection>('/clothings/collections/', data);
      console.log('Collection created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  },
  
  updateCollection: async (id: string, data: CollectionUpdateData): Promise<Collection> => {
    console.log(`Updating collection with ID ${id} with data:`, data);
    try {
      const response = await coreApiClient.put<Collection>(`/clothings/collections/${id}/`, data);
      console.log('Collection updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating collection with ID ${id}:`, error);
      throw error;
    }
  },
  
  deleteCollection: async (id: string): Promise<void> => {
    console.log(`Deleting collection with ID ${id}`);
    try {
      await coreApiClient.delete(`/clothings/collections/${id}/`);
      console.log('Collection deleted successfully');
    } catch (error) {
      console.error(`Error deleting collection with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Sizes
  getSizes: async (): Promise<Size[]> => {
    console.log('Fetching sizes from /clothings/sizes/');
    try {
      const response = await coreApiClient.get<Size[]>('/clothings/sizes/');
      console.log('Sizes fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching sizes:', error);
      throw error;
    }
  },
  
  getSize: async (id: string): Promise<Size> => {
    console.log(`Fetching size with ID ${id} from /clothings/sizes/${id}/`);
    try {
      const response = await coreApiClient.get<Size>(`/clothings/sizes/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching size with ID ${id}:`, error);
      throw error;
    }
  },
  
  createSize: async (data: SizeCreateData): Promise<Size> => {
    console.log('Creating size with data:', data);
    try {
      const response = await coreApiClient.post<Size>('/clothings/sizes/', data);
      console.log('Size created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating size:', error);
      throw error;
    }
  },
  
  updateSize: async (id: string, data: SizeUpdateData): Promise<Size> => {
    console.log(`Updating size with ID ${id} with data:`, data);
    try {
      const response = await coreApiClient.put<Size>(`/clothings/sizes/${id}/`, data);
      console.log('Size updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating size with ID ${id}:`, error);
      throw error;
    }
  },
  
  deleteSize: async (id: string): Promise<void> => {
    console.log(`Deleting size with ID ${id}`);
    try {
      await coreApiClient.delete(`/clothings/sizes/${id}/`);
      console.log('Size deleted successfully');
    } catch (error) {
      console.error(`Error deleting size with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Materials
  getMaterials: async (): Promise<Material[]> => {
    console.log('Fetching materials from /clothings/materials/');
    try {
      const response = await coreApiClient.get<Material[]>('/clothings/materials/');
      console.log('Materials fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }
  },
  
  getMaterial: async (id: string): Promise<Material> => {
    console.log(`Fetching material with ID ${id} from /clothings/materials/${id}/`);
    try {
      const response = await coreApiClient.get<Material>(`/clothings/materials/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching material with ID ${id}:`, error);
      throw error;
    }
  },
  
  createMaterial: async (data: MaterialCreateData): Promise<Material> => {
    console.log('Creating material with data:', data);
    try {
      const response = await coreApiClient.post<Material>('/clothings/materials/', data);
      console.log('Material created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating material:', error);
      throw error;
    }
  },
  
  updateMaterial: async (id: string, data: MaterialUpdateData): Promise<Material> => {
    console.log(`Updating material with ID ${id} with data:`, data);
    try {
      const response = await coreApiClient.put<Material>(`/clothings/materials/${id}/`, data);
      console.log('Material updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating material with ID ${id}:`, error);
      throw error;
    }
  },
  
  deleteMaterial: async (id: string): Promise<void> => {
    console.log(`Deleting material with ID ${id}`);
    try {
      await coreApiClient.delete(`/clothings/materials/${id}/`);
      console.log('Material deleted successfully');
    } catch (error) {
      console.error(`Error deleting material with ID ${id}:`, error);
      throw error;
    }
  }
}; 