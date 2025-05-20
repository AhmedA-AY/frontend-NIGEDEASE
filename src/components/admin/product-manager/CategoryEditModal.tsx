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
import { useStore } from '@/contexts/store-context';

interface CategoryData {
  id?: string;
  name: string;
  description?: string;
  store_id?: string;
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
  const { selectedStore } = useStore();
  const { enqueueSnackbar } = useSnackbar();
  
  // Reset form data when modal opens with new category data
  React.useEffect(() => {
    if (open) {
      // If store_id isn't provided, try to get it from selectedStore
      let storeId = category.store_id;
      
      if (!storeId && selectedStore) {
        storeId = selectedStore.id;
      }
      
      setFormData({
        ...category,
        store_id: storeId
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [category, open, selectedStore]);

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
    
    if (!formData.store_id) {
      newErrors.store_id = 'Store ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('Submitting category with data:', formData);
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Make sure we have a store_id
        if (!formData.store_id) {
          if (selectedStore) {
            formData.store_id = selectedStore.id;
          } else {
            throw new Error('Store ID is required');
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
          store_id: formData.store_id
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
        
        {errors.store_id && (
          <Box sx={{ color: 'error.main', mb: 2, fontSize: '0.75rem' }}>
            {errors.store_id}
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