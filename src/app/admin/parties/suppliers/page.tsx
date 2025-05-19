'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { UploadSimple as UploadSimpleIcon } from '@phosphor-icons/react/dist/ssr/UploadSimple';
import { useState } from 'react';
import SupplierEditModal, { SupplierFormData } from '@/components/admin/parties/SupplierEditModal';
import { useSnackbar } from 'notistack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { Supplier, SupplierCreateData, transactionsApi } from '@/services/api/transactions';

export default function SuppliersPage(): React.JSX.Element {
  const [selectedSuppliers, setSelectedSuppliers] = React.useState<string[]>([]);
  const [tabValue, setTabValue] = React.useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<SupplierFormData | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  
  // Fetch suppliers
  const fetchSuppliers = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await transactionsApi.getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      enqueueSnackbar('Failed to load suppliers', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar]);

  React.useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // Calculate total balance
  const totalBalance = suppliers.reduce((sum, supplier) => {
    const amount = parseFloat(supplier.credit_limit || '0');
    return sum + amount;
  }, 0);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedSuppliers(suppliers.map(supplier => supplier.id));
    } else {
      setSelectedSuppliers([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedSuppliers.includes(id)) {
      setSelectedSuppliers(selectedSuppliers.filter(supplierId => supplierId !== id));
    } else {
      setSelectedSuppliers([...selectedSuppliers, id]);
    }
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenAddModal = () => {
    setCurrentSupplier(undefined);
    setIsEditModalOpen(true);
  };
  
  const handleOpenEditModal = (supplier: Supplier) => {
    setCurrentSupplier({
      id: supplier.id,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      status: supplier.is_active ? 'Enabled' : 'Disabled',
      openingBalance: parseFloat(supplier.credit_limit || '0'),
      taxNumber: '',
      address: supplier.address,
      city: '',
      state: '',
      zipCode: '',
      country: '',
    });
    setIsEditModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };
  
  const handleSaveSupplier = async (supplierData: SupplierFormData) => {
    try {
      const supplierPayload: SupplierCreateData = {
        name: supplierData.name,
        email: supplierData.email,
        phone: supplierData.phone,
        address: supplierData.address || '',
        credit_limit: (supplierData.openingBalance || 0).toString(),
        is_active: supplierData.status === 'Enabled'
      };

      if (supplierData.id) {
        // Update existing supplier
        await transactionsApi.updateSupplier(supplierData.id, supplierPayload);
        enqueueSnackbar('Supplier updated successfully', { variant: 'success' });
      } else {
        // Add new supplier
        await transactionsApi.createSupplier(supplierPayload);
        enqueueSnackbar('Supplier added successfully', { variant: 'success' });
      }
      
      // Refresh the supplier list
      fetchSuppliers();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving supplier:', error);
      enqueueSnackbar('Failed to save supplier', { variant: 'error' });
    }
  };
  
  const handleOpenDeleteDialog = (supplierId: string) => {
    setSupplierToDelete(supplierId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSupplierToDelete(null);
  };
  
  const handleDeleteSupplier = async () => {
    if (supplierToDelete) {
      try {
        await transactionsApi.deleteSupplier(supplierToDelete);
        enqueueSnackbar('Supplier deleted successfully', { variant: 'success' });
        // Refresh the supplier list
        fetchSuppliers();
        // Clear selection if the deleted supplier was selected
        setSelectedSuppliers(prevSelected => 
          prevSelected.filter(id => id !== supplierToDelete)
        );
      } catch (error) {
        console.error('Error deleting supplier:', error);
        enqueueSnackbar('Failed to delete supplier', { variant: 'error' });
      }
    }
    handleCloseDeleteDialog();
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: '/admin/dashboard' },
    { label: 'Parties', url: '/admin/parties' },
    { label: 'Suppliers', url: '/admin/parties/suppliers' },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Suppliers</Typography>
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

      {/* Action Buttons and Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            startIcon={<PlusIcon weight="bold" />}
            sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            onClick={handleOpenAddModal}
          >
            Add New Supplier
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<UploadSimpleIcon weight="bold" />}
            sx={{ color: '#0ea5e9', borderColor: '#0ea5e9', '&:hover': { borderColor: '#0284c7', color: '#0284c7' } }}
          >
            Import Suppliers
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <OutlinedInput
            placeholder="Search..."
            size="small"
            startAdornment={
              <InputAdornment position="start">
                <MagnifyingGlassIcon size={20} />
              </InputAdornment>
            }
            sx={{ width: 200 }}
          />
          <Select
            displayEmpty
            value=""
            input={<OutlinedInput size="small" />}
            renderValue={(selected) => {
              if (!selected) {
                return <Typography color="text.secondary">Select Status...</Typography>;
              }
              return selected;
            }}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="Enabled">Enabled</MenuItem>
            <MenuItem value="Disabled">Disabled</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        sx={{ mb: 2, '& .MuiTabs-indicator': { bgcolor: '#0ea5e9' } }}
      >
        <Tab 
          label="All" 
          sx={{ 
            textTransform: 'none', 
            minWidth: 50,
            color: tabValue === 0 ? '#0ea5e9' : 'inherit',
            '&.Mui-selected': { color: '#0ea5e9' }
          }} 
        />
        <Tab 
          label="To Pay" 
          sx={{ 
            textTransform: 'none', 
            minWidth: 60,
            color: tabValue === 1 ? '#0ea5e9' : 'inherit',
            '&.Mui-selected': { color: '#0ea5e9' }
          }} 
        />
        <Tab 
          label="To Collect" 
          sx={{ 
            textTransform: 'none', 
            minWidth: 80,
            color: tabValue === 2 ? '#0ea5e9' : 'inherit',
            '&.Mui-selected': { color: '#0ea5e9' }
          }} 
        />
      </Tabs>

      {/* Suppliers Table */}
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={suppliers.length > 0 && selectedSuppliers.length === suppliers.length}
                  indeterminate={selectedSuppliers.length > 0 && selectedSuppliers.length < suppliers.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1">Loading suppliers...</Typography>
                </TableCell>
              </TableRow>
            ) : suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1">No suppliers found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => {
                const isSelected = selectedSuppliers.includes(supplier.id);
                
                return (
                  <TableRow 
                    hover 
                    key={supplier.id}
                    selected={isSelected}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox 
                        checked={isSelected}
                        onChange={() => handleSelectOne(supplier.id)}
                        inputProps={{ 'aria-labelledby': `supplier-${supplier.id}` }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box 
                        onClick={() => handleOpenEditModal(supplier)}
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          color: 'primary.main',
                          fontWeight: 500,
                        }}
                      >
                        {supplier.name}
                      </Box>
                    </TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{new Date(supplier.created_at).toLocaleDateString('en-US', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    }).replace(/\//g, '-')}</TableCell>
                    <TableCell align="right">${parseFloat(supplier.credit_limit || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Box 
                        sx={{ 
                          bgcolor: supplier.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                          color: supplier.is_active ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)', 
                          py: 0.5, 
                          px: 1.5, 
                          borderRadius: 1, 
                          display: 'inline-block',
                          fontSize: '0.75rem'
                        }}
                      >
                        {supplier.is_active ? 'Enabled' : 'Disabled'}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenEditModal(supplier)}
                          sx={{ color: 'primary.main' }}
                        >
                          <PencilSimpleIcon size={20} />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDeleteDialog(supplier.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <TrashIcon size={20} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
            <TableRow>
              <TableCell colSpan={4} sx={{ fontWeight: 'bold' }}>
                Total
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>${totalBalance.toLocaleString('en-US', {minimumFractionDigits: 2})}</TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <Button size="small" sx={{ minWidth: 'auto', p: 0 }}>&lt;</Button>
              <Button 
                size="small" 
                sx={{ 
                  minWidth: 24, 
                  height: 24, 
                  p: 0, 
                  mx: 0.5, 
                  border: '1px solid #0ea5e9', 
                  borderRadius: 1,
                  color: '#0ea5e9' 
                }}
              >
                1
              </Button>
              <Button size="small" sx={{ minWidth: 'auto', p: 0 }}>&gt;</Button>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              10 / page <Box component="span" sx={{ ml: 0.5, cursor: 'pointer' }}>▼</Box>
            </Typography>
          </Box>
        </Box>
      </Card>
      
      {/* Supplier Edit Modal */}
      <SupplierEditModal
        open={isEditModalOpen}
        onClose={handleCloseModal}
        supplier={currentSupplier}
        onSave={handleSaveSupplier}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this supplier? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteSupplier} 
            sx={{ color: '#f43f5e' }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 