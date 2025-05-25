'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
import { InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';

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
  tax: string;
  subtotal?: number;
  taxAmount?: number;
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
    tax: '0',
    subtotal: 0,
    taxAmount: 0,
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
  const { t } = useTranslation('admin');
  
  // State
  const [formData, setFormData] = React.useState<PurchaseData>(purchase);
  const [isLoading, setIsLoading] = React.useState(true);
  const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [paymentModes, setPaymentModes] = React.useState<PaymentMode[]>([]);
  const [currencies, setCurrencies] = React.useState<Currency[]>([]);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = React.useState('');
  
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
  
  // Reset form data when modal opens with new purchase data
  React.useEffect(() => {
    if (open) {
      // Ensure products is always an array
      const purchaseWithProducts = {
        ...purchase,
        products: purchase.products || []
      };
      
      // Always set the company_id to the current user's company_id if available
      if (userInfo?.company_id) {
        purchaseWithProducts.company_id = userInfo.company_id;
      }
      
      // If we have products, calculate the totals directly
      if (purchaseWithProducts.products.length > 0) {
        let subtotal = 0;
        purchaseWithProducts.products.forEach(item => {
          subtotal += item.subtotal;
        });
        
        const taxPercentage = parseFloat(purchaseWithProducts.tax || '0') || 0;
        const taxAmount = (subtotal * taxPercentage) / 100;
        const total = subtotal + taxAmount;
        
        purchaseWithProducts.subtotal = subtotal;
        purchaseWithProducts.taxAmount = taxAmount;
        purchaseWithProducts.totalAmount = total;
        purchaseWithProducts.dueAmount = total - (purchaseWithProducts.paidAmount || 0);
      }
      
      setFormData(purchaseWithProducts);
      setErrors({});
    }
  }, [purchase, open, userInfo]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'paidAmount') {
      const paidAmount = parseFloat(value) || 0;
      
      setFormData(prev => {
        const paymentStatus = paidAmount >= prev.totalAmount 
          ? 'Paid' 
          : (paidAmount > 0 ? 'Partially Paid' : 'Unpaid');
          
        return {
          ...prev,
          paidAmount,
          dueAmount: prev.totalAmount - paidAmount,
          paymentStatus
        };
      });
    } else if (name === 'tax') {
      // For tax updates, update the tax value and recalculate in one atomic operation
      setFormData(prev => {
        const newTax = value;
        const taxPercentage = parseFloat(newTax) || 0;
        const subtotal = prev.subtotal || 0;
        const taxAmount = (subtotal * taxPercentage) / 100;
        const total = subtotal + taxAmount;
        
        return { 
          ...prev, 
          tax: newTax,
          taxAmount: taxAmount,
          totalAmount: total,
          dueAmount: total - (prev.paidAmount || 0)
        };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
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
  
  const handleProductQuantityChange = (id: string, quantity: number) => {
    setFormData(prev => {
      const updatedProducts = prev.products.map(product => {
        if (product.id === id) {
          return { 
            ...product, 
            quantity: quantity,
            subtotal: quantity * product.unitPrice - product.discount
          };
        }
        return product;
      });
      
      // Calculate new totals directly
      let subtotal = 0;
      updatedProducts.forEach(item => {
        subtotal += item.subtotal;
      });
      
      const taxPercentage = parseFloat(prev.tax) || 0;
      const taxAmount = (subtotal * taxPercentage) / 100;
      const total = subtotal + taxAmount;
      
      return {
        ...prev, 
        products: updatedProducts,
        subtotal,
        taxAmount,
        totalAmount: total,
        dueAmount: total - (prev.paidAmount || 0)
      };
    });
  };
  
  const handleProductPriceChange = (id: string, price: number) => {
    setFormData(prev => {
      const updatedProducts = prev.products.map(product => {
        if (product.id === id) {
          return { 
            ...product, 
            unitPrice: price,
            subtotal: product.quantity * price - product.discount
          };
        }
        return product;
      });
      
      // Calculate new totals directly
      let subtotal = 0;
      updatedProducts.forEach(item => {
        subtotal += item.subtotal;
      });
      
      const taxPercentage = parseFloat(prev.tax) || 0;
      const taxAmount = (subtotal * taxPercentage) / 100;
      const total = subtotal + taxAmount;
      
      return {
        ...prev, 
        products: updatedProducts,
        subtotal,
        taxAmount,
        totalAmount: total,
        dueAmount: total - (prev.paidAmount || 0)
      };
    });
  };

  const handleAddProduct = () => {
    if (selectedProduct) {
      const product = products.find(p => p.id === selectedProduct);
      if (product) {
        const unitPrice = parseFloat(product.purchase_price) || 0;
        const newProduct: ProductItem = {
          id: product.id,
          name: product.name,
          quantity: 1,
          unitPrice,
          discount: 0,
          tax: 0,
          subtotal: unitPrice
        };
        
        setFormData(prev => {
          const updatedProducts = [...prev.products, newProduct];
          
          // Calculate new totals directly
          let subtotal = 0;
          updatedProducts.forEach(item => {
            subtotal += item.subtotal;
          });
          
          const taxPercentage = parseFloat(prev.tax) || 0;
          const taxAmount = (subtotal * taxPercentage) / 100;
          const total = subtotal + taxAmount;
          
          return {
            ...prev, 
            products: updatedProducts,
            subtotal,
            taxAmount,
            totalAmount: total,
            dueAmount: total - (prev.paidAmount || 0)
          };
        });
        
        setSelectedProduct('');
      }
    }
  };
  
  const handleRemoveProduct = (id: string) => {
    setFormData(prev => {
      const updatedProducts = prev.products.filter(p => p.id !== id);
      
      // Calculate new totals directly
      let subtotal = 0;
      updatedProducts.forEach(item => {
        subtotal += item.subtotal;
      });
      
      const taxPercentage = parseFloat(prev.tax) || 0;
      const taxAmount = (subtotal * taxPercentage) / 100;
      const total = subtotal + taxAmount;
      
      return {
        ...prev, 
        products: updatedProducts,
        subtotal,
        taxAmount,
        totalAmount: total,
        dueAmount: total - (prev.paidAmount || 0)
      };
    });
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
      <DialogTitle>{isNew ? t('purchases.add_purchase') : t('purchases.edit_purchase')}</DialogTitle>
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
          
          {/* Tax Percentage */}
          <Grid item xs={12} md={6}>
            <TextField
              name="tax"
              label="Tax Percentage"
              type="number"
              value={formData.tax || '0'}
              onChange={handleInputChange}
              fullWidth
              InputProps={{ 
                inputProps: { min: 0, step: 0.01 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              helperText="Tax percentage to apply to the purchase"
            />
          </Grid>
          
          {/* Products */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Products</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel id="product-select-label">Select Product</InputLabel>
                  <Select
                    labelId="product-select-label"
                    id="selectedProduct"
                    value={selectedProduct}
                    label="Select Product"
                    onChange={(e) => setSelectedProduct(e.target.value as string)}
                    size="small"
                  >
                    {products.map(product => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button 
                  variant="contained" 
                  startIcon={<PlusIcon />}
                  onClick={handleAddProduct}
                  disabled={!selectedProduct}
                >
                  Add Product
                </Button>
              </Box>
            </Box>
            
            {errors.products && (
              <Typography color="error" variant="caption" sx={{ display: 'block', mb: 2 }}>
                {errors.products}
              </Typography>
            )}
            
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('products.product_name')}</TableCell>
                  <TableCell align="right">{t('purchases.quantity')}</TableCell>
                  <TableCell align="right">{t('purchases.price')}</TableCell>
                  <TableCell align="right">{t('purchases.discount')}</TableCell>
                  <TableCell align="right">{t('purchases.subtotal')}</TableCell>
                  <TableCell align="center">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.products.length > 0 ? (
                  formData.products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          value={product.quantity}
                          onChange={(e) => handleProductQuantityChange(product.id, parseFloat(e.target.value) || 0)}
                          size="small"
                          InputProps={{ inputProps: { min: 1, style: { textAlign: 'right' } } }}
                          sx={{ width: '80px' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          value={product.unitPrice}
                          onChange={(e) => handleProductPriceChange(product.id, parseFloat(e.target.value) || 0)}
                          size="small" 
                          InputProps={{ inputProps: { min: 0, step: 0.01, style: { textAlign: 'right' } } }}
                          sx={{ width: '100px' }}
                        />
                      </TableCell>
                      <TableCell align="right">{product.discount.toFixed(2)}</TableCell>
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
                
                {/* Calculate subtotal, tax, and total */}
                {formData.products.length > 0 && (
                <>
                <TableRow>
                  <TableCell colSpan={4} align="right"><strong>{t('purchases.subtotal')}:</strong></TableCell>
                  <TableCell align="right" colSpan={2}>
                    ${formData.subtotal?.toFixed(2) || '0.00'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} align="right"><strong>{t('purchases.tax')} ({formData.tax || 0}%):</strong></TableCell>
                  <TableCell align="right" colSpan={2}>
                    ${formData.taxAmount?.toFixed(2) || '0.00'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} align="right"><strong>{t('purchases.total')}:</strong></TableCell>
                  <TableCell align="right" colSpan={2}>
                    ${formData.totalAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
                </>
                )}
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