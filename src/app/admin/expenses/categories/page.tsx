'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { paths } from '@/paths';
import ExpenseCategoryEditModal from '@/components/admin/expenses/ExpenseCategoryEditModal';
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';
import { ExpenseCategory, ExpenseCategoryCreateData, ExpenseCategoryUpdateData, financialsApi } from '@/services/api/financials';
import { companiesApi } from '@/services/api/companies';
import { useSnackbar } from 'notistack';
import { useCurrentUser } from '@/hooks/use-auth';

export default function ExpenseCategoriesPage(): React.JSX.Element {
  // Helper function to validate UUID format
  const isValidUUID = (str: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  // State
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<ExpenseCategory | undefined>(undefined);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [companyId, setCompanyId] = useState<string>(''); // Start with empty string
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo, isLoading: isLoadingUser } = useCurrentUser();

  // Fetch a valid company ID from available sources
  const fetchValidCompanyId = useCallback(async () => {
    console.log("Fetching a valid company ID...");
    
    try {
      // First try to get companies from the API
      console.log("Trying to get company ID from companies API...");
      const companies = await companiesApi.getCompanies();
      
      if (companies && companies.length > 0) {
        const validCompanyId = companies[0].id;
        console.log("Got valid company ID from companies API:", validCompanyId);
        return validCompanyId;
      }
      
      console.log("No companies found from API");
      return '';
    } catch (error) {
      console.error("Error fetching companies:", error);
      return '';
    }
  }, []);

  // Set company ID when the page loads
  useEffect(() => {
    const initializeCompanyId = async () => {
      if (companyId) {
        // Already have a company ID
        return;
      }
      
      // Try to get a valid company ID
      const validCompanyId = await fetchValidCompanyId();
      if (validCompanyId) {
        setCompanyId(validCompanyId);
      }
    };
    
    initializeCompanyId();
  }, [fetchValidCompanyId, companyId]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await financialsApi.getExpenseCategories();
      console.log("Categories data:", data);
      setCategories(data);
      
      // If we still don't have a company ID and we have categories, try to get it from there
      if (!companyId && data.length > 0) {
        const existingCompanyId = data[0].company;
        console.log("Found existing company ID from categories:", existingCompanyId);
        
        // Check if it's a valid UUID before using it
        if (isValidUUID(existingCompanyId)) {
          console.log("Using company ID from existing category:", existingCompanyId);
          setCompanyId(existingCompanyId);
        } else {
          console.warn("Company ID from existing category is not a valid UUID:", existingCompanyId);
        }
      }
    } catch (err) {
      console.error('Error fetching expense categories:', err);
      setError('Failed to load expense categories');
      enqueueSnackbar('Failed to load expense categories', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar, companyId]);

  useEffect(() => {
    console.log("Current company ID:", companyId);
    console.log("Is loading user:", isLoadingUser);
    
    const loadData = async () => {
      if (isLoadingUser) {
        console.log("Still loading user info, waiting...");
        return;
      }
      
      // If we don't have a company ID yet, try to get one
      if (!companyId) {
        console.log("No company ID yet, attempting to fetch one...");
        const validCompanyId = await fetchValidCompanyId();
        if (validCompanyId) {
          console.log("Setting company ID from API:", validCompanyId);
          setCompanyId(validCompanyId);
          // Now that we have a company ID, fetch categories
          await fetchCategories();
        } else {
          console.warn("Could not get a valid company ID, categories functionality will be limited");
        }
      } else {
        // We already have a company ID, just fetch categories
        await fetchCategories();
      }
    };
    
    loadData();
  }, [fetchCategories, fetchValidCompanyId, isLoadingUser, companyId]);

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
    console.log("handleSave called with data:", data);
    console.log("Current company ID:", companyId);
    
    // If we don't have a company ID, try to fetch one
    let effectiveCompanyId = companyId;
    
    if (!effectiveCompanyId) {
      console.log("No company ID available, attempting to fetch one...");
      effectiveCompanyId = await fetchValidCompanyId();
      
      if (!effectiveCompanyId) {
        console.error("Could not obtain a valid company ID");
        enqueueSnackbar('Could not obtain a valid company ID. Please try again later.', { variant: 'error' });
        return;
      }
      
      // Save the company ID for future use
      setCompanyId(effectiveCompanyId);
    }
    
    // Validate that the company ID is a valid UUID
    if (!isValidUUID(effectiveCompanyId)) {
      console.error("Invalid company ID format (not a UUID):", effectiveCompanyId);
      enqueueSnackbar('Invalid company ID format', { variant: 'error' });
      return;
    }
    
    setIsSaving(true);
    try {
      if (categoryToEdit?.id) {
        // Update existing category
        const updateData: ExpenseCategoryUpdateData = {
          name: data.name || '',
          description: data.description || '',
          company: categoryToEdit.company
        };
        console.log('Updating category with data:', updateData);
        await financialsApi.updateExpenseCategory(categoryToEdit.id, updateData);
        enqueueSnackbar('Category updated successfully', { variant: 'success' });
      } else {
        // Create new category
        const createData: ExpenseCategoryCreateData = {
          name: data.name || '',
          description: data.description || '',
          company: effectiveCompanyId
        };
        console.log('Creating new category with data:', createData);
        try {
          const result = await financialsApi.createExpenseCategory(createData);
          console.log('Category creation result:', result);
          enqueueSnackbar('Category added successfully', { variant: 'success' });
        } catch (apiError: any) {
          console.error('API error when creating category:', apiError);
          if (apiError.response && apiError.response.data) {
            console.error('API error response:', apiError.response.data);
            
            // Handle company error specifically
            if (apiError.response.data.company) {
              const companyError = Array.isArray(apiError.response.data.company) 
                ? apiError.response.data.company[0] 
                : apiError.response.data.company;
              
              enqueueSnackbar(`Company error: ${companyError}`, { variant: 'error' });
              
              if (companyError.includes("Invalid pk") || companyError.includes("object does not exist")) {
                enqueueSnackbar("The company ID used doesn't exist. Please refresh and try again.", { variant: 'error' });
              }
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
    if (!categoryToDelete) return;
    
    try {
      await financialsApi.deleteExpenseCategory(categoryToDelete);
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
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Expense Categories</Typography>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<PlusIcon weight="bold" />}
            sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            onClick={handleAddNew}
            disabled={!companyId}
          >
            Add New Category
          </Button>
          {/* Debug indicator - will only show in development */}
          {process.env.NODE_ENV === 'development' && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Button state: {!companyId ? 'Disabled (no company ID)' : 'Enabled'}, 
              Company ID: {companyId || 'Not set'}, 
              Loading user: {isLoadingUser ? 'Yes' : 'No'}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Main Content */}
      <Card>
        {isPageLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        ) : categories.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No expense categories found. Add your first category.
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description || '—'}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={() => handleEdit(category.id)} 
                      color="primary"
                      aria-label="edit category"
                    >
                      <PencilSimpleIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(category.id)} 
                      color="error"
                      aria-label="delete category"
                    >
                      <TrashIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
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
    </Box>
  );
} 