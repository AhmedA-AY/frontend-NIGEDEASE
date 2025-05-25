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
import { 
  usePurchases, 
  useCreatePurchase, 
  useUpdatePurchase, 
  useDeletePurchase,
  usePurchaseItems,
  useSuppliers,
  usePaymentModes,
  useProducts,
  useCurrencies
} from '@/hooks/queries';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('admin');
  const { currentStore } = useStore();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = React.useState(0);
  const [selectedPurchases, setSelectedPurchases] = React.useState<string[]>([]);
  const [anchorElMap, setAnchorElMap] = React.useState<{ [key: string]: HTMLElement | null }>({});
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentPurchase, setCurrentPurchase] = React.useState<any>(null);
  const [purchaseToDelete, setPurchaseToDelete] = React.useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [selectedPurchaseDetails, setSelectedPurchaseDetails] = useState<Purchase | null>(null);
  
  // Get current user's company
  const { userInfo, isLoading: isLoadingUser } = useCurrentUser();
  
  // TanStack Query Hooks
  const { 
    data: purchases = [], 
    isLoading: isLoadingPurchases 
  } = usePurchases(currentStore?.id);
  
  const { 
    data: suppliers = [], 
    isLoading: isLoadingSuppliers 
  } = useSuppliers(currentStore?.id);

  const { 
    data: paymentModes = [], 
    isLoading: isLoadingPaymentModes 
  } = usePaymentModes(currentStore?.id);
  
  const {
    data: products = [],
    isLoading: isLoadingProducts
  } = useProducts(currentStore?.id);
  
  const {
    data: currencies = [],
    isLoading: isLoadingCurrencies
  } = useCurrencies();

  // Regular state for entities that don't yet have query hooks
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stores, setStores] = useState<InventoryStore[]>([]);
  const [filteredStores, setFilteredStores] = useState<InventoryStore[]>([]);

  // Mutations
  const createPurchaseMutation = useCreatePurchase();
  const updatePurchaseMutation = useUpdatePurchase();
  const deletePurchaseMutation = useDeletePurchase();

  const isLoading = 
    isLoadingUser || 
    isLoadingPurchases || 
    isLoadingSuppliers || 
    isLoadingPaymentModes ||
    isLoadingProducts ||
    isLoadingCurrencies ||
    createPurchaseMutation.isPending ||
    updatePurchaseMutation.isPending ||
    deletePurchaseMutation.isPending;

  // Fetch remaining data
  const fetchRemainingData = useCallback(async () => {
    if (!currentStore) {
      enqueueSnackbar('No store selected. Please select a store first.', { variant: 'warning' });
      return;
    }
    
    try {
      const [
        companiesData, 
        storesData
      ] = await Promise.all([
        companiesApi.getCompanies(),
        inventoryApi.getStores()
      ]);
      
      setCompanies(companiesData);
      setStores(storesData);
      
      // Filter stores based on user's company
      if (userInfo?.company_id) {
        const storesForCompany = storesData.filter(store => 
          store.company && store.company.id === userInfo.company_id
        );
        setFilteredStores(storesForCompany);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      enqueueSnackbar('Failed to load some data', { variant: 'error' });
    }
  }, [enqueueSnackbar, currentStore, userInfo]);

  useEffect(() => {
    if (!isLoadingUser && currentStore) {
      fetchRemainingData();
    }
  }, [fetchRemainingData, isLoadingUser, currentStore]);

  // Listen for store change events
  useEffect(() => {
    const handleStoreChange = (event: Event) => {
      // State will be automatically refetched by the queries when currentStore changes
    };

    window.addEventListener(STORE_CHANGED_EVENT, handleStoreChange);
    
    return () => {
      window.removeEventListener(STORE_CHANGED_EVENT, handleStoreChange);
    };
  }, []);

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

  // Calculate total amount with tax
  const calculateTotalAmount = (products: any[], taxPercentage: number = 0) => {
    // Calculate subtotal from products
    const subtotal = products.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      const price = product ? parseFloat(product.purchase_price || '0') : 0;
      return sum + (item.quantity * price);
    }, 0);
    
    // Calculate tax amount
    const taxAmount = (subtotal * taxPercentage) / 100;
    
    // Return total including tax
    return subtotal + taxAmount;
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
    
    // Calculate subtotal
    const subtotal = newProducts.reduce((sum, product) => {
      return sum + (product.quantity * product.unitPrice);
    }, 0);
    
    // Calculate tax amount based on the tax percentage
    const taxPercentage = parseFloat(currentPurchase.tax) || 0;
    const taxAmount = (subtotal * taxPercentage) / 100;
    
    // Calculate total with tax
    const totalWithTax = subtotal + taxAmount;
    
    // Update the current purchase with new products and recalculated amounts
    setCurrentPurchase({
      ...currentPurchase,
      products: newProducts,
      subtotal: subtotal,
      taxAmount: taxAmount,
      totalAmount: totalWithTax
    });
    
    // Reset selected product and quantity
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
    setCurrentPurchase({
      id: null, // New purchase doesn't have an ID yet
      store_id: currentStore?.id || '',
      supplier: '',
      currency_id: currencies.length > 0 ? currencies[0].id : '',
      payment_mode_id: paymentModes.length > 0 ? paymentModes[0].id : '',
      is_credit: false,
      products: [],
      totalAmount: 0,
      subtotal: 0,
      tax: '0',
      taxAmount: 0,
      date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
    });
    setIsPurchaseModalOpen(true);
  };

  const handleEditPurchase = async (id: string) => {
    if (!currentStore) {
      enqueueSnackbar(t('common.no_store_selected'), { variant: 'error' });
      return;
    }
    
    try {
      const purchase = purchases.find(p => p.id === id);
      if (!purchase) {
        enqueueSnackbar(t('purchases.purchase_not_found'), { variant: 'error' });
        return;
      }
      
      // Get purchase items
      const items = await transactionsApi.getPurchaseItems(currentStore.id, purchase.id);
      
      // Map items to products format expected by the form
      const purchaseProducts = items.map(item => {
        const product = products.find(p => p.id === item.product.id);
        return {
          id: item.product.id,
          name: item.product.name,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(product?.purchase_price || '0')
        };
      });
      
      // Calculate subtotal
      const subtotal = purchaseProducts.reduce((sum, product) => {
        return sum + (product.quantity * product.unitPrice);
      }, 0);
      
      // Get tax percentage (default to 0 if not present)
      const taxPercentage = purchase.tax ? parseFloat(purchase.tax) : 0;
      
      // Calculate tax amount
      const taxAmount = (subtotal * taxPercentage) / 100;
      
      // Prepare purchase data for editing
      setCurrentPurchase({
        id: purchase.id,
        supplier: purchase.supplier.id,
        currency_id: purchase.currency.id,
        payment_mode_id: purchase.payment_mode.id,
        is_credit: purchase.is_credit,
        products: purchaseProducts,
        totalAmount: parseFloat(purchase.total_amount),
        subtotal: subtotal,
        tax: purchase.tax || '0',
        taxAmount: taxAmount,
      });
      
      setIsPurchaseModalOpen(true);
    } catch (error) {
      console.error('Error loading purchase details:', error);
      enqueueSnackbar(t('purchases.error_loading_purchase'), { variant: 'error' });
    }
  };

  const handleDeletePurchase = (id: string) => {
    setPurchaseToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!purchaseToDelete || !currentStore) {
      enqueueSnackbar(t('purchases.no_purchase_selected'), { variant: 'error' });
      return;
    }
    
    try {
      await deletePurchaseMutation.mutateAsync({ 
        storeId: currentStore.id, 
        id: purchaseToDelete 
      });
      
      enqueueSnackbar(t('purchases.purchase_deleted'), { variant: 'success' });
      setIsDeleteModalOpen(false);
      setPurchaseToDelete(null);
    } catch (error) {
      console.error('Error deleting purchase:', error);
      enqueueSnackbar(t('purchases.error_deleting'), { variant: 'error' });
    }
  };

  const handleSavePurchase = async (purchaseData: any) => {
    if (!currentStore) {
      enqueueSnackbar(t('common.no_store_selected'), { variant: 'warning' });
      return;
    }

    if (!purchaseData.supplier) {
      enqueueSnackbar(t('purchases.supplier_required'), { variant: 'error' });
      return;
    }

    if (!purchaseData.products || purchaseData.products.length === 0) {
      enqueueSnackbar(t('purchases.products_required'), { variant: 'error' });
      return;
    }

    if (!purchaseData.currency_id) {
      enqueueSnackbar(t('purchases.currency_required'), { variant: 'error' });
      return;
    }

    if (!purchaseData.payment_mode_id) {
      enqueueSnackbar(t('purchases.payment_mode_required'), { variant: 'error' });
      return;
    }

    try {
      // Prepare purchase data
      const createOrUpdateData = {
        store_id: currentStore.id,
        supplier_id: purchaseData.supplier,
        total_amount: purchaseData.totalAmount.toString(),
        tax: purchaseData.tax || '0',
        currency_id: purchaseData.currency_id,
        payment_mode_id: purchaseData.payment_mode_id,
        is_credit: purchaseData.is_credit || false,
        items: purchaseData.products.map((product: any) => ({
          product_id: product.id,
          quantity: product.quantity.toString()
        })),
      };

      if (purchaseData.id) {
        // Update existing purchase
        await updatePurchaseMutation.mutateAsync({
          storeId: currentStore.id,
          id: purchaseData.id,
          data: createOrUpdateData
        });
        enqueueSnackbar(t('purchases.purchase_updated'), { variant: 'success' });
      } else {
        // Create new purchase
        await createPurchaseMutation.mutateAsync({
          storeId: currentStore.id,
          data: createOrUpdateData
        });
        enqueueSnackbar(t('purchases.purchase_created'), { variant: 'success' });
      }

      // Close modal and reset state
      setIsPurchaseModalOpen(false);
      
    } catch (error: any) {
      console.error('Error saving purchase:', error);
      enqueueSnackbar(t('purchases.error_saving'), { variant: 'error' });
    }
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: t('dashboard.title'), url: paths.admin.dashboard },
    { label: t('purchases.title'), url: paths.admin.purchases },
  ];

  const PurchaseModal = ({ open, onClose, onSave, purchase, suppliers, currencies, paymentModes, isLoading, products, selectedProduct, currentQuantity, setSelectedProduct, setCurrentQuantity }: PurchaseModalProps) => {
    // Initialize formData with purchase but don't include tax initially to avoid the loop
    const [formData, setFormData] = useState<any>(() => {
      const initialData = purchase ? { ...purchase } : {};
      // Move calculations outside of the dependency cycle
      if (initialData?.products?.length > 0) {
        const subtotal = initialData.products.reduce(
          (sum: number, product: any) => sum + (product.quantity * product.unitPrice), 
          0
        );
        initialData.subtotal = subtotal;
        
        // Don't calculate tax amounts here - we'll do it separately
        initialData.taxAmount = initialData.taxAmount || 0;
        initialData.totalAmount = initialData.totalAmount || subtotal;
      }
      
      return initialData;
    });
    
    // Keep tax as a separate state to break the infinite loop cycle
    const [taxValue, setTaxValue] = useState<string>(purchase?.tax || '0');
    
    // Update formData when purchase changes (for edit/new purchase)
    useEffect(() => {
      if (purchase) {
        const initialData = { ...purchase };
        setTaxValue(initialData.tax || '0');
        setFormData(initialData);
      }
    }, [purchase]);

    // Calculate totals separately when taxValue changes
    useEffect(() => {
      if (formData?.products?.length > 0) {
        const subtotal = formData.products.reduce(
          (sum: number, product: any) => sum + (product.quantity * product.unitPrice),
          0
        );
        
        const taxPercentage = parseFloat(taxValue) || 0;
        const taxAmount = (subtotal * taxPercentage) / 100;
        
        setFormData((prevData: any) => ({
          ...prevData,
          subtotal,
          taxAmount,
          totalAmount: subtotal + taxAmount,
          tax: taxValue // Only update tax value here, not in the normal onChange handler
        }));
      }
    }, [taxValue]);

    const handleChange = useCallback((e: any) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;
      
      // Special handling for tax field to avoid Material-UI's dirty check loops
      if (name === 'tax') {
        setTaxValue(value);
        return; // Don't update formData directly for tax
      }
      
      // For all other fields, update formData normally
      setFormData((prev: any) => ({
        ...prev,
        [name]: newValue
      }));
    }, []);

    const handleSubmit = useCallback(() => {
      // Ensure tax is included in the final data
      onSave({
        ...formData,
        tax: taxValue
      });
    }, [formData, taxValue, onSave]);

    const removeProductFromOrder = useCallback((productId: string) => {
      setFormData((prev: any) => {
        const updatedProducts = prev.products.filter((product: any) => product.id !== productId);
        
        // Calculate subtotal
        const subtotal = updatedProducts.reduce(
          (sum: number, product: any) => sum + (product.quantity * product.unitPrice),
          0
        );
        
        // Return updated state (tax calculation will happen in the useEffect)
        return {
          ...prev,
          products: updatedProducts,
          subtotal
        };
      });
    }, []);

    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          {formData.id ? t('purchases.edit_purchase') : t('purchases.add_purchase')}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Basic Purchase Information */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="supplier-label">{t('purchases.purchase_supplier')}</InputLabel>
                  <Select
                    labelId="supplier-label"
                    name="supplier"
                    value={formData.supplier || ''}
                    onChange={handleChange}
                    label={t('purchases.purchase_supplier')}
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
                  label={t('purchases.purchase_date')}
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
              <Typography variant="h6" sx={{ mb: 2 }}>{t('purchases.add_item')}</Typography>
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth>
                    <InputLabel id="product-label">{t('products.product_name')}</InputLabel>
                    <Select
                      labelId="product-label"
                      name="selectedProduct"
                      value={selectedProduct || ''}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      label={t('products.product_name')}
                      disabled={isLoading}
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected) {
                          return <Typography color="text.secondary">{t('purchases.select_product')}</Typography>;
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
                    label={t('purchases.quantity')}
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
                    {t('purchases.add_item')}
                  </Button>
                </Grid>
              </Grid>

              {/* Products Table */}
              {formData.products && formData.products.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('products.product_name')}</TableCell>
                        <TableCell align="right">{t('purchases.quantity')}</TableCell>
                        <TableCell align="right">{t('purchases.price')}</TableCell>
                        <TableCell align="right">{t('purchases.total')}</TableCell>
                        <TableCell align="right">{t('common.actions')}</TableCell>
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
                        <TableCell colSpan={3} align="right"><strong>{t('purchases.subtotal')}:</strong></TableCell>
                        <TableCell align="right" colSpan={2}>
                          ${formData.subtotal ? formData.subtotal.toFixed(2) : '0.00'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} align="right"><strong>{t('purchases.tax')} ({formData.tax || 0}%):</strong></TableCell>
                        <TableCell align="right" colSpan={2}>
                          ${formData.taxAmount ? formData.taxAmount.toFixed(2) : '0.00'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} align="right"><strong>{t('purchases.total')}:</strong></TableCell>
                        <TableCell align="right" colSpan={2}>
                          ${formData.totalAmount ? formData.totalAmount.toFixed(2) : '0.00'}
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
                  <InputLabel id="currency-label">{t('common.currency')}</InputLabel>
                  <Select
                    labelId="currency-label"
                    name="currency_id"
                    value={formData.currency_id || ''}
                    onChange={handleChange}
                    label={t('common.currency')}
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
                  <InputLabel id="payment-mode-label">{t('purchases.payment_method')}</InputLabel>
                  <Select
                    labelId="payment-mode-label"
                    name="payment_mode_id"
                    value={formData.payment_mode_id || ''}
                    onChange={handleChange}
                    label={t('purchases.payment_method')}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('purchases.tax')}
                  name="tax"
                  type="number"
                  value={taxValue}
                  onChange={handleChange}
                  InputProps={{ 
                    inputProps: { min: 0, step: 0.01 },
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  disabled={isLoading}
                  helperText={t('purchases.tax')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="is_credit"
                      checked={formData.is_credit || false}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  }
                  label={t('purchases.credit')}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>{t('common.cancel')}</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={isLoading || !formData.supplier || (formData.products && formData.products.length === 0)}
            sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
          >
            {isLoading ? <CircularProgress size={24} /> : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>{t('purchases.title')}</Typography>
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
            {t('purchases.add_purchase')}
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            placeholder={t('purchases.search_invoice')}
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
                return <Typography color="text.secondary">{t('purchases.select_supplier')}</Typography>;
              }
              const supplier = suppliers.find(s => s.id === selected);
              return supplier ? supplier.name : "";
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">{t('purchases.all_suppliers')}</MenuItem>
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
              placeholder={t('purchases.start_date')}
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
              placeholder={t('purchases.end_date')}
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
            label={t('purchases.all_purchases')}
            sx={{ 
              textTransform: 'none',
              minHeight: 48,
              color: tabValue === 0 ? '#0ea5e9' : 'text.primary',
              '&.Mui-selected': { color: '#0ea5e9' },
              borderBottom: tabValue === 0 ? '2px solid #0ea5e9' : 'none',
            }} 
          />
          <Tab 
            label={t('purchases.unpaid')}
            sx={{ 
              textTransform: 'none',
              minHeight: 48,
              borderBottom: tabValue === 1 ? '2px solid #0ea5e9' : 'none',
              '&.Mui-selected': { color: '#0ea5e9' }
            }} 
          />
          <Tab 
            label={t('purchases.paid')}
            sx={{ 
              textTransform: 'none',
              minHeight: 48,
              borderBottom: tabValue === 2 ? '2px solid #0ea5e9' : 'none',
              '&.Mui-selected': { color: '#0ea5e9' }
            }} 
          />
          {selectedPurchaseDetails && (
            <Tab 
              label={t('purchases.purchase_details')}
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
          <Typography variant="h6" sx={{ mb: 2 }}>{t('purchases.purchase_details')}</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">{t('purchases.invoice_number')}</Typography>
                <Typography variant="body1">{selectedPurchaseDetails.id}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">{t('purchases.purchase_date')}</Typography>
                <Typography variant="body1">
                  {new Date(selectedPurchaseDetails.created_at).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">{t('purchases.purchase_status')}</Typography>
                <Chip 
                  label={selectedPurchaseDetails.status || (selectedPurchaseDetails.is_credit ? t('purchases.credit') : t('purchases.paid'))} 
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
                <Typography variant="subtitle2" color="text.secondary">{t('purchases.purchase_supplier')}</Typography>
                <Typography variant="body1">{selectedPurchaseDetails.supplier.name}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">{t('common.contact_info')}</Typography>
                <Typography variant="body1">{selectedPurchaseDetails.supplier.email}</Typography>
                <Typography variant="body1">{selectedPurchaseDetails.supplier.phone}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">{t('purchases.total')}</Typography>
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
              {t('common.back')}
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handleEditPurchase(selectedPurchaseDetails.id)}
              sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            >
              {t('common.edit')}
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
                    checked={selectedPurchases.length === companyPurchases.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>{t('purchases.invoice_number')}</TableCell>
                <TableCell>{t('purchases.purchase_date')}</TableCell>
                <TableCell>{t('purchases.purchase_supplier')}</TableCell>
                <TableCell>{t('purchases.purchase_status')}</TableCell>
                <TableCell>{t('purchases.total')}</TableCell>
                <TableCell>{t('purchases.paid')}</TableCell>
                <TableCell>{t('common.due_amount')}</TableCell>
                <TableCell>{t('purchases.payment_status')}</TableCell>
                <TableCell>{t('common.action')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={24} />
                    <Typography sx={{ ml: 2 }}>{t('purchases.loading_purchases')}</Typography>
                  </TableCell>
                </TableRow>
              ) : companyPurchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <Typography>{t('purchases.no_purchases')}</Typography>
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
                          <MenuItem onClick={() => handleEditPurchase(purchase.id)}>{t('common.edit')}</MenuItem>
                          <MenuItem onClick={() => handleDeletePurchase(purchase.id)}>{t('common.delete')}</MenuItem>
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
      
      <DeleteConfirmationModal 
        open={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleConfirmDelete} 
        title={t('common.confirmation')}
        message={t('purchases.confirm_delete')}
      />
    </Box>
  );
} 