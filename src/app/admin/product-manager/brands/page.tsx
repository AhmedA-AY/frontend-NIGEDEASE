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
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { CloudArrowUp as CloudArrowUpIcon } from '@phosphor-icons/react/dist/ssr/CloudArrowUp';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import BrandEditModal from '@/components/admin/product-manager/BrandEditModal';
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';
import { paths } from '@/paths';

export default function BrandsPage(): React.JSX.Element {
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isBrandModalOpen, setIsBrandModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentBrand, setCurrentBrand] = React.useState<{ id?: string; name: string; description?: string; logoUrl?: string } | null>(null);
  const [brandToDelete, setBrandToDelete] = React.useState<string | null>(null);
  
  // Mock brands data
  const brands = [
    { id: '1', name: 'Sauder', logo: '/brand-logos/sauder.png', description: 'Furniture manufacturer', productsCount: 12 },
    { id: '2', name: 'Furinno', logo: '/brand-logos/furinno.png', description: 'Affordable home furniture', productsCount: 8 },
    { id: '3', name: 'Zinus', logo: '/brand-logos/zinus.png', description: 'Mattresses and bedframes', productsCount: 15 },
    { id: '4', name: 'Munchkin', logo: '/brand-logos/munchkin.png', description: 'Baby products', productsCount: 7 },
    { id: '5', name: 'Graco', logo: '/brand-logos/graco.png', description: 'Baby gear and equipment', productsCount: 9 },
    { id: '6', name: 'Infantino', logo: '/brand-logos/infantino.png', description: 'Baby toys and carriers', productsCount: 0 },
    { id: '7', name: 'Pampers', logo: '/brand-logos/pampers.png', description: 'Baby diapers and wipes', productsCount: 0 },
    { id: '8', name: 'Grandma\'s', logo: '/brand-logos/grandmas.png', description: 'Cookies and baked goods', productsCount: 0 },
    { id: '9', name: 'Tostitos', logo: '/brand-logos/tostitos.png', description: 'Tortilla chips and dips', productsCount: 0 },
    { id: '10', name: 'Peet\'s', logo: '/brand-logos/peets.png', description: 'Premium coffee', productsCount: 0 },
  ];

  // Filter brands based on search query
  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedBrands(filteredBrands.map(brand => brand.id));
    } else {
      setSelectedBrands([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedBrands.includes(id)) {
      setSelectedBrands(selectedBrands.filter(brandId => brandId !== id));
    } else {
      setSelectedBrands([...selectedBrands, id]);
    }
  };
  
  const handleDelete = (id: string) => {
    // Check if brand exists and has products (disabled button should prevent this)
    const brandToRemove = brands.find(brand => brand.id === id);
    if (brandToRemove && brandToRemove.productsCount > 0) {
      return; // Don't allow deletion if products are using this brand
    }
    
    setBrandToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (brandToDelete) {
      // In a real application, this would call an API to delete the brand
      console.log(`Deleted brand with ID: ${brandToDelete}`);
      setIsDeleteModalOpen(false);
      setBrandToDelete(null);
    }
  };

  const handleEdit = (id: string) => {
    const brandToEdit = brands.find(brand => brand.id === id);
    if (brandToEdit) {
      setCurrentBrand({
        id: brandToEdit.id,
        name: brandToEdit.name,
        description: brandToEdit.description,
        logoUrl: brandToEdit.logo
      });
      setIsBrandModalOpen(true);
    }
  };

  const handleAddBrand = () => {
    setCurrentBrand({
      name: '',
      description: '',
      logoUrl: ''
    });
    setIsBrandModalOpen(true);
  };

  const handleSaveBrand = (brandData: { id?: string; name: string; description?: string; logoUrl?: string }) => {
    if (brandData.id) {
      // Update existing brand
      console.log(`Updated brand: ${JSON.stringify(brandData)}`);
    } else {
      // Add new brand
      console.log(`Added new brand: ${JSON.stringify(brandData)}`);
    }
    setIsBrandModalOpen(false);
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.admin.dashboard },
    { label: 'Product Manager', url: paths.admin.productManager },
    { label: 'Brands', url: paths.admin.brands },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Brands</Typography>
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

      {/* Action Buttons and Search */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            startIcon={<PlusIcon weight="bold" />}
            sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            onClick={handleAddBrand}
          >
            Add New Brand
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<CloudArrowUpIcon weight="bold" />}
          >
            Import Brands
          </Button>
        </Box>
        <Box>
          <TextField
            placeholder="Search brands..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlassIcon size={20} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 200 }}
          />
        </Box>
      </Box>

      {/* Brands Table */}
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={filteredBrands.length > 0 && selectedBrands.length === filteredBrands.length}
                  indeterminate={selectedBrands.length > 0 && selectedBrands.length < filteredBrands.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Brand Logo</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Products Using</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBrands.map((brand) => (
              <TableRow key={brand.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedBrands.includes(brand.id)}
                    onChange={() => handleSelectOne(brand.id)}
                  />
                </TableCell>
                <TableCell>{brand.name}</TableCell>
                <TableCell>
                  <Box
                    component="img"
                    src={brand.logo}
                    alt={brand.name}
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
                <TableCell>{brand.description}</TableCell>
                <TableCell>{brand.productsCount}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton 
                      size="small" 
                      sx={{ 
                        bgcolor: '#0ea5e9', 
                        color: 'white',
                        '&:hover': { bgcolor: '#0284c7' }  
                      }}
                      onClick={() => handleEdit(brand.id)}
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
                      disabled={brand.productsCount > 0}
                      onClick={() => handleDelete(brand.id)}
                    >
                      <TrashIcon size={18} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {filteredBrands.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No brands found matching your search
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      
      {/* Modals */}
      {isBrandModalOpen && currentBrand && (
        <BrandEditModal
          open={isBrandModalOpen}
          onClose={() => setIsBrandModalOpen(false)}
          onSave={handleSaveBrand}
          brand={currentBrand}
          isNew={!currentBrand.id}
        />
      )}
      
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={brandToDelete ? brands.find(b => b.id === brandToDelete)?.name || '' : ''}
        itemType="Brand"
        dependentItems={brandToDelete ? brands.find(b => b.id === brandToDelete)?.productsCount || 0 : 0}
      />
    </Box>
  );
} 