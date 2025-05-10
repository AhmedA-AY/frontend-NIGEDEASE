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
import { transactionsApi, Supplier, TransactionPaymentMode } from '@/services/api/transactions';
import { inventoryApi, Product, InventoryStore } from '@/services/api/inventory';
import { companiesApi, Company, Currency } from '@/services/api/companies';
import { useCurrentUser } from '@/hooks/use-auth';

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

export default function PurchaseEditModal({
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
}: PurchaseEditModalProps): React.JSX.Element {
  const [formData, setFormData] = React.useState<PurchaseData>({
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
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = React.useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stores, setStores] = useState<InventoryStore[]>([]);
  const [filteredStores, setFilteredStores] = useState<InventoryStore[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [paymentModes, setPaymentModes] = useState<TransactionPaymentMode[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Get current user's company
  const { userInfo, isLoading: isLoadingUser } = useCurrentUser();
  
  // Fetch data when modal opens
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [
            suppliersData, 
            productsData, 
            companiesData, 
            storesData, 
            currenciesData, 
            paymentModesData
          ] = await Promise.all([
            transactionsApi.getSuppliers(),
            inventoryApi.getProducts(),
            companiesApi.getCompanies(),
            inventoryApi.getStores(),
            companiesApi.getCurrencies(),
            transactionsApi.getPaymentModes()
          ]);
          
          setSuppliers(suppliersData);
          setProducts(productsData);
          setCompanies(companiesData);
          setStores(storesData);
          setCurrencies(currenciesData);
          setPaymentModes(paymentModesData);
          
          // Filter stores by user's company
          if (userInfo?.company_id) {
            const companyStores = storesData.filter(store => 
              store.company && store.company.id === userInfo.company_id
            );
            setFilteredStores(companyStores);
            
            // Filter products by user's company
            const companyProducts = productsData.filter(product => 
              product.company && product.company.id === userInfo.company_id
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
      
      // Filter products by company
      if (products.length > 0) {
        const companyProducts = products.filter(product => 
          product.company && product.company.id === userInfo.company_id
        );
        setFilteredProducts(companyProducts);
      }
    }
  }, [userInfo, stores, products]);
  
  // Reset form data when modal opens with new purchase data
  React.useEffect(() => {
    if (open) {
      // Update purchase data with user's company if creating new
      const updatedPurchase = { ...purchase };
      
      // If creating new, use the current user's company_id
      if (!updatedPurchase.id && userInfo?.company_id) {
        updatedPurchase.company_id = userInfo.company_id;
      }
      
      setFormData(updatedPurchase);
      setErrors({});
      calculateTotals(updatedPurchase.products);
    }
  }, [purchase, open, userInfo]);
  
  const calculateTotals = (productItems: ProductItem[]) => {
    let total = 0;
    
    productItems.forEach(item => {
      const subtotal = (item.quantity * item.unitPrice) - item.discount + item.tax;
      total += subtotal;
    });
    
    setFormData(prev => ({
      ...prev,
      totalAmount: total,
      dueAmount: total - prev.paidAmount,
      paymentStatus: prev.paidAmount >= total ? 'Paid' : (prev.paidAmount > 0 ? 'Partially Paid' : 'Unpaid')
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
    
    // Map the status to is_credit boolean
    if (name === 'status') {
      setFormData(prev => ({ 
        ...prev, 
        is_credit: value === 'Credit' || value === 'Pending'
      }));
    }
  };

  const handleAddProduct = () => {
    if (!selectedProduct) return;
    
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;
    
    const unitPrice = product.purchase_price ? parseFloat(product.purchase_price) : 0;
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
    
    const updatedProducts = [...formData.products, newProduct];
    setFormData(prev => ({ ...prev, products: updatedProducts }));
    calculateTotals(updatedProducts);
    setSelectedProduct('');
  };

  const handleRemoveProduct = (id: string) => {
    const updatedProducts = formData.products.filter(product => product.id !== id);
    setFormData(prev => ({ ...prev, products: updatedProducts }));
    calculateTotals(updatedProducts);
  };

  const handleProductChange = (id: string, field: keyof ProductItem, value: any) => {
    const updatedProducts = formData.products.map(product => {
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.supplier) {
      newErrors.supplier = 'Supplier is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (formData.products.length === 0) {
      newErrors.products = 'At least one product is required';
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
      <DialogTitle>{isNew ? 'Create New Purchase' : 'Edit Purchase'}</DialogTitle>
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
                label="Purchase Date"
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
              <FormControl fullWidth error={!!errors.supplier}>
                <InputLabel id="supplier-select-label">Supplier</InputLabel>
                <Select
                  labelId="supplier-select-label"
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  label="Supplier"
                  onChange={handleSelectChange}
                >
                  {suppliers.map(supplier => (
                    <MenuItem key={supplier.id} value={supplier.id}>{supplier.name}</MenuItem>
                  ))}
                </Select>
                {errors.supplier && <Typography color="error" variant="caption">{errors.supplier}</Typography>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status"
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="Ordered">Ordered</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Received">Received</MenuItem>
                  <MenuItem value="Credit">Credit</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                </Select>
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
                  {formData.products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No products added yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    formData.products.map((product) => (
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
                  <Typography variant="subtitle1" color={formData.dueAmount > 0 ? 'error' : 'success'}>
                    ${formData.dueAmount.toFixed(2)}
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