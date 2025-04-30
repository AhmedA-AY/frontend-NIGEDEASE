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

export default function CustomersPage(): React.JSX.Element {
  const [selectedCustomers, setSelectedCustomers] = React.useState<string[]>([]);
  const [tabValue, setTabValue] = React.useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<CustomerFormData | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  
  // Mock customer data
  const [customers, setCustomers] = useState([
    { id: '1', name: 'Walk In Customer', email: 'walkin@email.com', phone: '123-456-7890', createdAt: '30-04-2025 04:56 am', balance: '$0.00', status: 'Enabled' },
    { id: '2', name: 'Joesph Kulas', email: 'samantha.runolfsdottir@example.com', phone: '234-567-8901', createdAt: '29-04-2025 02:36 pm', balance: '$696,531.00', status: 'Enabled' },
    { id: '3', name: 'Corbin Hoppe Jr.', email: 'grant.kirlin@example.com', phone: '345-678-9012', createdAt: '29-04-2025 02:36 pm', balance: '$223,229.00', status: 'Enabled' },
    { id: '4', name: 'Kayli Skiles', email: 'annabell32@example.org', phone: '456-789-0123', createdAt: '29-04-2025 02:36 pm', balance: '$688,035.80', status: 'Enabled' },
    { id: '5', name: 'Mack O\'Connell MD', email: 'gregoria44@example.org', phone: '567-890-1234', createdAt: '29-04-2025 02:36 pm', balance: '$223,229.00', status: 'Enabled' },
    { id: '6', name: 'Bettie Barrows', email: 'damore.ressie@example.net', phone: '678-901-2345', createdAt: '29-04-2025 02:36 pm', balance: '$742,003.85', status: 'Enabled' },
    { id: '7', name: 'Maverick Runte', email: 'kris.cordie@example.org', phone: '789-012-3456', createdAt: '29-04-2025 02:36 pm', balance: '$263,697.00', status: 'Enabled' },
    { id: '8', name: 'Dr. Durward Shields Jr.', email: 'kelsi.funk@example.org', phone: '890-123-4567', createdAt: '29-04-2025 02:36 pm', balance: '$828,702.25', status: 'Enabled' },
    { id: '9', name: 'Prof. Luciano Wolff', email: 'darion83@example.net', phone: '901-234-5678', createdAt: '29-04-2025 02:36 pm', balance: '$309,087.00', status: 'Enabled' },
    { id: '10', name: 'Josianne Wunsch', email: 'nborer@example.com', phone: '012-345-6789', createdAt: '29-04-2025 02:36 pm', balance: '$142,094.00', status: 'Enabled' },
  ]);

  // Calculate total balance
  const totalBalance = customers.reduce((sum, customer) => {
    const amount = parseFloat(customer.balance.replace(/[$,]/g, ''));
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
  
  const handleOpenEditModal = (customer: any) => {
    // Convert balance string to number for the form
    const balanceStr = customer.balance.replace(/[$,]/g, '');
    const balanceNum = parseFloat(balanceStr);
    
    setCurrentCustomer({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status as 'Enabled' | 'Disabled',
      openingBalance: balanceNum,
      // Other fields can be added as needed
      taxNumber: '',
      address: '',
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
  
  const handleSaveCustomer = (customerData: CustomerFormData) => {
    if (customerData.id) {
      // Update existing customer
      setCustomers(prevCustomers => 
        prevCustomers.map(customer => 
          customer.id === customerData.id 
            ? {
                ...customer,
                name: customerData.name,
                email: customerData.email,
                phone: customerData.phone,
                status: customerData.status,
                balance: `$${customerData.openingBalance?.toLocaleString() || '0.00'}`,
              }
            : customer
        )
      );
      enqueueSnackbar('Customer updated successfully', { variant: 'success' });
    } else {
      // Add new customer
      const newCustomer = {
        id: (customers.length + 1).toString(),
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        createdAt: new Date().toLocaleDateString('en-US', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).replace(/\//g, '-'),
        balance: `$${customerData.openingBalance?.toLocaleString() || '0.00'}`,
        status: customerData.status
      };
      
      setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
      enqueueSnackbar('Customer added successfully', { variant: 'success' });
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
  
  const handleDeleteCustomer = () => {
    if (customerToDelete) {
      setCustomers(prevCustomers => 
        prevCustomers.filter(customer => customer.id !== customerToDelete)
      );
      setSelectedCustomers(prevSelected => 
        prevSelected.filter(id => id !== customerToDelete)
      );
      enqueueSnackbar('Customer deleted successfully', { variant: 'success' });
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
            {customers.map((customer) => (
              <TableRow key={customer.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomers.includes(customer.id)}
                    onChange={() => handleSelectOne(customer.id)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: '#0ea5e9',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        mr: 1,
                      }}
                    >
                      {customer.name.charAt(0)}
                    </Box>
                    {customer.name}
                  </Box>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.createdAt}</TableCell>
                <TableCell>{customer.balance}</TableCell>
                <TableCell>
                  <Box 
                    sx={{ 
                      bgcolor: 'rgba(16, 185, 129, 0.1)', 
                      color: 'rgb(16, 185, 129)', 
                      py: 0.5, 
                      px: 1.5, 
                      borderRadius: 1, 
                      display: 'inline-block',
                      fontSize: '0.75rem'
                    }}
                  >
                    {customer.status}
                  </Box>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenEditModal(customer)}
                      sx={{ color: '#0ea5e9' }}
                    >
                      <PencilSimpleIcon size={18} />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenDeleteDialog(customer.id)}
                      sx={{ color: '#f43f5e' }}
                    >
                      <TrashIcon size={18} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#0f766e' }}>
                      <EyeIcon size={18} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
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