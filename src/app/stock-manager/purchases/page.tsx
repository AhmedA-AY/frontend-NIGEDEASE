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
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { paths } from '@/paths';
import PurchaseEditModal from '@/components/admin/purchases/PurchaseEditModal';
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';
import { useState, useEffect, useCallback } from 'react';
import { Purchase, Supplier, PurchaseCreateData, PurchaseUpdateData, transactionsApi, PaymentMode } from '@/services/api/transactions';
import { inventoryApi, InventoryStore } from '@/services/api/inventory';
import { companiesApi, Company, Currency } from '@/services/api/companies';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { SelectChangeEvent } from '@mui/material/Select';
import { useCurrentUser } from '@/hooks/use-auth';
import { financialsApi } from '@/services/api/financials';
import { useStore, STORE_CHANGED_EVENT } from '@/providers/store-provider';
import { useSnackbar } from 'notistack';

export default function PurchasesPage(): React.JSX.Element {
  const { currentStore } = useStore();
  const { enqueueSnackbar } = useSnackbar();
  const [tabValue, setTabValue] = React.useState(0);
  const [selectedPurchases, setSelectedPurchases] = React.useState<string[]>([]);
  const [anchorElMap, setAnchorElMap] = React.useState<{ [key: string]: HTMLElement | null }>({});
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentPurchase, setCurrentPurchase] = React.useState<any>(null);
  const [purchaseToDelete, setPurchaseToDelete] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [selectedPurchaseDetails, setSelectedPurchaseDetails] = useState<Purchase | null>(null);
  const { userInfo } = useCurrentUser();
  
  // Fetch required data
  const fetchData = useCallback(async () => {
    if (!currentStore) {
      enqueueSnackbar('No store selected', { variant: 'warning' });
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      // Fetch purchases for the current store
      const purchasesData = await transactionsApi.getPurchases(currentStore.id);
      setPurchases(purchasesData);
      
      // Fetch suppliers for dropdown
      const suppliersData = await transactionsApi.getSuppliers(currentStore.id);
      setSuppliers(suppliersData);
      
      // Fetch payment modes
      const paymentModesData = await transactionsApi.getPaymentModes(currentStore.id);
      setPaymentModes(paymentModesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      enqueueSnackbar('Failed to load data', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [currentStore, enqueueSnackbar]);
  
  // Initial data load
  useEffect(() => {
    if (currentStore) {
      fetchData();
    }
  }, [fetchData, currentStore]);
  
  // Listen for store changes
  useEffect(() => {
    const handleStoreChange = () => {
      if (currentStore) {
        fetchData();
      }
    };
    
    window.addEventListener(STORE_CHANGED_EVENT, handleStoreChange);
    return () => {
      window.removeEventListener(STORE_CHANGED_EVENT, handleStoreChange);
    };
  }, [fetchData, currentStore]);
  
  // Filter purchases by selected supplier
  const filteredPurchases = selectedSupplier
    ? purchases.filter(purchase => purchase.supplier.id === selectedSupplier)
    : purchases;
  
  // Calculate total amounts
  const totalAmount = filteredPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.total_amount), 0);
  const totalPaid = 0; // Not available directly from the API
  const totalDue = totalAmount - totalPaid;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedPurchaseDetails(null); // Reset selected purchase details when changing tabs
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedPurchases(filteredPurchases.map(purchase => purchase.id));
    } else {
      setSelectedPurchases([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedPurchases.includes(id)) {
      setSelectedPurchases(selectedPurchases.filter(purchaseId => purchaseId !== id));
    } else {
      setSelectedPurchases([...selectedPurchases, id]);
    }
  };

  const handleSupplierChange = (event: SelectChangeEvent) => {
    setSelectedSupplier(event.target.value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorElMap({ ...anchorElMap, [id]: event.currentTarget });
  };

  const handleMenuClose = (id: string) => {
    setAnchorElMap({ ...anchorElMap, [id]: null });
  };

  const handleRowClick = (purchase: Purchase) => {
    setSelectedPurchaseDetails(purchase);
    setTabValue(3); // Switch to a new tab for viewing purchase details
  };

  const handleAddNewPurchase = () => {
    if (!currentStore) {
      enqueueSnackbar('Please select a store first', { variant: 'warning' });
      return;
    }
    
    const defaultPaymentModeId = paymentModes.length > 0 ? paymentModes[0].id : '';
    
    setCurrentPurchase({
      date: new Date().toISOString().split('T')[0],
      supplier: '',
      status: 'Ordered',
      products: [],
      totalAmount: 0,
      paidAmount: 0,
      dueAmount: 0,
      paymentStatus: 'Unpaid',
      store_id: currentStore.id,
      payment_mode_id: defaultPaymentModeId,
      is_credit: false
    });
    setIsPurchaseModalOpen(true);
  };

  const handleEditPurchase = async (id: string) => {
    if (!currentStore) {
      enqueueSnackbar('Please select a store first', { variant: 'warning' });
      return;
    }
    
    const purchaseToEdit = purchases.find(purchase => purchase.id === id);
    if (purchaseToEdit) {
      // Show loading indicator
      setIsLoading(true);
      
      try {
        const purchaseItems = await transactionsApi.getPurchaseItems(currentStore.id, id);
        
        const products = await Promise.all(purchaseItems.map(async (item) => {
          let product;
          try {
            product = await inventoryApi.getProduct(currentStore.id, item.product.id);
          } catch (err) {
            console.error(`Error fetching product ${item.product.id}:`, err);
            product = item.product;
          }
          
          return {
            id: item.product.id,
            name: product.name,
            quantity: parseInt(item.quantity),
            unitPrice: product.purchase_price ? parseFloat(product.purchase_price) : 0,
            discount: 0, // Not available from API, default to 0
            tax: 0, // Not available from API, default to 0
            subtotal: parseFloat(item.quantity) * (product.purchase_price ? parseFloat(product.purchase_price) : 0)
          };
        }));
        
        // Convert the purchase data to the format expected by the modal
        setCurrentPurchase({
          id: purchaseToEdit.id,
          date: new Date(purchaseToEdit.created_at).toISOString().split('T')[0],
          supplier: purchaseToEdit.supplier.id,
          status: purchaseToEdit.is_credit ? 'Credit' : 'Paid',
          products: products,
          totalAmount: parseFloat(purchaseToEdit.total_amount),
          paidAmount: 0, // Not available directly
          dueAmount: parseFloat(purchaseToEdit.total_amount), // Assuming full amount is due
          paymentStatus: purchaseToEdit.is_credit ? 'Unpaid' : 'Paid',
          store_id: purchaseToEdit.store.id,
          payment_mode_id: purchaseToEdit.payment_mode.id,
          is_credit: purchaseToEdit.is_credit
        });
        
        setIsPurchaseModalOpen(true);
        handleMenuClose(id);
      } catch (error) {
        console.error('Error fetching purchase items:', error);
        enqueueSnackbar('Failed to fetch purchase details', { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeletePurchase = (id: string) => {
    setPurchaseToDelete(id);
    setIsDeleteModalOpen(true);
    handleMenuClose(id);
  };
  
  const confirmDeletePurchase = async () => {
    if (!currentStore || !purchaseToDelete) {
      return;
    }
    
    setIsLoading(true);
    try {
      await transactionsApi.deletePurchase(currentStore.id, purchaseToDelete);
      enqueueSnackbar('Purchase deleted successfully', { variant: 'success' });
      
      // Remove from selected items if it was selected
      setSelectedPurchases(prev => prev.filter(id => id !== purchaseToDelete));
      
      // Refresh purchases list
      fetchData();
    } catch (error) {
      console.error('Error deleting purchase:', error);
      enqueueSnackbar('Failed to delete purchase', { variant: 'error' });
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setPurchaseToDelete(null);
    }
  };

  const handleSavePurchase = async (purchaseData: any) => {
    if (!currentStore) {
      enqueueSnackbar('Please select a store first', { variant: 'warning' });
      return;
    }
    
    setIsLoading(true);
    try {
      // Make sure we have all required fields
      const formattedData = {
        store_id: currentStore.id,
        supplier_id: purchaseData.supplier,
        total_amount: purchaseData.totalAmount.toString(),
        payment_mode_id: purchaseData.payment_mode_id,
        is_credit: purchaseData.is_credit,
        currency_id: purchaseData.currency_id || 'USD', // Add default or get from store
        items: purchaseData.products.map((product: any) => ({
          product_id: product.id,
          quantity: product.quantity.toString()
        }))
      };
      
      if (purchaseData.id) {
        // Update existing purchase
        await transactionsApi.updatePurchase(currentStore.id, purchaseData.id, formattedData);
        enqueueSnackbar('Purchase updated successfully', { variant: 'success' });
      } else {
        // Create new purchase
        await transactionsApi.createPurchase(currentStore.id, formattedData);
        enqueueSnackbar('Purchase created successfully', { variant: 'success' });
      }
      
      setIsPurchaseModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving purchase:', error);
      enqueueSnackbar('Failed to save purchase', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.stockManager.dashboard },
    { label: 'Purchases', url: paths.stockManager.purchases },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Purchases</Typography>
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
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<PlusIcon />}
          onClick={handleAddNewPurchase}
        >
          Add New Purchase
        </Button>
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
            value={selectedSupplier}
            onChange={handleSupplierChange}
            displayEmpty
            input={<OutlinedInput size="small" />}
            renderValue={(selected) => {
              if (!selected) {
                return <Typography sx={{ color: 'text.secondary' }}>All Suppliers</Typography>;
              }
              
              const supplier = suppliers.find(s => s.id === selected);
              return supplier ? supplier.name : 'All Suppliers';
            }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All Suppliers</MenuItem>
            {suppliers.map(supplier => (
              <MenuItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Total Amount</Typography>
              <Typography variant="h5">${totalAmount.toFixed(2)}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Total Paid</Typography>
              <Typography variant="h5">${totalPaid.toFixed(2)}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Total Due</Typography>
              <Typography variant="h5">${totalDue.toFixed(2)}</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="All Purchases" />
        <Tab label="Paid" />
        <Tab label="Credit" />
        {selectedPurchaseDetails && <Tab label={`Purchase ${selectedPurchaseDetails.id.substring(0, 8)}`} />}
      </Tabs>

      {/* Purchases Table */}
      <Card>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={filteredPurchases.length > 0 && selectedPurchases.length === filteredPurchases.length}
                    indeterminate={selectedPurchases.length > 0 && selectedPurchases.length < filteredPurchases.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Purchase ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Due</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map(purchase => {
                  const isSelected = selectedPurchases.includes(purchase.id);
                  const formattedDate = new Date(purchase.created_at).toLocaleDateString();
                  const displayStatus = purchase.is_credit ? 'Credit' : 'Paid';
                  
                  return (
                    <TableRow 
                      hover 
                      key={purchase.id}
                      selected={isSelected}
                      onClick={() => handleRowClick(purchase)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                        <Checkbox 
                          checked={isSelected}
                          onChange={() => handleSelectOne(purchase.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{purchase.id.substring(0, 8)}</Typography>
                      </TableCell>
                      <TableCell>{formattedDate}</TableCell>
                      <TableCell>{purchase.supplier.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={displayStatus} 
                          size="small"
                          sx={{ 
                            bgcolor: displayStatus === 'Credit' ? 'warning.100' : 'success.100',
                            color: displayStatus === 'Credit' ? 'warning.main' : 'success.main',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>${parseFloat(purchase.total_amount).toFixed(2)}</TableCell>
                      <TableCell>$0.00</TableCell>
                      <TableCell>${parseFloat(purchase.total_amount).toFixed(2)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <IconButton onClick={(e) => {
                          e.stopPropagation();
                          handleMenuOpen(e, purchase.id);
                        }}>
                          <DotsThreeIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorElMap[purchase.id]}
                          open={Boolean(anchorElMap[purchase.id])}
                          onClose={() => handleMenuClose(purchase.id)}
                        >
                          <MenuItem onClick={() => handleEditPurchase(purchase.id)}>Edit</MenuItem>
                          <MenuItem onClick={() => handleDeletePurchase(purchase.id)}>Delete</MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>No purchases found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Purchase Modal */}
      {isPurchaseModalOpen && (
        <PurchaseEditModal
          open={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
          onSave={handleSavePurchase}
          purchase={currentPurchase}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeletePurchase}
        title="Delete Purchase"
        message="Are you sure you want to delete this purchase? This action cannot be undone."
      />
    </Box>
  );
} 