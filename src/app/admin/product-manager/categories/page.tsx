'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { CloudArrowUp as CloudArrowUpIcon } from '@phosphor-icons/react/dist/ssr/CloudArrowUp';
import CategoryEditModal from '@/components/admin/product-manager/CategoryEditModal';
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';
import { paths } from '@/paths';
import { ProductCategory, inventoryApi, ProductCategoryCreateData, ProductCategoryUpdateData } from '@/services/api/inventory';
import { useSnackbar } from 'notistack';
import { useStore } from '@/contexts/store-context';

export default function CategoriesPage(): React.JSX.Element {
  const { selectedStore } = useStore();
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentCategory, setCurrentCategory] = React.useState<{ id?: string; name: string; description?: string; logoUrl?: string; hasExpand?: boolean; company_id?: string } | null>(null);
  const [categoryToDelete, setCategoryToDelete] = React.useState<string | null>(null);
  const [categories, setCategories] = React.useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  
  // Fetch categories
  const fetchCategories = React.useCallback(async () => {
    if (!selectedStore) {
      setError('No store selected. Please select a store first.');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await inventoryApi.getProductCategories(selectedStore.id);
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
      enqueueSnackbar('Failed to load categories', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar, selectedStore]);

  React.useEffect(() => {
    if (selectedStore) {
      fetchCategories();
    }
  }, [fetchCategories, selectedStore]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedCategories(categories.map(category => category.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter(categoryId => categoryId !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };
  
  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete && selectedStore) {
      setIsLoading(true);
      try {
        await inventoryApi.deleteProductCategory(selectedStore.id, categoryToDelete);
        enqueueSnackbar('Category deleted successfully', { variant: 'success' });
        await fetchCategories();
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
      } catch (err) {
        console.error('Error deleting category:', err);
        enqueueSnackbar('Failed to delete category', { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (id: string) => {
    const categoryToEdit = categories.find(category => category.id === id);
    if (categoryToEdit) {
      setCurrentCategory({
        id: categoryToEdit.id,
        name: categoryToEdit.name,
        description: categoryToEdit.description,
        company_id: categoryToEdit.company.id
      });
      setIsCategoryModalOpen(true);
    }
  };

  const handleAddCategory = () => {
    // Get company ID from the first category (they should all be from the same company)
    const companyId = categories.length > 0 ? categories[0].company.id : '';
    
    setCurrentCategory({
      name: '',
      description: '',
      company_id: companyId
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (categoryData: { id?: string; name: string; description?: string; company_id?: string }) => {
    if (!selectedStore) {
      enqueueSnackbar('No store selected', { variant: 'error' });
      return;
    }
    
    setIsLoading(true);
    console.log('Saving category with data:', categoryData);
    
    try {
      if (!categoryData.company_id) {
        throw new Error('Company ID is required');
      }
      
      if (categoryData.id) {
        // Update existing category
        console.log('Updating category with ID:', categoryData.id);
        const updateData: ProductCategoryUpdateData = {
          company_id: categoryData.company_id,
          name: categoryData.name,
          description: categoryData.description || ''
        };
        await inventoryApi.updateProductCategory(selectedStore.id, categoryData.id, updateData);
        enqueueSnackbar('Category updated successfully', { variant: 'success' });
      } else {
        // Add new category
        console.log('Creating new category with data:', {
          company_id: categoryData.company_id,
          name: categoryData.name,
          description: categoryData.description || ''
        });
        
        const createData: ProductCategoryCreateData = {
          company_id: categoryData.company_id,
          name: categoryData.name,
          description: categoryData.description || ''
        };
        
        const result = await inventoryApi.createProductCategory(selectedStore.id, createData);
        console.log('Category created successfully, result:', result);
        enqueueSnackbar('Category created successfully', { variant: 'success' });
      }
      
      await fetchCategories();
      setIsCategoryModalOpen(false);
    } catch (err: any) {
      console.error('Error saving category:', err);
      
      // More detailed error message
      let errorMessage = 'Failed to save category';
      
      if (err.response && err.response.data) {
        // Try to extract error message from API response
        const errorData = err.response.data;
        console.error('API error response:', errorData);
        
        if (typeof errorData === 'object') {
          const errorMessages = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
          
          errorMessage = `API Error: ${errorMessages}`;
        } else if (typeof errorData === 'string') {
          errorMessage = `API Error: ${errorData}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.admin.dashboard },
    { label: 'Product Manager', url: paths.admin.productManager },
    { label: 'Categories', url: paths.admin.categories },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Categories</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <Box component="span" sx={{ mx: 0.5 }}>-</Box>}
              <Typography 
                component="a" 
                href={item.url} 
                variant="body2" 
                color={index === breadcrumbItems.length - 1 ? 'text.primary' : 'inherit'}
                sx={{ textDecoration: 'none' }}
              >
                {item.label}
              </Typography>
            </React.Fragment>
          ))}
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button 
          variant="contained" 
          startIcon={<PlusIcon weight="bold" />}
          sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
          onClick={handleAddCategory}
          disabled={isLoading}
        >
          Add New Category
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<CloudArrowUpIcon weight="bold" />}
          disabled={isLoading}
        >
          Import Categories
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      {/* Categories Table */}
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={categories.length > 0 && selectedCategories.length === categories.length}
                  indeterminate={selectedCategories.length > 0 && selectedCategories.length < categories.length}
                  onChange={handleSelectAll}
                  disabled={isLoading}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  <Typography variant="body2" display="inline">
                    Loading categories...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2">
                    No categories found. Create your first category.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleSelectOne(category.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {category.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(category.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEdit(category.id)}
                        color="primary"
                      >
                        <PencilSimpleIcon size={20} />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete(category.id)}
                        color="error"
                      >
                        <TrashIcon size={20} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Modals */}
      <CategoryEditModal
        open={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        category={currentCategory || undefined}
        isNew={!currentCategory?.id}
      />
      
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
      />
    </Box>
  );
} 