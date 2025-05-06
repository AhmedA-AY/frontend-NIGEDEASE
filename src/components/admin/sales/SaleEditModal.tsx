'use client';

import React, { useEffect, useState } from 'react';
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
import { transactionsApi, Customer, TransactionPaymentMode } from '@/services/api/transactions';
import { inventoryApi, Product, InventoryStore } from '@/services/api/inventory';
import { companiesApi, Company, Currency } from '@/services/api/companies';

interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  subtotal: number;
}

interface SaleData {
  id?: string;
  customer: string;  // customer ID
  totalAmount: number;
  is_credit?: boolean;
  company_id?: string;
  store_id?: string;
  currency_id?: string;
  payment_mode_id?: string;
  
  // These fields can remain for UI purposes only
  date?: string;
  status?: string;
  reference?: string;
  note?: string;
  products?: ProductItem[];
  paidAmount?: number;
  dueAmount?: number;
  paymentStatus?: string;
}

interface SaleEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SaleData) => void;
  sale?: SaleData;
  isNew?: boolean;
}

export default function SaleEditModal({
  open,
  onClose,
  onSave,
  sale = {
    customer: '',
    totalAmount: 0,
    is_credit: false,
    company_id: '',
    store_id: '',
    currency_id: '',
    payment_mode_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Confirmed',
    products: [],
    paidAmount: 0,
    dueAmount: 0,
    paymentStatus: 'Unpaid'
  },
  isNew = true
}: SaleEditModalProps): React.JSX.Element {
  const [formData, setFormData] = React.useState<SaleData>({
    customer: '',
    totalAmount: 0,
    is_credit: false,
    company_id: '',
    store_id: '',
    currency_id: '',
    payment_mode_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Confirmed',
    products: [],
    paidAmount: 0,
    dueAmount: 0,
    paymentStatus: 'Unpaid'
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = React.useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stores, setStores] = useState<InventoryStore[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [paymentModes, setPaymentModes] = useState<TransactionPaymentMode[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Fetch data when modal opens
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [
            customersData, 
            productsData, 
            companiesData, 
            storesData, 
            currenciesData, 
            paymentModesData
          ] = await Promise.all([
            transactionsApi.getCustomers(),
            inventoryApi.getProducts(),
            companiesApi.getCompanies(),
            inventoryApi.getStores(),
            companiesApi.getCurrencies(),
            transactionsApi.getPaymentModes()
          ]);
          
          setCustomers(customersData);
          setProducts(productsData);
          setCompanies(companiesData);
          setStores(storesData);
          setCurrencies(currenciesData);
          setPaymentModes(paymentModesData);
          
          // If formData doesn't have IDs, set defaults
          setFormData(prev => {
            const updated = { ...prev };
            if (!updated.company_id && companiesData.length > 0) {
              updated.company_id = companiesData[0].id;
            }
            if (!updated.store_id && storesData.length > 0) {
              updated.store_id = storesData[0].id;
            }
            if (!updated.currency_id && currenciesData.length > 0) {
              updated.currency_id = currenciesData[0].id;
            }
            if (!updated.payment_mode_id && paymentModesData.length > 0) {
              updated.payment_mode_id = paymentModesData[0].id;
            }
            return updated;
          });
          
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [open]);
  
  // Reset form data when modal opens with new sale data
  React.useEffect(() => {
    if (open) {
      // Ensure products is always an array
      const saleWithProducts = {
        ...sale,
        products: sale.products || []
      };
      setFormData(saleWithProducts);
      setErrors({});
      calculateTotals(saleWithProducts.products);
    }
  }, [sale, open]);
  
  const calculateTotals = (productItems: ProductItem[]) => {
    let total = 0;
    
    productItems.forEach(item => {
      const subtotal = (item.quantity * item.unitPrice) - item.discount + item.tax;
      total += subtotal;
    });
    
    setFormData(prev => ({
      ...prev,
      totalAmount: total,
      dueAmount: total - (prev.paidAmount || 0),
      paymentStatus: (prev.paidAmount || 0) >= total ? 'Paid' : ((prev.paidAmount || 0) > 0 ? 'Partially Paid' : 'Unpaid')
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'paidAmount') {
      const paidAmount = parseFloat(value) || 0;
      const paymentStatus = paidAmount >= formData.totalAmount 
        ? 'Paid' 
        : (paidAmount > 0 ? 'Partially Paid' : 'Unpaid');
      
      setFormData(prev => ({
        ...prev,
        paidAmount,
        dueAmount: prev.totalAmount - paidAmount,
        paymentStatus
      }));
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

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Special handling for is_credit toggle
    if (name === 'is_credit') {
      setFormData(prev => ({ 
        ...prev, 
        is_credit: value === 'true',
        status: value === 'true' ? 'Credit' : 'Confirmed'
      }));
    }
  };

  const handleAddProduct = () => {
    if (!selectedProduct) return;
    
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;
    
    const unitPrice = product.sale_price ? parseFloat(product.sale_price) : 0;
    const tax = unitPrice * 0.1; // Default 10% tax if not available from the product
    
    const newProduct: ProductItem = {
      id: product.id,
      name: product.name,
      quantity: 1,
      unitPrice: unitPrice,
      discount: 0,
      tax: tax,
      subtotal: unitPrice + tax
    };
    
    const updatedProducts = [...(formData.products || []), newProduct];
    setFormData(prev => ({ ...prev, products: updatedProducts }));
    calculateTotals(updatedProducts);
    setSelectedProduct('');
  };

  const handleRemoveProduct = (id: string) => {
    const products = formData.products || [];
    const updatedProducts = products.filter(product => product.id !== id);
    setFormData(prev => ({ ...prev, products: updatedProducts }));
    calculateTotals(updatedProducts);
  };

  const handleProductChange = (id: string, field: keyof ProductItem, value: any) => {
    const products = formData.products || [];
    const updatedProducts = products.map(product => {
      if (product.id === id) {
        const updatedProduct = { ...product, [field]: parseFloat(value) || 0 };
        
        // Recalculate subtotal
        updatedProduct.subtotal = (updatedProduct.quantity * updatedProduct.unitPrice) - 
          updatedProduct.discount + updatedProduct.tax;
          
        return updatedProduct;
      }
      return product;
    });
    
    setFormData(prev => ({ ...prev, products: updatedProducts }));
    calculateTotals(updatedProducts);
  };

  // Status options for the form
  const statusOptions = [
    { value: 'false', label: 'Confirmed' },
    { value: 'true', label: 'Credit' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customer) {
      newErrors.customer = 'Customer is required';
    }
    
    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = 'Total amount must be greater than zero';
    }
    
    if (!formData.company_id) {
      newErrors.company_id = 'Company is required';
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
    
    if (!formData.products || formData.products.length === 0) {
      newErrors.products = 'At least one product is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{isNew ? 'Create New Sale' : 'Edit Sale'}</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={3}>
              <TextField
                name="date"
                label="Sale Date"
                type="date"
                fullWidth
                value={formData.date}
                onChange={handleChange}
                error={!!errors.date}
                helperText={errors.date}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth error={!!errors.customer}>
                <InputLabel id="customer-select-label">Customer</InputLabel>
                <Select
                  labelId="customer-select-label"
                  id="customer"
                  name="customer"
                  value={formData.customer}
                  label="Customer"
                  onChange={handleSelectChange}
                >
                  {customers.map(customer => (
                    <MenuItem key={customer.id} value={customer.id}>{customer.name}</MenuItem>
                  ))}
                </Select>
                {errors.customer && <Typography color="error" variant="caption">{errors.customer}</Typography>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth margin="normal" error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="is_credit"
                  value={String(formData.is_credit)}
                  onChange={handleSelectChange}
                  label="Status"
                >
                  {statusOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.status && <Typography color="error" variant="caption">{errors.status}</Typography>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                name="reference"
                label="Reference (Optional)"
                type="text"
                fullWidth
                value={formData.reference || ''}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth error={!!errors.company_id}>
                <InputLabel id="company-select-label">Company</InputLabel>
                <Select
                  labelId="company-select-label"
                  id="company_id"
                  name="company_id"
                  value={formData.company_id}
                  label="Company"
                  onChange={handleSelectChange}
                >
                  {companies.map(company => (
                    <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
                  ))}
                </Select>
                {errors.company_id && <Typography color="error" variant="caption">{errors.company_id}</Typography>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth error={!!errors.store_id}>
                <InputLabel id="store-select-label">Store</InputLabel>
                <Select
                  labelId="store-select-label"
                  id="store_id"
                  name="store_id"
                  value={formData.store_id}
                  label="Store"
                  onChange={handleSelectChange}
                >
                  {stores.map(store => (
                    <MenuItem key={store.id} value={store.id}>{store.name}</MenuItem>
                  ))}
                </Select>
                {errors.store_id && <Typography color="error" variant="caption">{errors.store_id}</Typography>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth error={!!errors.currency_id}>
                <InputLabel id="currency-select-label">Currency</InputLabel>
                <Select
                  labelId="currency-select-label"
                  id="currency_id"
                  name="currency_id"
                  value={formData.currency_id}
                  label="Currency"
                  onChange={handleSelectChange}
                >
                  {currencies.map(currency => (
                    <MenuItem key={currency.id} value={currency.id}>{currency.code}</MenuItem>
                  ))}
                </Select>
                {errors.currency_id && <Typography color="error" variant="caption">{errors.currency_id}</Typography>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth error={!!errors.payment_mode_id}>
                <InputLabel id="payment-mode-select-label">Payment Mode</InputLabel>
                <Select
                  labelId="payment-mode-select-label"
                  id="payment_mode_id"
                  name="payment_mode_id"
                  value={formData.payment_mode_id}
                  label="Payment Mode"
                  onChange={handleSelectChange}
                >
                  {paymentModes.map(mode => (
                    <MenuItem key={mode.id} value={mode.id}>{mode.name}</MenuItem>
                  ))}
                </Select>
                {errors.payment_mode_id && <Typography color="error" variant="caption">{errors.payment_mode_id}</Typography>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1">Products</Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="product-select-label">Select Product</InputLabel>
                    <Select
                      labelId="product-select-label"
                      id="selectedProduct"
                      name="selectedProduct"
                      value={selectedProduct}
                      label="Select Product"
                      onChange={(e) => setSelectedProduct(e.target.value as string)}
                      size="small"
                    >
                      {products.map(product => (
                        <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button 
                    variant="contained" 
                    onClick={handleAddProduct}
                    startIcon={<PlusIcon weight="bold" />}
                    sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
                    size="small"
                  >
                    Add
                  </Button>
                </Box>
              </Box>
              
              {errors.products && (
                <Typography color="error" variant="caption" sx={{ mb: 1, display: 'block' }}>
                  {errors.products}
                </Typography>
              )}
              
              <Table size="small" sx={{ mb: 3 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Unit Price</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Tax</TableCell>
                    <TableCell>Subtotal</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(formData.products || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No products added yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    (formData.products || []).map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={product.quantity}
                            onChange={(e) => handleProductChange(
                              product.id, 
                              'quantity', 
                              e.target.value
                            )}
                            inputProps={{ min: 1 }}
                            size="small"
                            sx={{ width: 70 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={product.unitPrice}
                            onChange={(e) => handleProductChange(
                              product.id, 
                              'unitPrice', 
                              e.target.value
                            )}
                            InputProps={{ startAdornment: '$' }}
                            size="small"
                            sx={{ width: 100 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={product.discount}
                            onChange={(e) => handleProductChange(
                              product.id, 
                              'discount', 
                              e.target.value
                            )}
                            InputProps={{ startAdornment: '$' }}
                            size="small"
                            sx={{ width: 80 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={product.tax}
                            onChange={(e) => handleProductChange(
                              product.id, 
                              'tax', 
                              e.target.value
                            )}
                            InputProps={{ startAdornment: '$' }}
                            size="small"
                            sx={{ width: 80 }}
                          />
                        </TableCell>
                        <TableCell>${product.subtotal.toFixed(2)}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveProduct(product.id)}
                            sx={{ color: '#ef4444' }}
                          >
                            <TrashIcon size={16} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="note"
                label="Note (Optional)"
                multiline
                rows={2}
                fullWidth
                value={formData.note || ''}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-end',
                gap: 1,
                mt: 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" sx={{ minWidth: 150 }}>Total Amount:</Typography>
                  <Typography variant="subtitle1">${formData.totalAmount.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" sx={{ minWidth: 150 }}>Paid Amount:</Typography>
                  <TextField
                    name="paidAmount"
                    type="number"
                    value={formData.paidAmount}
                    onChange={handleChange}
                    InputProps={{ startAdornment: '$' }}
                    size="small"
                    sx={{ width: 120 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" sx={{ minWidth: 150 }}>Due Amount:</Typography>
                  <Typography variant="subtitle1" color={(formData.dueAmount || 0) > 0 ? 'error' : 'success'}>
                    ${(formData.dueAmount || 0).toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" sx={{ minWidth: 150 }}>Payment Status:</Typography>
                  <Typography variant="subtitle1" 
                    color={
                      formData.paymentStatus === 'Paid' 
                        ? 'success' 
                        : formData.paymentStatus === 'Partially Paid' 
                          ? 'warning'
                          : 'error'
                    }
                  >
                    {formData.paymentStatus}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>Save</Button>
      </DialogActions>
    </Dialog>
  );
} 