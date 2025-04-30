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

interface ExpenseData {
  id?: number;
  category: string;
  amount: number;
  date: string;
  user: string;
  description?: string;
  reference?: string;
}

interface ExpenseEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ExpenseData) => void;
  expense?: ExpenseData;
  isNew?: boolean;
  users?: Array<{id: string; name: string}>;
}

export default function ExpenseEditModal({
  open,
  onClose,
  onSave,
  expense = {
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    user: '',
    description: '',
    reference: ''
  },
  isNew = true,
  users = []
}: ExpenseEditModalProps): React.JSX.Element {
  const [formData, setFormData] = React.useState<ExpenseData>({
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    user: '',
    description: '',
    reference: ''
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  // Mock users data if not provided
  const defaultUsers = [
    {id: '1', name: 'Salesman'},
    {id: '2', name: 'Mafalda Bahringer DDS'},
    {id: '3', name: 'Admin User'},
    {id: '4', name: 'Guest User'}
  ];
  
  const userList = users.length ? users : defaultUsers;
  
  // Expense categories
  const categories = [
    'Travel',
    'Utilities',
    'Office Supplies',
    'Rent',
    'Salaries',
    'Repairs',
    'Marketing',
    'Insurance',
    'Other'
  ];
  
  // Reset form data when modal opens with new expense data
  React.useEffect(() => {
    if (open) {
      setFormData(expense);
      setErrors({});
    }
  }, [expense, open]);

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
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.user) {
      newErrors.user = 'User is required';
    }
    
    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
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
      <DialogTitle>{isNew ? 'Add New Expense' : 'Edit Expense'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                id="category"
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleSelectChange}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
              {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="date"
              label="Expense Date"
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
            <FormControl fullWidth error={!!errors.user}>
              <InputLabel id="user-select-label">User</InputLabel>
              <Select
                labelId="user-select-label"
                id="user"
                name="user"
                value={formData.user}
                label="User"
                onChange={handleSelectChange}
              >
                {userList.map(user => (
                  <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                ))}
              </Select>
              {errors.user && <FormHelperText>{errors.user}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description (Optional)"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={formData.description || ''}
              onChange={handleChange}
            />
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
        >
          {isNew ? 'Add Expense' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 