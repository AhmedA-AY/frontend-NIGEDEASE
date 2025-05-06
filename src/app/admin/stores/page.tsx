'use client';

import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as EditIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';

import { inventoryApi, InventoryStore, InventoryStoreCreateData } from '@/services/api/inventory';
import { Company, companiesApi } from '@/services/api/companies';

export default function StoresPage(): React.JSX.Element {
  const [stores, setStores] = useState<InventoryStore[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<InventoryStoreCreateData>({
    name: '',
    address: '',
    phone_number: '',
    email: '',
    company_id: '',
    is_active: "active",
    location: '',
  });
  const [currentStoreId, setCurrentStoreId] = useState<string | null>(null);
  
  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Fetch stores and companies data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch stores with detailed debugging
      console.log('Fetching stores...');
      const storesResponse = await inventoryApi.getStores();
      console.log('Stores API call completed with data:', storesResponse);
      
      // Process stores data to ensure consistent structure
      const processedStores = storesResponse.map(store => {
        // Create a normalized store object with fallbacks for missing fields
        // Convert is_active string values to boolean for UI display
        const isActiveValue = 
          typeof store.is_active === 'string' 
            ? store.is_active === 'active' 
            : !!store.is_active;
        
        return {
          id: store.id,
          name: store.name || 'Unnamed Store',
          address: store.address || '',
          phone_number: store.phone_number || '',
          email: store.email || '',
          is_active: isActiveValue,
          company: store.company || null,
          location: store.location || '',
          created_at: store.created_at || '',
          updated_at: store.updated_at || ''
        };
      });
      
      console.log('Normalized stores data:', processedStores);
      
      const companiesData = await companiesApi.getCompanies();
      console.log('Companies data:', companiesData);
      
      setStores(processedStores);
      setCompanies(companiesData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      console.log('Submitting form data:', formData); // Add logging to debug
      
      if (isEditMode && currentStoreId) {
        await inventoryApi.updateStore(currentStoreId, formData);
        setNotification({
          open: true,
          message: 'Store updated successfully',
          severity: 'success',
        });
      } else {
        await inventoryApi.createStore(formData);
        setNotification({
          open: true,
          message: 'Store created successfully',
          severity: 'success',
        });
      }
      
      // Reset form and refresh data
      handleCloseDialog();
      fetchData();
    } catch (err: any) {
      console.error('Error saving store:', err);
      
      // Handle API error messages more explicitly
      let errorMessage = 'Failed to save store. Please try again.';
      
      if (err.response && err.response.data) {
        console.error('API error details:', err.response.data);
        
        // Extract field error messages
        const fieldErrors = err.response.data;
        const errorDetails = Object.entries(fieldErrors)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join('; ');
        
        if (errorDetails) {
          errorMessage = `Validation errors: ${errorDetails}`;
        }
      }
      
      setNotification({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  // Handle edit store
  const handleEditStore = (store: InventoryStore) => {
    console.log('Editing store:', store);
    setFormData({
      name: store.name || '',
      address: store.address || '',
      phone_number: store.phone_number || '',
      email: store.email || '',
      company_id: store.company?.id || '',
      is_active: typeof store.is_active === 'boolean' 
        ? (store.is_active ? "active" : "inactive") 
        : (store.is_active || "active"),
      location: store.location || '',
    });
    setCurrentStoreId(store.id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  // Handle delete store
  const handleDeleteStore = async (storeId: string) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        await inventoryApi.deleteStore(storeId);
        setNotification({
          open: true,
          message: 'Store deleted successfully',
          severity: 'success',
        });
        fetchData();
      } catch (err) {
        console.error('Error deleting store:', err);
        setNotification({
          open: true,
          message: 'Failed to delete store. Please try again.',
          severity: 'error',
        });
      }
    }
  };

  // Handle toggle store status
  const handleToggleStatus = async (storeId: string, currentStatus: boolean) => {
    try {
      console.log(`Toggling store ${storeId} from ${currentStatus} to ${!currentStatus}`);
      await inventoryApi.toggleStoreStatus(storeId, !currentStatus);
      setNotification({
        open: true,
        message: `Store ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
        severity: 'success',
      });
      fetchData();
    } catch (err) {
      console.error('Error toggling store status:', err);
      setNotification({
        open: true,
        message: 'Failed to update store status. Please try again.',
        severity: 'error',
      });
    }
  };

  // Handle opening the dialog for creating a new store
  const handleOpenCreateDialog = () => {
    setFormData({
      name: '',
      address: '',
      phone_number: '',
      email: '',
      company_id: companies.length > 0 ? companies[0].id : '',
      is_active: "active",
      location: '',
    });
    setIsEditMode(false);
    setCurrentStoreId(null);
    setIsDialogOpen(true);
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData({
      name: '',
      address: '',
      phone_number: '',
      email: '',
      company_id: '',
      is_active: "active",
      location: '',
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  // Handle select input changes
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as string]: value });
  };

  // Handle closing notifications
  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4">Stores</Typography>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          onClick={handleOpenCreateDialog}
          disabled={isLoading}
        >
          Add Store
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No stores found. Create your first store.
                  </TableCell>
                </TableRow>
              ) : (
                stores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell>{store.name || 'N/A'}</TableCell>
                    <TableCell>{store.address || 'N/A'}</TableCell>
                    <TableCell>{store.phone_number || 'N/A'}</TableCell>
                    <TableCell>{store.email || 'N/A'}</TableCell>
                    <TableCell>{store.company?.name || 'No company'}</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={typeof store.is_active === 'boolean' 
                              ? store.is_active 
                              : store.is_active === 'active'}
                            onChange={() => handleToggleStatus(
                              store.id, 
                              typeof store.is_active === 'boolean' 
                                ? store.is_active 
                                : store.is_active === 'active'
                            )}
                            color="primary"
                          />
                        }
                        label={typeof store.is_active === 'boolean' 
                          ? (store.is_active ? 'Active' : 'Inactive')
                          : (store.is_active === 'active' ? 'Active' : 'Inactive')}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditStore(store)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteStore(store.id)}
                      >
                        <TrashIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Store Form Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditMode ? 'Edit Store' : 'Add New Store'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Store Name"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Address"
              fullWidth
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              multiline
              rows={2}
              required
            />
            <TextField
              label="Location"
              fullWidth
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, State, Country"
              required
            />
            <TextField
              label="Phone Number"
              fullWidth
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Email"
              fullWidth
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <FormControl fullWidth>
              <InputLabel id="company-select-label">Company</InputLabel>
              <Select
                labelId="company-select-label"
                name="company_id"
                value={formData.company_id}
                label="Company"
                onChange={handleSelectChange}
                required
              >
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active === true || formData.is_active === "active"}
                  onChange={(e) => 
                    setFormData({ ...formData, is_active: e.target.checked ? "active" : "inactive" })
                  }
                  name="is_active"
                  color="primary"
                />
              }
              label={formData.is_active === true || formData.is_active === "active" ? 'Active' : 'Inactive'}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.name || !formData.company_id}
          >
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
} 