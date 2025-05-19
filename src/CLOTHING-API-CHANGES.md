# Clothing API Changes

## Overview

All clothing-related operations now require a `store_id` parameter in the URL path. This change aligns with the store-based architecture implemented across the application.

### Example:
- **Old endpoint**: `/clothings/collections/`
- **New endpoint**: `/clothings/stores/{store_id}/collections/`

## API Service Layer Changes

The following changes have been made to the API service layer in `src/services/api/clothing.ts`:

1. **Updated API endpoints** to include `store_id` in the URL path
2. **Modified interface definitions** to incorporate the `store_id` property
3. **Adjusted method signatures** to accept `store_id` as a parameter

### Available API Methods

#### Collections
- `getClothingCollections(storeId: string)`: Get all collections for a store
- `getClothingCollection(storeId: string, id: string)`: Get a specific collection by ID
- `createClothingCollection(data: CreateClothingCollectionDto)`: Create a new collection
- `updateClothingCollection(storeId: string, id: string, data: CreateClothingCollectionDto)`: Update a collection
- `deleteClothingCollection(storeId: string, id: string)`: Delete a collection

#### Colors
- `getClothingColors(storeId: string)`: Get all colors for a store
- `getClothingColor(storeId: string, id: string)`: Get a specific color by ID
- `createClothingColor(data: CreateClothingColorDto)`: Create a new color
- `updateClothingColor(storeId: string, id: string, data: CreateClothingColorDto)`: Update a color
- `deleteClothingColor(storeId: string, id: string)`: Delete a color

#### Seasons
- `getClothingSeasons(storeId: string)`: Get all seasons for a store
- `getClothingSeason(storeId: string, id: string)`: Get a specific season by ID
- `createClothingSeason(data: CreateClothingSeasonDto)`: Create a new season
- `updateClothingSeason(storeId: string, id: string, data: CreateClothingSeasonDto)`: Update a season
- `deleteClothingSeason(storeId: string, id: string)`: Delete a season

## React Hooks

New React hooks have been created in `src/hooks/stock-manager/use-clothing.ts`. All hooks now require a `store_id` parameter.

### Available Hooks

#### Collection Hooks
- `useClothingCollections(storeId: string)`: Hook to fetch all collections
- `useClothingCollection(storeId: string, collectionId: string)`: Hook to fetch a specific collection
- `useCreateClothingCollection(storeId: string)`: Hook to create a new collection
- `useUpdateClothingCollection(storeId: string, collectionId: string)`: Hook to update a collection
- `useDeleteClothingCollection(storeId: string)`: Hook to delete a collection

#### Color Hooks
- `useClothingColors(storeId: string)`: Hook to fetch all colors
- `useClothingColor(storeId: string, colorId: string)`: Hook to fetch a specific color
- `useCreateClothingColor(storeId: string)`: Hook to create a new color
- `useUpdateClothingColor(storeId: string, colorId: string)`: Hook to update a color
- `useDeleteClothingColor(storeId: string)`: Hook to delete a color

#### Season Hooks
- `useClothingSeasons(storeId: string)`: Hook to fetch all seasons
- `useClothingSeason(storeId: string, seasonId: string)`: Hook to fetch a specific season
- `useCreateClothingSeason(storeId: string)`: Hook to create a new season
- `useUpdateClothingSeason(storeId: string, seasonId: string)`: Hook to update a season
- `useDeleteClothingSeason(storeId: string)`: Hook to delete a season

## Usage Example

Here's an example of how to use the hooks in a React component:

```tsx
import { useState, useEffect } from 'react';
import { 
  useClothingCollections, 
  useCreateClothingCollection 
} from '@/hooks/stock-manager/use-clothing';
import { CreateClothingCollectionDto } from '@/services/api/clothing';

function CollectionsComponent() {
  const [storeId, setStoreId] = useState<string>('');
  const [collectionForm, setCollectionForm] = useState<CreateClothingCollectionDto>({
    store_id: '',
    season_id: '',
    name: '',
    release_date: '',
    description: ''
  });
  
  // Get store from localStorage
  useEffect(() => {
    const storedStoreId = localStorage.getItem('current_store_id');
    if (storedStoreId) {
      setStoreId(storedStoreId);
      setCollectionForm(prev => ({ ...prev, store_id: storedStoreId }));
    }
  }, []);
  
  // Use the hooks
  const { data: collections, isLoading } = useClothingCollections(storeId);
  const { mutate: createCollection } = useCreateClothingCollection(storeId);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCollection(collectionForm);
  };
  
  return (
    <div>
      <h1>Collections</h1>
      
      {/* Form to create a collection */}
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <button type="submit">Create Collection</button>
      </form>
      
      {/* Display collections */}
      {isLoading ? (
        <p>Loading...</p>
      ) : collections?.length ? (
        <ul>
          {collections.map(collection => (
            <li key={collection.id}>{collection.name}</li>
          ))}
        </ul>
      ) : (
        <p>No collections found</p>
      )}
    </div>
  );
}
```

## Complete Example Component

For a full implementation example, see `src/components/examples/ClothingExample.tsx`, which demonstrates:

1. Managing collections, colors, and seasons with tabs
2. Creating, updating, and deleting items
3. Displaying lists of items
4. Form handling with proper validation
5. Proper state management 