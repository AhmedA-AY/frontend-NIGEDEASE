'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-auth';
import { inventoryApi, InventoryStore } from '@/services/api/inventory';
import { useSnackbar } from 'notistack';
import { paths } from '@/paths';
import StoreEditModal from '@/components/admin/stores/StoreEditModal';
import { StoreSelector } from '@/components/admin/store-selector';
import { useStore } from '@/contexts/store-context';
import { FormControl, InputLabel, Select } from '@mui/material';

export default function StoresPage(): React.JSX.Element {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo } = useCurrentUser();
  const { selectedStore: activeStore, stores: contextStores } = useStore();
  
  const [isLoading, setIsLoading] = React.useState(true);
  const [stores, setStores] = React.useState<InventoryStore[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStore, setSelectedStore] = React.useState<InventoryStore | null>(null);
  const [isStoreModalOpen, setIsStoreModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [storeToDelete, setStoreToDelete] = React.useState<string | null>(null);
  const [anchorElMap, setAnchorElMap] = React.useState<{ [key: string]: HTMLElement | null }>({});
  
  // Check for URL query parameters
  React.useEffect(() => {
    // Get URL search params
    const queryParams = new URLSearchParams(window.location.search);
    const editStoreId = queryParams.get('edit');
    const deleteStoreId = queryParams.get('delete');

    // If there's an edit parameter, open the edit modal for that store
    if (editStoreId) {
      const storeToEdit = stores.find(store => store.id === editStoreId);
      if (storeToEdit) {
        setSelectedStore(storeToEdit);
        setIsStoreModalOpen(true);
        // Clear the query parameter
        router.replace('/admin/stores');
      }
    }

    // If there's a delete parameter, open the delete confirmation for that store
    if (deleteStoreId) {
      setStoreToDelete(deleteStoreId);
      setIsDeleteModalOpen(true);
      // Clear the query parameter
      router.replace('/admin/stores');
    }
  }, [stores, router]);
  
  // Fetch stores data
  const fetchStores = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // If user has a company_id, pass it to get only stores for that company
      const storesData = userInfo?.company_id 
        ? await inventoryApi.getStores(userInfo.company_id) 
        : await inventoryApi.getStores();
      
      // Filter stores by user's company and role
      let filteredStores = userInfo?.company_id 
        ? storesData 
        : storesData.filter(store => store.company && userInfo?.role === 'superadmin');
      
      setStores(filteredStores);
    } catch (error) {
      console.error('Error fetching stores:', error);
      enqueueSnackbar('Failed to fetch stores', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [userInfo, enqueueSnackbar]);
  
  // Load data on component mount
  React.useEffect(() => {
    fetchStores();
  }, [fetchStores]);
  
  // Handle search
  const filteredStores = searchQuery
    ? stores.filter(store => 
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.location.toLowerCase().includes(searchQuery.toLowerCase()))
    : stores;
  
  // Menu handling
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorElMap({ ...anchorElMap, [id]: event.currentTarget });
  };
  
  const handleMenuClose = (id: string) => {
    setAnchorElMap({ ...anchorElMap, [id]: null });
  };
  
  // Add/Edit/Delete handlers
  const handleAddNewStore = () => {
    setSelectedStore(null);
    setIsStoreModalOpen(true);
  };
  
  const handleEditStore = (store: InventoryStore) => {
    setSelectedStore(store);
    setIsStoreModalOpen(true);
    handleMenuClose(store.id);
  };
  
  const handleDeleteStore = (id: string) => {
    setStoreToDelete(id);
    setIsDeleteModalOpen(true);
    handleMenuClose(id);
  };
  
  const handleConfirmDelete = async () => {
    if (storeToDelete) {
      setIsLoading(true);
      try {
        await inventoryApi.deleteStore(storeToDelete);
        enqueueSnackbar('Store deleted successfully', { variant: 'success' });
        fetchStores();
      } catch (error) {
        console.error('Error deleting store:', error);
        enqueueSnackbar('Failed to delete store', { variant: 'error' });
      } finally {
        setIsLoading(false);
        setIsDeleteModalOpen(false);
        setStoreToDelete(null);
      }
    }
  };
  
  const handleSaveStore = async (storeData: any) => {
    setIsLoading(true);
    try {
      if (storeData.id) {
        // Update existing store
        await inventoryApi.updateStore(storeData.id, {
          name: storeData.name,
          location: storeData.location,
          company_id: userInfo?.company_id || storeData.company_id,
          is_active: storeData.is_active,
          address: storeData.address || '',
          phone_number: storeData.phone_number || '',
          email: storeData.email || ''
        });
        enqueueSnackbar('Store updated successfully', { variant: 'success' });
      } else {
        // Add new store - ensure company_id is provided
        if (!userInfo?.company_id) {
          throw new Error("Company ID is required to create a store");
        }

        await inventoryApi.createStore({
          name: storeData.name,
          location: storeData.location,
          company_id: userInfo.company_id,
          is_active: 'active',
          address: storeData.address || '',
          phone_number: storeData.phone_number || '',
          email: storeData.email || ''
        });
        enqueueSnackbar('Store created successfully', { variant: 'success' });
      }
      fetchStores();
      setIsStoreModalOpen(false);
    } catch (error) {
      console.error('Error saving store:', error);
      enqueueSnackbar('Failed to save store', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.admin.dashboard },
    { label: 'Stores', url: paths.admin.stores },
  ];
  
  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Stores Management</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <Box component="span" sx={{ mx: 0.5 }}>-</Box>}
              <Typography 
                component="a" 
                href={item.url} 
                variant="body2" 
                color={index === breadcrumbItems.length - 1 ? 'text.primary' : 'inherit'}
                sx={{ textDecoration: 'none' }}
              >
                {item.label}
              </Typography>
            </React.Fragment>
          ))}
        </Box>
      </Box>
      
      {/* Action Buttons and Search */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<PlusIcon weight="bold" />}
            sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            onClick={handleAddNewStore}
          >
            Add New Store
          </Button>
          {stores.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="store-selector-label">Store</InputLabel>
              <Select
                labelId="store-selector-label"
                id="store-selector"
                value=""
                onChange={(e) => {
                  const storeId = e.target.value as string;
                  const store = stores.find(s => s.id === storeId);
                  if (store) {
                    router.push(`/admin/stores/${storeId}`);
                  }
                }}
                label="Store"
                displayEmpty
                renderValue={() => "Switch Store"}
              >
                {stores.map((store) => (
                  <MenuItem key={store.id} value={store.id}>
                    {store.name} ({store.location})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
        <Box>
          <TextField
            placeholder="Search stores..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <MagnifyingGlassIcon size={20} style={{ marginRight: 8 }} />
              ),
            }}
            sx={{ width: 250 }}
          />
        </Box>
      </Box>
      
      {/* Stores List */}
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell width="100px">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={32} />
                  </TableCell>
                </TableRow>
              ) : filteredStores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No stores found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStores.map((store) => (
                  <TableRow key={store.id} hover>
                    <TableCell>{store.name}</TableCell>
                    <TableCell>{store.location}</TableCell>
                    <TableCell>
                      <Chip 
                        label={store.is_active === 'active' ? 'Active' : 'Inactive'} 
                        color={store.is_active === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(event) => handleMenuOpen(event, store.id)}>
                        <DotsThreeIcon size={24} />
                      </IconButton>
                      <Menu
                        anchorEl={anchorElMap[store.id]}
                        open={Boolean(anchorElMap[store.id])}
                        onClose={() => handleMenuClose(store.id)}
                      >
                        <MenuItem onClick={() => handleEditStore(store)}>Edit</MenuItem>
                        <MenuItem onClick={() => handleDeleteStore(store.id)}>Delete</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </Card>
      
      {/* Edit/Create Store Modal */}
      {isStoreModalOpen && (
        <StoreEditModal
          open={isStoreModalOpen}
          onClose={() => setIsStoreModalOpen(false)}
          onSave={handleSaveStore}
          store={selectedStore || undefined}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      <StoreDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}

// Delete confirmation modal component
function StoreDeleteModal({ 
  open, 
  onClose, 
  onConfirm 
}: { 
  open: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Store</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this store? This action cannot be undone.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error">Delete</Button>
      </DialogActions>
    </Dialog>
  );
}