'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

interface BrandData {
  id?: string;
  name: string;
  description?: string;
  logoUrl?: string;
}

interface BrandEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: BrandData) => void;
  brand?: BrandData;
  isNew?: boolean;
}

export default function BrandEditModal({
  open,
  onClose,
  onSave,
  brand = { name: '', description: '', logoUrl: '' },
  isNew = true
}: BrandEditModalProps): React.JSX.Element {
  const [formData, setFormData] = React.useState<BrandData>({ name: '', description: '', logoUrl: '' });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [logoPreview, setLogoPreview] = React.useState<string>('');
  
  // Reset form data when modal opens with new brand data
  React.useEffect(() => {
    if (open) {
      setFormData(brand);
      setLogoPreview(brand.logoUrl || '');
      setErrors({});
    }
  }, [brand, open]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target) {
          const logoUrl = event.target.result as string;
          setLogoPreview(logoUrl);
          setFormData(prev => ({ ...prev, logoUrl }));
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Brand name is required';
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isNew ? 'Add New Brand' : 'Edit Brand'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Brand Name"
          type="text"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          sx={{ mb: 2 }}
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
        />
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Brand Logo
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            {logoPreview ? (
              <Box
                component="img"
                src={logoPreview}
                alt="Brand Logo Preview"
                sx={{
                  width: 100,
                  height: 100,
                  objectFit: 'contain',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  p: 1
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  bgcolor: '#f5f5f5'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No logo
                </Typography>
              </Box>
            )}
            
            <Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon weight="bold" />}
                sx={{ mb: 1 }}
              >
                Upload Logo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              <Typography variant="caption" display="block" color="text.secondary">
                Recommended size: 200x200px. Max file size: 2MB.
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
        >
          {isNew ? 'Add Brand' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 