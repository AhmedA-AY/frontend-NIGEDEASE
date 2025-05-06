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
import CircularProgress from '@mui/material/CircularProgress';
import { 
  Product, 
  ProductCategory,
  ProductUnit,
  ProductCreateData, 
  inventoryApi 
} from '@/services/api/inventory';
import { useCurrentUser } from '@/hooks/use-auth';
import { companiesApi } from '@/services/api/companies';
import { clothingsApi } from '@/services/api/clothings';

interface ProductEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ProductCreateData & { id?: string }) => void;
  product: Partial<ProductCreateData> & { id?: string };
  categories: ProductCategory[];
}

export default function ProductEditModal({
  open,
  onClose,
  onSave,
  product,
  categories
}: ProductEditModalProps): React.JSX.Element {
  const [formData, setFormData] = useState<Partial<ProductCreateData> & { id?: string }>(product);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [productUnits, setProductUnits] = useState<ProductUnit[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useCurrentUser();
  const [companies, setCompanies] = useState<any[]>([]);
  
  // Fetch required data
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [companiesData, unitsData, colorsData, collectionsData] = await Promise.all([
          companiesApi.getCompanies(),
          inventoryApi.getProductUnits(),
          clothingsApi.getColors(),
          clothingsApi.getCollections()
        ]);
        setCompanies(companiesData);
        setProductUnits(unitsData);
        setColors(colorsData);
        setCollections(collectionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // Reset form data when modal opens with new product data
  useEffect(() => {
    if (open) {
      console.log('Modal opened, userInfo:', userInfo);
      console.log('Companies:', companies);
      
      let companyId = '';
      
      // Try to get company ID from various sources
      if (userInfo && userInfo.company_id) {
        console.log('Setting company ID from userInfo:', userInfo.company_id);
        companyId = userInfo.company_id;
      } else if (product.company_id) {
        console.log('Using product.company_id:', product.company_id);
        companyId = product.company_id;
      } else if (companies.length > 0) {
        console.log('Using first company ID:', companies[0].id);
        companyId = companies[0].id;
      }
      
      setFormData({
        ...product,
        company_id: companyId,
        purchase_price: product.purchase_price || '',
        sale_price: product.sale_price || ''
      });
      
      setErrors({});
    }
  }, [product, open, userInfo, companies]);

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
    
    if (!formData.name) {
      console.log('Validation failed: name is missing');
      newErrors.name = 'Name is required';
    }
    
    if (!formData.product_category_id) {
      console.log('Validation failed: product_category_id is missing');
      newErrors.product_category_id = 'Category is required';
    }
    
    if (!formData.product_unit_id) {
      console.log('Validation failed: product_unit_id is missing');
      newErrors.product_unit_id = 'Unit is required';
    }
    
    if (!formData.description) {
      console.log('Validation failed: description is missing');
      newErrors.description = 'Description is required';
    }
    
    // Validate prices if provided
    if (formData.purchase_price && isNaN(Number(formData.purchase_price))) {
      newErrors.purchase_price = 'Purchase price must be a valid number';
    }
    
    if (formData.sale_price && isNaN(Number(formData.sale_price))) {
      newErrors.sale_price = 'Sale price must be a valid number';
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
      
      let companyId = formData.company_id;
      
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
          company_id: "Unable to determine company ID. Please try again later."
        }));
        return;
      }
      
      // Make sure we have all required fields before submitting
      const completeData: ProductCreateData & { id?: string } = {
        company_id: companyId,
        name: formData.name || '',
        description: formData.description || '',
        product_category_id: formData.product_category_id || '',
        product_unit_id: formData.product_unit_id || '',
        image: formData.image || '',
        purchase_price: formData.purchase_price || '',
        sale_price: formData.sale_price || '',
        color_id: formData.color_id || undefined,
        collection_id: formData.collection_id || undefined,
        ...(formData.id ? { id: formData.id } : {})
      };
      console.log('Submitting complete data:', completeData);
      onSave(completeData);
    } else {
      console.log('Form validation failed, errors:', errors);
    }
  };

  if (isLoading) {
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
      <DialogTitle>{product.id ? 'Edit Product' : 'Add Product'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              name="name"
              label="Product Name"
              type="text"
              fullWidth
              value={formData.name || ''}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.product_category_id}>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                id="product_category_id"
                name="product_category_id"
                value={formData.product_category_id || ''}
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
              {errors.product_category_id && <FormHelperText>{errors.product_category_id}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.product_unit_id}>
              <InputLabel id="unit-select-label">Unit</InputLabel>
              <Select
                labelId="unit-select-label"
                id="product_unit_id"
                name="product_unit_id"
                value={formData.product_unit_id || ''}
                label="Unit"
                onChange={handleSelectChange}
              >
                <MenuItem value="">Select a Unit</MenuItem>
                {productUnits.map(unit => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.product_unit_id && <FormHelperText>{errors.product_unit_id}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="image"
              label="Image URL"
              type="text"
              fullWidth
              value={formData.image || ''}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="purchase_price"
              label="Purchase Price"
              type="number"
              fullWidth
              value={formData.purchase_price || ''}
              onChange={handleChange}
              error={!!errors.purchase_price}
              helperText={errors.purchase_price}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="sale_price"
              label="Sale Price"
              type="number"
              fullWidth
              value={formData.sale_price || ''}
              onChange={handleChange}
              error={!!errors.sale_price}
              helperText={errors.sale_price}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="color-select-label">Color</InputLabel>
              <Select
                labelId="color-select-label"
                id="color_id"
                name="color_id"
                value={formData.color_id || ''}
                label="Color"
                onChange={handleSelectChange}
              >
                <MenuItem value="">No Color</MenuItem>
                {colors.map(color => (
                  <MenuItem key={color.id} value={color.id}>
                    {color.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="collection-select-label">Collection</InputLabel>
              <Select
                labelId="collection-select-label"
                id="collection_id"
                name="collection_id"
                value={formData.collection_id || ''}
                label="Collection"
                onChange={handleSelectChange}
              >
                <MenuItem value="">No Collection</MenuItem>
                {collections.map(collection => (
                  <MenuItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={formData.description || ''}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
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
          {product.id ? 'Save Changes' : 'Add Product'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 