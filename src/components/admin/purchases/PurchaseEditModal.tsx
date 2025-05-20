'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { transactionsApi, Supplier, PaymentMode } from '@/services/api/transactions';
import { inventoryApi, Product, InventoryStore } from '@/services/api/inventory';
import { companiesApi, Company, Currency } from '@/services/api/companies';
import { useCurrentUser } from '@/hooks/use-auth';
import { useStore } from '@/providers/store-provider';
import { useSnackbar } from 'notistack';

interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  subtotal: number;
}

interface PurchaseData {
  id?: string;
  date: string;
  supplier: string;
  status: string;
  reference?: string;
  note?: string;
  products: ProductItem[];
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: string;
  company_id?: string;
  store_id?: string;
  currency_id?: string;
  payment_mode_id?: string;
  is_credit?: boolean;
}

interface PurchaseEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: PurchaseData) => void;
  purchase?: PurchaseData;
  isNew?: boolean;
}

const PurchaseEditModal = ({
  open,
  onClose,
  onSave,
  purchase = {
    date: new Date().toISOString().split('T')[0],
    supplier: '',
    status: 'Ordered',
    products: [],
    totalAmount: 0,
    paidAmount: 0,
    dueAmount: 0,
    paymentStatus: 'Unpaid',
    company_id: '',
    store_id: '',
    currency_id: '',
    payment_mode_id: ''
  },
  isNew = true
}: PurchaseEditModalProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo } = useCurrentUser();
  const { currentStore } = useStore();
  
  // State
  const [formData, setFormData] = React.useState<PurchaseData>(purchase);
  const [isLoading, setIsLoading] = React.useState(true);
  const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [paymentModes, setPaymentModes] = React.useState<PaymentMode[]>([]);
  const [currencies, setCurrencies] = React.useState<Currency[]>([]);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  // Load data when modal opens
  React.useEffect(() => {
    if (open && currentStore) {
      const loadData = async () => {
        try {
          setIsLoading(true);
          
          const [suppliersData, productsData, currenciesData, paymentModesData] = await Promise.all([
            transactionsApi.getSuppliers(currentStore.id),
            inventoryApi.getProducts(currentStore.id),
            companiesApi.getCurrencies(),
            transactionsApi.getPaymentModes(currentStore.id)
          ]);
          
          setSuppliers(suppliersData);
          setProducts(productsData);
          setCurrencies(currenciesData);
          setPaymentModes(paymentModesData);
          
          // Initialize form data with defaults if needed
          setFormData(current => ({
            ...current,
            store_id: currentStore.id,
            company_id: userInfo?.company_id || '',
            currency_id: currenciesData.length > 0 ? currenciesData[0].id : '',
            payment_mode_id: paymentModesData.length > 0 ? paymentModesData[0].id : ''
          }));
        } catch (error) {
          console.error('Error loading data:', error);
          enqueueSnackbar('Failed to load data', { variant: 'error' });
        } finally {
          setIsLoading(false);
        }
      };
      
      loadData();
    }
  }, [open, currentStore, userInfo, enqueueSnackbar]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value as string;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.supplier) {
      newErrors.supplier = 'Supplier is required';
    }
    
    if (!formData.store_id) {
      newErrors.store_id = 'Store is required';
    }
    
    if (!formData.currency_id) {
      newErrors.currency_id = 'Currency is required';
    }
    
    if (!formData.payment_mode_id) {
      newErrors.payment_mode_id = 'Payment mode is required';
    }
    
    if (formData.products.length === 0) {
      newErrors.products = 'At least one product is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleAddProduct = () => {
    // Get the selected product from a dropdown instead of using supplier ID
    // For now, just select the first product in the list as a fallback
    if (products.length === 0) {
      enqueueSnackbar('No products available', { variant: 'error' });
      return;
    }
    
    const product = products[0]; // Default to first product
    
    const newProduct: ProductItem = {
      id: product.id,
      name: product.name,
      quantity: 1,
      unitPrice: parseFloat(product.purchase_price) || 0,
      discount: 0,
      tax: 0,
      subtotal: parseFloat(product.purchase_price) || 0
    };
    
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, newProduct],
      totalAmount: prev.totalAmount + newProduct.subtotal
    }));
  };
  
  const handleRemoveProduct = (id: string) => {
    const productToRemove = formData.products.find(p => p.id === id);
    const subtotal = productToRemove ? productToRemove.subtotal : 0;
    
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id),
      totalAmount: prev.totalAmount - subtotal
    }));
  };
  
  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };
  
  if (isLoading) {
    return (
      <Dialog open={open} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isNew ? 'Add New Purchase' : 'Edit Purchase'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Supplier Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.supplier}>
              <InputLabel id="supplier-label">Supplier</InputLabel>
              <Select
                labelId="supplier-label"
                id="supplier"
                name="supplier"
                value={formData.supplier}
                label="Supplier"
                onChange={handleSelectChange as any}
              >
                {suppliers.map(supplier => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.supplier && (
                <Typography color="error" variant="caption">
                  {errors.supplier}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          {/* Date */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          {/* Currency */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.currency_id}>
              <InputLabel id="currency-label">Currency</InputLabel>
              <Select
                labelId="currency-label"
                id="currency_id"
                name="currency_id"
                value={formData.currency_id || ''}
                label="Currency"
                onChange={handleSelectChange as any}
              >
                {currencies.map(currency => (
                  <MenuItem key={currency.id} value={currency.id}>
                    {currency.code} - {currency.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.currency_id && (
                <Typography color="error" variant="caption">
                  {errors.currency_id}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          {/* Payment Mode */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.payment_mode_id}>
              <InputLabel id="payment-mode-label">Payment Mode</InputLabel>
              <Select
                labelId="payment-mode-label"
                id="payment_mode_id"
                name="payment_mode_id"
                value={formData.payment_mode_id || ''}
                label="Payment Mode"
                onChange={handleSelectChange as any}
              >
                {paymentModes.map(mode => (
                  <MenuItem key={mode.id} value={mode.id}>
                    {mode.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.payment_mode_id && (
                <Typography color="error" variant="caption">
                  {errors.payment_mode_id}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          {/* Is Credit */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="credit-label">Credit Purchase</InputLabel>
              <Select
                labelId="credit-label"
                id="is_credit"
                name="is_credit"
                value={formData.is_credit ? 'true' : 'false'}
                label="Credit Purchase"
                onChange={handleSelectChange as any}
              >
                <MenuItem value="false">No</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Products */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Products</Typography>
              <Button 
                variant="contained" 
                startIcon={<PlusIcon />}
                onClick={handleAddProduct}
              >
                Add Product
              </Button>
            </Box>
            
            {errors.products && (
              <Typography color="error" variant="caption" sx={{ display: 'block', mb: 2 }}>
                {errors.products}
              </Typography>
            )}
            
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.products.length > 0 ? (
                  formData.products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell align="right">{product.quantity}</TableCell>
                      <TableCell align="right">{product.unitPrice.toFixed(2)}</TableCell>
                      <TableCell align="right">{product.subtotal.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleRemoveProduct(product.id)}
                        >
                          <TrashIcon size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No products added yet
                    </TableCell>
                  </TableRow>
                )}
                
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <strong>Total:</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{formData.totalAmount.toFixed(2)}</strong>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
          
          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              name="note"
              value={formData.note || ''}
              onChange={handleInputChange}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={isLoading}
        >
          {isNew ? 'Create Purchase' : 'Update Purchase'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseEditModal; 