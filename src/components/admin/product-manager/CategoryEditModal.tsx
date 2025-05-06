'use client';

import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useSnackbar } from 'notistack';
import { useCurrentUser } from '@/hooks/use-auth';
import { companiesApi } from '@/services/api/companies';

interface CategoryData {
  id?: string;
  name: string;
  description?: string;
  company_id?: string;
}

interface CategoryEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CategoryData) => void;
  category?: CategoryData;
  isNew?: boolean;
}

export default function CategoryEditModal({
  open,
  onClose,
  onSave,
  category = { name: '', description: '' },
  isNew = true
}: CategoryEditModalProps): React.JSX.Element {
  const [formData, setFormData] = React.useState<CategoryData>({ name: '', description: '' });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { userInfo } = useCurrentUser();
  const { enqueueSnackbar } = useSnackbar();
  const [companies, setCompanies] = React.useState<any[]>([]);
  
  // Fetch companies if needed
  useEffect(() => {
    if (open && !category.company_id) {
      const fetchCompanies = async () => {
        try {
          const companiesData = await companiesApi.getCompanies();
          setCompanies(companiesData);
        } catch (error) {
          console.error('Error fetching companies:', error);
        }
      };
      
      fetchCompanies();
    }
  }, [open, category.company_id]);
  
  // Reset form data when modal opens with new category data
  React.useEffect(() => {
    if (open) {
      // If company_id isn't provided, try to get it from userInfo or fetch it
      let companyId = category.company_id;
      
      if (!companyId) {
        if (userInfo?.company_id) {
          companyId = userInfo.company_id;
        } else if (companies.length > 0) {
          companyId = companies[0].id;
        }
      }
      
      setFormData({
        ...category,
        company_id: companyId
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [category, open, userInfo, companies]);

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    if (!formData.company_id) {
      newErrors.company_id = 'Company ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('Submitting category with data:', formData);
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Make sure we have a company_id
        if (!formData.company_id) {
          if (userInfo?.company_id) {
            formData.company_id = userInfo.company_id;
          } else if (companies.length > 0) {
            formData.company_id = companies[0].id;
          } else {
            throw new Error('Company ID is required');
          }
        }
        
        // Ensure we have a description (API requires it)
        if (!formData.description) {
          formData.description = '';
        }
        
        await onSave({
          ...formData,
          id: formData.id,
          name: formData.name.trim(),
          description: formData.description,
          company_id: formData.company_id
        });
        
        console.log('Category saved successfully');
      } catch (error) {
        console.error('Error submitting category:', error);
        enqueueSnackbar('Failed to save category', { variant: 'error' });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('Validation failed with errors:', errors);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isNew ? 'Add New Category' : 'Edit Category'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Category Name"
          type="text"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          sx={{ mb: 2 }}
          disabled={isSubmitting}
        />
        
        <TextField
          margin="dense"
          name="description"
          label="Description (Optional)"
          type="text"
          fullWidth
          multiline
          rows={3}
          value={formData.description || ''}
          onChange={handleChange}
          sx={{ mb: 3 }}
          disabled={isSubmitting}
        />
        
        {errors.company_id && (
          <Box sx={{ color: 'error.main', mb: 2, fontSize: '0.75rem' }}>
            {errors.company_id}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          sx={{ 
            bgcolor: '#0ea5e9', 
            '&:hover': { bgcolor: '#0284c7' },
            minWidth: 100 
          }}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting ? 'Saving...' : isNew ? 'Add Category' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 