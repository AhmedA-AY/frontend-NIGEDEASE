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
import CustomerEditModal, { CustomerFormData } from '@/components/admin/parties/CustomerEditModal';
import { useSnackbar } from 'notistack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { Customer, CustomerCreateData, transactionsApi } from '@/services/api/transactions';
import { useStore } from '@/contexts/store-context';

export default function CustomersPage(): React.JSX.Element {
  const [selectedCustomers, setSelectedCustomers] = React.useState<string[]>([]);
  const [tabValue, setTabValue] = React.useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<CustomerFormData | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { selectedStore } = useStore();
  
  // Fetch customers
  const fetchCustomers = React.useCallback(async () => {
    if (!selectedStore) {
      enqueueSnackbar('No store selected', { variant: 'warning' });
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await transactionsApi.getCustomers(selectedStore.id);
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      enqueueSnackbar('Failed to load customers', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar, selectedStore]);

  React.useEffect(() => {
    if (selectedStore) {
      fetchCustomers();
    }
  }, [fetchCustomers, selectedStore]);

  // Calculate total balance
  const totalBalance = customers.reduce((sum, customer) => {
    const amount = parseFloat(customer.credit_limit || '0');
    return sum + amount;
  }, 0);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedCustomers(customers.map(customer => customer.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter(customerId => customerId !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenAddModal = () => {
    setCurrentCustomer(undefined);
    setIsEditModalOpen(true);
  };
  
  const handleOpenEditModal = (customer: Customer) => {
    setCurrentCustomer({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: 'Enabled', // Status is not in Customer model, assuming Enabled by default
      openingBalance: parseFloat(customer.credit_limit || '0'),
      taxNumber: '',
      address: customer.address,
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
  
  const handleSaveCustomer = async (customerData: CustomerFormData) => {
    if (!selectedStore) {
      enqueueSnackbar('No store selected', { variant: 'error' });
      return;
    }
    
    try {
      const customerPayload: CustomerCreateData = {
        store_id: selectedStore.id,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address || '',
        credit_limit: (customerData.openingBalance || 0).toString(),
      };

      if (customerData.id) {
        // Update existing customer
        await transactionsApi.updateCustomer(selectedStore.id, customerData.id, customerPayload);
        enqueueSnackbar('Customer updated successfully', { variant: 'success' });
      } else {
        // Add new customer
        await transactionsApi.createCustomer(selectedStore.id, customerPayload);
        enqueueSnackbar('Customer added successfully', { variant: 'success' });
      }
      
      // Refresh the customer list
      fetchCustomers();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving customer:', error);
      enqueueSnackbar('Failed to save customer', { variant: 'error' });
    }
  };
  
  const handleOpenDeleteDialog = (customerId: string) => {
    setCustomerToDelete(customerId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };
  
  const handleDeleteCustomer = async () => {
    if (!selectedStore) {
      enqueueSnackbar('No store selected', { variant: 'error' });
      return;
    }
    
    if (customerToDelete) {
      try {
        await transactionsApi.deleteCustomer(selectedStore.id, customerToDelete);
        enqueueSnackbar('Customer deleted successfully', { variant: 'success' });
        // Refresh the customer list
        fetchCustomers();
        // Clear selection if the deleted customer was selected
        setSelectedCustomers(prevSelected => 
          prevSelected.filter(id => id !== customerToDelete)
        );
      } catch (error) {
        console.error('Error deleting customer:', error);
        enqueueSnackbar('Failed to delete customer', { variant: 'error' });
      }
    }
    handleCloseDeleteDialog();
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: '/admin/dashboard' },
    { label: 'Parties', url: '/admin/parties' },
    { label: 'Customers', url: '/admin/parties/customers' },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Customers</Typography>
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
            Add New Customer
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<UploadSimpleIcon weight="bold" />}
            sx={{ color: '#0ea5e9', borderColor: '#0ea5e9', '&:hover': { borderColor: '#0284c7', color: '#0284c7' } }}
          >
            Import Customers
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
          label="To Collect" 
          sx={{ 
            textTransform: 'none', 
            minWidth: 80,
            color: tabValue === 1 ? '#0ea5e9' : 'inherit',
            '&.Mui-selected': { color: '#0ea5e9' }
          }} 
        />
        <Tab 
          label="To Pay" 
          sx={{ 
            textTransform: 'none', 
            minWidth: 60,
            color: tabValue === 2 ? '#0ea5e9' : 'inherit',
            '&.Mui-selected': { color: '#0ea5e9' }
          }} 
        />
      </Tabs>

      {/* Customers Table */}
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={customers.length > 0 && selectedCustomers.length === customers.length}
                  indeterminate={selectedCustomers.length > 0 && selectedCustomers.length < customers.length}
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
                  <Typography variant="body1">Loading customers...</Typography>
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1">No customers found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => {
                const isSelected = selectedCustomers.includes(customer.id);
                
                return (
                  <TableRow 
                    hover 
                    key={customer.id}
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
                        onChange={() => handleSelectOne(customer.id)}
                        inputProps={{ 'aria-labelledby': `customer-${customer.id}` }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box 
                        onClick={() => handleOpenEditModal(customer)}
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          color: 'primary.main',
                          fontWeight: 500,
                        }}
                      >
                        {customer.name}
                      </Box>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{new Date(customer.created_at).toLocaleDateString('en-US', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    }).replace(/\//g, '-')}</TableCell>
                    <TableCell align="right">${parseFloat(customer.credit_limit || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenEditModal(customer)}
                          sx={{ color: 'primary.main' }}
                        >
                          <PencilSimpleIcon size={20} />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDeleteDialog(customer.id)}
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
      
      {/* Customer Edit Modal */}
      <CustomerEditModal
        open={isEditModalOpen}
        onClose={handleCloseModal}
        customer={currentCustomer}
        onSave={handleSaveCustomer}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this customer? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteCustomer} 
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