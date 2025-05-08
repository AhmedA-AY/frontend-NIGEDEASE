'use client';

import * as React from 'react';
import { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
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

import { useStores, useCreateStore, useUpdateStore, useDeleteStore, useToggleStoreStatus } from '@/hooks/admin/use-stores';
import { useCompanies } from '@/hooks/admin/use-companies';
import { InventoryStoreCreateData } from '@/services/api/inventory';

export default function StoresPage(): React.JSX.Element {
  // Query hooks
  const { data: storesData, isLoading: isLoadingStores } = useStores();
  const { data: companies } = useCompanies();
  const createStoreMutation = useCreateStore();
  const updateStoreMutation = useUpdateStore('');
  const deleteStoreMutation = useDeleteStore();
  const toggleStoreStatusMutation = useToggleStoreStatus('');
  
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

  // Handle form submission
  const handleSubmit = async () => {
    try {
      if (isEditMode && currentStoreId) {
        await updateStoreMutation.mutateAsync(formData);
        setNotification({
          open: true,
          message: 'Store updated successfully',
          severity: 'success',
        });
      } else {
        await createStoreMutation.mutateAsync(formData);
        setNotification({
          open: true,
          message: 'Store created successfully',
          severity: 'success',
        });
      }
      
      handleCloseDialog();
    } catch (err: any) {
      console.error('Error saving store:', err);
      
      let errorMessage = 'Failed to save store. Please try again.';
      
      if (err.response?.data) {
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
  const handleEditStore = (store: any) => {
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
        await deleteStoreMutation.mutateAsync(storeId);
        setNotification({
          open: true,
          message: 'Store deleted successfully',
          severity: 'success',
        });
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
  const handleToggleStatus = async (storeId: string, currentStatus: "active" | "inactive") => {
    try {
      await toggleStoreStatusMutation.mutateAsync({ 
        is_active: currentStatus === "active" ? "inactive" : "active" 
      });
      setNotification({
        open: true,
        message: `Store ${currentStatus === "active" ? 'deactivated' : 'activated'} successfully`,
        severity: 'success',
      });
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
      company_id: companies?.data?.[0]?.id || '',
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

  if (isLoadingStores) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
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
          disabled={isLoadingStores}
        >
          Add Store
        </Button>
      </Stack>

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
            {storesData?.data.map((store) => (
              <TableRow key={store.id}>
                <TableCell>{store.name}</TableCell>
                <TableCell>{store.address}</TableCell>
                <TableCell>{store.phone_number}</TableCell>
                <TableCell>{store.email}</TableCell>
                <TableCell>{store.company?.name}</TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={store.is_active === "active"}
                        onChange={() => handleToggleStatus(store.id, store.is_active)}
                        color="primary"
                      />
                    }
                    label={store.is_active === "active" ? 'Active' : 'Inactive'}
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
                {companies?.data.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active === "active"}
                  onChange={(e) => 
                    setFormData({ ...formData, is_active: e.target.checked ? "active" : "inactive" })
                  }
                  name="is_active"
                  color="primary"
                />
              }
              label={formData.is_active === "active" ? 'Active' : 'Inactive'}
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