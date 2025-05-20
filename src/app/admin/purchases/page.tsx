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
import FormControlLabel from '@mui/material/FormControlLabel';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

// Purchase modal props interface
interface PurchaseModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (purchaseData: any) => void;
  purchase: any;
  suppliers: any[];
  currencies: any[];
  paymentModes: any[];
  isLoading: boolean;
  products: any[];
  selectedProduct: string;
  currentQuantity: number;
  setSelectedProduct: (value: string) => void;
  setCurrentQuantity: (value: number) => void;
}

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
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stores, setStores] = useState<InventoryStore[]>([]);
  const [filteredStores, setFilteredStores] = useState<InventoryStore[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [selectedPurchaseDetails, setSelectedPurchaseDetails] = useState<Purchase | null>(null);
  
  // Get current user's company
  const { userInfo, isLoading: isLoadingUser } = useCurrentUser();
  
  // Fetch purchases and suppliers
  const fetchData = useCallback(async () => {
    if (!currentStore) {
      enqueueSnackbar('No store selected. Please select a store first.', { variant: 'warning' });
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log(`Fetching purchase data for store: ${currentStore.name} (${currentStore.id})`);
      const [
        purchasesData, 
        suppliersData, 
        companiesData, 
        storesData, 
        currenciesData, 
        paymentModesData,
        productsData
      ] = await Promise.all([
        transactionsApi.getPurchases(currentStore.id),
        transactionsApi.getSuppliers(currentStore.id),
        companiesApi.getCompanies(),
        inventoryApi.getStores(),
        companiesApi.getCurrencies(),
        transactionsApi.getPaymentModes(currentStore.id),
        inventoryApi.getProducts(currentStore.id)
      ]);
      
      console.log('Purchases data received:', purchasesData);
      setPurchases(purchasesData);
      setSuppliers(suppliersData);
      setCompanies(companiesData);
      setStores(storesData);
      setCurrencies(currenciesData);
      setPaymentModes(paymentModesData);
      setProducts(productsData);
      
      // Filter stores based on user's company
      if (userInfo?.company_id) {
        const storesForCompany = storesData.filter(store => 
          store.company && store.company.id === userInfo.company_id
        );
        setFilteredStores(storesForCompany);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      enqueueSnackbar('Failed to load data', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar, currentStore, userInfo]);

  useEffect(() => {
    if (!isLoadingUser && currentStore) {
      fetchData();
    }
  }, [fetchData, isLoadingUser, currentStore]);

  // Listen for store change events
  useEffect(() => {
    const handleStoreChange = (event: Event) => {
      // Force refetch data when store changes
      if (currentStore) {
        // Small delay to ensure store context has been updated
        setTimeout(() => {
          fetchData();
        }, 100);
      }
    };

    window.addEventListener(STORE_CHANGED_EVENT, handleStoreChange);
    
    return () => {
      window.removeEventListener(STORE_CHANGED_EVENT, handleStoreChange);
    };
  }, [fetchData]);

  // Filter stores when userInfo changes
  useEffect(() => {
    if (userInfo?.company_id && stores.length > 0) {
      const storesForCompany = stores.filter(store => 
        store.company && store.company.id === userInfo.company_id
      );
      setFilteredStores(storesForCompany);
    }
  }, [userInfo, stores]);

  // Filter purchases by selected supplier
  const filteredPurchases = selectedSupplier
    ? purchases.filter(purchase => purchase.supplier.id === selectedSupplier)
    : purchases;

  // Filter purchases by current store
  const storeFilteredPurchases = currentStore
    ? filteredPurchases.filter(purchase => {
        console.log(`Checking purchase supplier store_id: ${purchase.supplier.store_id} against current store: ${currentStore.id}`);
        return purchase.supplier.store_id === currentStore.id;
      })
    : filteredPurchases;
    
  console.log(`Original purchases count: ${purchases.length}`);
  console.log(`After supplier filter: ${filteredPurchases.length}`);
  console.log(`After store filter: ${storeFilteredPurchases.length}`);

  // Further filter purchases by user's company if available
  const companyPurchases = userInfo?.company_id
    ? storeFilteredPurchases
    : storeFilteredPurchases;

  // Calculate total amounts
  const totalAmount = companyPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.total_amount), 0);
  const totalPaid = 0; // Not available in the API directly
  const totalDue = totalAmount - totalPaid;

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedPurchaseDetails(null); // Reset selected purchase details when changing tabs
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedPurchases(companyPurchases.map(purchase => purchase.id));
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
    if (isLoadingUser) {
      enqueueSnackbar('Please wait while we load your user information...', { variant: 'info' });
      return;
    }

    if (!userInfo?.company_id) {
      enqueueSnackbar('Unable to determine your company. Please try logging in again.', { variant: 'error' });
      return;
    }

    if (stores.length === 0) {
      enqueueSnackbar('No stores available. Please contact your administrator.', { variant: 'error' });
      return;
    }

    if (currencies.length === 0) {
      enqueueSnackbar('No currencies available. Please contact your administrator.', { variant: 'error' });
      return;
    }

    if (paymentModes.length === 0) {
      enqueueSnackbar('No payment modes available. Please contact your administrator.', { variant: 'error' });
      return;
    }

    // Use the current user's company ID
    const userCompanyId = userInfo.company_id;
    // Get the first store from the stores array
    const defaultStoreId = stores[0].id;
    const defaultCurrencyId = currencies[0].id;
    const defaultPaymentModeId = paymentModes[0].id;
    
    setCurrentPurchase({
      date: new Date().toISOString().split('T')[0],
      supplier: '',
      status: 'Ordered',
      products: [],
      totalAmount: 0,
      paidAmount: 0,
      dueAmount: 0,
      paymentStatus: 'Unpaid',
      company_id: userCompanyId,
      store_id: defaultStoreId,
      currency_id: defaultCurrencyId,
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
    
    setIsLoading(true);
    try {
      // Set purchase to edit
      const purchaseToEdit = await transactionsApi.getPurchase(currentStore.id, id);
      setCurrentPurchase(purchaseToEdit);
      setIsPurchaseModalOpen(true);
    } catch (error) {
      console.error('Error fetching purchase details:', error);
      enqueueSnackbar('Failed to load purchase details', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePurchase = (id: string) => {
    setPurchaseToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!purchaseToDelete || !currentStore) {
      enqueueSnackbar('No purchase selected or no store selected', { variant: 'error' });
      return;
    }
    
    setIsLoading(true);
    try {
      await transactionsApi.deletePurchase(currentStore.id, purchaseToDelete);
      
      // Remove the deleted purchase from the state
      setPurchases(purchases.filter(purchase => purchase.id !== purchaseToDelete));
      
      enqueueSnackbar('Purchase deleted successfully', { variant: 'success' });
      setIsDeleteModalOpen(false);
      setPurchaseToDelete(null);
    } catch (error) {
      console.error('Error deleting purchase:', error);
      enqueueSnackbar('Failed to delete purchase', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
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
      enqueueSnackbar('Please add at least one product to the purchase', { variant: 'error' });
      return;
    }

    if (!purchaseData.currency_id) {
      enqueueSnackbar('Please select a currency', { variant: 'error' });
      return;
    }

    if (!purchaseData.payment_mode_id) {
      enqueueSnackbar('Please select a payment mode', { variant: 'error' });
      return;
    }
    
    setIsLoading(true);
    try {
      // Calculate the total amount based on products
      const totalAmount = calculateTotalAmount(purchaseData.products);

      const formattedData = {
        store_id: currentStore.id,
        supplier_id: purchaseData.supplier,
        total_amount: totalAmount.toString(),
        currency_id: purchaseData.currency_id,
        payment_mode_id: purchaseData.payment_mode_id,
        is_credit: purchaseData.is_credit,
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
      const errorMessage = error?.message || error?.error || 'Failed to save purchase';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.admin.dashboard },
    { label: 'Purchases', url: paths.admin.purchases },
  ];

  const PurchaseModal = ({ open, onClose, onSave, purchase, suppliers, currencies, paymentModes, isLoading }: PurchaseModalProps) => {
    const [formData, setFormData] = useState<any>(purchase);

    useEffect(() => {
      setFormData(purchase);
    }, [purchase]);

    const handleChange = (e: any) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    };

    const handleSubmit = () => {
      onSave(formData);
    };

    const removeProductFromOrder = (productId: string) => {
      const updatedProducts = formData.products.filter((product: any) => product.id !== productId);
      
      // Recalculate total amount
      const totalAmount = updatedProducts.reduce((sum: number, product: any) => {
        return sum + (product.quantity * product.unitPrice);
      }, 0);
      
      setFormData({
        ...formData,
        products: updatedProducts,
        totalAmount
      });
    };

    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          {formData.id ? 'Edit Purchase' : 'Add New Purchase'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Basic Purchase Information */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="supplier-label">Supplier</InputLabel>
                  <Select
                    labelId="supplier-label"
                    name="supplier"
                    value={formData.supplier || ''}
                    onChange={handleChange}
                    label="Supplier"
                    disabled={isLoading}
                  >
                    {suppliers.map((supplier) => (
                      <MenuItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date || ''}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            {/* Products Section */}
            <Card sx={{ p: 2, mt: 2, bgcolor: '#f9fafb' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Add Items</Typography>
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth>
                    <InputLabel id="product-label">Product</InputLabel>
                    <Select
                      labelId="product-label"
                      name="selectedProduct"
                      value={selectedProduct || ''}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      label="Product"
                      disabled={isLoading}
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected) {
                          return <Typography color="text.secondary">Select a product</Typography>;
                        }
                        const product = products.find(p => p.id === selected);
                        return product ? product.name : '';
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300
                          }
                        }
                      }}
                    >
                      {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    name="currentQuantity"
                    type="number"
                    value={currentQuantity}
                    onChange={(e) => setCurrentQuantity(Number(e.target.value))}
                    disabled={isLoading}
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={addProductToOrder}
                    disabled={isLoading || !selectedProduct}
                    sx={{ height: '56px', bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
                  >
                    Add to Order
                  </Button>
                </Grid>
              </Grid>

              {/* Products Table */}
              {formData.products && formData.products.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.products.map((product: any) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell align="right">{product.quantity}</TableCell>
                          <TableCell align="right">${product.unitPrice.toFixed(2)}</TableCell>
                          <TableCell align="right">${(product.quantity * product.unitPrice).toFixed(2)}</TableCell>
                          <TableCell align="right">
                            <IconButton 
                              size="small" 
                              onClick={() => removeProductFromOrder(product.id)}
                              disabled={isLoading}
                            >
                              <TrashIcon size={20} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} align="right"><strong>Total Amount:</strong></TableCell>
                        <TableCell align="right" colSpan={2}>
                          <strong>${formData.totalAmount ? formData.totalAmount.toFixed(2) : '0.00'}</strong>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Card>

            {/* Payment Details */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="currency-label">Currency</InputLabel>
                  <Select
                    labelId="currency-label"
                    name="currency_id"
                    value={formData.currency_id || ''}
                    onChange={handleChange}
                    label="Currency"
                    disabled={isLoading}
                  >
                    {currencies.map((currency) => (
                      <MenuItem key={currency.id} value={currency.id}>
                        {currency.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="payment-mode-label">Payment Mode</InputLabel>
                  <Select
                    labelId="payment-mode-label"
                    name="payment_mode_id"
                    value={formData.payment_mode_id || ''}
                    onChange={handleChange}
                    label="Payment Mode"
                    disabled={isLoading}
                  >
                    {paymentModes.map((mode) => (
                      <MenuItem key={mode.id} value={mode.id}>
                        {mode.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="is_credit"
                      checked={formData.is_credit || false}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  }
                  label="Credit Purchase"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={isLoading || !formData.supplier || (formData.products && formData.products.length === 0)}
            sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

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
        <Box>
          <Button 
            variant="contained" 
            startIcon={<PlusIcon weight="bold" />}
            sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            onClick={handleAddNewPurchase}
          >
            Add New Purchase
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            placeholder="Search By Invoice..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlassIcon size={20} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 200 }}
          />
          <Select
            displayEmpty
            value={selectedSupplier}
            onChange={handleSupplierChange}
            input={<OutlinedInput size="small" />}
            renderValue={(selected) => {
              if (!selected) {
                return <Typography color="text.secondary">Select Supplier...</Typography>;
              }
              const supplier = suppliers.find(s => s.id === selected);
              return supplier ? supplier.name : "";
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Suppliers</MenuItem>
            {suppliers.map(supplier => (
              <MenuItem key={supplier.id} value={supplier.id}>{supplier.name}</MenuItem>
            ))}
          </Select>
          <Box sx={{ 
            display: 'flex', 
            border: '1px solid #e0e0e0', 
            borderRadius: 1, 
            overflow: 'hidden',
            alignItems: 'center',
          }}>
            <input 
              type="text" 
              placeholder="Start Date"
              style={{ 
                border: 'none', 
                padding: '8px 12px',
                outline: 'none',
                width: 80
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>→</Box>
            <input 
              type="text" 
              placeholder="End Date"
              style={{ 
                border: 'none', 
                padding: '8px 12px',
                outline: 'none',
                width: 80
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Purchase Type Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="purchase type tabs">
          <Tab 
            label="All Purchases" 
            sx={{ 
              textTransform: 'none',
              minHeight: 48,
              color: tabValue === 0 ? '#0ea5e9' : 'text.primary',
              '&.Mui-selected': { color: '#0ea5e9' },
              borderBottom: tabValue === 0 ? '2px solid #0ea5e9' : 'none',
            }} 
          />
          <Tab 
            label="Unpaid" 
            sx={{ 
              textTransform: 'none',
              minHeight: 48,
              borderBottom: tabValue === 1 ? '2px solid #0ea5e9' : 'none',
              '&.Mui-selected': { color: '#0ea5e9' }
            }} 
          />
          <Tab 
            label="Paid" 
            sx={{ 
              textTransform: 'none',
              minHeight: 48,
              borderBottom: tabValue === 2 ? '2px solid #0ea5e9' : 'none',
              '&.Mui-selected': { color: '#0ea5e9' }
            }} 
          />
          {selectedPurchaseDetails && (
            <Tab 
              label="Purchase Details" 
              sx={{ 
                textTransform: 'none',
                minHeight: 48,
                borderBottom: tabValue === 3 ? '2px solid #0ea5e9' : 'none',
                '&.Mui-selected': { color: '#0ea5e9' }
              }} 
            />
          )}
        </Tabs>
      </Box>

      {/* Purchases Table or Purchase Details */}
      {tabValue === 3 && selectedPurchaseDetails ? (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Purchase Details</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Invoice Number</Typography>
                <Typography variant="body1">{selectedPurchaseDetails.id}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Purchase Date</Typography>
                <Typography variant="body1">
                  {new Date(selectedPurchaseDetails.created_at).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip 
                  label={selectedPurchaseDetails.status || (selectedPurchaseDetails.is_credit ? 'Credit' : 'Paid')} 
                  size="small"
                  sx={{ 
                    bgcolor: selectedPurchaseDetails.status === 'UNPAID' || selectedPurchaseDetails.is_credit ? 'warning.100' : 'success.100',
                    color: selectedPurchaseDetails.status === 'UNPAID' || selectedPurchaseDetails.is_credit ? 'warning.main' : 'success.main',
                    fontWeight: 500
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Supplier</Typography>
                <Typography variant="body1">{selectedPurchaseDetails.supplier.name}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Contact Info</Typography>
                <Typography variant="body1">{selectedPurchaseDetails.supplier.email}</Typography>
                <Typography variant="body1">{selectedPurchaseDetails.supplier.phone}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Total Amount</Typography>
                <Typography variant="body1">${parseFloat(selectedPurchaseDetails.total_amount).toFixed(2)}</Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="outlined" 
              onClick={() => setTabValue(0)}
              sx={{ mr: 1 }}
            >
              Back to Purchases
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handleEditPurchase(selectedPurchaseDetails.id)}
              sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            >
              Edit Purchase
            </Button>
          </Box>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={companyPurchases.length > 0 && selectedPurchases.length === companyPurchases.length}
                    indeterminate={selectedPurchases.length > 0 && selectedPurchases.length < companyPurchases.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Invoice Number</TableCell>
                <TableCell>Purchase Date</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Purchase Status</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Paid Amount</TableCell>
                <TableCell>Due Amount</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={24} />
                    <Typography sx={{ ml: 2 }}>Loading purchases...</Typography>
                  </TableCell>
                </TableRow>
              ) : companyPurchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <Typography>No purchases found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                companyPurchases.map(purchase => {
                  const isSelected = selectedPurchases.includes(purchase.id);
                  const isMenuOpen = Boolean(anchorElMap[purchase.id]);
                  const formattedDate = new Date(purchase.created_at).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }).replace(/\//g, '-');
                  
                  const displayStatus = purchase.status || (purchase.is_credit ? 'Credit' : 'Paid');
                  const displayPaymentStatus = purchase.status || (purchase.is_credit ? 'Unpaid' : 'Paid');
                  
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
                      <TableCell>
                        <Chip 
                          label={displayPaymentStatus} 
                          size="small"
                          sx={{ 
                            bgcolor: displayPaymentStatus === 'Unpaid' ? 'error.100' : 'success.100',
                            color: displayPaymentStatus === 'Unpaid' ? 'error.main' : 'success.main',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <IconButton 
                          size="small"
                          onClick={(event) => handleMenuOpen(event, purchase.id)}
                        >
                          <DotsThreeIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorElMap[purchase.id]}
                          open={isMenuOpen}
                          onClose={() => handleMenuClose(purchase.id)}
                        >
                          <MenuItem onClick={() => handleEditPurchase(purchase.id)}>Edit</MenuItem>
                          <MenuItem onClick={() => handleDeletePurchase(purchase.id)}>Delete</MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Modals */}
      {isPurchaseModalOpen && currentPurchase && (
        <PurchaseModal
          open={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
          onSave={handleSavePurchase}
          purchase={currentPurchase}
          suppliers={suppliers}
          currencies={currencies}
          paymentModes={paymentModes}
          isLoading={isLoading}
          products={products}
          selectedProduct={selectedProduct}
          currentQuantity={currentQuantity}
          setSelectedProduct={setSelectedProduct}
          setCurrentQuantity={setCurrentQuantity}
        />
      )}
      
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete this purchase?`}
      />
    </Box>
  );
} 