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
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { CloudArrowUp as CloudArrowUpIcon } from '@phosphor-icons/react/dist/ssr/CloudArrowUp';
import CategoryEditModal from '@/components/admin/product-manager/CategoryEditModal';
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';
import { paths } from '@/paths';

export default function CategoriesPage(): React.JSX.Element {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentCategory, setCurrentCategory] = React.useState<{ id?: string; name: string; description?: string; logoUrl?: string; hasExpand?: boolean } | null>(null);
  const [categoryToDelete, setCategoryToDelete] = React.useState<string | null>(null);
  
  // Mock categories data
  const categories = [
    { id: '1', name: 'Electronics', logo: '/category-logos/electronics.png', description: 'Electronic devices and accessories', hasExpand: true, productsCount: 45 },
    { id: '2', name: 'Baby & Kids', logo: '/category-logos/baby-kids.png', description: 'Products for babies and children', productsCount: 32 },
    { id: '3', name: 'Home and Furnitures', logo: '/category-logos/home-furniture.png', description: 'Items for home decoration and furniture', productsCount: 58 },
    { id: '4', name: 'Grocery', logo: '/category-logos/grocery.png', description: 'Food and grocery items', productsCount: 27 },
    { id: '5', name: 'Fashion', logo: '/category-logos/fashion.png', description: 'Clothing and fashion accessories', hasExpand: true, productsCount: 0 },
  ];

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
    // Check if category exists and has products (disabled button should prevent this)
    const categoryToRemove = categories.find(category => category.id === id);
    if (categoryToRemove && categoryToRemove.productsCount > 0) {
      return; // Don't allow deletion if products are using this category
    }
    
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      // In a real application, this would call an API to delete the category
      console.log(`Deleted category with ID: ${categoryToDelete}`);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleEdit = (id: string) => {
    const categoryToEdit = categories.find(category => category.id === id);
    if (categoryToEdit) {
      setCurrentCategory({
        id: categoryToEdit.id,
        name: categoryToEdit.name,
        description: categoryToEdit.description,
        logoUrl: categoryToEdit.logo,
        hasExpand: categoryToEdit.hasExpand
      });
      setIsCategoryModalOpen(true);
    }
  };

  const handleAddCategory = () => {
    setCurrentCategory({
      name: '',
      description: '',
      logoUrl: '',
      hasExpand: false
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (categoryData: { id?: string; name: string; description?: string; logoUrl?: string; hasExpand?: boolean }) => {
    if (categoryData.id) {
      // Update existing category
      console.log(`Updated category: ${JSON.stringify(categoryData)}`);
    } else {
      // Add new category
      console.log(`Added new category: ${JSON.stringify(categoryData)}`);
    }
    setIsCategoryModalOpen(false);
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
        >
          Add New Category
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<CloudArrowUpIcon weight="bold" />}
        >
          Import Categories
        </Button>
      </Box>

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
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category Logo</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Products Using</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleSelectOne(category.id)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {category.hasExpand && (
                      <Button 
                        size="small" 
                        sx={{ 
                          minWidth: 'auto', 
                          p: 0, 
                          mr: 1, 
                          color: 'text.secondary',
                          fontSize: '16px',
                          fontWeight: 'bold'
                        }}
                      >
                        +
                      </Button>
                    )}
                    {category.name}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    component="img"
                    src={category.logo}
                    alt={category.name}
                    sx={{
                      width: 40,
                      height: 40,
                      objectFit: 'contain'
                    }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = 'https://via.placeholder.com/40';
                    }}
                  />
                </TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{category.productsCount}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton 
                      size="small" 
                      sx={{ 
                        bgcolor: '#0ea5e9', 
                        color: 'white',
                        '&:hover': { bgcolor: '#0284c7' }  
                      }}
                      onClick={() => handleEdit(category.id)}
                    >
                      <PencilSimpleIcon size={18} />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      sx={{ 
                        bgcolor: '#ef4444', 
                        color: 'white',
                        '&:hover': { bgcolor: '#dc2626' }  
                      }}
                      disabled={category.productsCount > 0}
                      onClick={() => handleDelete(category.id)}
                    >
                      <TrashIcon size={18} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Pagination count={1} shape="rounded" />
        </Box>
      </Card>
      
      {/* Modals */}
      {isCategoryModalOpen && currentCategory && (
        <CategoryEditModal
          open={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          onSave={handleSaveCategory}
          category={currentCategory}
          isNew={!currentCategory.id}
          parentCategories={categories
            .filter(c => c.hasExpand && (!currentCategory.id || c.id !== currentCategory.id))
            .map(c => ({ id: c.id, name: c.name }))}
        />
      )}
      
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={categoryToDelete ? categories.find(c => c.id === categoryToDelete)?.name || '' : ''}
        itemType="Category"
        dependentItems={categoryToDelete ? categories.find(c => c.id === categoryToDelete)?.productsCount || 0 : 0}
      />
    </Box>
  );
} 