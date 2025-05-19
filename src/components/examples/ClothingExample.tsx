import { useState, useEffect } from 'react';
import StoreSelector from '../common/StoreSelector';
import {
  useClothingCollections,
  useCreateClothingCollection,
  useUpdateClothingCollection,
  useDeleteClothingCollection,
  useClothingColors,
  useCreateClothingColor,
  useUpdateClothingColor,
  useDeleteClothingColor,
  useClothingSeasons,
  useCreateClothingSeason,
  useUpdateClothingSeason,
  useDeleteClothingSeason
} from '@/hooks/stock-manager/use-clothing';
import { CreateClothingCollectionDto, CreateClothingColorDto, CreateClothingSeasonDto } from '@/services/api/clothing';

export default function ClothingExample() {
  const [storeId, setStoreId] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<'collections' | 'colors' | 'seasons'>('collections');
  
  // Collection state
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
  const [collectionForm, setCollectionForm] = useState<CreateClothingCollectionDto>({
    store_id: '',
    season_id: '',
    name: '',
    release_date: '',
    description: ''
  });
  
  // Color state
  const [selectedColorId, setSelectedColorId] = useState<string>('');
  const [colorForm, setColorForm] = useState<CreateClothingColorDto>({
    store_id: '',
    name: '',
    color_code: '',
    is_active: true
  });
  
  // Season state
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('');
  const [seasonForm, setSeasonForm] = useState<CreateClothingSeasonDto>({
    store_id: '',
    name: '',
    start_date: '',
    end_date: '',
    description: ''
  });

  // Handle store change
  const handleStoreChange = (newStoreId: string) => {
    setStoreId(newStoreId);
    setCollectionForm(prev => ({ ...prev, store_id: newStoreId }));
    setColorForm(prev => ({ ...prev, store_id: newStoreId }));
    setSeasonForm(prev => ({ ...prev, store_id: newStoreId }));
    
    // Reset selections when store changes
    setSelectedCollectionId('');
    setSelectedColorId('');
    setSelectedSeasonId('');
  };

  // Get store from localStorage on initial load
  useEffect(() => {
    const storedStoreId = localStorage.getItem('current_store_id');
    if (storedStoreId) {
      handleStoreChange(storedStoreId);
    }
  }, []);

  // Collection hooks
  const { 
    data: collections, 
    isLoading: isLoadingCollections 
  } = useClothingCollections(storeId);
  
  const { 
    mutate: createCollection, 
    isPending: isCreatingCollection 
  } = useCreateClothingCollection(storeId);
  
  const { 
    mutate: updateCollection, 
    isPending: isUpdatingCollection 
  } = useUpdateClothingCollection(storeId, selectedCollectionId);
  
  const { 
    mutate: deleteCollection, 
    isPending: isDeletingCollection 
  } = useDeleteClothingCollection(storeId);

  // Color hooks
  const { 
    data: colors, 
    isLoading: isLoadingColors 
  } = useClothingColors(storeId);
  
  const { 
    mutate: createColor, 
    isPending: isCreatingColor 
  } = useCreateClothingColor(storeId);
  
  const { 
    mutate: updateColor, 
    isPending: isUpdatingColor 
  } = useUpdateClothingColor(storeId, selectedColorId);
  
  const { 
    mutate: deleteColor, 
    isPending: isDeletingColor 
  } = useDeleteClothingColor(storeId);

  // Season hooks
  const { 
    data: seasons, 
    isLoading: isLoadingSeasons 
  } = useClothingSeasons(storeId);
  
  const { 
    mutate: createSeason, 
    isPending: isCreatingSeason 
  } = useCreateClothingSeason(storeId);
  
  const { 
    mutate: updateSeason, 
    isPending: isUpdatingSeason 
  } = useUpdateClothingSeason(storeId, selectedSeasonId);
  
  const { 
    mutate: deleteSeason, 
    isPending: isDeletingSeason 
  } = useDeleteClothingSeason(storeId);

  // Collection handlers
  const handleCollectionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCollectionForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    createCollection(collectionForm);
  };

  const handleUpdateCollection = () => {
    if (selectedCollectionId) {
      updateCollection(collectionForm);
    }
  };

  const handleDeleteCollection = () => {
    if (selectedCollectionId) {
      deleteCollection(selectedCollectionId);
      setSelectedCollectionId('');
    }
  };

  const handleSelectCollection = (collection: any) => {
    setSelectedCollectionId(collection.id);
    setCollectionForm({
      store_id: storeId,
      season_id: collection.season_id,
      name: collection.name,
      release_date: collection.release_date,
      description: collection.description
    });
  };

  // Color handlers
  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'is_active') {
      setColorForm(prev => ({ ...prev, [name]: value === 'true' }));
    } else {
      setColorForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateColor = (e: React.FormEvent) => {
    e.preventDefault();
    createColor(colorForm);
  };

  const handleUpdateColor = () => {
    if (selectedColorId) {
      updateColor(colorForm);
    }
  };

  const handleDeleteColor = () => {
    if (selectedColorId) {
      deleteColor(selectedColorId);
      setSelectedColorId('');
    }
  };

  const handleSelectColor = (color: any) => {
    setSelectedColorId(color.id);
    setColorForm({
      store_id: storeId,
      name: color.name,
      color_code: color.color_code,
      is_active: color.is_active
    });
  };

  // Season handlers
  const handleSeasonInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSeasonForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateSeason = (e: React.FormEvent) => {
    e.preventDefault();
    createSeason(seasonForm);
  };

  const handleUpdateSeason = () => {
    if (selectedSeasonId) {
      updateSeason(seasonForm);
    }
  };

  const handleDeleteSeason = () => {
    if (selectedSeasonId) {
      deleteSeason(selectedSeasonId);
      setSelectedSeasonId('');
    }
  };

  const handleSelectSeason = (season: any) => {
    setSelectedSeasonId(season.id);
    setSeasonForm({
      store_id: storeId,
      name: season.name,
      start_date: season.start_date,
      end_date: season.end_date,
      description: season.description
    });
  };

  if (!storeId) {
    return <div>Please select a store first</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clothing Management Example</h1>
      
      {/* Store Selector */}
      <div className="mb-6">
        <StoreSelector 
          currentStoreId={storeId}
          onStoreChange={handleStoreChange}
          className="mb-2"
        />
        {!storeId && <p className="text-red-500">Please select a store to continue</p>}
      </div>
      
      {/* Only show tabs and content if a store is selected */}
      {storeId && (
        <>
          {/* Tabs */}
          <div className="mb-6">
            <div className="flex border-b">
              <button
                className={`py-2 px-4 ${selectedTab === 'collections' ? 'border-b-2 border-blue-500' : ''}`}
                onClick={() => setSelectedTab('collections')}
              >
                Collections
              </button>
              <button
                className={`py-2 px-4 ${selectedTab === 'colors' ? 'border-b-2 border-blue-500' : ''}`}
                onClick={() => setSelectedTab('colors')}
              >
                Colors
              </button>
              <button
                className={`py-2 px-4 ${selectedTab === 'seasons' ? 'border-b-2 border-blue-500' : ''}`}
                onClick={() => setSelectedTab('seasons')}
              >
                Seasons
              </button>
            </div>
          </div>
          
          {/* Collections Tab */}
          {selectedTab === 'collections' && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Collections</h2>
              
              {/* Collection Form */}
              <form onSubmit={handleCreateCollection} className="mb-4 p-4 border rounded">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="collection-name" className="block mb-1">Name</label>
                    <input
                      id="collection-name"
                      type="text"
                      name="name"
                      value={collectionForm.name}
                      onChange={handleCollectionInputChange}
                      className="w-full p-2 border rounded"
                      aria-label="Collection name"
                      title="Collection name"
                    />
                  </div>
                  <div>
                    <label htmlFor="collection-season" className="block mb-1">Season ID</label>
                    <select
                      id="collection-season"
                      name="season_id"
                      value={collectionForm.season_id}
                      onChange={handleCollectionInputChange}
                      className="w-full p-2 border rounded"
                      aria-label="Season"
                      title="Season"
                    >
                      <option value="">Select Season</option>
                      {seasons?.map(season => (
                        <option key={season.id} value={season.id}>{season.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="collection-release" className="block mb-1">Release Date</label>
                    <input
                      id="collection-release"
                      type="date"
                      name="release_date"
                      value={collectionForm.release_date}
                      onChange={handleCollectionInputChange}
                      className="w-full p-2 border rounded"
                      aria-label="Release date"
                      title="Release date"
                    />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="collection-description" className="block mb-1">Description</label>
                    <textarea
                      id="collection-description"
                      name="description"
                      value={collectionForm.description}
                      onChange={handleCollectionInputChange}
                      className="w-full p-2 border rounded"
                      rows={3}
                      aria-label="Description"
                      title="Description"
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button
                    type="submit"
                    disabled={isCreatingCollection}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    {isCreatingCollection ? 'Creating...' : 'Create Collection'}
                  </button>
                  
                  <button
                    type="button"
                    disabled={!selectedCollectionId || isUpdatingCollection}
                    onClick={handleUpdateCollection}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                  >
                    {isUpdatingCollection ? 'Updating...' : 'Update Collection'}
                  </button>
                  
                  <button
                    type="button"
                    disabled={!selectedCollectionId || isDeletingCollection}
                    onClick={handleDeleteCollection}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    {isDeletingCollection ? 'Deleting...' : 'Delete Collection'}
                  </button>
                </div>
              </form>
              
              {/* Collection List */}
              <div>
                <h3 className="text-lg font-medium mb-2">Collection List</h3>
                {isLoadingCollections ? (
                  <p>Loading collections...</p>
                ) : collections?.length ? (
                  <ul className="border rounded divide-y">
                    {collections.map(collection => (
                      <li
                        key={collection.id}
                        onClick={() => handleSelectCollection(collection)}
                        className={`p-3 cursor-pointer hover:bg-gray-50 ${
                          selectedCollectionId === collection.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="font-medium">{collection.name}</div>
                        <div className="text-sm text-gray-600">Release: {collection.release_date}</div>
                        <div className="text-sm text-gray-600">{collection.description}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No collections found</p>
                )}
              </div>
            </div>
          )}
          
          {/* Colors Tab */}
          {selectedTab === 'colors' && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Colors</h2>
              
              {/* Color Form */}
              <form onSubmit={handleCreateColor} className="mb-4 p-4 border rounded">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="color-name" className="block mb-1">Name</label>
                    <input
                      id="color-name"
                      type="text"
                      name="name"
                      value={colorForm.name}
                      onChange={handleColorInputChange}
                      className="w-full p-2 border rounded"
                      aria-label="Color name"
                      title="Color name"
                    />
                  </div>
                  <div>
                    <label htmlFor="color-code" className="block mb-1">Color Code</label>
                    <input
                      id="color-code"
                      type="text"
                      name="color_code"
                      value={colorForm.color_code}
                      onChange={handleColorInputChange}
                      className="w-full p-2 border rounded"
                      aria-label="Color code"
                      title="Color code"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Status</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="is_active"
                          value="true"
                          checked={colorForm.is_active === true}
                          onChange={handleColorInputChange}
                          aria-label="Active status"
                          title="Active status"
                        />
                        <span className="ml-2">Active</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="is_active"
                          value="false"
                          checked={colorForm.is_active === false}
                          onChange={handleColorInputChange}
                          aria-label="Inactive status"
                          title="Inactive status"
                        />
                        <span className="ml-2">Inactive</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button
                    type="submit"
                    disabled={isCreatingColor}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    {isCreatingColor ? 'Creating...' : 'Create Color'}
                  </button>
                  
                  <button
                    type="button"
                    disabled={!selectedColorId || isUpdatingColor}
                    onClick={handleUpdateColor}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                  >
                    {isUpdatingColor ? 'Updating...' : 'Update Color'}
                  </button>
                  
                  <button
                    type="button"
                    disabled={!selectedColorId || isDeletingColor}
                    onClick={handleDeleteColor}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    {isDeletingColor ? 'Deleting...' : 'Delete Color'}
                  </button>
                </div>
              </form>
              
              {/* Color List */}
              <div>
                <h3 className="text-lg font-medium mb-2">Color List</h3>
                {isLoadingColors ? (
                  <p>Loading colors...</p>
                ) : colors?.length ? (
                  <ul className="border rounded divide-y">
                    {colors.map(color => (
                      <li
                        key={color.id}
                        onClick={() => handleSelectColor(color)}
                        className={`p-3 cursor-pointer hover:bg-gray-50 ${
                          selectedColorId === color.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <div 
                            className="w-6 h-6 rounded-full mr-2" 
                            style={{ backgroundColor: color.color_code }}
                          ></div>
                          <div className="font-medium">{color.name}</div>
                        </div>
                        <div className="text-sm text-gray-600">Code: {color.color_code}</div>
                        <div className="text-sm text-gray-600">
                          Status: {color.is_active ? 'Active' : 'Inactive'}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No colors found</p>
                )}
              </div>
            </div>
          )}
          
          {/* Seasons Tab */}
          {selectedTab === 'seasons' && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Seasons</h2>
              
              {/* Season Form */}
              <form onSubmit={handleCreateSeason} className="mb-4 p-4 border rounded">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="season-name" className="block mb-1">Name</label>
                    <input
                      id="season-name"
                      type="text"
                      name="name"
                      value={seasonForm.name}
                      onChange={handleSeasonInputChange}
                      className="w-full p-2 border rounded"
                      aria-label="Season name"
                      title="Season name"
                    />
                  </div>
                  <div>
                    <label htmlFor="season-start" className="block mb-1">Start Date</label>
                    <input
                      id="season-start"
                      type="date"
                      name="start_date"
                      value={seasonForm.start_date}
                      onChange={handleSeasonInputChange}
                      className="w-full p-2 border rounded"
                      aria-label="Start date"
                      title="Start date"
                    />
                  </div>
                  <div>
                    <label htmlFor="season-end" className="block mb-1">End Date</label>
                    <input
                      id="season-end"
                      type="date"
                      name="end_date"
                      value={seasonForm.end_date}
                      onChange={handleSeasonInputChange}
                      className="w-full p-2 border rounded"
                      aria-label="End date"
                      title="End date"
                    />
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="season-description" className="block mb-1">Description</label>
                    <textarea
                      id="season-description"
                      name="description"
                      value={seasonForm.description}
                      onChange={handleSeasonInputChange}
                      className="w-full p-2 border rounded"
                      rows={3}
                      aria-label="Description"
                      title="Description"
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button
                    type="submit"
                    disabled={isCreatingSeason}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    {isCreatingSeason ? 'Creating...' : 'Create Season'}
                  </button>
                  
                  <button
                    type="button"
                    disabled={!selectedSeasonId || isUpdatingSeason}
                    onClick={handleUpdateSeason}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                  >
                    {isUpdatingSeason ? 'Updating...' : 'Update Season'}
                  </button>
                  
                  <button
                    type="button"
                    disabled={!selectedSeasonId || isDeletingSeason}
                    onClick={handleDeleteSeason}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    {isDeletingSeason ? 'Deleting...' : 'Delete Season'}
                  </button>
                </div>
              </form>
              
              {/* Season List */}
              <div>
                <h3 className="text-lg font-medium mb-2">Season List</h3>
                {isLoadingSeasons ? (
                  <p>Loading seasons...</p>
                ) : seasons?.length ? (
                  <ul className="border rounded divide-y">
                    {seasons.map(season => (
                      <li
                        key={season.id}
                        onClick={() => handleSelectSeason(season)}
                        className={`p-3 cursor-pointer hover:bg-gray-50 ${
                          selectedSeasonId === season.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="font-medium">{season.name}</div>
                        <div className="text-sm text-gray-600">
                          {season.start_date} to {season.end_date}
                        </div>
                        <div className="text-sm text-gray-600">{season.description}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No seasons found</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 