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

interface PaymentInData {
  id?: string;
  date: string;
  customer: string;
  invoiceNo: string;
  amount: number;
  bank: string;
  paymentMethod: string;
  reference?: string;
  note?: string;
}

interface PaymentInEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: PaymentInData) => void;
  payment?: PaymentInData;
  isNew?: boolean;
  customers?: Array<{id: string; name: string}>;
}

export default function PaymentInEditModal({
  open,
  onClose,
  onSave,
  payment = {
    date: new Date().toISOString().split('T')[0],
    customer: '',
    invoiceNo: '',
    amount: 0,
    bank: '',
    paymentMethod: '',
    reference: '',
    note: ''
  },
  isNew = true,
  customers = []
}: PaymentInEditModalProps): React.JSX.Element {
  const [formData, setFormData] = React.useState<PaymentInData>({
    date: new Date().toISOString().split('T')[0],
    customer: '',
    invoiceNo: '',
    amount: 0,
    bank: '',
    paymentMethod: '',
    reference: '',
    note: ''
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  // Mock customers data if not provided
  const defaultCustomers = [
    {id: '1', name: 'Example Customer'},
    {id: '2', name: 'John Doe'},
    {id: '3', name: 'Jane Smith'},
    {id: '4', name: 'Acme Corp.'}
  ];
  
  const customerList = customers.length ? customers : defaultCustomers;
  
  // Payment methods
  const paymentMethods = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'Check',
    'PayPal',
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
    
    if (!formData.customer) {
      newErrors.customer = 'Customer is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.invoiceNo) {
      newErrors.invoiceNo = 'Invoice number is required';
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
      <DialogTitle>{isNew ? 'Add Payment In' : 'Edit Payment In'}</DialogTitle>
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
                {customerList.map(customer => (
                  <MenuItem key={customer.id} value={customer.id}>{customer.name}</MenuItem>
                ))}
              </Select>
              {errors.customer && <FormHelperText>{errors.customer}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="invoiceNo"
              label="Invoice Number"
              type="text"
              fullWidth
              value={formData.invoiceNo}
              onChange={handleChange}
              error={!!errors.invoiceNo}
              helperText={errors.invoiceNo}
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