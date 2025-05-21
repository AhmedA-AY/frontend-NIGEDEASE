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
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { paths } from '@/paths';
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';
import { useState, useEffect, useCallback } from 'react';
import { Purchase, Supplier, PurchaseCreateData, PurchaseUpdateData, transactionsApi, PaymentMode } from '@/services/api/transactions';
import { inventoryApi, InventoryStore, Product } from '@/services/api/inventory';
import { companiesApi, Company, Currency } from '@/services/api/companies';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { SelectChangeEvent } from '@mui/material/Select';
import { useCurrentUser } from '@/hooks/use-auth';
import { financialsApi } from '@/services/api/financials';
import { useStore, STORE_CHANGED_EVENT } from '@/providers/store-provider';
import { useSnackbar } from 'notistack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import PurchaseEditModal from '@/components/admin/purchases/PurchaseEditModal';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);
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

      // Fetch products
      const productsData = await inventoryApi.getProducts(currentStore.id);
      setProducts(productsData);
      
      // Fetch currencies
      const currenciesData = await companiesApi.getCurrencies();
      setCurrencies(currenciesData);
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
    const defaultCurrencyId = currencies.length > 0 ? currencies[0].id : '';
    
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
      currency_id: defaultCurrencyId,
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

  const calculateTotalAmount = (products: any[]) => {
    return products.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      const price = product ? parseFloat(product.purchase_price || '0') : 0;
      return sum + (item.quantity * price);
    }, 0);
  };

  const addProductToOrder = () => {
    if (!selectedProduct) {
      enqueueSnackbar('Please select a product', { variant: 'warning' });
      return;
    }
    
    const product = products.find(p => p.id === selectedProduct);
    if (!product) {
      enqueueSnackbar('Selected product not found', { variant: 'error' });
      return;
    }
    
    if (!currentPurchase.products) {
      setCurrentPurchase({...currentPurchase, products: []});
    }
    
    const newProducts = [...(currentPurchase.products || [])];
    const existingIndex = newProducts.findIndex(p => p.id === selectedProduct);
    
    if (existingIndex >= 0) {
      // Update quantity if product already exists
      newProducts[existingIndex].quantity += currentQuantity;
    } else {
      // Add new product
      newProducts.push({
        id: product.id,
        name: product.name,
        quantity: currentQuantity,
        unitPrice: parseFloat(product.purchase_price || '0')
      });
    }
    
    const totalAmount = calculateTotalAmount(newProducts);
    
    setCurrentPurchase({
      ...currentPurchase, 
      products: newProducts,
      totalAmount: totalAmount
    });
    
    // Reset selection
    setSelectedProduct('');
    setCurrentQuantity(1);
  };

  const handleSavePurchase = async (purchaseData: any) => {
    if (!currentStore) {
      enqueueSnackbar('Please select a store first', { variant: 'warning' });
      return;
    }
    
    if (!purchaseData.supplier) {
      enqueueSnackbar('Please select a supplier', { variant: 'error' });
        return;
      }
      
    if (!purchaseData.products || purchaseData.products.length === 0) {
      enqueueSnackbar('Please add at least one product', { variant: 'error' });
      return;
    }

    if (!purchaseData.payment_mode_id) {
      enqueueSnackbar('Please select a payment mode', { variant: 'error' });
        return;
      }
      
    if (!purchaseData.currency_id && currencies.length === 0) {
      enqueueSnackbar('No currencies available', { variant: 'error' });
      return;
    }
      
    setIsLoading(true);
    try {
      // Calculate total amount from items
      const totalAmount = purchaseData.products.reduce((sum: number, item: any) => {
        const product = products.find(p => p.id === item.id);
        const price = product ? parseFloat(product.purchase_price || '0') : 0;
        return sum + (item.quantity * price);
      }, 0);
      
      // Default currency if not provided but currencies are available
      const currencyId = purchaseData.currency_id || (currencies.length > 0 ? currencies[0].id : null);
      
      if (!currencyId) {
        throw new Error('No valid currency available');
      }
      
      // Make sure we have all required fields
      const formattedData = {
        store_id: currentStore.id,
        supplier_id: purchaseData.supplier,
        total_amount: totalAmount.toString(),
        payment_mode_id: purchaseData.payment_mode_id,
        is_credit: purchaseData.is_credit,
        currency_id: currencyId,
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
    } catch (error: any) {
      console.error('Error saving purchase:', error);
      const errorMessage = error?.response?.data?.non_field_errors?.[0] || 
                          error?.message || 
                          'Failed to save purchase';
      enqueueSnackbar(errorMessage, { variant: 'error' });
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
        <Dialog 
          open={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{currentPurchase.id ? 'Edit Purchase' : 'Add New Purchase'}</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Supplier</InputLabel>
                    <Select
                      value={currentPurchase.supplier || ''}
                      label="Supplier"
                      onChange={(e) => setCurrentPurchase({...currentPurchase, supplier: e.target.value})}
                    >
                      {suppliers.map(supplier => (
                        <MenuItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Mode</InputLabel>
                    <Select
                      value={currentPurchase.payment_mode_id || ''}
                      label="Payment Mode"
                      onChange={(e) => setCurrentPurchase({...currentPurchase, payment_mode_id: e.target.value})}
                    >
                      {paymentModes.map(mode => (
                        <MenuItem key={mode.id} value={mode.id}>
                          {mode.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={currentPurchase.currency_id || 'USD'}
                      label="Currency"
                      onChange={(e) => setCurrentPurchase({...currentPurchase, currency_id: e.target.value})}
                    >
                      <MenuItem value="USD">USD - US Dollar</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Credit Purchase</InputLabel>
                    <Select
                      value={currentPurchase.is_credit ? 'true' : 'false'}
                      label="Credit Purchase"
                      onChange={(e) => setCurrentPurchase({...currentPurchase, is_credit: e.target.value === 'true'})}
                    >
                      <MenuItem value="false">No</MenuItem>
                      <MenuItem value="true">Yes</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Card sx={{ p: 2, bgcolor: 'background.neutral', mb: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Add Items</Typography>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={5}>
                        <FormControl fullWidth>
                          <InputLabel>Product</InputLabel>
                          <Select
                            value={selectedProduct}
                            label="Product"
                            onChange={(e) => setSelectedProduct(e.target.value)}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 300
                                }
                              }
                            }}
                          >
                            <MenuItem value="" disabled>
                              <em>Select a product</em>
                            </MenuItem>
                            {products.map(product => (
                              <MenuItem key={product.id} value={product.id}>
                                {product.name} - ${parseFloat(product.purchase_price || '0').toFixed(2)}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Quantity"
                          type="number"
                          value={currentQuantity}
                          onChange={(e) => setCurrentQuantity(parseInt(e.target.value) || 1)}
                          InputProps={{ inputProps: { min: 1 } }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Button 
                          variant="contained" 
                          startIcon={<PlusIcon />}
                          onClick={addProductToOrder}
                          fullWidth
                          sx={{ height: '56px' }}
                        >
                          Add to Order
                        </Button>
                      </Grid>
                    </Grid>
                  </Card>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">Order Items</Typography>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Subtotal</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(currentPurchase.products || []).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} align="center">No items added</TableCell>
                          </TableRow>
                        ) : (
                          (currentPurchase.products || []).map((product: any, index: number) => {
                            const productInfo = products.find(p => p.id === product.id);
                            const price = productInfo ? parseFloat(productInfo.purchase_price || '0') : 0;
                            const subtotal = price * product.quantity;
                            
                            return (
                              <TableRow key={index}>
                                <TableCell>{productInfo ? productInfo.name : 'Unknown Product'}</TableCell>
                                <TableCell>${price.toFixed(2)}</TableCell>
                                <TableCell>
                                  <TextField
                                    type="number"
                                    value={product.quantity}
                                    onChange={(e) => {
                                      const newQuantity = parseInt(e.target.value) || 1;
                                      const newProducts = [...currentPurchase.products];
                                      newProducts[index].quantity = newQuantity;
                                      
                                      const totalAmount = calculateTotalAmount(newProducts);
                                      setCurrentPurchase({
                                        ...currentPurchase, 
                                        products: newProducts,
                                        totalAmount: totalAmount
                                      });
                                    }}
                                    InputProps={{ inputProps: { min: 1 } }}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>${subtotal.toFixed(2)}</TableCell>
                                <TableCell>
                                  <IconButton
                                    color="error"
                                    onClick={() => {
                                      const newProducts = [...currentPurchase.products];
                                      newProducts.splice(index, 1);
                                      
                                      const totalAmount = calculateTotalAmount(newProducts);
                                      setCurrentPurchase({
                                        ...currentPurchase, 
                                        products: newProducts,
                                        totalAmount: totalAmount
                                      });
                                    }}
                                  >
                                    <TrashIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                      <TableHead>
                        <TableRow>
                          <TableCell colSpan={3} align="right"><Typography variant="subtitle1">Total:</Typography></TableCell>
                          <TableCell colSpan={2}>
                            <Typography variant="subtitle1">
                              ${(currentPurchase.totalAmount || 0).toFixed(2)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                    </Table>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsPurchaseModalOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={() => handleSavePurchase(currentPurchase)}
              disabled={!currentPurchase.supplier || !(currentPurchase.products || []).length}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
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