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
import { transactionsApi, Customer, PaymentMode } from '@/services/api/transactions';
import { inventoryApi, Product, InventoryStore } from '@/services/api/inventory';
import { companiesApi, Company, Currency } from '@/services/api/companies';
import { useCurrentUser } from '@/hooks/use-auth';
import { useStore } from '@/providers/store-provider';
import { InputAdornment } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

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
  tax: string;
  subtotal?: number;
  taxAmount?: number;
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
    date: new Date().toISOString().split('T')[0],
    customer: '',
    status: 'Ordered',
    products: [],
    totalAmount: 0,
    subtotal: 0,
    taxAmount: 0,
    tax: '0',
    paidAmount: 0,
    dueAmount: 0,
    paymentStatus: 'Unpaid',
    company_id: '',
    store_id: '',
    currency_id: '',
    payment_mode_id: ''
  },
  isNew = true
}: SaleEditModalProps): React.JSX.Element {
  const [formData, setFormData] = React.useState<SaleData>({
    date: new Date().toISOString().split('T')[0],
    customer: '',
    status: 'Ordered',
    products: [],
    totalAmount: 0,
    subtotal: 0,
    taxAmount: 0,
    tax: '0',
    paidAmount: 0,
    dueAmount: 0,
    paymentStatus: 'Unpaid',
    company_id: '',
    store_id: '',
    currency_id: '',
    payment_mode_id: ''
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [stores, setStores] = React.useState<InventoryStore[]>([]);
  const [filteredStores, setFilteredStores] = React.useState<InventoryStore[]>([]);
  const [currencies, setCurrencies] = React.useState<Currency[]>([]);
  const [paymentModes, setPaymentModes] = React.useState<PaymentMode[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  
  // Get current user's company
  const { userInfo, isLoading: isLoadingUser } = useCurrentUser();
  const { currentStore } = useStore();
  
  // Fetch data when modal opens
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          if (!currentStore) {
            console.error('No store selected');
            return;
          }
          
          const [
            customersData, 
            productsData, 
            companiesData, 
            storesData, 
            currenciesData
          ] = await Promise.all([
            transactionsApi.getCustomers(currentStore.id),
            inventoryApi.getProducts(currentStore.id),
            companiesApi.getCompanies(),
            inventoryApi.getStores(),
            companiesApi.getCurrencies()
          ]);
          
          setCustomers(customersData);
          setProducts(productsData);
          setCompanies(companiesData);
          setStores(storesData);
          setCurrencies(currenciesData);
          
          // Get payment modes after we have the store ID
          const paymentModesData = await transactionsApi.getPaymentModes(currentStore.id);
          setPaymentModes(paymentModesData);
          
          // Filter stores by user's company
          if (userInfo?.company_id) {
            const companyStores = storesData.filter(store => 
              store.company && store.company.id === userInfo.company_id
            );
            setFilteredStores(companyStores);
            
            // Filter products by user's company through the store
            const companyProducts = productsData.filter(product => 
              product.store && product.store.company && product.store.company.id === userInfo.company_id
            );
            setFilteredProducts(companyProducts);
          } else {
            setFilteredProducts(productsData);
          }
          
          // If formData doesn't have IDs, set defaults
          setFormData(prev => {
            const updated = { ...prev };
            // Always use the user's company
            if (userInfo?.company_id) {
              updated.company_id = userInfo.company_id;
            } else if (!updated.company_id && companiesData.length > 0) {
              updated.company_id = companiesData[0].id;
            }
            
            // Set default store from filtered stores
            if (!updated.store_id) {
              const availableStores = userInfo?.company_id 
                ? storesData.filter(store => store.company && store.company.id === userInfo.company_id)
                : storesData;
                
              if (availableStores.length > 0) {
                updated.store_id = availableStores[0].id;
              }
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
  }, [open, userInfo]);
  
  // Filter stores whenever user company changes
  useEffect(() => {
    if (userInfo?.company_id) {
      // Filter stores by company
      if (stores.length > 0) {
        const companyStores = stores.filter(store => 
          store.company && store.company.id === userInfo.company_id
        );
        setFilteredStores(companyStores);
      }
      
      // Filter products by company through the store
      if (products.length > 0) {
        const companyProducts = products.filter(product => 
          product.store && product.store.company && product.store.company.id === userInfo.company_id
        );
        setFilteredProducts(companyProducts);
      }
    }
  }, [userInfo, stores, products]);
  
  // Reset form data when modal opens with new sale data
  React.useEffect(() => {
    if (open) {
      // Ensure products is always an array
      const saleWithProducts = {
        ...sale,
        products: sale.products || []
      };
      
      // Always set the company_id to the current user's company_id if available
      if (userInfo?.company_id) {
        saleWithProducts.company_id = userInfo.company_id;
      }
      
      setFormData(saleWithProducts);
      setErrors({});
      calculateTotals(saleWithProducts.products);
    }
  }, [sale, open, userInfo]);
  
  const calculateTotals = (productItems: ProductItem[]) => {
    let subtotal = 0;
    
    productItems.forEach(item => {
      const itemSubtotal = (item.quantity * item.unitPrice) - item.discount;
      subtotal += itemSubtotal;
    });
    
    // Calculate tax amount based on tax percentage
    const taxPercentage = parseFloat(formData.tax) || 0;
    const taxAmount = (subtotal * taxPercentage) / 100;
    
    // Total amount is subtotal + tax
    const total = subtotal + taxAmount;
    
    setFormData(prev => ({
      ...prev,
      subtotal: subtotal,
      taxAmount: taxAmount,
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
    } else if (name === 'tax') {
      // When tax changes, first update the tax value
      const newTax = value;
      const taxPercentage = parseFloat(newTax) || 0;
      const subtotal = formData.subtotal || 0;
      const taxAmount = (subtotal * taxPercentage) / 100;
      const total = subtotal + taxAmount;
      
      setFormData(prev => ({ 
        ...prev, 
        tax: newTax,
        taxAmount: taxAmount,
        totalAmount: total,
        dueAmount: total - (prev.paidAmount || 0)
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
    
    const newProduct: ProductItem = {
      id: product.id,
      name: product.name,
      quantity: 1,
      unitPrice: unitPrice,
      discount: 0,
      tax: 0,
      subtotal: unitPrice
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
        
        // Recalculate subtotal for this product (not including tax, which is calculated at the order level)
        updatedProduct.subtotal = (updatedProduct.quantity * updatedProduct.unitPrice) - updatedProduct.discount;
          
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
      newErrors.company_id = 'Company is required. Please refresh the page to get your company information.';
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
    // Log the form data to see what's being submitted
    console.log('Form data before validation:', formData);
    
    // Check company_id specifically
    if (!formData.company_id) {
      console.error('Company ID is missing!');
      setErrors(prev => ({
        ...prev,
        company_id: 'Company is required. Please refresh the page to get your company information.'
      }));
      return;
    }
    
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
              <FormControl fullWidth error={!!errors.company_id} disabled>
                <InputLabel id="company-select-label">Company</InputLabel>
                <Select
                  labelId="company-select-label"
                  id="company_id"
                  name="company_id"
                  value={formData.company_id}
                  label="Company"
                  onChange={handleSelectChange}
                  disabled={!!userInfo?.company_id} // Disable when we have a user company
                >
                  {companies.map(company => (
                    <MenuItem 
                      key={company.id} 
                      value={company.id}
                      disabled={Boolean(userInfo?.company_id && company.id !== userInfo.company_id)}
                    >
                      {company.name}
                    </MenuItem>
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
                  {filteredStores.length > 0 ? (
                    filteredStores.map(store => (
                      <MenuItem key={store.id} value={store.id}>{store.name}</MenuItem>
                    ))
                  ) : (
                    stores.map(store => (
                      <MenuItem 
                        key={store.id} 
                        value={store.id}
                        disabled={Boolean(userInfo?.company_id && store.company && store.company.id !== userInfo.company_id)}
                      >
                        {store.name}
                      </MenuItem>
                    ))
                  )}
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
                    <MenuItem key={currency.id} value={currency.id}>{currency.name}</MenuItem>
                  ))}
                </Select>
                {errors.currency_id && <Typography color="error" variant="caption">{errors.currency_id}</Typography>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth error={!!errors.payment_mode_id}>
                <InputLabel id="payment-mode-label">Payment Mode</InputLabel>
                <Select
                  labelId="payment-mode-label"
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
            
            <Grid item xs={12} md={3}>
              <TextField
                name="tax"
                label="Tax Percentage"
                type="number"
                value={formData.tax || '0'}
                onChange={handleChange}
                fullWidth
                InputProps={{ 
                  inputProps: { min: 0, step: 0.01 },
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                helperText="Tax percentage to apply to the sale"
              />
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
                      {(filteredProducts.length > 0 ? filteredProducts : products).map(product => (
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
              
              {formData.products && formData.products.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 2, mb: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">Discount</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.products.map(product => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={product.quantity}
                              onChange={(e) => handleProductChange(product.id, 'quantity', e.target.value)}
                              size="small"
                              InputProps={{ inputProps: { min: 1, style: { textAlign: 'right' } } }}
                              sx={{ width: '80px' }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={product.unitPrice}
                              onChange={(e) => handleProductChange(product.id, 'unitPrice', e.target.value)}
                              size="small"
                              InputProps={{ inputProps: { min: 0, step: 0.01, style: { textAlign: 'right' } } }}
                              sx={{ width: '100px' }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={product.discount}
                              onChange={(e) => handleProductChange(product.id, 'discount', e.target.value)}
                              size="small"
                              InputProps={{ inputProps: { min: 0, step: 0.01, style: { textAlign: 'right' } } }}
                              sx={{ width: '100px' }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            ${((product.quantity * product.unitPrice) - product.discount).toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveProduct(product.id)}
                              color="error"
                            >
                              <TrashIcon size={16} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {/* Calculate subtotal, tax, and total */}
                      <TableRow>
                        <TableCell colSpan={4} align="right"><strong>Subtotal:</strong></TableCell>
                        <TableCell align="right" colSpan={2}>
                          <strong>
                            ${(formData.subtotal || formData.products.reduce((sum, product) => sum + ((product.quantity * product.unitPrice) - product.discount), 0)).toFixed(2)}
                          </strong>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} align="right"><strong>Tax ({formData.tax || 0}%):</strong></TableCell>
                        <TableCell align="right" colSpan={2}>
                          <strong>
                            ${(formData.taxAmount || ((parseFloat(formData.tax) / 100) * (formData.subtotal || formData.products.reduce((sum, product) => sum + ((product.quantity * product.unitPrice) - product.discount), 0)))).toFixed(2)}
                          </strong>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} align="right"><strong>Total:</strong></TableCell>
                        <TableCell align="right" colSpan={2}>
                          <strong>${(formData.totalAmount || ((formData.subtotal || 0) + (formData.taxAmount || 0))).toFixed(2)}</strong>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
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