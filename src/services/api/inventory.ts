import { coreApiClient } from './client';
import { Company, Currency, SubscriptionPlan } from './companies';

// Inventory Interfaces
export interface ProductUnit {
  id: string;
  company: Company;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProductUnitCreateData {
  company_id: string;
  name: string;
  description: string;
}

export interface ProductUnitUpdateData extends ProductUnitCreateData {}

export interface ProductCategory {
  id: string;
  company: Company;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProductCategoryCreateData {
  company_id: string;
  name: string;
  description: string;
}

export interface ProductCategoryUpdateData extends ProductCategoryCreateData {}

export interface Product {
  id: string;
  company: Company;
  name: string;
  description: string;
  image: string;
  product_unit: ProductUnit;
  product_category: ProductCategory;
  purchase_price?: string;
  sale_price?: string;
  color_id?: string;
  collection_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductCreateData {
  company_id: string;
  name: string;
  description: string;
  image: string;
  product_unit_id: string;
  product_category_id: string;
  purchase_price?: string;
  sale_price?: string;
  color_id?: string;
  collection_id?: string;
}

export interface ProductUpdateData extends ProductCreateData {}

export interface InventoryStore {
  id: string;
  company: Company;
  name: string;
  address: string;
  phone_number: string;
  email: string;
  is_active: "active" | "inactive";
  location: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryStoreCreateData {
  company_id: string;
  name: string;
  address: string;
  phone_number: string;
  email: string;
  is_active: "active" | "inactive";
  location: string;
}

export interface InventoryStoreUpdateData extends Partial<InventoryStoreCreateData> {}

export interface Inventory {
  id: string;
  product: Product;
  store: InventoryStore;
  quantity: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryCreateData {
  product_id: string;
  store_id: string;
  quantity: string;
}

export interface InventoryUpdateData extends InventoryCreateData {}

// Clothing Interfaces
export interface ClothingColor {
  id: string;
  company: Company;
  name: string;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ClothingColorCreateData {
  company_id: string;
  name: string;
  code: string;
  description: string;
}

export interface ClothingColorUpdateData extends ClothingColorCreateData {}

export interface ClothingMaterial {
  id: string;
  company: Company;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ClothingMaterialCreateData {
  company_id: string;
  name: string;
  description: string;
}

export interface ClothingMaterialUpdateData extends ClothingMaterialCreateData {}

export interface ClothingSize {
  id: string;
  company: Company;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ClothingSizeCreateData {
  company_id: string;
  name: string;
  description: string;
}

export interface ClothingSizeUpdateData extends ClothingSizeCreateData {}

export interface ClothingSeason {
  id: string;
  company: Company;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ClothingSeasonCreateData {
  company_id: string;
  name: string;
  description: string;
}

export interface ClothingSeasonUpdateData extends ClothingSeasonCreateData {}

export interface ClothingCollection {
  id: string;
  company: Company;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ClothingCollectionCreateData {
  company_id: string;
  name: string;
  description: string;
}

export interface ClothingCollectionUpdateData extends ClothingCollectionCreateData {}

// API client
export const inventoryApi = {
  // Product Units
  getProductUnits: async (storeId: string): Promise<ProductUnit[]> => {
    const response = await coreApiClient.get<ProductUnit[]>(`/inventory/stores/${storeId}/product-units/`);
    return response.data;
  },
  
  getProductUnit: async (storeId: string, id: string): Promise<ProductUnit> => {
    const response = await coreApiClient.get<ProductUnit>(`/inventory/stores/${storeId}/product-units/${id}/`);
    return response.data;
  },
  
  createProductUnit: async (storeId: string, data: ProductUnitCreateData): Promise<ProductUnit> => {
    const response = await coreApiClient.post<ProductUnit>(`/inventory/stores/${storeId}/product-units/`, data);
    return response.data;
  },
  
  updateProductUnit: async (storeId: string, id: string, data: ProductUnitUpdateData): Promise<ProductUnit> => {
    const response = await coreApiClient.put<ProductUnit>(`/inventory/stores/${storeId}/product-units/${id}/`, data);
    return response.data;
  },
  
  deleteProductUnit: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/inventory/stores/${storeId}/product-units/${id}/`);
  },

  // Product Categories
  getProductCategories: async (storeId: string): Promise<ProductCategory[]> => {
    console.log(`Fetching product categories from /inventory/stores/${storeId}/product-categories/`);
    const response = await coreApiClient.get<ProductCategory[]>(`/inventory/stores/${storeId}/product-categories/`);
    return response.data;
  },
  
  getProductCategory: async (storeId: string, id: string): Promise<ProductCategory> => {
    console.log(`Fetching product category with ID ${id} from /inventory/stores/${storeId}/product-categories/${id}/`);
    const response = await coreApiClient.get<ProductCategory>(`/inventory/stores/${storeId}/product-categories/${id}/`);
    return response.data;
  },
  
  createProductCategory: async (storeId: string, data: ProductCategoryCreateData): Promise<ProductCategory> => {
    console.log('Creating product category with data:', data);
    try {
      const response = await coreApiClient.post<ProductCategory>(`/inventory/stores/${storeId}/product-categories/`, data);
      console.log('Product category created, response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating product category:', error);
      throw error;
    }
  },
  
  updateProductCategory: async (storeId: string, id: string, data: ProductCategoryUpdateData): Promise<ProductCategory> => {
    console.log(`Updating product category with ID ${id} and data:`, data);
    const response = await coreApiClient.put<ProductCategory>(`/inventory/stores/${storeId}/product-categories/${id}/`, data);
    return response.data;
  },
  
  deleteProductCategory: async (storeId: string, id: string): Promise<void> => {
    console.log(`Deleting product category with ID ${id}`);
    await coreApiClient.delete(`/inventory/stores/${storeId}/product-categories/${id}/`);
  },

  // Products
  getProducts: async (storeId: string): Promise<Product[]> => {
    const response = await coreApiClient.get<Product[]>(`/inventory/stores/${storeId}/products/`);
    return response.data;
  },
  
  getProduct: async (storeId: string, id: string): Promise<Product> => {
    const response = await coreApiClient.get<Product>(`/inventory/stores/${storeId}/products/${id}/`);
    return response.data;
  },
  
  createProduct: async (storeId: string, data: ProductCreateData): Promise<Product> => {
    const response = await coreApiClient.post<Product>(`/inventory/stores/${storeId}/products/`, data);
    return response.data;
  },
  
  updateProduct: async (storeId: string, id: string, data: ProductUpdateData): Promise<Product> => {
    const response = await coreApiClient.put<Product>(`/inventory/stores/${storeId}/products/${id}/`, data);
    return response.data;
  },
  
  deleteProduct: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/inventory/stores/${storeId}/products/${id}/`);
  },

  // Stores
  getStores: async (): Promise<InventoryStore[]> => {
    console.log('Making API call to get stores');
    const response = await coreApiClient.get<InventoryStore[]>('/inventory/stores/');
    console.log('Raw API response for stores:', response);
    console.log('API response data structure:', JSON.stringify(response.data, null, 2));
    
    // Check if response is an array or has a specific data property
    const storesData = Array.isArray(response.data) ? response.data : 
                       (response.data as any).results || response.data;
    
    console.log('Processed stores data length:', storesData.length);
    if (storesData.length > 0) {
      console.log('Sample store object keys:', Object.keys(storesData[0]));
      console.log('Sample store object:', storesData[0]);
    }
    
    return storesData;
  },
  
  getStore: async (id: string): Promise<InventoryStore> => {
    const response = await coreApiClient.get<InventoryStore>(`/inventory/stores/${id}/`);
    return response.data;
  },
  
  createStore: async (data: InventoryStoreCreateData): Promise<InventoryStore> => {
    const response = await coreApiClient.post<InventoryStore>('/inventory/stores/', data);
    return response.data;
  },
  
  updateStore: async (id: string, data: InventoryStoreUpdateData): Promise<InventoryStore> => {
    const response = await coreApiClient.put<InventoryStore>(`/inventory/stores/${id}/`, data);
    return response.data;
  },
  
  deleteStore: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/inventory/stores/${id}/`);
  },

  toggleStoreStatus: async (id: string, isActive: boolean): Promise<InventoryStore> => {
    try {
      // First, get the current store data
      console.log(`Toggling store ${id} status to ${isActive ? 'active' : 'inactive'}`);
      const storeResponse = await coreApiClient.get<InventoryStore>(`/inventory/stores/${id}/`);
      const store = storeResponse.data;
      
      // Now update just the is_active field while preserving other fields
      // The API expects "active" or "inactive" strings, not boolean values
      const updateData: InventoryStoreUpdateData = {
        company_id: store.company?.id,
        name: store.name,
        location: store.location,
        address: store.address,
        phone_number: store.phone_number,
        email: store.email,
        is_active: isActive ? "active" : "inactive"
      };
      
      console.log('Updating store with data:', updateData);
      const response = await coreApiClient.put<InventoryStore>(`/inventory/stores/${id}/`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error toggling store status:', error);
      throw error;
    }
  },

  // Inventory
  getInventories: async (storeId: string): Promise<Inventory[]> => {
    const response = await coreApiClient.get<Inventory[]>(`/inventory/stores/${storeId}/inventories/`);
    return response.data;
  },
  
  getInventory: async (storeId: string, id: string): Promise<Inventory> => {
    const response = await coreApiClient.get<Inventory>(`/inventory/stores/${storeId}/inventories/${id}/`);
    return response.data;
  },
  
  createInventory: async (storeId: string, data: InventoryCreateData): Promise<Inventory> => {
    const response = await coreApiClient.post<Inventory>(`/inventory/stores/${storeId}/inventories/`, data);
    return response.data;
  },
  
  updateInventory: async (storeId: string, id: string, data: InventoryUpdateData): Promise<Inventory> => {
    const response = await coreApiClient.put<Inventory>(`/inventory/stores/${storeId}/inventories/${id}/`, data);
    return response.data;
  },
  
  deleteInventory: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/inventory/stores/${storeId}/inventories/${id}/`);
  },

  // Clothing Colors
  getClothingColors: async (): Promise<ClothingColor[]> => {
    const response = await coreApiClient.get<ClothingColor[]>('/inventory/clothing/colors/');
    return response.data;
  },
  
  getClothingColor: async (id: string): Promise<ClothingColor> => {
    const response = await coreApiClient.get<ClothingColor>(`/inventory/clothing/colors/${id}/`);
    return response.data;
  },
  
  createClothingColor: async (data: ClothingColorCreateData): Promise<ClothingColor> => {
    const response = await coreApiClient.post<ClothingColor>('/inventory/clothing/colors/', data);
    return response.data;
  },
  
  updateClothingColor: async (id: string, data: ClothingColorUpdateData): Promise<ClothingColor> => {
    const response = await coreApiClient.put<ClothingColor>(`/inventory/clothing/colors/${id}/`, data);
    return response.data;
  },
  
  deleteClothingColor: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/inventory/clothing/colors/${id}/`);
  },

  // Clothing Materials
  getClothingMaterials: async (): Promise<ClothingMaterial[]> => {
    const response = await coreApiClient.get<ClothingMaterial[]>('/inventory/clothing/materials/');
    return response.data;
  },
  
  getClothingMaterial: async (id: string): Promise<ClothingMaterial> => {
    const response = await coreApiClient.get<ClothingMaterial>(`/inventory/clothing/materials/${id}/`);
    return response.data;
  },
  
  createClothingMaterial: async (data: ClothingMaterialCreateData): Promise<ClothingMaterial> => {
    const response = await coreApiClient.post<ClothingMaterial>('/inventory/clothing/materials/', data);
    return response.data;
  },
  
  updateClothingMaterial: async (id: string, data: ClothingMaterialUpdateData): Promise<ClothingMaterial> => {
    const response = await coreApiClient.put<ClothingMaterial>(`/inventory/clothing/materials/${id}/`, data);
    return response.data;
  },
  
  deleteClothingMaterial: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/inventory/clothing/materials/${id}/`);
  },

  // Clothing Sizes
  getClothingSizes: async (): Promise<ClothingSize[]> => {
    const response = await coreApiClient.get<ClothingSize[]>('/inventory/clothing/sizes/');
    return response.data;
  },
  
  getClothingSize: async (id: string): Promise<ClothingSize> => {
    const response = await coreApiClient.get<ClothingSize>(`/inventory/clothing/sizes/${id}/`);
    return response.data;
  },
  
  createClothingSize: async (data: ClothingSizeCreateData): Promise<ClothingSize> => {
    const response = await coreApiClient.post<ClothingSize>('/inventory/clothing/sizes/', data);
    return response.data;
  },
  
  updateClothingSize: async (id: string, data: ClothingSizeUpdateData): Promise<ClothingSize> => {
    const response = await coreApiClient.put<ClothingSize>(`/inventory/clothing/sizes/${id}/`, data);
    return response.data;
  },
  
  deleteClothingSize: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/inventory/clothing/sizes/${id}/`);
  },

  // Clothing Seasons
  getClothingSeasons: async (): Promise<ClothingSeason[]> => {
    const response = await coreApiClient.get<ClothingSeason[]>('/inventory/clothing/seasons/');
    return response.data;
  },
  
  getClothingSeason: async (id: string): Promise<ClothingSeason> => {
    const response = await coreApiClient.get<ClothingSeason>(`/inventory/clothing/seasons/${id}/`);
    return response.data;
  },
  
  createClothingSeason: async (data: ClothingSeasonCreateData): Promise<ClothingSeason> => {
    const response = await coreApiClient.post<ClothingSeason>('/inventory/clothing/seasons/', data);
    return response.data;
  },
  
  updateClothingSeason: async (id: string, data: ClothingSeasonUpdateData): Promise<ClothingSeason> => {
    const response = await coreApiClient.put<ClothingSeason>(`/inventory/clothing/seasons/${id}/`, data);
    return response.data;
  },
  
  deleteClothingSeason: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/inventory/clothing/seasons/${id}/`);
  },

  // Clothing Collections
  getClothingCollections: async (): Promise<ClothingCollection[]> => {
    const response = await coreApiClient.get<ClothingCollection[]>('/inventory/clothing/collections/');
    return response.data;
  },
  
  getClothingCollection: async (id: string): Promise<ClothingCollection> => {
    const response = await coreApiClient.get<ClothingCollection>(`/inventory/clothing/collections/${id}/`);
    return response.data;
  },
  
  createClothingCollection: async (data: ClothingCollectionCreateData): Promise<ClothingCollection> => {
    const response = await coreApiClient.post<ClothingCollection>('/inventory/clothing/collections/', data);
    return response.data;
  },
  
  updateClothingCollection: async (id: string, data: ClothingCollectionUpdateData): Promise<ClothingCollection> => {
    const response = await coreApiClient.put<ClothingCollection>(`/inventory/clothing/collections/${id}/`, data);
    return response.data;
  },
  
  deleteClothingCollection: async (id: string): Promise<void> => {
    await coreApiClient.delete(`/inventory/clothing/collections/${id}/`);
  },
}; 