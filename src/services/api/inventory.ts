import { coreApiClient } from './client';
import { Company, Currency, SubscriptionPlan, companiesApi, Store as CompanyStore } from './companies';

// Inventory Interfaces
export interface Store {
  id: string;
  company: Company;
  name: string;
  location: string;
  created_at: string;
  updated_at: string;
  is_active: "active" | "inactive";
}

export interface ProductUnit {
  id: string;
  store: Store;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProductUnitCreateData {
  store_id: string;
  name: string;
  description: string;
}

export interface ProductUnitUpdateData extends ProductUnitCreateData {}

export interface ProductCategory {
  id: string;
  store: Store;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProductCategoryCreateData {
  store_id: string;
  name: string;
  description: string;
}

export interface ProductCategoryUpdateData extends ProductCategoryCreateData {}

export interface Product {
  id: string;
  store: Store;
  name: string;
  description: string;
  image: string;
  product_unit: ProductUnit;
  product_category: ProductCategory;
  purchase_price?: string;
  sale_price?: string;
  color?: string;
  collection?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductCreateData {
  store_id: string;
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

// Stores - For backward compatibility
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
  store: Store;
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
  
  createProductUnit: async (data: ProductUnitCreateData): Promise<ProductUnit> => {
    const response = await coreApiClient.post<ProductUnit>(`/inventory/stores/${data.store_id}/product-units/`, data);
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
  
  createProductCategory: async (data: ProductCategoryCreateData): Promise<ProductCategory> => {
    console.log('Creating product category with data:', data);
    try {
      const response = await coreApiClient.post<ProductCategory>(`/inventory/stores/${data.store_id}/product-categories/`, data);
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
  
  createProduct: async (data: ProductCreateData): Promise<Product> => {
    const response = await coreApiClient.post<Product>(`/inventory/stores/${data.store_id}/products/`, data);
    return response.data;
  },
  
  updateProduct: async (storeId: string, id: string, data: ProductUpdateData): Promise<Product> => {
    const response = await coreApiClient.put<Product>(`/inventory/stores/${storeId}/products/${id}/`, data);
    return response.data;
  },
  
  deleteProduct: async (storeId: string, id: string): Promise<void> => {
    await coreApiClient.delete(`/inventory/stores/${storeId}/products/${id}/`);
  },

  // Stores - Using the new API for backward compatibility
  getStores: async (): Promise<InventoryStore[]> => {
    console.log('Making API call to get stores (using new companiesApi)');
    try {
      const stores = await companiesApi.getStores();
      
      // Convert the new store format to the old format for backward compatibility
      const inventoryStores: InventoryStore[] = stores.map(store => ({
        id: store.id,
        company: store.company,
        name: store.name,
        location: store.location,
        address: store.location, // Map location to address for compatibility
        phone_number: '', // These fields don't exist in the new API
        email: '',
        is_active: store.is_active,
        created_at: store.created_at,
        updated_at: store.updated_at
      }));
      
      console.log(`Converted ${stores.length} stores to inventory store format`);
      return inventoryStores;
    } catch (error) {
      console.error('Error getting stores:', error);
      throw error;
    }
  },
  
  getStore: async (id: string): Promise<InventoryStore> => {
    try {
      const store = await companiesApi.getStore(id);
      
      // Convert to old format
      const inventoryStore: InventoryStore = {
        id: store.id,
        company: store.company,
        name: store.name,
        location: store.location,
        address: store.location, // Map location to address for compatibility
        phone_number: '', // These fields don't exist in the new API
        email: '',
        is_active: store.is_active,
        created_at: store.created_at,
        updated_at: store.updated_at
      };
      
      return inventoryStore;
    } catch (error) {
      console.error(`Error getting store ${id}:`, error);
      throw error;
    }
  },
  
  createStore: async (data: InventoryStoreCreateData): Promise<InventoryStore> => {
    try {
      // Convert to new format
      const newStoreData = {
        company_id: data.company_id,
        name: data.name,
        location: data.address || data.location,
        is_active: data.is_active
      };
      
      const store = await companiesApi.createStore(newStoreData);
      
      // Convert back to old format
      const inventoryStore: InventoryStore = {
        id: store.id,
        company: store.company,
        name: store.name,
        location: store.location,
        address: store.location,
        phone_number: data.phone_number || '',
        email: data.email || '',
        is_active: store.is_active,
        created_at: store.created_at,
        updated_at: store.updated_at
      };
      
      return inventoryStore;
    } catch (error) {
      console.error('Error creating store:', error);
      throw error;
    }
  },
  
  updateStore: async (id: string, data: InventoryStoreUpdateData): Promise<InventoryStore> => {
    try {
      // Convert to new format
      const updateStoreData = {
        company_id: data.company_id || '',
        name: data.name || '',
        location: data.address || data.location || '',
        is_active: data.is_active || 'active' as "active" | "inactive"
      };
      
      const store = await companiesApi.updateStore(id, updateStoreData);
      
      // Convert back to old format
      const inventoryStore: InventoryStore = {
        id: store.id,
        company: store.company,
        name: store.name,
        location: store.location,
        address: store.location,
        phone_number: data.phone_number || '',
        email: data.email || '',
        is_active: store.is_active,
        created_at: store.created_at,
        updated_at: store.updated_at
      };
      
      return inventoryStore;
    } catch (error) {
      console.error(`Error updating store ${id}:`, error);
      throw error;
    }
  },
  
  deleteStore: async (id: string): Promise<void> => {
    try {
      await companiesApi.deleteStore(id);
    } catch (error) {
      console.error(`Error deleting store ${id}:`, error);
      throw error;
    }
  },

  toggleStoreStatus: async (id: string, isActive: boolean): Promise<InventoryStore> => {
    try {
      // First, get the current store data
      console.log(`Toggling store ${id} status to ${isActive ? 'active' : 'inactive'}`);
      const store = await companiesApi.getStore(id);
      
      // Update with the new status
      const updateData = {
        company_id: store.company.id,
        name: store.name,
        location: store.location,
        is_active: (isActive ? "active" : "inactive") as "active" | "inactive"
      };
      
      const updatedStore = await companiesApi.updateStore(id, updateData);
      
      // Convert to old format
      const inventoryStore: InventoryStore = {
        id: updatedStore.id,
        company: updatedStore.company,
        name: updatedStore.name,
        location: updatedStore.location,
        address: updatedStore.location,
        phone_number: '',
        email: '',
        is_active: updatedStore.is_active,
        created_at: updatedStore.created_at,
        updated_at: updatedStore.updated_at
      };
      
      return inventoryStore;
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
  
  createInventory: async (data: InventoryCreateData): Promise<Inventory> => {
    const response = await coreApiClient.post<Inventory>(`/inventory/stores/${data.store_id}/inventories/`, data);
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