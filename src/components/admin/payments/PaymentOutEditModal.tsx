'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';

interface PaymentOutData {
  id?: string;
  date: string;
  supplier: string;
  purchaseNo: string;
  amount: number;
  bank: string;
  paymentMethod: string;
  reference?: string;
  note?: string;
}

interface PaymentOutEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: PaymentOutData) => void;
  payment?: PaymentOutData;
  isNew?: boolean;
  suppliers?: Array<{id: string; name: string}>;
}

export default function PaymentOutEditModal({
  open,
  onClose,
  onSave,
  payment = {
    date: new Date().toISOString().split('T')[0],
    supplier: '',
    purchaseNo: '',
    amount: 0,
    bank: '',
    paymentMethod: '',
    reference: '',
    note: ''
  },
  isNew = true,
  suppliers = []
}: PaymentOutEditModalProps): React.JSX.Element {
  const [formData, setFormData] = React.useState<PaymentOutData>({
    date: new Date().toISOString().split('T')[0],
    supplier: '',
    purchaseNo: '',
    amount: 0,
    bank: '',
    paymentMethod: '',
    reference: '',
    note: ''
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  // Mock suppliers data if not provided
  const defaultSuppliers = [
    {id: '1', name: 'ABC Supplier'},
    {id: '2', name: 'XYZ Supplier'},
    {id: '3', name: 'Office Supply Co'},
    {id: '4', name: 'Global Distribution Inc.'}
  ];
  
  const supplierList = suppliers.length ? suppliers : defaultSuppliers;
  
  // Payment methods
  const paymentMethods = [
    'Bank Transfer',
    'Check',
    'Cash',
    'Credit Card',
    'PayPal',
    'Wire Transfer',
    'Other'
  ];

  // Banks
  const banks = [
    'Example Bank',
    'Another Bank',
    'City Bank',
    'National Bank',
    'Other'
  ];
  
  // Reset form data when modal opens with new payment data
  React.useEffect(() => {
    if (open) {
      setFormData(payment);
      setErrors({});
    }
  }, [payment, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      setFormData(prev => ({
        ...prev,
        amount: parseFloat(value) || 0
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
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.purchaseNo) {
      newErrors.purchaseNo = 'Purchase number is required';
    }
    
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    }
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }
    
    if (!formData.bank) {
      newErrors.bank = 'Bank is required';
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isNew ? 'Add Payment Out' : 'Edit Payment Out'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              name="date"
              label="Payment Date"
              type="date"
              fullWidth
              value={formData.date}
              onChange={handleChange}
              error={!!errors.date}
              helperText={errors.date}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
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
              {errors.supplier && <FormHelperText>{errors.supplier}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="purchaseNo"
              label="Purchase Number"
              type="text"
              fullWidth
              value={formData.purchaseNo}
              onChange={handleChange}
              error={!!errors.purchaseNo}
              helperText={errors.purchaseNo}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="amount"
              label="Amount"
              type="number"
              fullWidth
              value={formData.amount || ''}
              onChange={handleChange}
              error={!!errors.amount}
              helperText={errors.amount}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.bank}>
              <InputLabel id="bank-select-label">Bank</InputLabel>
              <Select
                labelId="bank-select-label"
                id="bank"
                name="bank"
                value={formData.bank}
                label="Bank"
                onChange={handleSelectChange}
              >
                {banks.map(bank => (
                  <MenuItem key={bank} value={bank}>{bank}</MenuItem>
                ))}
              </Select>
              {errors.bank && <FormHelperText>{errors.bank}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.paymentMethod}>
              <InputLabel id="payment-method-select-label">Payment Method</InputLabel>
              <Select
                labelId="payment-method-select-label"
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                label="Payment Method"
                onChange={handleSelectChange}
              >
                {paymentMethods.map(method => (
                  <MenuItem key={method} value={method}>{method}</MenuItem>
                ))}
              </Select>
              {errors.paymentMethod && <FormHelperText>{errors.paymentMethod}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="reference"
              label="Reference Number (Optional)"
              type="text"
              fullWidth
              value={formData.reference || ''}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="note"
              label="Note (Optional)"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={formData.note || ''}
              onChange={handleChange}
            />
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
          {isNew ? 'Add Payment' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 