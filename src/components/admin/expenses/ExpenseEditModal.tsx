// @ts-nocheck

'use client';

import React, { useEffect, useState } from 'react';
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
import { ExpenseCreateData, ExpenseCategory } from '@/services/api/financials';
import { TransactionPaymentMode, transactionsApi } from '@/services/api/transactions';
import { useCurrentUser } from '@/hooks/use-auth';
import CircularProgress from '@mui/material/CircularProgress';
import { companiesApi, Currency, Company } from '@/services/api/companies';

interface ExpenseEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ExpenseCreateData & { id?: string }) => void;
  expense: Partial<ExpenseCreateData> & { id?: string };
  categories: ExpenseCategory[];
}

export default function ExpenseEditModal({
  open,
  onClose,
  onSave,
  expense,
  categories
}: ExpenseEditModalProps): React.JSX.Element {
  const [formData, setFormData] = useState<Partial<ExpenseCreateData> & { id?: string }>(expense);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentModes, setPaymentModes] = useState<TransactionPaymentMode[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo, isLoading: isUserLoading } = useCurrentUser();
  
  // Fetch payment modes, currencies, and companies
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [modesData, currencyData, companiesData] = await Promise.all([
          transactionsApi.getPaymentModes(),
          companiesApi.getCurrencies(),
          companiesApi.getCompanies(),
        ]);
        setPaymentModes(modesData);
        setCurrencies(currencyData);
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // Reset form data when modal opens with new expense data
  useEffect(() => {
    if (open) {
      console.log('Modal opened, userInfo:', userInfo);
      console.log('Companies:', companies);
      
      let companyId = '';
      
      // Try to get company ID from various sources
      if (userInfo && userInfo.company_id) {
        console.log('Setting company ID from userInfo:', userInfo.company_id);
        companyId = userInfo.company_id;
      } else if (expense.company) {
        console.log('Using expense.company:', expense.company);
        companyId = expense.company;
      } else if (companies.length > 0) {
        console.log('Using first company ID:', companies[0].id);
        companyId = companies[0].id;
      }
      
      setFormData({
        ...expense,
        company: companyId
      });
      
      setErrors({});
    }
  }, [expense, open, userInfo, companies]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    console.log('Validating form with data:', formData);
    
    if (!formData.expense_category) {
      console.log('Validation failed: expense_category is missing');
      newErrors.expense_category = 'Category is required';
    }
    
    if (!formData.amount) {
      console.log('Validation failed: amount is missing or zero');
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      console.log('Validation failed: amount is not greater than zero', formData.amount);
      newErrors.amount = 'Amount must be greater than zero';
    }
    
    if (!formData.description) {
      console.log('Validation failed: description is missing');
      newErrors.description = 'Description is required';
    }
    
    if (!formData.currency) {
      console.log('Validation failed: currency is missing');
      newErrors.currency = 'Currency is required';
    }
    
    if (!formData.payment_mode) {
      console.log('Validation failed: payment_mode is missing');
      newErrors.payment_mode = 'Payment method is required';
    }
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Validation result:', isValid ? 'PASSED' : 'FAILED', newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    console.log('handleSubmit called, validating form');
    if (validateForm()) {
      console.log('Form validation passed');
      
      let companyId = formData.company;
      
      // If company ID is missing, try to find it
      if (!companyId) {
        if (userInfo && userInfo.company_id) {
          companyId = userInfo.company_id;
        } else if (companies.length > 0) {
          companyId = companies[0].id;
        }
      }
      
      if (!companyId) {
        console.log('Company ID missing');
        setErrors(prev => ({
          ...prev,
          company: "Unable to determine company ID. Please try again later."
        }));
        return;
      }
      
      // Make sure we have all required fields before submitting
      const completeData: ExpenseCreateData & { id?: string } = {
        company: companyId,
        expense_category: formData.expense_category || '',
        amount: formData.amount || '',
        description: formData.description || '',
        currency: formData.currency || '',
        payment_mode: formData.payment_mode || '',
        ...(formData.id ? { id: formData.id } : {})
      };
      console.log('Submitting complete data:', completeData);
      onSave(completeData);
    } else {
      console.log('Form validation failed, errors:', errors);
    }
  };

  // Get currency code for display
  const getCurrencyCode = (currencyId: string) => {
    const currency = currencies.find(c => c.id === currencyId);
    return currency ? currency.code : '';
  };

  if (isLoading || isUserLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{expense.id ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.expense_category}>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                id="expense_category"
                name="expense_category"
                value={formData.expense_category || ''}
                label="Category"
                onChange={handleSelectChange}
              >
                <MenuItem value="">Select a Category</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.expense_category && <FormHelperText>{errors.expense_category}</FormHelperText>}
            </FormControl>
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
          
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={2}
              value={formData.description || ''}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.currency}>
              <InputLabel id="currency-select-label">Currency</InputLabel>
              <Select
                labelId="currency-select-label"
                id="currency"
                name="currency"
                value={formData.currency || ''}
                label="Currency"
                onChange={handleSelectChange}
              >
                <MenuItem value="">Select a Currency</MenuItem>
                {currencies.map(currency => (
                  <MenuItem key={currency.id} value={currency.id}>
                    {currency.code}
                  </MenuItem>
                ))}
              </Select>
              {errors.currency && <FormHelperText>{errors.currency}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.payment_mode}>
              <InputLabel id="payment-method-select-label">Payment Method</InputLabel>
              <Select
                labelId="payment-method-select-label"
                id="payment_mode"
                name="payment_mode"
                value={formData.payment_mode || ''}
                label="Payment Method"
                onChange={handleSelectChange}
              >
                <MenuItem value="">Select a Payment Method</MenuItem>
                {paymentModes.map(mode => (
                  <MenuItem key={mode.id} value={mode.id}>
                    {mode.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.payment_mode && <FormHelperText>{errors.payment_mode}</FormHelperText>}
            </FormControl>
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
          {expense.id ? 'Save Changes' : 'Add Expense'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 