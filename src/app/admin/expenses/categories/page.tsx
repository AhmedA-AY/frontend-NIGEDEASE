'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { TrashSimple as TrashSimpleIcon } from '@phosphor-icons/react/dist/ssr/TrashSimple';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useSnackbar } from 'notistack';
import format from 'date-fns/format';

import { financialsApi, ExpenseCategory, ExpenseCategoryCreateData, ExpenseCategoryUpdateData } from '@/services/api/financials';
import { useCurrentUser } from '@/hooks/use-auth';
import { paths } from '@/paths';
import { companiesApi } from '@/services/api/companies';
import { useStore } from '@/contexts/store-context';
import ExpenseCategoryEditModal from '@/components/admin/expenses/ExpenseCategoryEditModal';
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';

// Simple breadcrumbs component
interface BreadcrumbsItem {
  label: string;
  url: string;
}

interface BreadcrumbsPathProps {
  items: BreadcrumbsItem[];
}

const BreadcrumbsPath: React.FC<BreadcrumbsPathProps> = ({ items }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 3 }}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <Box component="span" sx={{ mx: 0.5 }}>-</Box>}
          <Typography 
            component="a" 
            href={item.url} 
            variant="body2" 
            color={index === items.length - 1 ? 'text.primary' : 'inherit'}
            sx={{ textDecoration: 'none' }}
          >
            {item.label}
          </Typography>
        </React.Fragment>
      ))}
    </Box>
  );
};

export default function ExpenseCategoriesPage(): React.JSX.Element {
  const { userInfo, isLoading: isLoadingUser } = useCurrentUser();
  const { enqueueSnackbar } = useSnackbar();
  const { selectedStore } = useStore();
  
  // State
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<ExpenseCategory | undefined>();
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    if (!selectedStore) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await financialsApi.getExpenseCategories(selectedStore.id);
      console.log("Categories data:", data);
      setCategories(data);
    } catch (err) {
      console.error('Error fetching expense categories:', err);
      setError('Failed to load expense categories');
      enqueueSnackbar('Failed to load expense categories', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar, selectedStore]);

  useEffect(() => {
    if (selectedStore) {
      fetchCategories();
    }
  }, [fetchCategories, selectedStore]);

  // Handlers
  const handleAddNew = () => {
    setCategoryToEdit(undefined);
    setIsEditModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    setCategoryToEdit(category);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async (data: Partial<ExpenseCategory>) => {
    if (!selectedStore) {
      enqueueSnackbar('No store selected. Please select a store and try again.', { variant: 'error' });
      return;
    }
    
    setIsSaving(true);
    try {
      if (categoryToEdit?.id) {
        // Update existing category
        const updateData: ExpenseCategoryUpdateData = {
          store_id: selectedStore.id,
          name: data.name || '',
          description: data.description || ''
        };
        console.log('Updating category with data:', updateData);
        await financialsApi.updateExpenseCategory(selectedStore.id, categoryToEdit.id, updateData);
        enqueueSnackbar('Category updated successfully', { variant: 'success' });
      } else {
        // Create new category
        const createData: ExpenseCategoryCreateData = {
          store_id: selectedStore.id,
          name: data.name || '',
          description: data.description || ''
        };
        console.log('Creating new category with data:', createData);
        try {
          const result = await financialsApi.createExpenseCategory(selectedStore.id, createData);
          console.log('Category creation result:', result);
          enqueueSnackbar('Category added successfully', { variant: 'success' });
        } catch (apiError: any) {
          console.error('API error when creating category:', apiError);
          if (apiError.response && apiError.response.data) {
            console.error('API error response:', apiError.response.data);
            
            // Handle store error specifically
            if (apiError.response.data.store_id) {
              const storeError = Array.isArray(apiError.response.data.store_id) 
                ? apiError.response.data.store_id[0] 
                : apiError.response.data.store_id;
              
              enqueueSnackbar(`Store error: ${storeError}`, { variant: 'error' });
            }
            
            // Handle name errors
            if (apiError.response.data.name) {
              const nameError = Array.isArray(apiError.response.data.name) 
                ? apiError.response.data.name[0] 
                : apiError.response.data.name;
              
              enqueueSnackbar(`Name error: ${nameError}`, { variant: 'error' });
            }
          }
          throw apiError;
        }
      }
      setIsEditModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      enqueueSnackbar('Failed to save category', { variant: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete || !selectedStore) return;
    
    try {
      await financialsApi.deleteExpenseCategory(selectedStore.id, categoryToDelete);
      enqueueSnackbar('Category deleted successfully', { variant: 'success' });
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      enqueueSnackbar('Failed to delete category', { variant: 'error' });
    }
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.admin.dashboard },
    { label: 'Expenses', url: paths.admin.expenses },
    { label: 'Categories', url: paths.admin.expenseCategories },
  ];

  const isPageLoading = isLoading || isLoadingUser;

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="xl">
        <BreadcrumbsPath items={breadcrumbItems} />
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Expense Categories</Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            onClick={handleAddNew}
            disabled={!selectedStore}
          >
            Add New Category
          </Button>
        </Box>
        
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ mt: 1, mb: 2 }}>
            {process.env.NODE_ENV === 'development' && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Button state: {!selectedStore ? 'Disabled (no store)' : 'Enabled'}, 
                Store ID: {selectedStore?.id || 'Not set'}, 
                Loading user: {isLoadingUser ? 'Yes' : 'No'}
              </Typography>
            )}
          </Box>
        )}
        
        <Card sx={{ mt: 3 }}>
          <CardHeader title="All Categories" />
          <Divider />
          <CardContent>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
            ) : categories.length === 0 ? (
              <Alert severity="info" sx={{ my: 2 }}>No categories found. Add your first category.</Alert>
            ) : (
              <TableContainer>
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id} hover>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>
                          {format(new Date(category.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(category.id)}
                            aria-label="edit category"
                            sx={{ mr: 1 }}
                          >
                            <PencilSimpleIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(category.id)}
                            aria-label="delete category"
                          >
                            <TrashSimpleIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
        
        {/* Edit Modal */}
        <ExpenseCategoryEditModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
          category={categoryToEdit}
          isLoading={isSaving}
        />
        
        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Category"
          message="Are you sure you want to delete this category? This action cannot be undone."
        />
      </Container>
    </Box>
  );
} 