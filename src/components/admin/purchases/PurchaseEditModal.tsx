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
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';

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
}

interface PurchaseEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: PurchaseData) => void;
  purchase?: PurchaseData;
  isNew?: boolean;
  suppliers?: Array<{id: string; name: string}>;
  products?: Array<{id: string; name: string; price: number; tax: number}>;
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
    paymentStatus: 'Unpaid'
  },
  isNew = true,
  suppliers = [],
  products = []
}: PurchaseEditModalProps): React.JSX.Element {
  const [formData, setFormData] = React.useState<PurchaseData>({
    date: new Date().toISOString().split('T')[0],
    supplier: '',
    status: 'Ordered',
    products: [],
    totalAmount: 0,
    paidAmount: 0,
    dueAmount: 0,
    paymentStatus: 'Unpaid'
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = React.useState<string>('');
  
  // Mock suppliers data if not provided
  const defaultSuppliers = [
    {id: '1', name: 'Northern Tool Supply'},
    {id: '2', name: 'Wholesale Furniture Co.'},
    {id: '3', name: 'Tech Distributors Inc.'},
    {id: '4', name: 'Global Office Supplies'},
    {id: '5', name: 'Quality Materials Ltd.'},
    {id: '6', name: 'National Electronics'}
  ];
  
  // Mock products data if not provided
  const defaultProducts = [
    {id: 'p1', name: 'Office Chair (Bulk)', price: 89.99, tax: 5},
    {id: 'p2', name: 'LED Desk Lamp (Bulk)', price: 29.50, tax: 3},
    {id: 'p3', name: 'Computer Mouse (Bulk)', price: 12.99, tax: 2},
    {id: 'p4', name: 'Computer Monitor (Bulk)', price: 179.99, tax: 8},
    {id: 'p5', name: 'Keyboard (Bulk)', price: 45.99, tax: 4}
  ];
  
  const supplierList = suppliers.length ? suppliers : defaultSuppliers;
  const prodList = products.length ? products : defaultProducts;
  
  // Reset form data when modal opens with new purchase data
  React.useEffect(() => {
    if (open) {
      setFormData(purchase);
      setErrors({});
      calculateTotals(purchase.products);
    }
  }, [purchase, open]);
  
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
    
    if (name === 'selectedProduct') {
      setSelectedProduct(value);
    }
  };

  const handleAddProduct = () => {
    if (!selectedProduct) return;
    
    const product = prodList.find(p => p.id === selectedProduct);
    if (!product) return;
    
    const newProduct: ProductItem = {
      id: product.id,
      name: product.name,
      quantity: 1,
      unitPrice: product.price,
      discount: 0,
      tax: (product.price * product.tax / 100),
      subtotal: product.price + (product.price * product.tax / 100)
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
                {supplierList.map(supplier => (
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
                <MenuItem value="Received">Received</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
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
                    {prodList.map(product => (
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
                        ? 'warning.main' 
                        : 'error'
                  }
                >
                  {formData.paymentStatus}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
        >
          {isNew ? 'Create Purchase' : 'Update Purchase'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 